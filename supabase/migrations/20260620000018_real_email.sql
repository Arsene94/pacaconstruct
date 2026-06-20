-- PACA CONSTRUCT — email de contact real în site_settings
-- Adresa confirmată: contact@pacaconstruct.ro (un singur inbox).
-- Până acum `contact` nu avea email, deci resolverul cădea pe `siteConfig.email`.
-- Populăm rândul singleton, ca emailul să vină din DB (sursa live pentru
-- footer, pagina de contact, paginile legale, llms.txt).
--
-- jsonb `||` adaugă/suprascrie doar cheile de email și păstrează restul
-- obiectului `contact` (adresă/geo/mapUrl rămân pe fallback-ul din siteConfig).
-- Condiționat: doar dacă emailPrimary nu e deja setat → NU clobberează editări
-- din admin. Idempotentă.
update public.site_settings set
  contact = contact || jsonb_build_object(
    'emailPrimary', 'contact@pacaconstruct.ro',
    'emailOffice', 'contact@pacaconstruct.ro'
  )
where id = 1
  and coalesce(nullif(trim(contact->>'emailPrimary'), ''), '') = '';
