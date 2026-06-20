# Copy servicii pentru seed: texte umane bazate pe informațiile reale

> Texte de înlocuit în seed-ul de servicii (`supabase/migrations/...seed.sql`), scrise din documentele reale din `docs/servicii/` (cele 10 fișiere). Reguli humanizer: diacritice, fără em-dash, fapte concrete de șantier, fără pretenții inventate.
>
> **Domeniul real, important:** firma execută **partea mecanizată: pregătire teren, terasamente, excavări, infrastructură**. Documentele spun clar ce NU face: plantări, gazon, irigații, întreținere spații verzi, întreținere piscine. Am respectat aceste limite în fiecare text, fiindcă onestitatea vinde și evită reclamații.
>
> **Pe câmpuri seed:** pentru fiecare serviciu dau `eyebrow`, `title`, `description`, `summary_title`, `summary`, `processes[]` (title + text) și `specs[]` (label / value / impact). Înlocuiește direct valorile din rândurile existente.

## Mapare documente → slug-uri seed

| Document real                                          | Slug(uri) seed                                                   |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Amenajari spatii verzi                                 | `amenajare-spatii-verzi`, `gradini-si-curti`                     |
| Lucrari de terasamente                                 | `terasamente-excavari`, `nivelare-teren`, `drenaje-ape-pluviale` |
| Sapaturi pentru fundatie + Sapaturi pivnite si beciuri | `fundatii-pivnite`                                               |
| Excavari fose                                          | `fose-septice`                                                   |
| Lucrari pentru apa si canalizare                       | `bransamente-apa-canalizare`                                     |
| Drumuri si alei + Alei pietonale                       | `alei-platforme-drumuri`, `drumuri-interne`                      |
| Elemente de apa + constructii piscine                  | `iazuri-si-piscine`                                              |
| (general, încadrare industrială)                       | `excavari-industriale`, `platforme-industriale`                  |

⚠️ **De confirmat / eliminat din seed** (nu apar în documentele reale sau le contrazic): `intretinere-spatii-verzi` (documentele spun explicit că NU faceți întreținere) și `amenajari-garduri` (niciun document, niciun serviciu de garduri). Vezi secțiunea finală.

💡 **Telefon real găsit în documente: 0799 299 644** (`+40 799 299 644`). Completează-l în `siteConfig`, înlocuiește placeholderul.

---

## `amenajare-spatii-verzi`

- **eyebrow:** Infrastructură exterioară
- **title:** Amenajare spații verzi
- **short_title:** Amenajări exterioare
- **description:** Pregătim și modelăm terenul curții tale: nivelare, terasamente, alei și platforme, drenaj. Partea mecanizată, dură, pe care stă apoi grădina. Fără plantări sau întreținere de gazon.
- **summary_title:** Amenajarea mecanizată, nu peisagistica
- **summary:** Ne ocupăm de infrastructura spațiului exterior: pregătirea și modelarea terenului, terasamente, alei, platforme, corectarea pantelor pentru drenaj și pregătirea zonelor pentru piscine sau iazuri. Lucrăm cu utilaje proprii. Nu facem design vegetal, plantări, însămânțări de gazon sau întreținere, ca să fim limpezi de la început și să nu plătești de două ori.
- **processes:**
  1. Evaluare pe teren · Ne uităm la acces, la diferențele de nivel, la sol și la cum curge apa. Stabilim ce se poate face și în ce ordine.
  2. Pregătire și modelare · Curățăm, nivelăm și corectăm pantele, ca aleile să stea drepte și apa să meargă unde trebuie.
  3. Infrastructură · Realizăm alei, platforme, borduri și pregătim zonele pentru piscină sau iaz, cu strat suport compactat.
  4. Predare · Lăsăm terenul stabil, curat și gata pentru finisaje sau plantare făcută de altcineva.
- **specs:**
  - Modelare teren / Nivelare și corectare pante / Drenaj corect, fără băltiri
  - Strat suport / Compactat mecanizat / Alei și platforme care nu se lasă
  - Limite clare / Doar partea mecanizată / Fără surprize de buget la plantări

## `gradini-si-curti`

