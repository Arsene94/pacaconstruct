-- PACA CONSTRUCT — refresh copy (lot 1)
-- Aliniază conținutul DB la docs/COPY-SITE.md: cele 4 pagini-pilon de servicii
-- și titlurile celor 4 grupuri din navigație. Voce umană, diacritice corecte.
-- Idempotentă prin natura ei: UPDATE după slug, sigur de rulat de mai multe ori.
-- Notă: după rulare, golește cache-ul „services" (salvează un serviciu din admin
-- sau redeploy) ca paginile publice să preia textele noi.

-- ─── Titluri grupuri (navigație) ─────────────────────────────────────────────
update public.service_groups set title = 'Amenajare spații verzi'
  where slug = 'amenajare-spatii-verzi';
update public.service_groups set title = 'Terasamente și excavări'
  where slug = 'terasamente-excavari';
update public.service_groups set title = 'Excavări pentru proiecte industriale'
  where slug = 'excavari-industriale';
update public.service_groups set title = 'Închirieri utilaje cu operator'
  where slug = 'inchirieri-utilaje';

-- ─── Serviciu 1: Amenajare spații verzi ──────────────────────────────────────
update public.services set
  title = 'Amenajare spații verzi',
  eyebrow = 'Amenajări exterioare',
  description = 'Pornim de la teren, nu de la gazon. Pregătim solul, rezolvăm scurgerea apei, montăm irigații și abia apoi plantăm, ca grădina să arate bine și peste cinci ani, nu doar în prima lună.',
  summary_title = 'O curte gândită ca să reziste, nu doar ca să pozeze',
  summary = 'Multe amenajări arată impecabil la predare și se strică pe tăcute: gazonul se îngălbenește unde băltește apa, aleile se lasă unde solul nu a fost compactat. Noi punem la punct ce nu se vede (nivelare, drenaj, sol) înainte de partea frumoasă. Tu primești o curte pe care o folosești, nu una pe care o repari.',
  processes = $json$[
    {"title":"Citim terenul","text":"Vedem cum curge apa, unde e umbră, ce sol ai și de unde se intră cu utilajul."},
    {"title":"Pregătim solul","text":"Curățăm, nivelăm, corectăm pământul și rezolvăm drenajul, ca rădăcinile și aleile să stea bine."},
    {"title":"Construim cadrul","text":"Irigații, gazon, plantări, alei, iaz sau piscină, în ordinea care nu strică ce s-a făcut deja."},
    {"title":"Întreținem","text":"Preluăm și partea de îngrijire, ca să nu cauți alt om peste o lună."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Drenaj","value":"Dimensionat la suprafață și sol","impact":"Fără băltiri și rădăcini sufocate."},
    {"label":"Sol","value":"Corectat și compactat controlat","impact":"Alei drepte, gazon uniform."},
    {"label":"Irigații","value":"Traseu îngropat înainte de gazon","impact":"Fără săpat din nou peste un an."}
  ]$json$::jsonb,
  faqs = $json$[
    {"question":"Preluați și pregătirea terenului, nu doar plantarea?","answer":"Da. De obicei aici e și jumătate din muncă: nivelare, drenaj, corecție de sol. Le facem cu utilajele noastre, înainte de partea verde."},
    {"question":"Când e momentul potrivit să planific?","answer":"Cu câteva săptămâni înainte de sezon. Pregătirea terenului și irigațiile se fac mai ușor pe uscat, iar plantatul prinde mai bine la timp."}
  ]$json$::jsonb
where slug = 'amenajare-spatii-verzi';

-- ─── Serviciu 2: Terasamente și excavări ─────────────────────────────────────
update public.services set
  title = 'Terasamente și excavări',
  eyebrow = 'Infrastructură de teren',
  description = 'Săpături, nivelări, compactări, drenaje, branșamente și drumuri de acces. Aici se pune baza pe care stă casa sau hala. O facem la cotă, în straturi, cu pământul evacuat la final.',
  summary_title = 'Baza care nu se vede, dar ține totul',
  summary = 'O fundație turnată pe umplutură necompactată sau un teren fără drenaj te costă peste câțiva ani, în fisuri și infiltrații. Săpăm la cota din proiect, compactăm în straturi, ducem apa unde trebuie și scoatem pământul în exces. Ce facem corect aici nu se mai atinge.',
  processes = $json$[
    {"title":"Verificăm terenul și accesul","text":"Diferențe de nivel, tip de sol, pe unde intră utilajul, unde stă pământul scos."},
    {"title":"Săpăm și nivelăm","text":"La cotă, cu utilaje pe măsura lucrării, în spațiu larg sau îngust."},
    {"title":"Compactăm și drenăm","text":"Umplutura în straturi, apa dirijată departe de fundație."},
    {"title":"Curățăm și predăm","text":"Evacuăm pământul rezultat și lăsăm terenul gata de turnat sau de construit."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Adâncime săpătură","value":"La cota din proiect","impact":"Fundație pe teren stabil, nu pe umplutură."},
    {"label":"Compactare","value":"În straturi controlate","impact":"Fără tasări și fisuri ulterioare."},
    {"label":"Evacuare pământ","value":"Inclusă în lucrare","impact":"Curte curată la final."}
  ]$json$::jsonb,
  faqs = $json$[
    {"question":"Evacuați pământul rezultat?","answer":"Da. Transportul pământului în exces intră în lucrare, ca să nu rămâi cu el grămadă în curte."},
    {"question":"Cât de adânc puteți săpa pentru o fundație?","answer":"La cota cerută în proiect. Stabilim adâncimea și sprijinirile după sol și după ce construiești deasupra."},
    {"question":"Lucrați și în spații înguste?","answer":"Da. Alegem utilajul după acces, inclusiv pentru curți strâmte sau între construcții existente."}
  ]$json$::jsonb
where slug = 'terasamente-excavari';

-- ─── Serviciu 3: Excavări pentru proiecte industriale ────────────────────────
update public.services set
  title = 'Excavări pentru proiecte industriale',
  eyebrow = 'Proiecte industriale',
  description = 'Terasamente și platforme pentru hale, depozite și drumuri interne. Volume mari, cote respectate, grafic pe care îl poți pune în planificare. Lucrăm pe deviz și pe termen, nu pe aproximări.',
  summary_title = 'Volume mari, fără surprize la cote și la termen',
  summary = 'Pe industrial, două lucruri strică un proiect: cote greșite și un grafic la care nu te poți baza. Pregătim platforma și drumurile interne la toleranțele cerute, compactăm pentru sarcinile reale și ținem ritmul stabilit. Primești rapoarte clare, nu promisiuni.',
  processes = $json$[
    {"title":"Analiză și planificare","text":"Volume, cote, acces, faze. Stabilim graficul împreună cu tine."},
    {"title":"Terasamente de volum","text":"Săpături și umpluturi cu flotă dimensionată pentru ritm."},
    {"title":"Platforme și drumuri","text":"Compactare pentru sarcini grele, suprafețe la toleranță."},
    {"title":"Predare cu verificări","text":"Cote confirmate, teren gata pentru construcție sau montaj."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Toleranțe cote","value":"Conform proiectului","impact":"Montaj și turnări fără corecții ulterioare."},
    {"label":"Compactare","value":"Pentru sarcini de trafic greu","impact":"Platforme care nu se lasă."},
    {"label":"Grafic","value":"Faze și termene agreate","impact":"Planificare pe care te bazezi."}
  ]$json$::jsonb,
  faqs = $json$[
    {"question":"Lucrați pe bază de proiect și deviz?","answer":"Da. Pe industrial pornim de la proiect și volume, dăm deviz pe faze și raportăm progresul pe cote."},
    {"question":"Puteți ține un termen ferm?","answer":"Stabilim graficul după volume și acces, apoi îl respectăm. Dacă apare ceva pe teren care îl afectează, afli din timp, nu la final."}
  ]$json$::jsonb
where slug = 'excavari-industriale';

-- ─── Serviciu 4: Închirieri utilaje cu operator ──────────────────────────────
update public.services set
  title = 'Închirieri utilaje cu operator',
  eyebrow = 'Utilaje cu operator',
  description = 'Ai nevoie de un utilaj pentru câteva ore sau câteva zile, cu om care știe să-l folosească. Vine excavatorul, buldoexcavatorul, încărcătorul frontal sau basculanta, cu operator inclus. Tu spui lucrarea, noi aducem utilajul potrivit.',
  summary_title = 'Utilajul potrivit, cu operator, când îți trebuie',
  summary = 'Un utilaj fără operatorul potrivit e timp pierdut și risc. La noi vine cu om care l-a mai folosit pe lucrări ca a ta. Plătești pe ce ai nevoie, fără să cumperi sau să întreții echipament. Îți spunem din start ce acces cere utilajul, ca să nu pierzi o zi degeaba.',
  processes = $json$[
    {"title":"Spune-ne lucrarea","text":"Ce ai de săpat, încărcat sau transportat, și pe ce acces."},
    {"title":"Alegem utilajul","text":"Excavator, buldoexcavator, încărcător frontal sau transport agregate."},
    {"title":"Venim cu operator","text":"Mobilizare la termenul stabilit, lucrare făcută controlat."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Complexitate","value":"Tipul de sol și adâncimea cerută","impact":"Cu cât e mai greu de săpat, cu atât crește timpul de lucru."},
    {"label":"Durată","value":"Orele estimate pentru lucrare","impact":"Plătești pe ce ai nevoie, nu pe o zi întreagă."},
    {"label":"Logistică","value":"Distanța, accesul și mobilizarea","impact":"Un acces bun ține costul de transport jos."}
  ]$json$::jsonb,
  faqs = $json$[
    {"question":"Operatorul e inclus?","answer":"Da. Utilajele se închiriază cu operator, tocmai ca lucrarea să iasă bine și în siguranță."},
    {"question":"Cum aflu cât costă?","answer":"Spune-ne lucrarea și accesul. Îți dăm o estimare pe baza orelor, a solului și a distanței."}
  ]$json$::jsonb
where slug = 'inchirieri-utilaje';
