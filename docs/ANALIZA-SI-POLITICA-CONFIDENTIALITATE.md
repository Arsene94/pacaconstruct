# Politica de confidențialitate PACA CONSTRUCT: analiză juridică și text de publicat

> Document pregătit în registru juridic profesionist, structurat în două părți: (1) o analiză de conformitate (mapare a prelucrărilor, temeiuri, transferuri, lipsuri) și (2) textul politicii, gata de publicat pe `/confidentialitate`.
>
> **Notă de responsabilitate.** Materialul este o redactare-cadru riguroasă, dar nu înlocuiește consultanța juridică angajată. Înainte de publicare, trebuie validat de un avocat sau de responsabilul cu protecția datelor al societății și completat cu datele reale de identificare (CUI, nr. Reg. Com., sediu, date de contact). Locurile marcate `[a se completa]` sunt obligatorii.

---

# PARTEA 1. Analiză juridică de conformitate

## 1.1. Cadrul legal aplicabil

Prelucrarea datelor cu caracter personal de către PACA CONSTRUCT SRL este guvernată de:

- Regulamentul (UE) 2016/679 (GDPR);
- Legea nr. 190/2018 privind măsuri de punere în aplicare a GDPR în România;
- Legea nr. 506/2004 privind prelucrarea datelor cu caracter personal și protecția vieții private în sectorul comunicațiilor electronice (temeiul consimțământului pentru cookie-uri, art. 4 alin. (5));
- Legea contabilității nr. 82/1991 și legislația fiscală (termene de păstrare a documentelor);
- Codul civil (art. 2517, termenul general de prescripție de 3 ani, relevant pentru retenția datelor de prospect).

Autoritatea de supraveghere competentă este Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).

## 1.2. Calitatea de operator

PACA CONSTRUCT SRL acționează în calitate de **operator** (art. 4 pct. 7 GDPR) pentru prelucrările descrise mai jos. Furnizorii de tehnologie (găzduire, email, analytics) acționează ca **împuterniciți** (art. 4 pct. 8) sau, în cazul platformelor de publicitate, în anumite operațiuni, ca **operatori independenți / asociați** pentru propriile scopuri.

## 1.3. Registrul prelucrărilor (sinteză, art. 30 GDPR)

| Operațiune                                                           | Categorii de date                                                               | Persoane vizate    | Scop                                                     | Temei legal                                                                                   | Retenție                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Formular cerere serviciu / închiriere                                | nume, telefon, email (opțional), localitate, suprafață, descriere lucrare       | clienți potențiali | evaluarea cererii, ofertare, contact                     | art. 6(1)(b) (demersuri precontractuale) și art. 6(1)(f) (interes legitim, pentru contactare) | până la 3 ani de la ultimul contact                  |
| Abonare newsletter / marketing                                       | email, opțional nume și telefon                                                 | abonați            | comunicări comerciale                                    | art. 6(1)(a) (consimțământ); Legea 506/2004                                                   | până la retragerea consimțământului                  |
| Cookie-uri de analiză și publicitate (Google, Meta, TikTok prin GTM) | identificatori online, IP, comportament de navigare, identificatori de campanie | vizitatori         | statistici de audiență, măsurarea reclamelor             | art. 6(1)(a) (consimțământ) + Legea 506/2004 art. 4(5); Consent Mode v2 implicit „refuzat”    | durata fiecărui cookie (vezi Politica de cookie-uri) |
| Atribuirea conversiilor (gclid, fbclid, UTM)                         | identificatori de campanie atașați solicitării                                  | clienți potențiali | măsurarea eficienței campaniilor, optimizarea costurilor | art. 6(1)(a) pentru componenta publicitară; art. 6(1)(f) pentru analiza proprie               | corelat cu durata solicitării                        |
| Securitate și prevenirea abuzului (rate limiting)                    | adresă IP, antet de cerere                                                      | vizitatori         | protejarea site-ului și a formularelor                   | art. 6(1)(f) (interes legitim)                                                                | perioade scurte, strict necesare                     |
| Facturare și contabilitate (la contractare)                          | date de identificare și de facturare                                            | clienți            | îndeplinirea obligațiilor fiscale                        | art. 6(1)(c) (obligație legală)                                                               | termenele legale (registre contabile 10 ani)         |

## 1.4. Analiza temeiurilor legale

