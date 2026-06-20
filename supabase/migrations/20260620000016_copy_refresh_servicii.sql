-- PACA CONSTRUCT — refresh copy servicii (lot 2)
-- Rescrie TOATE serviciile după docs/COPY-SERVICII-SEED.md, redactat din
-- documentele reale (docs/servicii/*.docx). Domeniul real: doar partea
-- mecanizată (pregătire teren, terasamente, excavări, infrastructură). NU
-- plantări, gazon, irigații, întreținere spații verzi/piscine.
-- Idempotentă: UPDATE/DELETE după slug, sigură de rulat de mai multe ori.
-- Rulează după seed (003) și lot 1 (015), deci are ultimul cuvânt.
-- Notă: după rulare, golește cache-ul „services" (salvează un serviciu din
-- admin sau redeploy) ca paginile publice să preia textele noi.

-- ─── Servicii care contrazic documentele reale → eliminate ───────────────────
-- Documentele spun explicit că NU se face întreținere spații verzi și nu există
-- niciun serviciu de garduri. Le scoatem ca să nu atragă cereri pe care le refuzi.
delete from public.services where slug in ('intretinere-spatii-verzi', 'amenajari-garduri');

-- ─── 1. Amenajare spații verzi ───────────────────────────────────────────────
update public.services set
  eyebrow = $t$Infrastructură exterioară$t$,
  title = $t$Amenajare spații verzi$t$,
  short_title = $t$Amenajări exterioare$t$,
  description = $t$Pregătim și modelăm terenul curții tale: nivelare, terasamente, alei și platforme, drenaj. Partea mecanizată, dură, pe care stă apoi grădina. Fără plantări sau întreținere de gazon.$t$,
  summary_title = $t$Amenajarea mecanizată, nu peisagistica$t$,
  summary = $t$Ne ocupăm de infrastructura spațiului exterior: pregătirea și modelarea terenului, terasamente, alei, platforme, corectarea pantelor pentru drenaj și pregătirea zonelor pentru piscine sau iazuri. Lucrăm cu utilaje proprii. Nu facem design vegetal, plantări, însămânțări de gazon sau întreținere, ca să fim limpezi de la început și să nu plătești de două ori.$t$,
  processes = $json$[
    {"title":"Evaluare pe teren","text":"Ne uităm la acces, la diferențele de nivel, la sol și la cum curge apa. Stabilim ce se poate face și în ce ordine."},
    {"title":"Pregătire și modelare","text":"Curățăm, nivelăm și corectăm pantele, ca aleile să stea drepte și apa să meargă unde trebuie."},
    {"title":"Infrastructură","text":"Realizăm alei, platforme, borduri și pregătim zonele pentru piscină sau iaz, cu strat suport compactat."},
    {"title":"Predare","text":"Lăsăm terenul stabil, curat și gata pentru finisaje sau plantare făcută de altcineva."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Modelare teren","value":"Nivelare și corectare pante","impact":"Drenaj corect, fără băltiri."},
    {"label":"Strat suport","value":"Compactat mecanizat","impact":"Alei și platforme care nu se lasă."},
    {"label":"Limite clare","value":"Doar partea mecanizată","impact":"Fără surprize de buget la plantări."}
  ]$json$::jsonb,
  -- FAQ-urile vechi (lot 1) menționau plantări/gazon și contrazic domeniul real.
  -- Le golim; pagina cade pe FAQ generat automat până scriem unele specifice.
  faqs = $json$[]$json$::jsonb
where slug = 'amenajare-spatii-verzi';

-- ─── 2. Grădini și curți ─────────────────────────────────────────────────────
update public.services set
  eyebrow = $t$Curți și grădini private$t$,
  title = $t$Grădini și curți$t$,
  description = $t$Pregătim terenul pentru curți private și grădini mici: nivelare, modelare, alei și platforme. Lucrări mecanizate adaptate spațiilor mici, cu acces îngust.$t$,
  summary_title = $t$Făcut pentru curți mici, cu acces strâmt$t$,
  summary = $t$Multe curți rezidențiale au acces îngust și diferențe de nivel care complică lucrarea. Alegem utilajul potrivit spațiului (inclusiv miniexcavator) și pregătim terenul: nivelare, modelare, alei, platforme, pregătire pentru piscină sau iaz. Ne oprim la partea mecanizată; plantarea și gazonul rămân în grija ta sau a unui peisagist.$t$,
  processes = $json$[
    {"title":"Vedem curtea","text":"Măsurăm accesul, nivelul și solul, ca să venim cu utilajul care intră și lucrează curat."},
    {"title":"Pregătim terenul","text":"Nivelare, modelare, drenaj, strat suport pentru alei și platforme."},
    {"title":"Predăm curat","text":"Evacuăm pământul în exces și lăsăm spațiul gata de pasul următor."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Acces îngust","value":"Miniexcavator disponibil","impact":"Lucrăm și în curți strâmte."},
    {"label":"Modelare","value":"Pante corectate pentru drenaj","impact":"Fără apă stătută lângă casă."},
    {"label":"Evacuare pământ","value":"Inclusă, cu autobasculantă","impact":"Curte curată la final."}
  ]$json$::jsonb
where slug = 'gradini-si-curti';

-- ─── 3. Iazuri și piscine ────────────────────────────────────────────────────
update public.services set
  eyebrow = $t$Elemente de apă$t$,
  title = $t$Iazuri și piscine$t$,
  description = $t$Excavare, modelare și pregătire teren pentru piscine, iazuri decorative, helestee și cascade. La piscine executăm și structura de beton, hidroizolația și montajul echipamentelor.$t$,
  summary_title = $t$De la groapă la bazin etanș$t$,
  summary = $t$Pentru iazuri și elemente de apă realizăm excavarea, modelarea terenului, impermeabilizarea cu folie sau beton și drenajul zonei. Pentru piscine mergem mai departe: structură de beton sau cadre prefabricate, hidroizolație, finisaje, borduri și montajul echipamentelor (pompe, filtre, încălzire, iluminat), cu testarea etanșeității. Nu ne ocupăm de plantări și de întreținerea periodică ulterioară.$t$,
  processes = $json$[
    {"title":"Proiectare și poziționare","text":"Stabilim tipul și locul (iaz de curte, helesteu, piscină), dimensiunile și elementele de apă."},
    {"title":"Teren și impermeabilizare","text":"Nivelare, modelare, drenaj și protecție împotriva infiltrațiilor, cu folie sau beton."},
    {"title":"Structură și finisaje","text":"La piscine: beton sau prefabricate, hidroizolație, borduri și finisaje interioare."},
    {"title":"Echipamente și test","text":"Montaj pompe, filtre, încălzire, iluminat, apoi verificarea etanșeității."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Impermeabilizare","value":"Folie sau beton + drenaj","impact":"Fără infiltrații în jur."},
    {"label":"Structură piscină","value":"Beton sau prefabricate","impact":"Bazin durabil, finisat."},
    {"label":"Echipamente","value":"Pompe, filtre, iluminat","impact":"Piscină funcțională, testată."}
  ]$json$::jsonb
where slug = 'iazuri-si-piscine';

-- ─── 4. Lucrări de terasamente și excavări ───────────────────────────────────
update public.services set
  eyebrow = $t$Infrastructură de teren$t$,
  title = $t$Lucrări de terasamente și excavări$t$,
  description = $t$Pregătirea terenului pentru instalații și construcții civile: cote din proiect, decopertare, excavare controlată, umpluturi și compactare în straturi. Aici se decide stabilitatea a tot ce vine deasupra.$t$,
  summary_title = $t$Mai mult decât o săpătură mecanizată$t$,
  summary = $t$O lucrare de terasamente corectă înseamnă un proces controlat: stabilirea cotelor din proiectul tehnic, decopertarea stratului vegetal, excavarea la adâncime controlată, gestionarea și evacuarea pământului, umpluturi controlate și compactare în straturi succesive. Respectarea etapelor previne tasările, infiltrațiile și problemele structurale de mai târziu. Lucrăm cu utilaje proprii și personal calificat, cu control pe fiecare proces.$t$,
  processes = $json$[
    {"title":"Cote și decopertare","text":"Stabilim cotele din proiect și îndepărtăm stratul vegetal."},
    {"title":"Excavare controlată","text":"Săpăm la adâncimea cerută, cu verificarea nivelului."},
    {"title":"Umpluturi și compactare","text":"Umplem în straturi succesive și compactăm mecanizat."},
    {"title":"Evacuare","text":"Gestionăm și transportăm pământul rezultat, cu autobasculanta."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Cote","value":"Conform proiectului tehnic","impact":"Fundație pe teren stabil, nu pe umplutură."},
    {"label":"Compactare","value":"În straturi succesive","impact":"Fără tasări și fisuri ulterioare."},
    {"label":"Evacuare pământ","value":"Inclusă","impact":"Șantier curat la final."}
  ]$json$::jsonb
where slug = 'terasamente-excavari';

-- ─── 5. Nivelare teren ───────────────────────────────────────────────────────
update public.services set
  eyebrow = $t$Pregătire suprafețe$t$,
  title = $t$Nivelare teren$t$,
  description = $t$Decopertare, nivelare și umpluturi compactate pentru pregătirea terenului înainte de construcție. O suprafață plană și stabilă, la cota cerută.$t$,
  summary_title = $t$O suprafață pe care se poate construi$t$,
  summary = $t$Înainte de orice construcție, terenul trebuie adus la cotă și stabilizat. Executăm decopertarea stratului vegetal, nivelarea suprafeței și umpluturile controlate, cu compactare mecanizată. Așa eviți tasările neuniforme și pregătești corect terenul pentru fundație, platformă sau amenajare.$t$,
  processes = $json$[
    {"title":"Decopertare","text":"Îndepărtăm stratul vegetal și pregătim suprafața."},
    {"title":"Nivelare","text":"Aducem terenul la cotă, eliminăm denivelările."},
    {"title":"Umpluturi și compactare","text":"Umplem unde e nevoie, compactăm în straturi pentru o bază stabilă."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Nivel","value":"La cota cerută","impact":"Bază plană pentru ce urmează."},
    {"label":"Compactare","value":"Mecanizată, în straturi","impact":"Suprafață care nu se lasă."},
    {"label":"Strat vegetal","value":"Decopertat și gestionat","impact":"Teren curat, pregătit."}
  ]$json$::jsonb
where slug = 'nivelare-teren';

-- ─── 6. Drenaje și evacuare ape pluviale ─────────────────────────────────────
update public.services set
  eyebrow = $t$Management apă$t$,
  title = $t$Drenaje și evacuare ape pluviale$t$,
  description = $t$Săpături și sisteme de drenaj care duc apa pluvială departe de fundație. Previn infiltrațiile și acumularea apei acolo unde face pagube.$t$,
  summary_title = $t$Apa dusă unde trebuie, nu lângă fundație$t$,
  summary = $t$Apa care stă lângă fundație sau băltește în curte ajunge, în timp, în fisuri și infiltrații. Realizăm săpături pentru sisteme de drenaj și evacuare a apei pluviale, dimensionate după suprafață și sol, ca apa să fie dirijată controlat departe de construcție.$t$,
  processes = $json$[
    {"title":"Evaluăm scurgerea","text":"Vedem cum curge apa pe teren și unde se adună."},
    {"title":"Săpăm traseul","text":"Realizăm șanțurile de drenaj la panta corectă."},
    {"title":"Dirijăm apa","text":"Conducem apa pluvială departe de fundație, controlat."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Pantă","value":"Calculată pentru scurgere","impact":"Apa pleacă, nu stă."},
    {"label":"Poziție","value":"Departe de fundație","impact":"Fără infiltrații în structură."},
    {"label":"Dimensionare","value":"După suprafață și sol","impact":"Sistem care face față ploilor."}
  ]$json$::jsonb
where slug = 'drenaje-ape-pluviale';

-- ─── 7. Săpături pentru fundații și pivnițe ──────────────────────────────────
update public.services set
  eyebrow = $t$Excavări controlate$t$,
  title = $t$Săpături pentru fundații și pivnițe$t$,
  description = $t$Săpături pentru fundații (continue, izolate, radier) și pentru spații subterane: pivnițe, beciuri, subsoluri. La cota din proiect, cu stabilizarea săpăturii și evacuarea pământului.$t$,
  summary_title = $t$Baza casei și spațiile de sub ea$t$,
  summary = $t$Săpătura pentru fundație este prima etapă din construcția unei locuințe, iar de corectitudinea ei depinde stabilitatea întregii structuri. Executăm săpături pentru fundații continue, izolate sau radier general, la cotele din proiect, cu pregătirea stratului suport și evacuarea materialului. Pentru pivnițe, beciuri și subsoluri (inclusiv beci în pământ sau sub garaj) excavăm controlat, asigurând stabilitatea săpăturii și spațiul necesar pentru hidroizolații, drenaje și structura de rezistență.$t$,
  processes = $json$[
    {"title":"Trasare și cote","text":"Stabilim conturul și adâncimea din planul de săpătură."},
    {"title":"Excavare controlată","text":"Săpăm la cotă, cu atenție la stabilitatea malurilor."},
    {"title":"Pregătire bază","text":"Pregătim stratul suport pentru armare și turnare."},
    {"title":"Evacuare","text":"Transportăm pământul rezultat, cu autobasculanta."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Adâncime","value":"La cota din proiect","impact":"Fundație stabilă, fără tasări."},
    {"label":"Stabilitate săpătură","value":"Maluri asigurate","impact":"Lucru sigur pentru pivnițe și subsoluri."},
    {"label":"Acces","value":"Miniexcavator pentru spații strâmte","impact":"Lucrăm și în curți înguste."}
  ]$json$::jsonb
where slug = 'fundatii-pivnite';

-- ─── 8. Săpături pentru fose septice ─────────────────────────────────────────
update public.services set
  eyebrow = $t$Instalații subterane$t$,
  title = $t$Săpături pentru fose septice$t$,
  description = $t$Excavare și pregătire teren pentru fose septice și sisteme individuale de canalizare, plus șanțurile de racord. Pentru fosele din beton, pregătim și baza de montaj.$t$,
  summary_title = $t$Canalizare proprie, acolo unde nu e rețea$t$,
  summary = $t$Pentru locuințele fără racord la canalizarea publică, executăm săpătura pentru fosa septică la dimensiunile din proiect, cu pregătirea și stabilizarea terenului pentru montajul bazinului. La fosele din beton realizăm și etapele pregătitoare: stabilizarea terenului și stratul suport. Săpăm și șanțurile pentru conductele care leagă locuința de fosă, la adâncimea și panta corecte.$t$,
  processes = $json$[
    {"title":"Stabilim amplasarea","text":"Poziția și adâncimea gropii, în funcție de proiect și teren."},
    {"title":"Excavăm și stabilizăm","text":"Săpăm groapa și asigurăm baza, ca terenul să nu se surpe."},
    {"title":"Racord","text":"Realizăm șanțurile pentru conductele dintre casă și fosă."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Dimensiuni groapă","value":"Conform proiectului","impact":"Montaj corect al bazinului."},
    {"label":"Stabilizare","value":"Bază pregătită","impact":"Sistem care nu se mișcă după instalare."},
    {"label":"Racord","value":"Pantă corectă","impact":"Curgere fără blocaje."}
  ]$json$::jsonb
where slug = 'fose-septice';

-- ─── 9. Branșamente apă și canalizare ────────────────────────────────────────
update public.services set
  eyebrow = $t$Utilități$t$,
  title = $t$Branșamente apă și canalizare$t$,
  description = $t$Săpături pentru rețele de apă și canalizare: conducte, branșamente și racorduri la rețeaua publică. La adâncimea și panta corecte, pentru sisteme care funcționează fără probleme.$t$,
  summary_title = $t$Legătura corectă la apă și canal$t$,
  summary = $t$Executăm săpăturile pentru conducte de apă, șanțuri de canalizare și branșamente la utilități, pentru locuințe și construcții noi sau pentru extinderea rețelelor existente. Respectăm cotele din proiect, ca instalațiile subterane să fie montate corect și să funcționeze fără infiltrații sau blocaje.$t$,
  processes = $json$[
    {"title":"Trasăm traseul","text":"Stabilim drumul conductelor și adâncimea necesară."},
    {"title":"Săpăm șanțurile","text":"La panta corectă pentru curgere sau presiune."},
    {"title":"Pregătim racordul","text":"Pregătim conectarea la rețeaua publică existentă."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Adâncime","value":"Sub limita de îngheț, conform proiectului","impact":"Instalații protejate."},
    {"label":"Pantă canalizare","value":"Calculată","impact":"Curgere fără blocaje."},
    {"label":"Branșament","value":"Racord la rețeaua publică","impact":"Conectare corectă, durabilă."}
  ]$json$::jsonb
where slug = 'bransamente-apa-canalizare';

-- ─── 10. Alei, platforme și drumuri de acces ─────────────────────────────────
update public.services set
  eyebrow = $t$Acces și circulații$t$,
  title = $t$Alei, platforme și drumuri de acces$t$,
  description = $t$Pregătim terenul pentru alei, platforme și drumuri de acces auto sau pietonale: decopertare, nivelare, strat suport din balast sau piatră, compactare. La cerere, turnăm și betonul.$t$,
  summary_title = $t$Suprafețe circulabile care rezistă$t$,
  summary = $t$O alee sau un drum de acces durabil începe cu un strat suport stabil. Executăm decopertarea, nivelarea și stratul suport din balast sau piatră, cu compactare mecanizată, pentru intrări auto, parcări rezidențiale, alei de curte și drumuri de acces către locuințe sau șantiere. În funcție de destinație, finisăm prin betonare, pietruire sau pregătim suprafața pentru pavaj. Montajul de pavaj și turnarea betonului se fac la cerere.$t$,
  processes = $json$[
    {"title":"Pregătim terenul","text":"Decopertare și nivelare a traseului."},
    {"title":"Strat suport","text":"Balast sau piatră, compactate pentru o bază stabilă."},
    {"title":"Finisaj","text":"Betonare, pietruire sau pregătire pentru pavaj, după caz."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Strat suport","value":"Balast/piatră compactate","impact":"Suprafață care nu se lasă."},
    {"label":"Destinație","value":"Pietonal sau auto ușor","impact":"Fundație adaptată traficului."},
    {"label":"Finisaj","value":"Beton, piatră sau pavaj","impact":"Suprafață durabilă, la cerere betonată."}
  ]$json$::jsonb
where slug = 'alei-platforme-drumuri';

-- ─── 11. Drumuri interne și de acces ─────────────────────────────────────────
update public.services set
  eyebrow = $t$Infrastructură internă$t$,
  title = $t$Drumuri interne și de acces$t$,
  description = $t$Drumuri de acces și platforme pentru curți, șantiere și zone comerciale: pregătirea terenului, strat suport stabil și compactare pentru trafic auto.$t$,
  summary_title = $t$Acces auto care ține la utilizare zilnică$t$,
  summary = $t$Pentru curți rezidențiale, șantiere și zone comerciale executăm drumuri interne și de acces: decopertare, nivelare, strat suport din balast sau piatră și compactare mecanizată, dimensionate pentru circulația autovehiculelor. La cerere, finisăm prin betonare.$t$,
  processes = $json$[
    {"title":"Trasare și pregătire","text":"Stabilim traseul și pregătim terenul."},
    {"title":"Strat suport","text":"Balast sau piatră, compactate pentru sarcini auto."},
    {"title":"Finisaj","text":"Betonare sau pietruire, după destinație."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Compactare","value":"Pentru trafic auto","impact":"Drum care nu se lasă."},
    {"label":"Strat suport","value":"Balast/piatră","impact":"Bază stabilă pe orice vreme."},
    {"label":"Finisaj","value":"Beton la cerere","impact":"Suprafață durabilă."}
  ]$json$::jsonb
where slug = 'drumuri-interne';

-- ─── 12. Excavări pentru proiecte industriale ────────────────────────────────
update public.services set
  eyebrow = $t$Proiecte industriale$t$,
  title = $t$Excavări pentru proiecte industriale$t$,
  description = $t$Terasamente și excavări de volum pentru hale, depozite și platforme industriale, cu utilaje proprii și cote respectate. Pe deviz și pe termen, nu pe aproximări.$t$,
  summary_title = $t$Volume mari, cote respectate$t$,
  summary = $t$Pentru proiecte comerciale și industriale executăm terasamente și excavări de volum: decopertare, săpături la cotă, umpluturi controlate și compactare pentru sarcinile reale ale platformei. Lucrăm organizat, cu utilaje proprii și personal calificat, cu control pe fiecare etapă și gestionarea evacuării pământului.$t$,
  processes = $json$[
    {"title":"Planificare","text":"Volume, cote, acces și faze, stabilite împreună cu tine."},
    {"title":"Terasamente de volum","text":"Săpături și umpluturi cu utilaje dimensionate pentru ritm."},
    {"title":"Compactare","text":"Pentru sarcini grele, conform destinației platformei."},
    {"title":"Predare","text":"Cote confirmate, teren gata pentru construcție sau montaj."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Cote","value":"Conform proiectului","impact":"Montaj și turnări fără corecții."},
    {"label":"Compactare","value":"Pentru sarcini grele","impact":"Platforme care nu se lasă."},
    {"label":"Organizare","value":"Faze și evacuare gestionate","impact":"Șantier sub control."}
  ]$json$::jsonb
where slug = 'excavari-industriale';

-- ─── 13. Terasamente și platforme industriale ────────────────────────────────
update public.services set
  eyebrow = $t$Platforme industriale$t$,
  title = $t$Terasamente și platforme industriale$t$,
  description = $t$Pregătirea terenului și a stratului suport pentru platforme și drumuri interne industriale, compactate pentru trafic greu și sarcini de depozitare.$t$,
  summary_title = $t$O platformă pentru sarcini reale$t$,
  summary = $t$Realizăm terasamentele și stratul suport pentru platforme industriale și drumuri interne: decopertare, nivelare la toleranțe, strat de balast sau piatră și compactare pentru trafic greu. O platformă pregătită corect nu se tasează sub sarcină și nu cere corecții după montaj.$t$,
  processes = $json$[
    {"title":"Pregătire teren","text":"Decopertare și nivelare la cota cerută."},
    {"title":"Strat suport","text":"Balast/piatră în straturi, compactate."},
    {"title":"Verificare","text":"Confirmarea cotelor și a portanței înainte de predare."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Toleranțe","value":"Conform proiectului","impact":"Suprafață uniformă pentru trafic greu."},
    {"label":"Portanță","value":"Compactare pentru sarcini","impact":"Platformă care ține."},
    {"label":"Drumuri interne","value":"Strat suport stabil","impact":"Circulație fără degradare."}
  ]$json$::jsonb
where slug = 'platforme-industriale';

-- ─── 14. Închirieri utilaje cu operator ──────────────────────────────────────
update public.services set
  eyebrow = $t$Serviciu adiacent$t$,
  title = $t$Închirieri utilaje cu operator$t$,
  description = $t$Excavator, miniexcavator, buldoexcavator, încărcător frontal și autobasculantă, cu operator inclus. Tu spui lucrarea și accesul, noi aducem utilajul potrivit.$t$,
  summary_title = $t$Utilajul potrivit, cu om care îl știe$t$,
  summary = $t$Punem la dispoziție utilajele cu care lucrăm zilnic: miniexcavator pentru curți și acces îngust, excavator pentru săpături ample, buldoexcavator pentru lucrări versatile, încărcător frontal și autobasculantă (3,5t, 7t, 8x4) pentru transport și evacuare. Operatorul e inclus, fiindcă de el depinde ca lucrarea să iasă bine și în siguranță. Tariful depinde de complexitate, durată și logistică.$t$,
  processes = $json$[
    {"title":"Spune-ne lucrarea","text":"Ce ai de săpat, încărcat sau transportat, și pe ce acces."},
    {"title":"Alegem utilajul","text":"Mini sau excavator standard, buldoexcavator, încărcător, basculantă."},
    {"title":"Venim cu operator","text":"Mobilizare la termen, lucru controlat."}
  ]$json$::jsonb,
  specs = $json$[
    {"label":"Operator","value":"Inclus","impact":"Lucrare sigură, fără improvizații."},
    {"label":"Acces","value":"Miniexcavator pentru spații strâmte","impact":"Intrăm și unde e îngust."},
    {"label":"Transport","value":"Autobasculante 3,5t, 7t, 8x4","impact":"Evacuare și aprovizionare rapidă."}
  ]$json$::jsonb
where slug = 'inchirieri-utilaje';
