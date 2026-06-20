# Copy static din aplicație: texte care vând, mapate pe fișier

> Continuarea lui `COPY-SITE.md`, dar pentru **textele statice din componente și pagini** (nu cele din baza de date: servicii, FAQ, utilaje, blog). Reguli humanizer: diacritice corecte, fără em-dash, fapte concrete, fără clișee.
> Format: pentru fiecare fișier, `actual` → `propus`. Multe string-uri actuale sunt fără diacritice; le corectez și le fac să vândă. Acolo unde textul e deja bun (despre, proiecte, 404, eroare), notez asta și las mici sugestii.

---

## `app/components/home-sections.tsx`

Hero

- eyebrow `AMENAJARI • TERASAMENTE • EXCAVARI` → `AMENAJĂRI · TERASAMENTE · EXCAVĂRI`
- buton `Exploreaza proiectele` → `Vezi proiectele`
- buton `Serviciile noastre` → `Vezi serviciile`

Trasee servicii

- `Estetica organica` → `Estetică naturală`
- `Infrastructura grea` → `Infrastructură de teren`
- link `Exploreaza divizia` → `Vezi ce facem`
- pe card mobil: `Detalii serviciu` → `Vezi serviciul`

Statement

- titlu `Un proiect bun incepe cu un teren pregatit corect.` → `O lucrare bună începe sub pământ, nu deasupra.`

Mozaic

- eyebrow `EXPERTIZA COMPLETA` → `CE FACEM`
- `Toate serviciile` rămâne (corect)
- link card `Detalii ->` → `Vezi serviciul`

Proces

- eyebrow `PROCES TEHNIC` → `CUM LUCRĂM`
- titlu `O lucrare clara, din teren pana la predare.` → `O lucrare clară, de la teren până la predare.`
- pașii (rescriere concretă):
  - `Evaluare teren` / `Analizam accesul, diferentele de nivel, natura solului si cerintele tehnice.` → `Evaluare pe teren` / `Ne uităm la acces, la diferențele de nivel și la natura solului. Îți spunem ce se poate și ce ne îngrijorează.`
  - `Plan de executie` / ... → `Plan și deviz` / `Stabilim etapele, utilajele potrivite, durata și riscurile. Primești un cost legat de ce e pe teren.`
  - `Executie controlata` / ... → `Execuție controlată` / `Operatori calificați, cote și finisaje verificate pe parcurs, nu la final.`
  - `Predare lucrare` / ... → `Predare` / `Lăsăm terenul gata de pasul următor: construcție, plantare sau infrastructură. Curat, fără munți de pământ.`

ContactCta

- `Estimare rapida` → `Estimare rapidă`
- titlu `Ai un teren de pregatit sau o lucrare de excavat?` → `Ai un teren de pregatit sau o lucrare de săpat?`
- buton `Suna pentru oferta` → `Sună pentru o ofertă`

---

## `app/components/navbar.tsx`

- bara de sus `Evaluare si ofertare pentru proiectul tau` → `Evaluăm terenul și îți facem o ofertă, fără cost.` (devine oricum „announcement” editabil din setări)
- meniu mobil `Deschide meniul` (sr-only) rămâne corect
- buton `Cere oferta` → `Cere o ofertă`

## `app/components/footer.tsx`

- tagline `Tehnicitate in armonie cu natura. Amenajari, terasamente si excavari pentru proiecte rezidentiale, comerciale si industriale.` → `Tehnicitate în armonie cu natura. Amenajări, terasamente și excavări pentru proiecte rezidențiale, comerciale și industriale.`
- titlu coloană `Companie` rămâne; `Legal` rămâne
- `Contact rapid` rămâne corect

---

## `app/servicii/(list)/page.tsx`

Badge-uri (cu diacritice + concret)

- `Operatori calificati` → `Operatori calificați`
- `Evaluare teren inclusa` → `Evaluare pe teren, inclusă`
- `Utilaj potrivit lucrarii` → `Utilajul potrivit lucrării`
- `Lucrari finalizate la cota` → `Lucrări finalizate la cotă`

