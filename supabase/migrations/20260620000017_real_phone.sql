-- PACA CONSTRUCT — număr de telefon real în site_settings
-- Telefonul real (0799 299 644 / +40 799 299 644) găsit în documentele firmei.
-- Până acum `phones` era gol și pagina cădea pe `defaultPhones()` din siteConfig.
-- Populăm rândul singleton, ca numărul să vină din DB (sursa live pentru
-- navbar/footer/contact/butoane flotante).
--
-- Condiționat pe `phones = '[]'` ca să NU suprascrie numere editate ulterior din
-- admin. Idempotentă: la a doua rulare phones nu mai e gol, deci no-op.
-- id = 'primary' păstrează convenția din defaultPhones() (referințe floating ok).
update public.site_settings set
  phones = $json$[
    {
      "id": "primary",
      "label": "Telefon",
      "e164": "+40799299644",
      "display": "+40 799 299 644",
      "whatsapp": true,
      "isPrimary": true,
      "showInFloating": true,
      "order": 0
    }
  ]$json$::jsonb
where id = 1 and phones = '[]'::jsonb;
