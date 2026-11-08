-- Lista de e-mails que viram admin automaticamente ao entrar pela 1ª vez (magic link)
create table admin_emails (email text primary key);
alter table admin_emails enable row level security;
create policy "admin all" on admin_emails for all using (is_admin()) with check (is_admin());

create or replace function public.handle_new_user_admin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from admin_emails where lower(email) = lower(new.email)) then
    insert into admins(user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end; $$;
revoke all on function public.handle_new_user_admin from public, anon, authenticated;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_new_user_admin();

insert into admin_emails values ('bnovaes@acelerarh.com.br');

-- Fotos de serviços (planos pagos) e imagens de banners
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('midia', 'midia', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "midia admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'midia' and public.is_admin());
create policy "midia admin update" on storage.objects for update to authenticated using (bucket_id = 'midia' and public.is_admin());
create policy "midia admin delete" on storage.objects for delete to authenticated using (bucket_id = 'midia' and public.is_admin());
