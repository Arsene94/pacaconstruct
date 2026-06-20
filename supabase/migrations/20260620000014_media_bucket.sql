-- ─── Storage: bucket public „media" pentru imaginile încărcate din admin ─────
-- Folosit de uploadul de imagini din formularele de admin (servicii, blog,
-- proiecte, utilaje, campanii email). Citire publică; scriere/ștergere doar
-- admin (uploadul efectiv rulează cu service_role în ruta /api/admin/upload).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media admin insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media admin update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media admin delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
