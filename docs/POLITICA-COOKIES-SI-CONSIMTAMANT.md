# Politica de cookie-uri și textul bannerului de consimțământ (PACA CONSTRUCT)

> Document în două părți: (1) Politica de cookie-uri, gata de publicat pe `/cookies`, și (2) microcopy pentru bannerul de consimțământ. Redactat în registru juridic, conform Legii nr. 506/2004 și GDPR.
>
> **Notă.** Lista de cookie-uri din secțiunea 4 reflectă instrumentele pe care le folosești (GTM cu GA4, Google Ads, Meta, TikTok). Cookie-urile efective depind de ce activezi în GTM. Înainte de publicare, verifică lista cu un scanner de cookie-uri și completează duratele reale. Materialul nu înlocuiește validarea de către consilierul juridic.

---

# PARTEA 1. Politica de cookie-uri (text de publicat)

**Politica de cookie-uri PACA CONSTRUCT SRL**
Ultima actualizare: iunie 2026

## 1. Ce sunt cookie-urile

Cookie-urile sunt fișiere mici text pe care un site le stochează în browserul tău. Ele permit site-ului să funcționeze, să rețină preferințe și, dacă ești de acord, să măsoare audiența și eficiența reclamelor. Folosim și tehnologii similare (pixeli, stocare locală), pe care le numim generic „cookie-uri” în această politică.

## 2. Temeiul legal

Cookie-urile strict necesare le folosim fără acord, fiind indispensabile funcționării site-ului (art. 4 alin. (5) din Legea nr. 506/2004). Pentru cookie-urile de analiză și de marketing îți cerem consimțământul prealabil (art. 6 alin. (1) lit. a din GDPR coroborat cu Legea nr. 506/2004). Nu le activăm înainte de acordul tău.

## 3. Cum gestionăm consimțământul

La prima vizită îți afișăm un banner prin care poți accepta sau refuza categoriile neesențiale. Folosim Google Consent Mode v2, setat implicit pe „refuzat”: până când nu alegi, instrumentele de analiză și de publicitate nu plasează cookie-uri și nu citesc identificatori. Îți poți schimba oricând alegerea din link-ul „Modifică preferințele de cookie-uri” aflat în subsolul site-ului, sau direct din setările browserului.

## 4. Ce cookie-uri folosim

Le grupăm în trei categorii.

**a) Strict necesare (fără consimțământ)**
| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| preferință de consimțământ (ex. `pc_consent`) | PACA CONSTRUCT | reține alegerea ta privind cookie-urile | până la 12 luni |
| cookie-uri de securitate și de echilibrare a încărcării | Vercel | livrarea și stabilitatea site-ului | sesiune / scurtă durată |

**b) De analiză (cu consimțământ)**
| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `_ga`, `_ga_*` | Google Analytics 4 | statistici de audiență, vizitatori unici | până la 13 luni |

**c) De marketing și publicitate (cu consimțământ)**
| Cookie | Furnizor | Scop | Durată |
|---|---|---|---|
| `_gcl_au` | Google Ads | atribuirea conversiilor din reclame | până la 90 de zile |
| `_fbp` | Meta | măsurarea și optimizarea reclamelor | până la 90 de zile |
| `_ttp` | TikTok | măsurarea reclamelor | până la 13 luni |

Google Tag Manager, prin care încărcăm aceste instrumente, nu plasează el însuși cookie-uri. Lista poate varia în funcție de instrumentele active și se actualizează la nevoie.

## 5. Cookie-uri ale terților și transferuri

Cookie-urile de analiză și de marketing sunt setate de furnizori terți (Google, Meta, TikTok), care le pot prelucra în afara Spațiului Economic European. Aceste transferuri sunt acoperite de Cadrul UE-SUA de confidențialitate a datelor și/sau de Clauzele Contractuale Standard. Detalii în Politica de confidențialitate.

## 6. Cum dezactivezi cookie-urile din browser

Poți bloca sau șterge cookie-urile din setările browserului. Dacă blochezi cookie-urile strict necesare, unele funcții ale site-ului pot să nu mai meargă corect. Instrucțiuni găsești în secțiunile de ajutor ale Chrome, Safari, Firefox și Edge.

## 7. Drepturile tale și contact

Drepturile tale privind datele cu caracter personal și datele de contact sunt descrise în Politica de confidențialitate. Pentru întrebări despre cookie-uri, scrie-ne la `[a se completa: email de contact]`.

## 8. Modificări

Putem actualiza această politică odată cu schimbarea instrumentelor folosite. Data ultimei actualizări este afișată în partea de sus.

---

# PARTEA 2. Microcopy pentru bannerul de consimțământ

> Bannerul implementează Consent Mode v2 (vezi `PROMPT-GTM-TRACKING.md`, FAZA 6). Refuzul trebuie să fie la fel de simplu ca acceptul: trei butoane vizibile la același nivel.

**Titlu:** Respectăm alegerea ta privind cookie-urile

**Text:** Folosim cookie-uri pentru ca site-ul să funcționeze și, doar cu acordul tău, pentru statistici și pentru a măsura reclamele. Poți accepta tot, refuza tot sau alege pe categorii. Îți poți schimba oricând decizia din subsolul site-ului. Detalii în Politica de cookie-uri și în Politica de confidențialitate.

**Butoane (la același nivel vizual):**

- Accept toate
- Refuz toate
- Preferințe

**Panou de preferințe (la apăsarea „Preferințe”):**

- **Strict necesare** (mereu active). Fac site-ul să funcționeze: rețin alegerea ta de cookie-uri și asigură securitatea. Nu pot fi dezactivate.
- **Analiză** (comutator, implicit oprit). Ne arată, anonim, cum este folosit site-ul, ca să-l îmbunătățim.
- **Marketing** (comutator, implicit oprit). Ne ajută să măsurăm reclamele și să-ți arătăm conținut relevant.

**Buton panou:** Salvează preferințele

**Link subsol site (permanent):** Modifică preferințele de cookie-uri

**Microcopy legături:** Politica de cookie-uri · Politica de confidențialitate

---

_Pune textul din Partea 1 pe `/cookies` și microcopy-ul din Partea 2 în bannerul de consimțământ. Vezi promptul de implementare în `PROMPT-PAGINI-LEGALE.md`._