- **eyebrow:** Curți și grădini private
- **title:** Grădini și curți
- **description:** Pregătim terenul pentru curți private și grădini mici: nivelare, modelare, alei și platforme. Lucrări mecanizate adaptate spațiilor mici, cu acces îngust.
- **summary_title:** Făcut pentru curți mici, cu acces strâmt
- **summary:** Multe curți rezidențiale au acces îngust și diferențe de nivel care complică lucrarea. Alegem utilajul potrivit spațiului (inclusiv miniexcavator) și pregătim terenul: nivelare, modelare, alei, platforme, pregătire pentru piscină sau iaz. Ne oprim la partea mecanizată; plantarea și gazonul rămân în grija ta sau a unui peisagist.
- **processes:**
  1. Vedem curtea · Măsurăm accesul, nivelul și solul, ca să venim cu utilajul care intră și lucrează curat.
  2. Pregătim terenul · Nivelare, modelare, drenaj, strat suport pentru alei și platforme.
  3. Predăm curat · Evacuăm pământul în exces și lăsăm spațiul gata de pasul următor.
- **specs:**
  - Acces îngust / Miniexcavator disponibil / Lucrăm și în curți strâmte
  - Modelare / Pante corectate pentru drenaj / Fără apă stătută lângă casă
  - Evacuare pământ / Inclusă, cu autobasculantă / Curte curată la final

## `iazuri-si-piscine`

- **eyebrow:** Elemente de apă
- **title:** Iazuri și piscine
- **description:** Excavare, modelare și pregătire teren pentru piscine, iazuri decorative, helestee și cascade. La piscine executăm și structura de beton, hidroizolația și montajul echipamentelor.
- **summary_title:** De la groapă la bazin etanș
- **summary:** Pentru iazuri și elemente de apă realizăm excavarea, modelarea terenului, impermeabilizarea cu folie sau beton și drenajul zonei. Pentru piscine mergem mai departe: structură de beton sau cadre prefabricate, hidroizolație, finisaje, borduri și montajul echipamentelor (pompe, filtre, încălzire, iluminat), cu testarea etanșeității. Nu ne ocupăm de plantări și de întreținerea periodică ulterioară.
- **processes:**
  1. Proiectare și poziționare · Stabilim tipul și locul (iaz de curte, helesteu, piscină), dimensiunile și elementele de apă.
  2. Teren și impermeabilizare · Nivelare, modelare, drenaj și protecție împotriva infiltrațiilor, cu folie sau beton.
  3. Structură și finisaje · La piscine: beton sau prefabricate, hidroizolație, borduri și finisaje interioare.
  4. Echipamente și test · Montaj pompe, filtre, încălzire, iluminat, apoi verificarea etanșeității.
- **specs:**
  - Impermeabilizare / Folie sau beton + drenaj / Fără infiltrații în jur
  - Structură piscină / Beton sau prefabricate / Bazin durabil, finisat
  - Echipamente / Pompe, filtre, iluminat / Piscină funcțională, testată

## `terasamente-excavari`

- **eyebrow:** Infrastructură de teren
- **title:** Lucrări de terasamente și excavări
- **description:** Pregătirea terenului pentru instalații și construcții civile: cote din proiect, decopertare, excavare controlată, umpluturi și compactare în straturi. Aici se decide stabilitatea a tot ce vine deasupra.
- **summary_title:** Mai mult decât o săpătură mecanizată
- **summary:** O lucrare de terasamente corectă înseamnă un proces controlat: stabilirea cotelor din proiectul tehnic, decopertarea stratului vegetal, excavarea la adâncime controlată, gestionarea și evacuarea pământului, umpluturi controlate și compactare în straturi succesive. Respectarea etapelor previne tasările, infiltrațiile și problemele structurale de mai târziu. Lucrăm cu utilaje proprii și personal calificat, cu control pe fiecare proces.
- **processes:**
  1. Cote și decopertare · Stabilim cotele din proiect și îndepărtăm stratul vegetal.
  2. Excavare controlată · Săpăm la adâncimea cerută, cu verificarea nivelului.
  3. Umpluturi și compactare · Umplem în straturi succesive și compactăm mecanizat.
  4. Evacuare · Gestionăm și transportăm pământul rezultat, cu autobasculanta.
- **specs:**
  - Cote / Conform proiectului tehnic / Fundație pe teren stabil, nu pe umplutură
  - Compactare / În straturi succesive / Fără tasări și fisuri ulterioare
  - Evacuare pământ / Inclusă / Șantier curat la final

## `nivelare-teren`

