# Copy pagina Despre: text uman, bazat pe documentele reale

> Text pentru pagina `/despre`, scris din `docs/servicii/Website Paca Construct Srl.docx` (poziționarea companiei și structura de servicii) plus documentele de servicii. Reguli humanizer: diacritice, fără em-dash, fapte concrete, fără cifre sau dovezi inventate.
>
> **Fără cifre inventate.** La cererea ta, am scos complet numărul de proiecte, mărimea flotei și anii de activitate. Pagina folosește doar ce reiese din documente: cele două direcții de lucru, scopul real (partea mecanizată), utilajele proprii, operatorii calificați și evaluarea pe teren.
>
> **Telefon real din documente:** 0799 299 644.

---

## HERO

- **eyebrow:** Despre PACA CONSTRUCT
- **H1:** Pregătim terenul. Restul stă pe ce facem noi.
- **Intro:** PACA CONSTRUCT SRL lucrează în terasamente și excavări, între lucrările de pregătire a terenului pentru amenajări exterioare și cele pentru instalații și construcții civile. Pe scurt: aducem terenul în starea în care se poate construi, planta sau circula pe el, cu utilaje proprii și operatori care fac asta zi de zi.

## CE FACEM

- **Titlu:** Două lucruri pe care le facem bine, restul în jurul lor
- **Text:** Avem două direcții principale. Prima e amenajarea mecanizată a spațiilor exterioare: pregătim și modelăm terenul curților și grădinilor, facem alei, platforme și drenaj. A doua e partea grea de infrastructură: terasamente și excavări pentru fundații, instalații de apă și canalizare, fose septice, pivnițe și subsoluri. În jurul acestor două direcții punem serviciile complementare de care are nevoie o lucrare de pregătire a terenului: nivelare, drumuri de acces, drenaje, lucrări industriale și închirieri de utilaje cu operator.

## CUM LUCRĂM (trei blocuri)

**1. O singură echipă pentru tot**
Cele mai multe probleme apar la mijloc, între meseriași: cel care a săpat dă vina pe cel care toarnă, cel cu drenajul pe cel cu aleea. Noi ducem partea de teren de la excavare până la predare, așa că ai un singur om cu care vorbești și o singură răspundere.

**2. Începem cu terenul, nu cu oferta**
Mergem pe teren, ne uităm la acces, la diferențele de nivel și la sol, și abia apoi spunem un cost. Lucrăm la cotele din proiect, compactăm în straturi și ducem apa unde trebuie, fiindcă acolo se strică lucrările, nu la finisaj. Preferăm un „nu se poate” clar în loc de o promisiune nerealistă.

**3. Spunem din start unde ne oprim**
Facem partea mecanizată: pregătire teren, terasamente, infrastructură. Nu facem plantări, gazon, irigații sau întreținere de spații verzi. Îți spunem asta de la prima discuție, ca să știi exact ce intră în ofertă și să nu plătești de două ori pentru același lucru.

## TEHNICITATE ÎN ARMONIE CU NATURA

Lucrăm cu utilaje grele, dar pe terenul cuiva. Asta înseamnă acces gândit, pământ evacuat și o curte lăsată curată, nu un șantier abandonat. Alegem utilajul după lucrare și după acces, de la miniexcavator pentru curți strâmte până la excavator și buldoexcavator pentru volume mari, cu autobasculante pentru transport și evacuare.

## PUNCTE TARI (din documente, fără cifre)

Patru lucruri reale, susținute de documente, pe care le poți afișa ca un rând de repere sub intro:

- Utilaje proprii
- Operatori calificați
- Evaluare pe teren înainte de ofertă
- Rezidențial și comercial

Toate sunt verificabile și nu pretind nimic despre vechime sau volum.

## ZONA ÎN CARE LUCRĂM

Ne deplasăm cu utilaje proprii, ceea ce ne permite să ajungem eficient la lucrare, în funcție de distanță, acces și volumul proiectului. Zona exactă de intervenție o stabilim după o evaluare inițială. Lucrăm pentru proprietăți rezidențiale și comerciale, în localitatea de bază și în zonele din jur.

## DATE DE FIRMĂ (de completat în siteConfig)

- Denumire: PACA CONSTRUCT SRL
- CUI: `[completează]`
- Reg. Com.: `[completează]`
- Telefon: 0799 299 644
- Email: `[completează]`
- Adresă: `[completează]`

## CTA FINAL

- **Titlu:** Ai un teren de pregătit? Hai să ne uităm la el.
- **Text:** Spune-ne ce ai de făcut și unde. Venim, evaluăm și îți zicem cinstit cum stă treaba și cât costă.
- **Buton principal:** Cere o evaluare
- **Buton secundar:** Sună la 0799 299 644

---

## Pentru implementare

Pagina `app/despre/page.tsx` are deja secțiunile (intro, cele trei carduri, blocul „tehnicitate”, un rând de statistici, date de firmă). **Scoate rândul de statistici** cu „ani de experiență / proiecte finalizate / utilaje în flotă” și pune în loc cele patru puncte tari de mai sus, sau lasă-l afară de tot. Datele de firmă vin din `siteConfig` odată completate. Spune-mi dacă vrei un patch direct pe `app/despre/page.tsx`.