- **Lead-urile (formularele)** se întemeiază în principal pe art. 6(1)(b): persoana solicită o ofertă, deci prelucrarea este necesară pentru demersuri precontractuale la cererea sa. Pentru contactarea ulterioară și gestionarea relației se reține, subsidiar, interesul legitim (art. 6(1)(f)), justificat de raportul direct cu solicitantul.
- **Marketingul** se bazează exclusiv pe consimțământ (art. 6(1)(a)), liber, specific, informat și neechivoc (art. 4 pct. 11 și art. 7), cu posibilitatea retragerii la fel de ușor ca acordarea (art. 7 alin. (3)). Bifa de abonare nu este precompletată.
- **Cookie-urile neesențiale** necesită consimțământ prealabil (Legea 506/2004 art. 4 alin. (5), coroborat cu art. 6(1)(a) GDPR). Implementarea Google Consent Mode v2 cu valori implicite „refuzat” respectă cerința de a nu plasa cookie-uri de analiză sau publicitate înainte de acord.
- **Securitatea** (limitarea abuzului prin IP) se întemeiază pe interesul legitim (art. 6(1)(f)), test de proporționalitate îndeplinit prin retenție minimă.
- **Obligațiile contabile** se întemeiază pe art. 6(1)(c).

Nu se prelucrează categorii speciale de date (art. 9) și nu se realizează decizii automate cu efecte juridice semnificative (art. 22).

## 1.5. Împuterniciți și destinatari (art. 28)

| Furnizor               | Rol                                 | Locul prelucrării                             | Mecanism de transfer                             |
| ---------------------- | ----------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Supabase               | bază de date, autentificare         | UE / SUA (în funcție de regiunea proiectului) | SCC / DPF, după caz                              |
| Vercel                 | găzduire și livrare site            | UE / SUA                                      | SCC / DPF                                        |
| Upstash                | cache, rate limiting, cozi, căutare | UE / global                                   | SCC, după caz                                    |
| Resend                 | livrare email                       | SUA                                           | SCC / DPF                                        |
| Google (GA4, Ads, GTM) | analiză, publicitate                | SUA                                           | Decizia de adecvare DPF (Google LLC certificată) |
| Meta                   | publicitate                         | SUA                                           | DPF / SCC                                        |
| TikTok                 | publicitate                         | în afara SEE                                  | SCC + măsuri suplimentare                        |

Cu fiecare împuternicit trebuie încheiat un acord de prelucrare (DPA) conform art. 28 alin. (3). **Verificare necesară:** confirmarea existenței DPA-urilor semnate.

## 1.6. Transferuri internaționale (art. 44-49) — poziție la iunie 2026

O parte dintre furnizori prelucrează date în Statele Unite. Cadrul aplicabil:

- **EU-U.S. Data Privacy Framework (DPF):** decizia de adecvare a Comisiei Europene este în vigoare din 10 iulie 2023. Tribunalul UE a respins acțiunea în anulare la 3 septembrie 2025, confirmând valabilitatea cadrului. Există un apel pendinte la Curtea de Justiție (cauza C-703/25 P), fără termen de judecată stabilit la data redactării. Cât timp decizia rămâne în vigoare, transferul către importatori americani **certificați DPF** (de exemplu Google LLC) se poate face în temeiul adecvării, fără garanții suplimentare.
- **Importatorii necertificați DPF** sau prelucrarea în alte state terțe se întemeiază pe Clauzele Contractuale Standard ale Comisiei (Decizia 2021/914), însoțite, după caz, de măsuri suplimentare (Schrems II).

**Recomandare:** monitorizarea cauzei C-703/25 P; pregătirea unui plan de contingență (trecerea pe SCC) în ipoteza unei invalidări.

## 1.7. Drepturile persoanelor vizate (art. 12-22, 77)

Acces, rectificare, ștergere, restricționare, opoziție (inclusiv la marketing direct, art. 21 alin. (2), drept absolut), portabilitate, retragerea consimțământului, plângere la ANSPDCP și cale judiciară. Termen de răspuns: o lună (art. 12 alin. (3)), prelungibil cu două luni în cazuri complexe. Identitatea solicitantului se verifică rezonabil înainte de soluționare.

## 1.8. Lipsuri identificate și recomandări (gap analysis)