- **eyebrow:** Pregătire suprafețe
- **title:** Nivelare teren
- **description:** Decopertare, nivelare și umpluturi compactate pentru pregătirea terenului înainte de construcție. O suprafață plană și stabilă, la cota cerută.
- **summary_title:** O suprafață pe care se poate construi
- **summary:** Înainte de orice construcție, terenul trebuie adus la cotă și stabilizat. Executăm decopertarea stratului vegetal, nivelarea suprafeței și umpluturile controlate, cu compactare mecanizată. Așa eviți tasările neuniforme și pregătești corect terenul pentru fundație, platformă sau amenajare.
- **processes:**
  1. Decopertare · Îndepărtăm stratul vegetal și pregătim suprafața.
  2. Nivelare · Aducem terenul la cotă, eliminăm denivelările.
  3. Umpluturi și compactare · Umplem unde e nevoie, compactăm în straturi pentru o bază stabilă.
- **specs:**
  - Nivel / La cota cerută / Bază plană pentru ce urmează
  - Compactare / Mecanizată, în straturi / Suprafață care nu se lasă
  - Strat vegetal / Decopertat și gestionat / Teren curat, pregătit

## `drenaje-ape-pluviale`

- **eyebrow:** Management apă
- **title:** Drenaje și evacuare ape pluviale
- **description:** Săpături și sisteme de drenaj care duc apa pluvială departe de fundație. Previn infiltrațiile și acumularea apei acolo unde face pagube.
- **summary_title:** Apa dusă unde trebuie, nu lângă fundație
- **summary:** Apa care stă lângă fundație sau băltește în curte ajunge, în timp, în fisuri și infiltrații. Realizăm săpături pentru sisteme de drenaj și evacuare a apei pluviale, dimensionate după suprafață și sol, ca apa să fie dirijată controlat departe de construcție.
- **processes:**
  1. Evaluăm scurgerea · Vedem cum curge apa pe teren și unde se adună.
  2. Săpăm traseul · Realizăm șanțurile de drenaj la panta corectă.
  3. Dirijăm apa · Conducem apa pluvială departe de fundație, controlat.
- **specs:**
  - Pantă / Calculată pentru scurgere / Apa pleacă, nu stă
  - Poziție / Departe de fundație / Fără infiltrații în structură
  - Dimensionare / După suprafață și sol / Sistem care face față ploilor

## `fundatii-pivnite`

- **eyebrow:** Excavări controlate
- **title:** Săpături pentru fundații și pivnițe
- **description:** Săpături pentru fundații (continue, izolate, radier) și pentru spații subterane: pivnițe, beciuri, subsoluri. La cota din proiect, cu stabilizarea săpăturii și evacuarea pământului.
- **summary_title:** Baza casei și spațiile de sub ea
- **summary:** Săpătura pentru fundație este prima etapă din construcția unei locuințe, iar de corectitudinea ei depinde stabilitatea întregii structuri. Executăm săpături pentru fundații continue, izolate sau radier general, la cotele din proiect, cu pregătirea stratului suport și evacuarea materialului. Pentru pivnițe, beciuri și subsoluri (inclusiv beci în pământ sau sub garaj) excavăm controlat, asigurând stabilitatea săpăturii și spațiul necesar pentru hidroizolații, drenaje și structura de rezistență.
- **processes:**
  1. Trasare și cote · Stabilim conturul și adâncimea din planul de săpătură.
  2. Excavare controlată · Săpăm la cotă, cu atenție la stabilitatea malurilor.
  3. Pregătire bază · Pregătim stratul suport pentru armare și turnare.
  4. Evacuare · Transportăm pământul rezultat, cu autobasculanta.
- **specs:**
  - Adâncime / La cota din proiect / Fundație stabilă, fără tasări
  - Stabilitate săpătură / Maluri asigurate / Lucru sigur pentru pivnițe și subsoluri
  - Acces / Miniexcavator pentru spații strâmte / Lucrăm și în curți înguste

## `fose-septice`

- **eyebrow:** Instalații subterane
- **title:** Săpături pentru fose septice
- **description:** Excavare și pregătire teren pentru fose septice și sisteme individuale de canalizare, plus șanțurile de racord. Pentru fosele din beton, pregătim și baza de montaj.
- **summary_title:** Canalizare proprie, acolo unde nu e rețea
- **summary:** Pentru locuințele fără racord la canalizarea publică, executăm săpătura pentru fosa septică la dimensiunile din proiect, cu pregătirea și stabilizarea terenului pentru montajul bazinului. La fosele din beton realizăm și etapele pregătitoare: stabilizarea terenului și stratul suport. Săpăm și șanțurile pentru conductele care leagă locuința de fosă, la adâncimea și panta corecte.
- **processes:**
  1. Stabilim amplasarea · Poziția și adâncimea gropii, în funcție de proiect și teren.
  2. Excavăm și stabilizăm · Săpăm groapa și asigurăm baza, ca terenul să nu se surpe.
  3. Racord · Realizăm șanțurile pentru conductele dintre casă și fosă.
