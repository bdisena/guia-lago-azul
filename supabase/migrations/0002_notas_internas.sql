-- nota interna não pode ficar numa tabela de leitura pública
alter table prestadores drop column nota_interna;
create table prestador_notas (
  prestador_id uuid primary key references prestadores(id) on delete cascade,
  nota text,
  updated_at timestamptz not null default now()
);
alter table prestador_notas enable row level security;
create policy "admin all" on prestador_notas for all using (is_admin()) with check (is_admin());
