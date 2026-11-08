-- Guia dos Condomínios — schema inicial
create extension if not exists unaccent with schema extensions;

create type plano_t as enum ('free','destaque','suspenso');
create type origem_t as enum ('recomendacao','pedido','compartilhado','cadastro');
create type status_ind_t as enum ('pendente','aprovada','rejeitada');
create type status_orc_t as enum ('novo','enviado','concluido','cancelado');
create type evento_t as enum ('view_categoria','view_prestador','click_whatsapp','click_banner','click_clube');
create type posicao_banner_t as enum ('topo','entre_categorias');

create table condominios (
  id smallserial primary key,
  slug text unique not null,
  nome text not null
);

create table categorias (
  id serial primary key,
  slug text unique not null,
  nome text not null,
  icone text not null default '🛠️',
  ordem int not null default 100
);

create table prestadores (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  telefones text[] not null default '{}',
  whatsapp text,
  descricao text,
  servicos text[] not null default '{}',
  plano plano_t not null default 'free',
  verificado boolean not null default false,
  mais_recomendado boolean not null default false,
  origem origem_t not null default 'compartilhado',
  indicado_em smallint references condominios(id),
  atende_todos boolean not null default true,
  fotos text[] not null default '{}',
  ativo boolean not null default true,
  nota_interna text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prestador_categorias (
  prestador_id uuid references prestadores(id) on delete cascade,
  categoria_id int references categorias(id) on delete cascade,
  primary key (prestador_id, categoria_id)
);
create index on prestador_categorias(categoria_id);

create table prestador_condominios (
  prestador_id uuid references prestadores(id) on delete cascade,
  condominio_id smallint references condominios(id) on delete cascade,
  primary key (prestador_id, condominio_id)
);
create index on prestador_condominios(condominio_id);

create table indicacoes (
  id uuid primary key default gen_random_uuid(),
  nome_prestador text not null,
  telefone text not null,
  categoria_id int references categorias(id),
  categoria_texto text,
  comentario text,
  morador_nome text,
  condominio_id smallint references condominios(id),
  status status_ind_t not null default 'pendente',
  prestador_id uuid references prestadores(id) on delete set null,
  created_at timestamptz not null default now()
);

create table orcamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  condominio_id smallint not null references condominios(id),
  categoria_id int references categorias(id),
  descricao text not null,
  status status_orc_t not null default 'novo',
  created_at timestamptz not null default now()
);

create table orcamento_destinos (
  orcamento_id uuid references orcamentos(id) on delete cascade,
  prestador_id uuid references prestadores(id) on delete cascade,
  enviado_em timestamptz not null default now(),
  primary key (orcamento_id, prestador_id)
);
create index on orcamento_destinos(prestador_id);

create table banners (
  id uuid primary key default gen_random_uuid(),
  anunciante text not null,
  titulo text not null,
  subtitulo text,
  imagem_url text,
  link text,
  posicao posicao_banner_t not null default 'topo',
  ativo boolean not null default true,
  inicio date,
  fim date,
  created_at timestamptz not null default now()
);

