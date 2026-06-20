-- PACA CONSTRUCT — seed conținut inițial
-- Migrare 3/3: populează conținutul public migrat din app/data/*.ts.
-- Idempotentă: fiecare bloc rulează doar dacă tabelul corespunzător e gol.
-- NU se seedează cereri (service_requests / rental_requests) — sunt generate de
-- utilizatori prin formularele publice.

do $$
declare
  -- Procese / specificații partajate (din app/data/services.ts)
  default_processes jsonb := $json$[
    {"title":"Evaluare tehnica","text":"Analizam accesul, cotele, solul si limitarile reale din teren inainte de mobilizare."},
    {"title":"Planificare executie","text":"Stabilim ordinea lucrarilor, utilajele necesare, traseele si masurile de protectie."},
    {"title":"Executie controlata","text":"Lucram cu operatori calificati si verificam permanent adancimile, pantele si finisajele."},
    {"title":"Predare pregatita","text":"Lasam terenul curat, stabilizat si pregatit pentru etapa urmatoare a proiectului."}
  ]$json$;
  garden_processes jsonb := $json$[
    {"title":"Proiectare spatiu","text":"Stabilim functiunile, circulatiile, zonele verzi si relatia dintre plante, apa si acces."},
    {"title":"Infrastructura ascunsa","text":"Pregatim drenajul, irigatiile, stratul vegetal si suportul pentru alei sau borduri."},
    {"title":"Selectie vegetala","text":"Alegem specii adaptate climatului local, expunerii si nivelului de intretinere dorit."},
    {"title":"Plantare si finisaj","text":"Executam plantarea, nivelarea finala, mulcirea si detaliile care dau coerenta spatiului."}
  ]$json$;
  default_specs jsonb := $json$[
    {"label":"Trasare si cote","value":"Verificare pe etape","impact":"Reduce riscul de corectii costisitoare si mentine lucrarea in parametri."},
    {"label":"Gestionare material","value":"Sortare, relocare sau evacuare","impact":"Pastreaza santierul organizat si accelereaza lucrarile urmatoare."},
    {"label":"Protectie teren","value":"Acces controlat si compactare adaptata","impact":"Limiteaza deteriorarea zonelor adiacente si stabilizeaza suprafetele."}
  ]$json$;
  garden_specs jsonb := $json$[
    {"label":"Strat vegetal","value":"Min. 30-40 cm pentru gazon","impact":"Asigura prindere buna, rezistenta la seceta si crestere uniforma."},
    {"label":"Drenaj si irigatii","value":"Trasee ascunse, testate inainte de finisaj","impact":"Previne baltirea si mentine vegetatia stabila in perioadele calde."},
    {"label":"Material vegetal","value":"Specii aclimatizate","impact":"Reduce pierderile si pastreaza gradina usor de intretinut."}
  ]$json$;
  excavation_specs jsonb := $json$[
    {"label":"Adancime sapatura","value":"Conform trasarii si proiectului","impact":"Asigura baza corecta pentru fundatii, utilitati sau elemente tehnice."},
    {"label":"Pante si evacuare apa","value":"Control vizual si instrumental","impact":"Reduce riscul de acumulare a apei si instabilitate in timp."},
    {"label":"Compactare","value":"Pe straturi adaptate solului","impact":"Creste portanta si pregateste terenul pentru etapa de constructie."}
  ]$json$;
begin

-- ─── FAQ ─────────────────────────────────────────────────────────────────────
if (select count(*) from public.faq_sections) = 0 then
  insert into public.faq_sections (slug, index_label, title, description, sort_order) values
    ('evaluare', '01', 'Evaluare si costuri',
     'Transparenta in calcularea bugetelor pentru lucrari de terasament, excavare si amenajare.', 0),
    ('excavari', '02', 'Excavari si fundatii',
     'Raspunsuri despre sapaturi, evacuarea pamantului, fundatii si siguranta in santier.', 1),
    ('amenajari', '03', 'Amenajari exterioare',
     'Etape si criterii pentru pregatirea terenului inainte de gradini, alei, drenaje sau spatii verzi.', 2);

  insert into public.faq_items (section_id, question, answer, highlights, sort_order)
  select s.id, v.question, v.answer, v.highlights, v.sort_order
  from (values
    ('evaluare', 'Cum se calculeaza pretul unei lucrari?',
     'Pretul depinde de volumul de pamant dislocat, tipul de sol, accesul in santier si utilajele necesare. Putem oferi o estimare initiala pe baza fotografiilor si detaliilor trimise, dar oferta finala se stabileste dupa vizita la locatie.',
     array['Volum si tip de sol','Acces pentru utilaje','Durata si logistica'], 0),
    ('evaluare', 'De ce este importanta evaluarea tehnica pe teren?',
     'Evaluarea confirma structura solului, diferentele de nivel, accesul si riscurile de executie. Astfel evitam modificari neprevazute de pret si alegem utilajele potrivite pentru lucrare.',
     array['Masuratori reale','Solutie tehnica clara','Oferta ferma'], 1),
    ('evaluare', 'Puteti face o estimare fara proiect tehnic?',
     'Da, pentru orientare. Avem nevoie de locatie, fotografii, dimensiuni aproximative si obiectivul lucrarii. Pentru executie, cerintele finale sunt confirmate prin masuratori si verificare in teren.',
     array['Fotografii','Dimensiuni aproximative','Obiectivul lucrarii'], 2),
    ('excavari', 'Evacuati pamantul rezultat?',
     'Da, putem coordona evacuarea pamantului excedentar la depozite autorizate. Acest serviciu este ofertat separat, in functie de distanta, volum si numarul de curse necesare.',
     array['Depozite autorizate','Transport calculat separat','Logistica inclusa'], 0),
    ('excavari', 'Cat de adanc puteti excava pentru o fundatie?',
     'Adancimea depinde de proiect, studiul geotehnic si conditiile reale din teren. Pentru sapaturi adanci stabilim solutii de sprijinire a malurilor si reguli de lucru care previn surparile.',
     array['Studiu geotehnic','Sprijiniri de maluri','Norme de siguranta'], 1),
    ('excavari', 'Lucrati si in spatii inguste?',
     'Da. Pentru curti sau zone cu acces limitat folosim utilaje compacte, iar planul de executie este adaptat la latimea accesului si la protectia elementelor existente.',
     array['Miniutilaje','Protectie pentru curte','Plan adaptat accesului'], 2),
    ('amenajari', 'Ce include pregatirea terenului?',
     'Pregatirea poate include decopertare, nivelare, compactare, drenaj si modelarea cotelor. Etapele exacte se aleg dupa evaluarea terenului si dupa obiectivul final al amenajarii.',
     array['Decopertare','Nivelare','Drenaj corect'], 0),
    ('amenajari', 'Puteti prelua si partea de spatii verzi?',
     'Da. Executam lucrari de amenajare peisagistica, plantari, gazon, irigatii si intretinere, in functie de proiect si de conditiile terenului.',
     array['Gazon si plantari','Irigatii','Intretinere'], 1),
    ('amenajari', 'Cand este potrivit sa planific lucrarea?',
     'Pentru amenajari exterioare, perioadele stabile meteo sunt cele mai eficiente. Recomandam planificarea din timp, mai ales cand lucrarea depinde de utilaje, transport si materiale.',
     array['Planificare meteo','Utilaje disponibile','Materiale pregatite'], 2)
  ) as v(section_slug, question, answer, highlights, sort_order)
  join public.faq_sections s on s.slug = v.section_slug;
end if;

-- ─── Grupuri de servicii (navigație) ─────────────────────────────────────────
if (select count(*) from public.service_groups) = 0 then
  insert into public.service_groups (slug, title, href, sort_order) values
    ('amenajare-spatii-verzi', 'Amenajare spatii verzi', '/servicii/amenajare-spatii-verzi', 0),
    ('terasamente-excavari',   'Lucrari terasamente si excavari', '/servicii/terasamente-excavari', 1),
    ('excavari-industriale',   'Excavari pentru proiecte industriale', '/servicii/excavari-industriale', 2),
    ('inchirieri-utilaje',     'Inchirieri utilaje cu operator', '/servicii/inchirieri-utilaje', 3);
end if;

-- ─── Servicii ────────────────────────────────────────────────────────────────
if (select count(*) from public.services) = 0 then
  insert into public.services
    (slug, title, eyebrow, description, summary_title, summary, image_src, image_alt,
     processes, specs, group_slug, in_mosaic, is_mosaic_hero, is_mosaic_wide, sort_order)
  values
    ('amenajare-spatii-verzi', 'Amenajare spatii verzi', 'Servicii Premium',
     'Transformam spatiile exterioare brute in zone verzi coerente, functionale si usor de intretinut.',
     'De la teren brut la spatiu viu.',
     'Abordam fiecare spatiu verde ca pe o structura vie: pregatim solul, apa, accesul si plantarea astfel incat rezultatul sa fie estetic, stabil si durabil.',
     '/hero.png', 'Amenajare spatii verzi executata cu utilaje si finisaje naturale',
     garden_processes, garden_specs, null, false, false, false, 0),

    ('gradini-si-curti', 'Gradini si curti', 'Servicii Premium',
     'Proiectare si executie pentru gradini rezidentiale, curti private, gazon, plantari, alei si irigatii.',
     'O curte bine gandita incepe sub nivelul gazonului.',
     'Integram lucrari de teren, drenaj, strat vegetal si finisaje pentru ca gradina sa arate bine si sa functioneze corect in fiecare sezon.',
     '/hero.png', 'Gradina si curte amenajate cu zone verzi si alei',
     garden_processes, garden_specs, 'amenajare-spatii-verzi', true, true, false, 1),

    ('iazuri-si-piscine', 'Iazuri si piscine', 'Servicii cu infrastructura',
     'Sapaturi, modelare teren si pregatire tehnica pentru iazuri decorative si piscine rezidentiale.',
     'Apa cere cote precise si teren stabil.',
     'Pregatim forma, adancimea, accesul si evacuarea materialului astfel incat instalarea bazinului sau a iazului sa aiba o baza sigura.',
     '/hero.png', 'Pregatire teren pentru iaz sau piscina',
     default_processes, excavation_specs, 'amenajare-spatii-verzi', true, false, false, 2),

    ('intretinere-spatii-verzi', 'Intretinere spatii verzi', 'Servicii periodice',
     'Interventii pentru gazon, vegetatie, irigatii si mentinerea spatiilor verzi in forma optima.',
     'Spatiile verzi bune se mentin prin ritm, nu prin improvizatie.',
     'Planificam lucrarile recurente in functie de sezon, stare vegetatiei si nivelul de utilizare al spatiului.',
     null, null,
     garden_processes, garden_specs, 'amenajare-spatii-verzi', true, false, false, 3),

    ('terasamente-excavari', 'Lucrari terasamente si excavari', 'Infrastructura teren',
     'Sapaturi, nivelari, compactari, drenaje si lucrari de pregatire pentru constructii si instalatii.',
     'Terenul corect pregatit tine proiectul drept.',
     'Combinam utilaje potrivite, operatori experimentati si verificari pe etape pentru lucrari rapide, curate si predictibile.',
     '/hero.png', 'Utilaj de terasamente pe santier',
     default_processes, excavation_specs, null, false, false, false, 4),

    ('fundatii-pivnite', 'Excavari fundatii si pivnite', 'Excavari controlate',
     'Excavatii precise pentru fundatii, pivnite, subsoluri si lucrari pregatitoare pentru constructii.',
     'Sapatura fundatiei trebuie sa fie precisa din prima.',
     'Respectam cotele si accesul utilajelor, gestionam materialul excavat si pregatim terenul pentru armare, turnare sau sprijiniri.',
     '/hero.png', 'Excavare pentru fundatie si pivnita',
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 5),

    ('fose-septice', 'Sapaturi fose septice', 'Instalatii subterane',
     'Sapaturi pentru fose septice, camine tehnice si instalatii subterane, adaptate conditiilor din teren.',
     'Volumul corect si accesul bun fac instalatia mai sigura.',
     'Pregatim groapa, traseele si zona de lucru pentru montaj rapid, cu atentie la pante si evacuarea pamantului.',
     null, null,
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 6),

    ('bransamente-apa-canalizare', 'Bransamente apa si canalizare', 'Utilitati',
     'Santuri, trasee si pregatire teren pentru retele de apa, canalizare si utilitati conexe.',
     'Traseele de utilitati trebuie sa ramana curate si verificabile.',
     'Executam sapaturi liniare, pastram pantele necesare si protejam zonele adiacente pentru racordari eficiente.',
     null, null,
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 7),

    ('nivelare-teren', 'Nivelare teren', 'Pregatire suprafete',
     'Decopertare, umplere, compactare si aducerea terenului la cota necesara proiectului.',
     'Nivelarea buna face diferenta in fiecare etapa urmatoare.',
     'Corectam diferentele de nivel, imbunatatim scurgerea apelor si pregatim suprafata pentru gradina, constructie sau acces auto.',
     '/hero.png', 'Nivelare teren cu utilaj',
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 8),

    ('alei-platforme-drumuri', 'Alei, platforme si drumuri de acces', 'Acces si circulatii',
     'Pregatire strat suport, tasare si modelare pentru alei, platforme si cai de acces auto.',
     'Un drum bun incepe cu suportul, nu cu finisajul.',
     'Pregatim infrastructura de baza pentru circulatii stabile, cu pante, compactare si drenaj adaptate utilizarii.',
     '/hero.png', 'Pregatire platforma si drum de acces',
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 9),

    ('drenaje-ape-pluviale', 'Drenaje si evacuare ape pluviale', 'Management apa',
     'Sisteme de drenaj pentru captarea, directionarea si evacuarea eficienta a apelor pluviale.',
     'Apa trebuie directionata inainte sa devina problema.',
     'Modelam terenul si pregatim traseele pentru drenuri, rigole sau evacuari care protejeaza constructiile si spatiile verzi.',
     null, null,
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 10),

    ('amenajari-garduri', 'Amenajari garduri', 'Limite si imprejmuiri',
     'Pregatire teren, sapaturi si suport tehnic pentru fundatii, stalpi si trasee de garduri.',
     'O imprejmuire dreapta incepe cu traseu si fundatie.',
     'Curatam si pregatim traseul, executam sapaturi si nivelari astfel incat montajul gardului sa fie stabil si ordonat.',
     null, null,
     default_processes, excavation_specs, 'terasamente-excavari', true, false, false, 11),

    ('excavari-industriale', 'Excavari pentru proiecte industriale', 'Proiecte industriale',
     'Excavari, platforme si pregatiri de teren pentru proiecte industriale, logistice si comerciale.',
     'Santierul industrial cere ritm si control.',
     'Lucram pe suprafete mari cu planificare clara, utilaje potrivite si coordonare cu etapele de infrastructura.',
     '/hero.png', 'Excavari pentru proiect industrial',
     default_processes, excavation_specs, null, false, false, false, 12),

    ('platforme-industriale', 'Terasamente si platforme industriale', 'Platforme industriale',
     'Terasamente, compactari si pregatiri de platforme pentru proiecte industriale si comerciale.',
     'Platforma industriala trebuie sa fie stabila si masurabila.',
     'Pregatim stratificarea, evacuarea apelor si compactarea pentru suprafete tehnice, zone de lucru sau fundatii ulterioare.',
     '/hero.png', 'Terasamente si platforme industriale',
     default_processes, excavation_specs, 'excavari-industriale', true, false, false, 13),

    ('drumuri-interne', 'Drumuri interne si infrastructura', 'Infrastructura interna',
     'Lucrari de infrastructura pentru circulatii interne, drumuri tehnologice si acces in santiere.',
     'Circulatia interna tine santierul functional.',
     'Executam pregatirea traseelor, stratul suport si pantele necesare pentru acces eficient si sigur.',
     null, null,
     default_processes, excavation_specs, 'excavari-industriale', true, false, false, 14),

    ('inchirieri-utilaje', 'Inchirieri utilaje cu operator', 'Serviciu adiacent',
     'Excavatoare, incarcator frontal si transport agregate, operate de personal calificat.',
     'Utilajul potrivit conteaza doar cu operatorul potrivit.',
     'Punem la dispozitie utilaje deservite de oameni care inteleg terenul, ritmul santierului si executia precisa.',
     '/hero.png', 'Utilaje de santier cu operator',
     default_processes, default_specs, null, true, false, true, 15),

    ('excavatoare', 'Excavatoare', 'Utilaje cu operator',
     'Excavatoare pentru sapaturi, terasamente, incarcari si lucrari punctuale in santiere rezidentiale sau industriale.',
     'Excavatorul aduce precizie si forta acolo unde terenul cere.',
     'Alegem utilajul si cupa potrivita pentru volum, acces si tipul solului, cu operator inclus.',
     '/hero.png', 'Excavator cu operator pe santier',
     default_processes, default_specs, 'inchirieri-utilaje', false, false, false, 16),

    ('incarcator-frontal', 'Incarcator frontal', 'Utilaje cu operator',
     'Incarcator frontal pentru manipulare material, nivelari, incarcari si organizarea santierului.',
     'Manipularea materialului decide viteza santierului.',
     'Folosim incarcatorul frontal pentru volume mari, relocari rapide si curatarea eficienta a zonelor de lucru.',
     '/hero.png', 'Incarcator frontal pentru materiale de constructii',
     default_processes, default_specs, 'inchirieri-utilaje', false, false, false, 17),

    ('transport-agregate', 'Transport agregate', 'Logistica santier',
     'Transport pentru agregate, pamant, piatra si materiale necesare lucrarilor de teren.',
     'Materialele trebuie sa ajunga cand santierul e pregatit.',
     'Coordonam transportul cu etapa de executie, astfel incat materialele sa fie disponibile fara blocaje inutile.',
     null, null,
     default_processes, default_specs, 'inchirieri-utilaje', false, false, false, 18);
end if;

-- ─── Utilaje de închiriat ────────────────────────────────────────────────────
if (select count(*) from public.rental_machines) = 0 then
  insert into public.rental_machines
    (slug, category, title, short_description, long_description, price, image_src, image_alt,
     specs, uses, access_requirements, sort_order)
  values
    ('excavator-cu-operator', 'Echipament greu', 'Excavator cu operator',
     'Ideal pentru excavatii de mare adancime, fundatii, demolari si manipularea volumelor mari de pamant.',
     'Inchiriere excavator profesional cu operator experimentat pentru lucrari complexe de terasamente, fundatii si amenajari exterioare. Eficienta maxima si precizie tehnica pentru proiectul tau.',
     'De la 180 RON / ora', '/hero.png', 'Excavator lucrand pe un teren pregatit pentru amenajare.',
     $json$[{"label":"Greutate operationala","value":"8.5 - 20 tone"},{"label":"Adancime sapare","value":"Pana la 6 m"},{"label":"Latime cupa","value":"400 - 1200 mm"},{"label":"Disponibilitate","value":"Confirmare rapida"}]$json$,
     array['Sapaturi fundatii case','Nivelare si terasare teren','Decopertari strat vegetal','Santuri utilitati'],
     array['Latime minima acces: 2.5 m','Sol stabilizat pentru transport','Fara cabluri aeriene joase'], 0),

    ('buldoexcavator', 'Include operator', 'Buldoexcavator',
     'Combinatie practica intre incarcator frontal si excavator, potrivita pentru santiere urbane si spatii restranse.',
     'Buldoexcavator cu operator pentru sapaturi, incarcare materiale si nivelari rapide in zone cu acces controlat.',
     'De la 160 RON / ora', '/hero.png', 'Buldoexcavator pregatit pentru lucrari de santier.',
     $json$[{"label":"Configuratie","value":"Cupă fata + brat spate"},{"label":"Aplicatii","value":"Sapaturi, incarcare, nivelare"},{"label":"Acces","value":"Potrivit pentru zone urbane"},{"label":"Operator","value":"Inclus"}]$json$,
     array['Sapare santuri utilitati','Nivelare teren','Incarcare materiale'],
     array['Acces auto pentru transport','Spatiu minim pentru manevra','Verificare teren inainte de mobilizare'], 1),

    ('incarcator-frontal', 'Include operator', 'Incarcator frontal',
     'Eficient pentru mutarea rapida a pamantului, pietrisului sau deseurilor din constructii.',
     'Incarcator frontal cu operator pentru manipularea volumelor mari, curatarea amplasamentelor si alimentarea camioanelor.',
     'De la 150 RON / ora', '/hero.png', 'Incarcator frontal pe un santier pregatit.',
     $json$[{"label":"Utilizare","value":"Manipulare volum mare"},{"label":"Materiale","value":"Pamant, agregate, resturi"},{"label":"Productivitate","value":"Ridicata pe suprafete mari"},{"label":"Operator","value":"Inclus"}]$json$,
     array['Manipulare agregate','Curatare amplasament','Umpluturi fundatii'],
     array['Suprafata suficienta pentru viraj','Teren portant','Zona de incarcare clar delimitata'], 2),

    ('transport-agregate', 'Transport santier', 'Transport agregate',
     'Camioane pentru livrarea materialelor granulare necesare amenajarilor sau fundatiilor.',
     'Transport de agregate pentru santiere rezidentiale, comerciale si industriale, cu planificare adaptata accesului si volumului necesar.',
     'De la 250 RON / cursa', '/hero.png', 'Camion pentru transport agregate in zona de santier.',
     $json$[{"label":"Materiale","value":"Piatra, nisip, balast"},{"label":"Planificare","value":"In functie de volum"},{"label":"Transport","value":"Stabilit separat"},{"label":"Disponibilitate","value":"Cu confirmare"}]$json$,
     array['Piatra sparta, refuz ciur','Nisip, balast','Pamant vegetal'],
     array['Acces pentru camion','Zona sigura de descarcare','Confirmare traseu inainte de livrare'], 3),

    ('transport-pamant', 'Transport santier', 'Transport pamant',
     'Evacuarea pamantului rezultat din excavatii sau relocarea acestuia in santier.',
     'Transport pamant si resturi vegetale cu planificare tehnica pentru evacuare eficienta si coordonare cu lucrarile de excavare.',
     'De la 250 RON / cursa', '/hero.png', 'Camion pentru transport pamant de pe santier.',
     $json$[{"label":"Aplicatie","value":"Evacuare si relocare"},{"label":"Material","value":"Pamant excavat"},{"label":"Planificare","value":"Dupa volum estimat"},{"label":"Disponibilitate","value":"Cu confirmare"}]$json$,
     array['Evacuare pamant excavat','Relocare interna','Evacuare resturi vegetale'],
     array['Acces pentru incarcare','Volum estimat inainte de cursa','Locatie de descarcare confirmata'], 4);
end if;

-- ─── Blog ────────────────────────────────────────────────────────────────────
if (select count(*) from public.blog_posts) = 0 then
  insert into public.blog_posts
    (slug, title, excerpt, category, read_time, published_at, published_label,
     image_src, image_alt, is_featured, sort_order)
  values
    ('nivelarea-unui-teren',
     'Cum se face nivelarea unui teren: etape, utilaje si factori de cost',
     'Nivelarea corecta previne baltirea, tasarile si corectiile scumpe. Vezi etapele tehnice, utilajele potrivite si variabilele care influenteaza bugetul.',
     'Nivelare si pregatire teren', '6 min', date '2024-10-15', '15 Oct 2024',
     '/hero.png', 'Utilaj pe santier pentru nivelarea terenului', false, 0),

    ('pregatire-teren-constructie-casa',
     'Cum pregatesti corect terenul inainte de constructia unei case',
     'O fundatie solida incepe mult inainte de turnarea betonului: analiza solului, decopertare, cote, drenaj si compactare controlata.',
     'Excavari si fundatii', '8 min', date '2024-10-02', '02 Oct 2024',
     '/hero.png', 'Sapatura pentru fundatia unei case', true, 1),

    ('alegerea-utilajului-potrivit',
     'Ce utilaj este potrivit pentru lucrarea ta?',
     'De la miniexcavatoare pentru spatii inguste la excavatoare senilate pentru volume mari, alegerea utilajului schimba ritmul si costul lucrarii.',
     'Echipamente', '5 min', date '2024-09-24', '24 Sep 2024',
     '/hero.png', 'Excavator pregatit pentru lucrari de santier', false, 2),

    ('drenaj-curte',
     'Cum se face drenajul unei curti?',
     'Sistemele de drenaj protejeaza fundatia, gazonul si aleile. Afla cand ai nevoie de santuri drenante, rigole sau dren francez.',
     'Amenajari peisagistice', '7 min', date '2024-09-10', '10 Sep 2024',
     '/hero.png', 'Pregatire drenaj pentru o curte rezidentiala', false, 3),

    ('calcul-volume-pamant',
     'Calculul volumelor de pamant la sapaturi si umpluturi',
     'Estimarea corecta a volumelor ajuta la planificarea orelor de utilaj, a transportului si a costurilor de evacuare.',
     'Nivelare', '4 min', date '2024-08-28', '28 Aug 2024',
     '/hero.png', 'Santier cu lucrari de sapatura si mutare pamant', false, 4);
end if;

-- ─── Proiecte (intern) ───────────────────────────────────────────────────────
if (select count(*) from public.projects) = 0 then
  insert into public.projects (code, name, client, type, location, value, deadline, status, sort_order) values
    ('PRJ-2026-018', 'Excavare fundație hală logistică', 'Nord Development SRL', 'Excavări', 'Cluj-Napoca', '82.500 €', '30 Iun 2026', 'În execuție', 0),
    ('PRJ-2026-017', 'Nivelare și compactare platformă', 'Transilvania Logistic', 'Terasamente', 'Turda', '41.200 €', '12 Iul 2026', 'Planificat', 1),
    ('PRJ-2026-015', 'Amenajare spații verzi ansamblu rezidențial', 'Bucur Grup SRL', 'Amenajări', 'Florești', '57.900 €', '05 Aug 2026', 'Ofertat', 2),
    ('PRJ-2026-012', 'Închiriere buldoexcavator cu operator', 'Mega Infrastructura', 'Închiriere', 'Dej', '9.800 €', '20 Iun 2026', 'În execuție', 3),
    ('PRJ-2026-009', 'Drenaj și modelare cote teren', 'Ionescu Maria', 'Terasamente', 'Apahida', '14.300 €', '28 Mai 2026', 'Finalizat', 4),
    ('PRJ-2026-006', 'Demolare și evacuare moloz anexă', 'SC Construct SRL', 'Excavări', 'Gherla', '11.750 €', '15 Mai 2026', 'Suspendat', 5);
end if;

end $$;
