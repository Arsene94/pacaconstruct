# Prompt pentru logo — PACA CONSTRUCT

> Logo vectorial, modern, simplu, derivat din aplicație, domeniul de activitate și design-ul existent.
> Promptul de bază e în engleză (generatoarele de imagini performează cel mai bine așa — Recraft, Ideogram, Midjourney, DALL·E). Explicațiile sunt în română. Poți traduce promptul dacă vrei.

---

## 1. Fundament de brand (extras din proiect)

- **Firmă:** PACA CONSTRUCT SRL
- **Domeniu:** terasamente, excavări, amenajări peisagistice, închiriere utilaje cu operator.
- **Poziționare:** „Tehnicitate în armonie cu natura" · „De la teren brut la spațiu viu" — adică **infrastructură grea + natură**.
- **Motiv vizual recurent în UI:** linii topografice / curbe de nivel (`bg-topo`), borduri subțiri, etichete uppercase, titluri serif editoriale.
- **Paletă (hex din `globals.css`):**
  - Olive (principal): `#1e2a20`
  - Carbon (near-black): `#171a16`
  - Amber (accent): `#d88a24`
  - Sage (verde deschis): `#d8e6d7`
  - Limestone (fundal cald): `#f1efe9`
  - Stone (gri-text): `#434843`
- **Tipografie:** Source Serif 4 (display), Manrope (sans), Inter (mono).
- **Personalitate:** premium, tehnic, sobru, organic, editorial. NU corporate-generic, NU „construcții ieftine".

**Idee centrală pentru simbol:** dualitatea **teren ↔ creștere** (excavare/curbe de nivel jos, viață/frunză/spațiu verde sus), exprimată minimal. Litera **P** (din PACA) e cârligul de monogramă natural.

---

## 2. ⭐ Prompt recomandat (monogramă „P" topografică)

> Cel mai bun pentru că leagă direct de motivul topografic deja folosit în site și e excelent ca app icon/favicon.

```
Minimalist vector logo for "PACA CONSTRUCT", a premium earthworks and
landscaping company. A geometric monogram of the letter "P" built from clean
topographic contour lines nested like elevation curves on a survey map,
evoking terrain, excavation and land shaping. Single-weight monoline, flat
design, lots of negative space, geometric precision, perfectly balanced.
Deep olive green (#1e2a20) mark on warm off-white (#f1efe9) background, with
one subtle amber (#d88a24) accent contour. Modern, sophisticated, editorial,
timeless. Flat 2D vector, crisp clean edges, no gradients, no 3D, no shadows,
scalable, legible at favicon size. Centered, isolated on plain background.
```

**Negative prompt:** `photo, 3D render, gradient, drop shadow, bevel, mascot, clip-art, excavator illustration, hard hat, gears, globe, generic construction icon, busy details, text artifacts, watermark, low contrast`

---

## 3. Variante de concept (alege direcția)

### A. Wordmark + simbol (lockup) — cel mai „brand complet"
```
Modern vector logo lockup for "PACA CONSTRUCT". A small abstract mark made of
three nested topographic contour lines forming a subtle hill/terrain, paired to
the left of a clean refined wordmark "PACA CONSTRUCT" in an elegant
high-contrast serif (similar to Source Serif), uppercase, generous letter
spacing. Deep olive (#1e2a20) with a single amber (#d88a24) accent on the top
contour. Flat vector, monoline symbol, balanced, premium, editorial. Plain
off-white background, isolated, scalable.
```

### B. „Secțiune de teren" — concept narativ (teren brut → spațiu viu)
```
Minimal vector logo symbol: an abstract cross-section of land. A single
horizontal ground line; below it a clean geometric excavation slope/contour,
above it a simple sprout or leaf rising — one continuous monoline expressing
"from raw land to living space". Geometric, balanced, lots of negative space.
Deep olive green (#1e2a20), one amber (#d88a24) accent on the sprout. Flat 2D
vector, single weight, no gradients, favicon-ready, isolated on warm off-white.
```

### C. Litera „A" ca vârf/deal (subtil, geometric)
```
Geometric vector wordmark "PACA" where the apex of the letter "A" becomes a
clean mountain/terrain peak with a single topographic contour line inside its
counter. Modern sans-serif, sturdy but refined, uppercase. Deep olive
(#1e2a20) with an amber (#d88a24) accent line. Flat minimal vector, precise,
premium, scalable. Isolated on plain background.
```

### D. Monogramă „PC" geometrică (sobru, corporate-premium)
```
Minimalist geometric monogram combining letters "P" and "C" into one balanced
mark, formed by clean monoline strokes with a subtle terraced/stepped terrain
cut suggesting earthworks. Single weight, flat vector, lots of negative space.
Deep olive (#1e2a20) on off-white (#f1efe9), one amber (#d88a24) accent.
Modern, sober, editorial, timeless. Favicon-safe, isolated, scalable.
```

---

## 4. Specificații tehnice (pune-le în brief, indiferent de tool)

- **Format:** vector pur (SVG/AI/EPS), 2D flat, geometric, monoline sau forme simple geometrice.
- **Scalabilitate:** lizibil de la 16×16 px (favicon) la panou/utilaj.
- **Variante obligatorii:** (1) full color olive+amber pe limestone; (2) **monocrom** carbon `#171a16`; (3) negativ (alb) pe fundal închis; (4) doar simbol (icon) + lockup orizontal + lockup vertical.
- **Spațiu liber & echilibru:** clear-space generos, fără detalii care „se închid" la dimensiuni mici.
- **Fără:** fotorealism, 3D, gradient, umbre, bevel, mascotă, clișee (excavator desenat, cască, roți dințate, glob).
- **Tipografie de pereche:** Source Serif 4 (premium/editorial) SAU un geometric sans curat (Manrope) pentru wordmark; uppercase, tracking lejer.

---

## 5. Recomandarea mea

Mergi pe **monograma „P" topografică (secțiunea 2)** ca simbol principal + **wordmark serif** (varianta A) pentru lockup. Motiv: refolosește limbajul vizual deja existent în aplicație (curbele de nivel `bg-topo`), spune povestea „teren modelat" fără clișee, e sobru și premium, și funcționează impecabil ca favicon și ca icon de app — exact ce-ți trebuie și pentru `app/icon.tsx` / `opengraph-image` din celelalte prompturi.

---

## 6. Tooluri recomandate (iunie 2026)

- **Recraft** sau **Ideogram** — cele mai bune la logo vectorial + text corect, exportă SVG.
- **Midjourney / DALL·E** — bune la explorare de concept (rasterizat), apoi vectorizezi.
- După generare: rafinează în Figma/Illustrator și exportă SVG curat (optimizat) pentru web.

---

*Dacă vrei, pot să-ți schițez direct una–două variante ca SVG editabil, ca să le vezi în paleta reală înainte să generezi versiunea finală.*
