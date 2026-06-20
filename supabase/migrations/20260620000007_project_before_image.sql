-- PACA CONSTRUCT — Portofoliu: imagine „înainte" pentru galeria înainte/după.
-- Migrare 7: `image_src`/`image_alt` rămân imaginea „după" (principală); aici
-- adăugăm perechea „înainte". Galeria pe pagina de detaliu se afișează doar
-- dacă există cel puțin o imagine.
alter table public.projects
  add column if not exists image_before_src text,
  add column if not exists image_before_alt text;