create table clube_vantagens (
  id uuid primary key default gen_random_uuid(),
  parceiro text not null,
  segmento text,
  oferta text not null,
  whatsapp text,
  link text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table eventos (
  id bigserial primary key,
  tipo evento_t not null,
  prestador_id uuid references prestadores(id) on delete cascade,
  categoria_id int references categorias(id) on delete cascade,
  banner_id uuid references banners(id) on delete cascade,
  clube_id uuid references clube_vantagens(id) on delete cascade,
  condominio_id smallint references condominios(id),
  created_at timestamptz not null default now()
);
create index on eventos(created_at);
create index on eventos(prestador_id, tipo);

create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- helpers ----------------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger prestadores_touch before update on prestadores
for each row execute function touch_updated_at();

-- RLS ----------------------------------------------------------------------
alter table condominios enable row level security;
alter table categorias enable row level security;
alter table prestadores enable row level security;
alter table prestador_categorias enable row level security;
alter table prestador_condominios enable row level security;
alter table indicacoes enable row level security;
alter table orcamentos enable row level security;
alter table orcamento_destinos enable row level security;
alter table banners enable row level security;
alter table clube_vantagens enable row level security;
alter table eventos enable row level security;
alter table admins enable row level security;

-- leitura pública
create policy "public read" on condominios for select using (true);
create policy "public read" on categorias for select using (true);
create policy "public read" on prestadores for select using ((ativo and plano <> 'suspenso') or is_admin());
create policy "public read" on prestador_categorias for select using (true);
create policy "public read" on prestador_condominios for select using (true);
create policy "public read" on banners for select using (
  (ativo and (inicio is null or inicio <= current_date) and (fim is null or fim >= current_date)) or is_admin());
create policy "public read" on clube_vantagens for select using (ativo or is_admin());

-- admin full
create policy "admin all" on condominios for all using (is_admin()) with check (is_admin());
create policy "admin all" on categorias for all using (is_admin()) with check (is_admin());
create policy "admin all" on prestadores for all using (is_admin()) with check (is_admin());
create policy "admin all" on prestador_categorias for all using (is_admin()) with check (is_admin());
create policy "admin all" on prestador_condominios for all using (is_admin()) with check (is_admin());
create policy "admin all" on indicacoes for all using (is_admin()) with check (is_admin());
create policy "admin all" on orcamentos for all using (is_admin()) with check (is_admin());
create policy "admin all" on orcamento_destinos for all using (is_admin()) with check (is_admin());
create policy "admin all" on banners for all using (is_admin()) with check (is_admin());
create policy "admin all" on clube_vantagens for all using (is_admin()) with check (is_admin());
create policy "admin read" on eventos for select using (is_admin());
create policy "admin read self" on admins for select using (user_id = auth.uid());

-- RPCs públicas (inserts validados; tabelas não aceitam insert anon direto) --
create or replace function public.registrar_evento(
  p_tipo evento_t, p_prestador uuid default null, p_categoria int default null,
  p_banner uuid default null, p_clube uuid default null, p_condominio text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into eventos(tipo, prestador_id, categoria_id, banner_id, clube_id, condominio_id)
  values (p_tipo, p_prestador, p_categoria, p_banner, p_clube,
          (select id from condominios where slug = p_condominio));
end; $$;

create or replace function public.enviar_orcamento(
  p_nome text, p_whatsapp text, p_condominio text, p_categoria int, p_descricao text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_cond smallint; v_digits text;
begin
  v_digits := regexp_replace(coalesce(p_whatsapp,''), '\D', '', 'g');
  if length(trim(coalesce(p_nome,''))) < 2 or length(trim(coalesce(p_descricao,''))) < 5
     or length(v_digits) < 10 or length(v_digits) > 13 then
    raise exception 'Dados inválidos';
  end if;
  select id into v_cond from condominios where slug = p_condominio;
  if v_cond is null then raise exception 'Condomínio inválido'; end if;
  if (select count(*) from orcamentos where whatsapp = v_digits and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Muitos pedidos em pouco tempo. Tente mais tarde.';
  end if;
  insert into orcamentos(nome, whatsapp, condominio_id, categoria_id, descricao)
  values (left(trim(p_nome),120), v_digits, v_cond, p_categoria, left(trim(p_descricao),2000))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public.enviar_indicacao(
  p_nome_prestador text, p_telefone text, p_categoria int, p_categoria_texto text,
  p_comentario text, p_morador text, p_condominio text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_digits text;
begin
  v_digits := regexp_replace(coalesce(p_telefone,''), '\D', '', 'g');
  if length(trim(coalesce(p_nome_prestador,''))) < 2 or length(v_digits) < 10 or length(v_digits) > 13 then
    raise exception 'Dados inválidos';
  end if;
  if (select count(*) from indicacoes where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Muitas indicações em pouco tempo. Tente mais tarde.';
  end if;
  insert into indicacoes(nome_prestador, telefone, categoria_id, categoria_texto, comentario, morador_nome, condominio_id)
  values (left(trim(p_nome_prestador),120), v_digits, p_categoria, left(p_categoria_texto,80),
          left(p_comentario,1000), left(p_morador,120), (select id from condominios where slug = p_condominio))
  returning id into v_id;
  return v_id;
end; $$;

revoke all on function public.registrar_evento, public.enviar_orcamento, public.enviar_indicacao from public;
grant execute on function public.registrar_evento, public.enviar_orcamento, public.enviar_indicacao to anon, authenticated;

-- métricas (admin) ---------------------------------------------------------
create or replace function public.metricas_prestadores(p_dias int default 30)
returns table(prestador_id uuid, nome text, plano plano_t, views bigint, cliques bigint, leads bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.nome, p.plano,
    (select count(*) from eventos e where e.prestador_id = p.id and e.tipo = 'view_prestador' and e.created_at > now() - make_interval(days => p_dias)),
    (select count(*) from eventos e where e.prestador_id = p.id and e.tipo = 'click_whatsapp' and e.created_at > now() - make_interval(days => p_dias)),
    (select count(*) from orcamento_destinos d where d.prestador_id = p.id and d.enviado_em > now() - make_interval(days => p_dias))
  from prestadores p where is_admin()
  order by 5 desc, 4 desc, p.nome;
$$;

create or replace function public.metricas_categorias(p_dias int default 30)
returns table(categoria_id int, nome text, views bigint, cliques bigint)
language sql stable security definer set search_path = public as $$
  select c.id, c.nome,
    (select count(*) from eventos e where e.categoria_id = c.id and e.tipo = 'view_categoria' and e.created_at > now() - make_interval(days => p_dias)),
    (select count(*) from eventos e join prestador_categorias pc on pc.prestador_id = e.prestador_id
       where pc.categoria_id = c.id and e.tipo = 'click_whatsapp' and e.created_at > now() - make_interval(days => p_dias))
  from categorias c where is_admin()
  order by 3 desc, c.nome;
$$;
revoke all on function public.metricas_prestadores, public.metricas_categorias from public, anon;
grant execute on function public.metricas_prestadores, public.metricas_categorias to authenticated;
revoke all on function public.is_admin from public;
grant execute on function public.is_admin to anon, authenticated;

-- dados base
insert into condominios(slug, nome) values
 ('lago-azul','Lago Azul'),('lagoa-bonita','Lagoa Bonita'),('portal-do-lago','Portal do Lago'),
 ('recanto-dos-passaros','Recanto dos Pássaros'),('jacaranda','Jacarandá');
