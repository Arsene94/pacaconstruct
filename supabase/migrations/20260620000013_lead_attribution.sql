-- Faza 7 (tracking): atribuire pentru conversii offline (Google Ads / Meta).
--
-- Captăm identificatorii de click și sursa campaniei la submit (din URL/cookie,
-- prin câmpuri hidden) ca să putem importa manual conversiile câștigate
-- („Confirmat") în Ads/Meta cu valoarea reală. Fără server-side: importul e
-- operațional (interfață / Sheets), aici doar stocăm.
--
-- Toate coloanele sunt nullable: cererile fără atribuire (trafic direct/organic)
-- rămân valide. Niciun PII suplimentar — doar identificatori tehnici de click.

alter table public.service_requests
  add column if not exists gclid          text,
  add column if not exists gbraid         text,
  add column if not exists wbraid         text,
  add column if not exists fbclid         text,
  add column if not exists ttclid         text,
  add column if not exists msclkid        text,
  add column if not exists utm_source     text,
  add column if not exists utm_medium     text,
  add column if not exists utm_campaign   text,
  add column if not exists utm_term       text,
  add column if not exists utm_content    text,
  add column if not exists landing_page   text,
  add column if not exists consent_ads    boolean not null default false,
  add column if not exists value_estimate numeric(12, 2);

alter table public.rental_requests
  add column if not exists gclid          text,
  add column if not exists gbraid         text,
  add column if not exists wbraid         text,
  add column if not exists fbclid         text,
  add column if not exists ttclid         text,
  add column if not exists msclkid        text,
  add column if not exists utm_source     text,
  add column if not exists utm_medium     text,
  add column if not exists utm_campaign   text,
  add column if not exists utm_term       text,
  add column if not exists utm_content    text,
  add column if not exists landing_page   text,
  add column if not exists consent_ads    boolean not null default false,
  add column if not exists value_estimate numeric(12, 2);
