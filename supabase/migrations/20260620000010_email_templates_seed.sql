-- PACA CONSTRUCT — seed template-uri email
-- Populează public.email_templates cu intrările implicite din catalog. `key`
-- corespunde 1:1 cu emails/registry.ts. Subiectele pot conține variabile
-- {{...}} interpolate la trimitere (app/lib/email/templates.ts).
-- Idempotentă: rulează doar dacă tabelul e gol.

insert into public.email_templates (key, name, category, audience, subject, preheader)
select * from (values
  ('service_request_user',  'Confirmare cerere serviciu (client)',   'tranzactional'::public.email_category, 'user'::public.email_audience,      'Am înregistrat solicitarea ta — {{code}}',        'Referință {{code}}. Te contactăm în 24h.'),
  ('service_request_admin', 'Cerere serviciu nouă (admin)',          'tranzactional'::public.email_category, 'admin'::public.email_audience,     'Cerere nouă de serviciu — {{name}}',              'Lead nou de serviciu.'),
  ('rental_request_user',   'Confirmare cerere închiriere (client)', 'tranzactional'::public.email_category, 'user'::public.email_audience,      'Solicitarea ta de închiriere — {{code}}',         '{{machine}} · referință {{code}}'),
  ('rental_request_admin',  'Cerere închiriere nouă (admin)',        'tranzactional'::public.email_category, 'admin'::public.email_audience,     'Cerere nouă de închiriere — {{name}}',            'Lead nou de închiriere.'),
  ('request_in_review',     'Cerere în evaluare (client)',           'tranzactional'::public.email_category, 'user'::public.email_audience,      'Solicitarea ta este în evaluare — {{code}}',      'Un inginer analizează cazul tău.'),
  ('request_quoted',        'Cerere ofertată (client)',              'tranzactional'::public.email_category, 'user'::public.email_audience,      'Oferta ta este gata — {{code}}',                  'Consultă oferta și revino cu întrebări.'),
  ('request_confirmed',     'Cerere confirmată (client)',            'tranzactional'::public.email_category, 'user'::public.email_audience,      'Lucrarea ta este confirmată — {{code}}',          'Confirmăm programarea lucrării.'),
  ('request_closed',        'Cerere închisă + recenzie (client)',    'tranzactional'::public.email_category, 'user'::public.email_audience,      'Îți mulțumim că ai ales PACA CONSTRUCT',          'O recenzie ne-ar ajuta enorm.'),
  ('admin_daily_digest',    'Sumar zilnic (admin)',                  'sistem'::public.email_category,        'admin'::public.email_audience,     'Sumar zilnic — cereri noi',                       'Rezumatul cererilor din ultimele 24h.'),
  ('newsletter_article',    'Newsletter — articol nou',              'marketing'::public.email_category,     'broadcast'::public.email_audience, '{{title}}',                                       '{{excerpt}}'),
  ('broadcast_generic',     'Broadcast generic',                     'marketing'::public.email_category,     'broadcast'::public.email_audience, '{{heading}}',                                     'Noutăți de la PACA CONSTRUCT.')
) as t(key, name, category, audience, subject, preheader)
where not exists (select 1 from public.email_templates);