Hero

- titlu `Servicii PACA CONSTRUCT` → `Tot ce ține de teren, sub un singur antreprenor`
- (sub-text, dacă există descriere hero) → `De la prima cupă de pământ până la amenajarea finală: excavări, terasamente, drenaje și spații verzi, cu utilaje proprii și operatori care au mai făcut lucrări ca a ta.`

## `app/inchiriere-utilaje/(list)/page.tsx`

Badge-uri

- `Selectie in functie de lucrare` → `Utilaj ales după lucrare`
- `Evaluarea accesului` → `Verificăm accesul`
- `Transport stabilit separat` → `Transport stabilit separat`
- `Utilaj cu operator` → `Operator inclus`

Matrice de capabilități (etichete rânduri, cu diacritice)

- `Fundatii adanci` → `Fundații adânci`
- `Sapare santuri utilitati` → `Săpare șanțuri utilități`
- `Nivelare teren suprafete mari` → `Nivelare teren, suprafețe mari`
- `Incarcare camioane` → `Încărcare camioane`
- valorile `Excelent` / `Limitat` rămân (corecte); `Excelent (modele mini)` → `Excelent (mini)`

Hero / intro

- titlu → `Utilajul potrivit, cu operator, când îți trebuie`
- intro → `Spune-ne lucrarea și accesul. Aducem excavatorul, buldoexcavatorul, încărcătorul sau basculanta, cu om care le știe. Plătești pe ce ai nevoie, fără să cumperi sau să întreții echipament.`

---

## `app/blog/(list)/page.tsx`

Categorii (cu diacritice, mai clare)

- `Toate articolele` rămâne
- `Constructia unei case` → `Construiești o casă`
- `Probleme cu apa` → `Probleme cu apa`
- `Amenajari peisagistice` → `Amenajări exterioare`

Alt imagine

- `Santier inainte de nivelare` → `Șantier înainte de nivelare`

Intro (dacă există titlu de listă)

- → `Ghiduri practice despre teren: excavări, nivelare, drenaj și amenajări. Lucruri pe care e bine să le știi înainte să începi.`

---

## `app/faq/page.tsx`

Scurtături (intenții)

- `Vreau o gradina` → `Vreau o grădină`
- `Construiesc o casa` → `Construiesc o casă`
- `Am nevoie de utilaje` → `Am nevoie de un utilaj`

Top căutări

- `Top cautari` → `Cele mai căutate`
- `Cat dureaza o lucrare de excavare?` → `Cât durează o lucrare de excavare?`
- `Ce include pregatirea terenului?` → `Ce include pregătirea terenului?`
- `Este necesara o vizita la locatie?` → `E nevoie de o vizită pe teren?`

Câmp căutare

- placeholder `Cauta o intrebare...` → `Caută o întrebare...`

Titlu pagină (dacă e static deasupra listei)

- → `Întrebări frecvente, răspunsuri scurte`
- subtitlu → `Despre evaluări, costuri, excavări, fundații și amenajări. Dacă nu găsești răspunsul, sună-ne.`

---

## `app/components/service-page-template.tsx`

- hero CTA `Programeaza o consultanta` → `Cere o evaluare`
- secțiune specs titlu `Standarde de executie` → `Cum lucrăm, pe scurt`
- coloane tabel: `Specificatie` → `Ce verificăm`; `Parametri PACA` → `Cum o facem`; `Impact vizual / functional` → `De ce contează`
- CTA final eyebrow `Urmatorul pas` → `Pasul următor`
- CTA buton `Suna pentru oferta` → `Sună pentru o ofertă`
- (titlurile „Întrebări frecvente despre …” și „Executăm … în zona ta” sunt deja cu diacritice, ok)

## `app/inchiriere-utilaje/[slug]/page.tsx`