- **specs:**
  - Dimensiuni groapă / Conform proiectului / Montaj corect al bazinului
  - Stabilizare / Bază pregătită / Sistem care nu se mișcă după instalare
  - Racord / Pantă corectă / Curgere fără blocaje

## `bransamente-apa-canalizare`

- **eyebrow:** Utilități
- **title:** Branșamente apă și canalizare
- **description:** Săpături pentru rețele de apă și canalizare: conducte, branșamente și racorduri la rețeaua publică. La adâncimea și panta corecte, pentru sisteme care funcționează fără probleme.
- **summary_title:** Legătura corectă la apă și canal
- **summary:** Executăm săpăturile pentru conducte de apă, șanțuri de canalizare și branșamente la utilități, pentru locuințe și construcții noi sau pentru extinderea rețelelor existente. Respectăm cotele din proiect, ca instalațiile subterane să fie montate corect și să funcționeze fără infiltrații sau blocaje.
- **processes:**
  1. Trasăm traseul · Stabilim drumul conductelor și adâncimea necesară.
  2. Săpăm șanțurile · La panta corectă pentru curgere sau presiune.
  3. Pregătim racordul · Pregătim conectarea la rețeaua publică existentă.
- **specs:**
  - Adâncime / Sub limita de îngheț, conform proiectului / Instalații protejate
  - Pantă canalizare / Calculată / Curgere fără blocaje
  - Branșament / Racord la rețeaua publică / Conectare corectă, durabilă

## `alei-platforme-drumuri`

- **eyebrow:** Acces și circulații
- **title:** Alei, platforme și drumuri de acces
- **description:** Pregătim terenul pentru alei, platforme și drumuri de acces auto sau pietonale: decopertare, nivelare, strat suport din balast sau piatră, compactare. La cerere, turnăm și betonul.
- **summary_title:** Suprafețe circulabile care rezistă
- **summary:** O alee sau un drum de acces durabil începe cu un strat suport stabil. Executăm decopertarea, nivelarea și stratul suport din balast sau piatră, cu compactare mecanizată, pentru intrări auto, parcări rezidențiale, alei de curte și drumuri de acces către locuințe sau șantiere. În funcție de destinație, finisăm prin betonare, pietruire sau pregătim suprafața pentru pavaj. Montajul de pavaj și turnarea betonului se fac la cerere.
- **processes:**
  1. Pregătim terenul · Decopertare și nivelare a traseului.
  2. Strat suport · Balast sau piatră, compactate pentru o bază stabilă.
  3. Finisaj · Betonare, pietruire sau pregătire pentru pavaj, după caz.
- **specs:**
  - Strat suport / Balast/piatră compactate / Suprafață care nu se lasă
  - Destinație / Pietonal sau auto ușor / Fundație adaptată traficului
  - Finisaj / Beton, piatră sau pavaj / Suprafață durabilă, la cerere betonată

## `drumuri-interne`

- **eyebrow:** Infrastructură internă
- **title:** Drumuri interne și de acces
- **description:** Drumuri de acces și platforme pentru curți, șantiere și zone comerciale: pregătirea terenului, strat suport stabil și compactare pentru trafic auto.
- **summary_title:** Acces auto care ține la utilizare zilnică
- **summary:** Pentru curți rezidențiale, șantiere și zone comerciale executăm drumuri interne și de acces: decopertare, nivelare, strat suport din balast sau piatră și compactare mecanizată, dimensionate pentru circulația autovehiculelor. La cerere, finisăm prin betonare.
- **processes:**
  1. Trasare și pregătire · Stabilim traseul și pregătim terenul.
  2. Strat suport · Balast sau piatră, compactate pentru sarcini auto.
  3. Finisaj · Betonare sau pietruire, după destinație.
- **specs:**
  - Compactare / Pentru trafic auto / Drum care nu se lasă
  - Strat suport / Balast/piatră / Bază stabilă pe orice vreme
  - Finisaj / Beton la cerere / Suprafață durabilă

## `excavari-industriale`

- **eyebrow:** Proiecte industriale
- **title:** Excavări pentru proiecte industriale
- **description:** Terasamente și excavări de volum pentru hale, depozite și platforme industriale, cu utilaje proprii și cote respectate. Pe deviz și pe termen, nu pe aproximări.
- **summary_title:** Volume mari, cote respectate
- **summary:** Pentru proiecte comerciale și industriale executăm terasamente și excavări de volum: decopertare, săpături la cotă, umpluturi controlate și compactare pentru sarcinile reale ale platformei. Lucrăm organizat, cu utilaje proprii și personal calificat, cu control pe fiecare etapă și gestionarea evacuării pământului.
- **processes:**
  1. Planificare · Volume, cote, acces și faze, stabilite împreună cu tine.
  2. Terasamente de volum · Săpături și umpluturi cu utilaje dimensionate pentru ritm.
  3. Compactare · Pentru sarcini grele, conform destinației platformei.
  4. Predare · Cote confirmate, teren gata pentru construcție sau montaj.