1. **Date de identificare incomplete** ale operatorului (CUI, Reg. Com., sediu, persoană de contact) — obligatorii în politică (art. 13).
2. **Pagina „Politica de cookie-uri”** (`/cookies`) este referită, dar trebuie creată, cu lista cookie-urilor, durata și furnizorul, plus mecanismul de gestionare a consimțământului (bannerul Consent Mode v2).
3. **Evidența consimțămintelor** (cine, când, pentru ce) trebuie păstrată ca probă (art. 7 alin. (1)).
4. **DPA-uri (art. 28)** semnate cu toți împuterniciții — de confirmat și arhivat.
5. **Registrul de evidență a activităților de prelucrare** (art. 30) — de întocmit intern.
6. **Responsabil cu protecția datelor:** desemnarea unui DPO **nu este obligatorie** (activitatea societății nu se încadrează în art. 37, neexistând monitorizare sistematică la scară largă ori categorii speciale la scară largă); se recomandă totuși o **persoană de contact** dedicată pentru cereri privind datele.
7. **Procedură de răspuns la cereri** și de notificare a breșelor (art. 33-34) — de formalizat.

---

# PARTEA 2. Politica de confidențialitate (text de publicat)

**Politica de confidențialitate PACA CONSTRUCT SRL**
Ultima actualizare: iunie 2026

## 1. Operatorul de date

Prezenta politică descrie modul în care PACA CONSTRUCT SRL, persoană juridică română cu sediul în `[a se completa: adresă completă]`, înregistrată la Registrul Comerțului sub nr. `[a se completa: J__/____/____]`, cod unic de înregistrare `[a se completa: CUI]` (denumită în continuare „PACA CONSTRUCT”, „noi” sau „operatorul”), colectează și prelucrează datele cu caracter personal ale persoanelor care îi vizitează site-ul sau îi solicită serviciile.

Prelucrarea se realizează în conformitate cu Regulamentul (UE) 2016/679 (GDPR), Legea nr. 190/2018 și Legea nr. 506/2004.

Pentru orice întrebare privind protecția datelor sau pentru exercitarea drepturilor, ne puteți contacta la `[a se completa: email de contact date personale]` sau la `[a se completa: telefon]`.

## 2. Ce date colectăm

Colectăm numai datele necesare scopurilor de mai jos:

1. **Date furnizate prin formulare** (cerere de serviciu sau de închiriere utilaj): numele, numărul de telefon, adresa de email (opțională), localitatea, suprafața aproximativă și descrierea lucrării.
2. **Date de abonare la comunicări comerciale**: adresa de email și, dacă le furnizați, numele și telefonul, atunci când bifați acordul pentru newsletter.
3. **Date tehnice și de utilizare**: adresa IP, tipul de dispozitiv și de browser, paginile vizitate, sursa traficului și identificatorii de campanie (de exemplu gclid, fbclid, parametri UTM), colectate prin cookie-uri și tehnologii similare, în condițiile secțiunii 6.

Nu colectăm date din categorii speciale (privind sănătatea, opiniile, originea etc.) și nu adresăm serviciile noastre minorilor.

## 3. În ce scopuri și în ce temei prelucrăm datele

- **Pentru a răspunde solicitărilor și a ofertare**: prelucrarea este necesară pentru demersuri precontractuale făcute la cererea dumneavoastră (art. 6 alin. (1) lit. b GDPR).
- **Pentru a vă contacta** în legătură cu cererea: în temeiul interesului nostru legitim de a gestiona relația cu solicitantul (art. 6 alin. (1) lit. f).
- **Pentru newsletter și oferte**: numai cu consimțământul dumneavoastră (art. 6 alin. (1) lit. a). Vă puteți dezabona oricând.
- **Pentru statistici și măsurarea reclamelor**: numai pe baza consimțământului pentru cookie-uri (art. 6 alin. (1) lit. a și Legea 506/2004).
- **Pentru securitatea site-ului** și prevenirea abuzului asupra formularelor: în temeiul interesului legitim (art. 6 alin. (1) lit. f), cu păstrarea datelor pe perioade scurte.
- **Pentru obligații legale** de facturare și arhivare, atunci când contractăm: în temeiul obligației legale (art. 6 alin. (1) lit. c).

Nu luăm decizii automate care să producă efecte juridice asupra dumneavoastră.

## 4. Cât timp păstrăm datele

- Solicitările și ofertele: pe durata relației și până la 3 ani de la ultimul contact, pentru a putea relua discuția.
- Documentele financiar-contabile: pe termenele prevăzute de legislația contabilă și fiscală (registrele contabile, 10 ani).
- Datele de newsletter: până la dezabonare sau la retragerea consimțământului.
- Datele tehnice din cookie-uri: pe durata fiecărui cookie, conform Politicii de cookie-uri.

La expirarea termenelor, datele se șterg sau se anonimizează.

## 5. Cui dezvăluim datele