- `Serviciu cu operator inclus` → `Operator inclus`
- `Tarif` rămâne
- `Inchiriaza utilaj` → `Cere utilajul`
- secțiune `Ce influenteaza estimarea` → `Ce influențează tariful`
- cardurile:
  - `01. Complexitate` / `Tipul de sol si adancimea necesara.` → `Complexitate` / `Tipul de sol și adâncimea cerută.`
  - `02. Durata` / `Numarul de ore estimate pentru lucrare.` → `Durată` / `Orele estimate pentru lucrare.`
  - `03. Logistica` / `Distanta, accesul si mobilizarea utilajului.` → `Logistică` / `Distanța, accesul și mobilizarea utilajului.`
- breadcrumb `Acasa` → `Acasă`; `Inchirieri utilaje` → `Închirieri utilaje`

## `app/blog/[slug]/page.tsx`

- `Inapoi la blog` → `Înapoi la blog`
- `Publicat:` rămâne
- secțiune `Surse` rămâne
- sidebar `Ai un proiect in plan?` → `Ai un proiect în plan?`
- sidebar text `Evaluam terenul si lucrarea pentru o solutie tehnica si un deviz corect.` → `Ne uităm la teren și la lucrare și revenim cu pașii și un deviz corect.`
- sidebar link `Cere evaluare ->` → `Cere o evaluare`

---

## `app/contact/page.tsx` (părțile statice)

contactDetails (etichete)

- `Suna acum` → `Sună acum`
- `Trimite documente si fotografii` → `Trimite documente și fotografii`
- `Locatie centrala` / `Servicii la nivel national` → `Acoperire` / `București și județele din jur`
- `Program` rămâne

Carduri de intenție

- `Evaluare lucrare` / `Am un proiect clar si am nevoie de o estimare tehnica si de cost.` → `Am o lucrare clară` / `Știu ce vreau și am nevoie de o estimare tehnică și de cost.`
- `Nu stiu ce serviciu imi trebuie` / `Am o idee sau o problema, dar nu sunt sigur de solutia tehnica.` → `Nu știu de unde să încep` / `Am un teren sau o problemă, dar nu sunt sigur ce soluție îmi trebuie.`

(H1 și intro: vezi `COPY-SITE.md`, secțiunea Contact.)

---

## `app/zona/[slug]/page.tsx`

- `Zonă indisponibilă` rămâne (corect)
- text-cadru per zonă: scrie un paragraf care leagă serviciul de localitate, fără să pară duplicat. Model:
  `Lucrăm în {zonă} și împrejurimi: excavări, terasamente, drenaje și amenajări, cu utilaje proprii. Cunoaștem accesul și tipul de teren din zonă, așa că evaluarea și devizul ies repede și corect.`
- CTA → `Cere o evaluare în {zonă}`

---

## Deja bune (doar verificare, fără rescriere)

- `app/not-found.tsx`: „Eroare 404 / Pagina nu a putut fi găsită / Linkul accesat este greșit…” are diacritice și ton bun. Opțional, mai cald: `Pagina asta nu există sau a fost mutată. Iată unde poți merge mai departe.`
- `app/error.tsx`: „A apărut o eroare / Ceva nu a funcționat / Reîncearcă” e bun. Opțional buton: `Reîncearcă` rămâne.
- `app/despre/page.tsx`: copy deja uman și cu diacritice (din lotul anterior). Doar completează statisticile reale unde scrie „ani de experiență / proiecte finalizate / utilaje în flotă”.
- `app/proiecte/page.tsx`: cele 3 studii de caz sunt exemple-placeholder. Înlocuiește-le cu proiecte reale (tip lucrare, locație, rezultat) când le ai. Dovada concretă vinde cel mai tare.

---

## Ce urmează

- Pun direct aceste texte în componente (find/replace) printr-un prompt, dacă vrei.
- Sau continuăm cu lotul 2 de DB-copy din `COPY-SITE.md` (cele 12 sub-servicii și 5 utilaje).

Spune-mi încotro mergem. Și, ca data trecută: dă-mi cifrele reale (ani, proiecte, utilaje, zone) ca să le țes unde am lăsat loc, fiindcă numerele concrete bat orice adjectiv.
