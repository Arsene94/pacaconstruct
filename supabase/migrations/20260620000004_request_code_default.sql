-- PACA CONSTRUCT — cod cerere opțional la inserare
-- Codul (CS-…/CI-…) este generat de triggerele `set_*_request_code` ÎNAINTE de
-- insert. Adăugăm un default gol pentru ca aplicația (și tipurile generate de
-- Supabase) să poată insera fără a furniza `code` — triggerul îl completează.

alter table public.service_requests alter column code set default '';
alter table public.rental_requests  alter column code set default '';