Nu vindem datele dumneavoastră. Le dezvăluim numai furnizorilor care ne ajută să operăm site-ul și serviciile, pe bază de contract de prelucrare (art. 28 GDPR) și strict în limita necesară:

- **Supabase** (găzduirea bazei de date și autentificare);
- **Vercel** (găzduirea și livrarea site-ului);
- **Upstash** (cache, limitarea abuzului, cozi de procesare, căutare);
- **Resend** (trimiterea emailurilor de confirmare și de newsletter);
- **Google, Meta, TikTok** (analiză și publicitate), numai pe baza consimțământului pentru cookie-uri.

Putem dezvălui date și autorităților publice, atunci când legea ne obligă.

## 6. Cookie-uri și tehnologii de urmărire

Folosim cookie-uri strict necesare pentru funcționarea site-ului și, numai cu acordul dumneavoastră, cookie-uri de analiză și de publicitate. Instrumentele Google, Meta și TikTok sunt încărcate prin Google Tag Manager, cu **Google Consent Mode v2** setat implicit pe „refuzat”: niciun cookie de analiză sau de marketing nu se plasează înainte de acordul dumneavoastră. Vă puteți modifica oricând alegerea din bannerul de consimțământ sau din link-ul „Modifică preferințele de cookie-uri” din subsolul site-ului. Detaliile complete (lista cookie-urilor, durata, furnizorul) se află în Politica de cookie-uri.

## 7. Transferuri în afara Spațiului Economic European

O parte dintre furnizorii noștri pot prelucra date în afara SEE, inclusiv în Statele Unite. În aceste cazuri, transferul se întemeiază pe:

- decizia de adecvare a Comisiei Europene privind Cadrul UE-SUA de confidențialitate a datelor (EU-U.S. Data Privacy Framework), pentru furnizorii certificați; și/sau
- Clauzele Contractuale Standard ale Comisiei Europene, însoțite de măsuri suplimentare acolo unde este necesar.

Puteți obține o copie a garanțiilor aplicabile scriindu-ne la adresa de contact din secțiunea 1.

## 8. Securitatea datelor

Aplicăm măsuri tehnice și organizatorice adecvate pentru a proteja datele împotriva accesului neautorizat, pierderii sau divulgării: criptare în tranzit, control al accesului pe bază de roluri, limitarea automată a abuzului și separarea mediilor. Niciun sistem nu este complet sigur, însă urmărim un nivel de protecție corespunzător riscului (art. 32 GDPR).

## 9. Drepturile dumneavoastră

În calitate de persoană vizată, aveți dreptul:

- de acces la date și de a obține o copie;
- de rectificare a datelor inexacte;
- de ștergere („dreptul de a fi uitat”);
- de restricționare a prelucrării;
- de opoziție, inclusiv opoziția la marketing direct, care se respectă necondiționat;
- de portabilitate a datelor;
- de a vă retrage consimțământul oricând, fără a afecta legalitatea prelucrării anterioare.

Vă puteți exercita drepturile scriindu-ne la `[a se completa: email de contact date personale]`. Răspundem în cel mult o lună de la cerere, termen care poate fi prelungit cu două luni în cazuri complexe, situație în care vă vom informa.

De asemenea, aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal:
B-dul G-ral Gheorghe Magheru nr. 28-30, Sector 1, cod poștal 010336, București; telefon +40 318 059 211; email anspdcp@dataprotection.ro; web www.dataprotection.ro.

## 10. Modificări ale acestei politici

Putem actualiza periodic această politică. Versiunea în vigoare și data ultimei actualizări sunt afișate în partea de sus a paginii. Modificările semnificative vor fi semnalate pe site.

## 11. Contact

PACA CONSTRUCT SRL · `[a se completa: adresă]` · `[a se completa: telefon]` · `[a se completa: email]`.

---

_Sfârșitul textului de publicat. Înlocuiește conținutul din `app/confidentialitate/page.tsx` cu acesta, după completarea câmpurilor `[a se completa]` și validarea de către consilierul juridic. Creează separat pagina `/cookies` (Politica de cookie-uri), referită în secțiunea 6._

### Surse (verificare la zi)

- Statutul EU-U.S. Data Privacy Framework (în vigoare; confirmat de Tribunalul UE la 3 sept. 2025; apel pendinte C-703/25 P). — [European Commission, EU-US data transfers](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en), [Epstein Becker Green](https://www.workforcebulletin.com/adequacy-of-the-eu-u-s-data-privacy-framework-survives-challenge)
- Certificarea Google sub DPF. — [Google data transfer frameworks](https://policies.google.com/privacy/frameworks)