- **specs:**
  - Cote / Conform proiectului / Montaj și turnări fără corecții
  - Compactare / Pentru sarcini grele / Platforme care nu se lasă
  - Organizare / Faze și evacuare gestionate / Șantier sub control

## `platforme-industriale`

- **eyebrow:** Platforme industriale
- **title:** Terasamente și platforme industriale
- **description:** Pregătirea terenului și a stratului suport pentru platforme și drumuri interne industriale, compactate pentru trafic greu și sarcini de depozitare.
- **summary_title:** O platformă pentru sarcini reale
- **summary:** Realizăm terasamentele și stratul suport pentru platforme industriale și drumuri interne: decopertare, nivelare la toleranțe, strat de balast sau piatră și compactare pentru trafic greu. O platformă pregătită corect nu se tasează sub sarcină și nu cere corecții după montaj.
- **processes:**
  1. Pregătire teren · Decopertare și nivelare la cota cerută.
  2. Strat suport · Balast/piatră în straturi, compactate.
  3. Verificare · Confirmarea cotelor și a portanței înainte de predare.
- **specs:**
  - Toleranțe / Conform proiectului / Suprafață uniformă pentru trafic greu
  - Portanță / Compactare pentru sarcini / Platformă care ține
  - Drumuri interne / Strat suport stabil / Circulație fără degradare

## `inchirieri-utilaje` (+ utilaje)

- **eyebrow:** Serviciu adiacent
- **title:** Închirieri utilaje cu operator
- **description:** Excavator, miniexcavator, buldoexcavator, încărcător frontal și autobasculantă, cu operator inclus. Tu spui lucrarea și accesul, noi aducem utilajul potrivit.
- **summary_title:** Utilajul potrivit, cu om care îl știe
- **summary:** Punem la dispoziție utilajele cu care lucrăm zilnic: miniexcavator pentru curți și acces îngust, excavator pentru săpături ample, buldoexcavator pentru lucrări versatile, încărcător frontal și autobasculantă (3,5t, 7t, 8x4) pentru transport și evacuare. Operatorul e inclus, fiindcă de el depinde ca lucrarea să iasă bine și în siguranță. Tariful depinde de complexitate, durată și logistică.
- **processes:**
  1. Spune-ne lucrarea · Ce ai de săpat, încărcat sau transportat, și pe ce acces.
  2. Alegem utilajul · Mini sau excavator standard, buldoexcavator, încărcător, basculantă.
  3. Venim cu operator · Mobilizare la termen, lucru controlat.
- **specs:**
  - Operator / Inclus / Lucrare sigură, fără improvizații
  - Acces / Miniexcavator pentru spații strâmte / Intrăm și unde e îngust
  - Transport / Autobasculante 3,5t, 7t, 8x4 / Evacuare și aprovizionare rapidă

> Pentru paginile individuale de utilaj (`excavatoare`, `incarcator-frontal`, `transport-agregate`) și pentru tabelul `rental_machines`, pot scrie separat descrieri + utilizări + cerințe de acces, pe baza acelorași documente.

---

## ⚠️ De confirmat sau eliminat din seed

- **`intretinere-spatii-verzi`**: documentele tale spun explicit că NU oferiți întreținere (tuns, irigat, fertilizat, reamenajări). Recomand eliminarea acestui serviciu sau, dacă chiar îl oferiți, dă-mi informațiile și îl scriu corect. Lăsat așa, contrazice restul site-ului și atrage cereri pe care le refuzi.
- **`amenajari-garduri`**: niciun document nu menționează garduri. Confirmă dacă faceți sau nu. Dacă nu, scoate-l. Dacă da (de exemplu săpături pentru fundația gardului, montaj stâlpi), trimite-mi detalii și îl redactez.

## Ce urmează

- Pot transforma textele astea într-un patch direct pe seed (find/replace pe rândurile existente), dacă vrei.
- Pot scrie și paginile de utilaje (`rental_machines`) și FAQ-urile per serviciu, în aceeași voce.
- Completează în `siteConfig` telefonul real **0799 299 644** și datele de firmă.
