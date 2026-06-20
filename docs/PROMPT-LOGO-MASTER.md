# Prompt MASTER de logo — PACA CONSTRUCT (complet · complex · profesionist)

> Brief de design + prompt de generare, într-un singur document. Centrat pe direcția recomandată: **monogramă „P" din curbe topografice + wordmark serif**.
> Promptul de generare e în engleză (optim pentru Midjourney, Ideogram, Recraft, DALL·E). Scaffolding-ul profesional e în română.

---

## 0. Esența pe care o codifică logo-ul (din aplicație + domeniu + design)

- **Cine:** PACA CONSTRUCT SRL — terasamente, excavări, amenajări peisagistice, închiriere utilaje cu operator.
- **Idee centrală:** „de la teren brut la spațiu viu" — **precizie tehnică în armonie cu natura**. Dualitate: pământ modelat (jos) ↔ viață/spațiu verde (sus).
- **Limbaj vizual moștenit din UI:** curbe de nivel / topografie (`bg-topo`), borduri subțiri, uppercase, serif editorial. Logo-ul **continuă** acest limbaj, nu inventează altul.
- **Ton:** premium, sobru, tehnic, atemporal. Anti-clișeu (fără excavator desenat, cască, roți dințate).

---

## 1. ⭐ PROMPTUL MASTER (copy-paste)

```
Design a sophisticated, minimalist vector brand mark for "PACA CONSTRUCT", a
premium Romanian earthworks and landscape-architecture company whose philosophy
is "from raw land to living space — technical precision in harmony with nature".

PRIMARY SYMBOL — a refined monogram of the letter "P" constructed entirely from
clean, evenly spaced topographic contour lines (the nested elevation curves of a
land-survey map). The contours must read simultaneously as (a) the letterform P
and (b) a shaped parcel of terrain being modeled — so the mark embodies
excavation, grading and land-shaping. The vertical stem of the P doubles as a
survey axis; the bowl of the P is formed by the innermost closed contour, like
the graded summit of a hill. Single consistent stroke weight (monoline), built
on a precise modular grid with mathematically even contour spacing. Exactly ONE
contour line is rendered in amber, like a single highlighted survey datum,
giving the mark one quiet focal spark.

STYLE — flat 2D vector, geometric, architectural, editorial, timeless. Extreme
restraint, generous negative space, nothing decorative, nothing literal.
Confident and premium, never corporate-generic.

COLOR — deep olive green #1e2a20 for the mark on a warm off-white #f1efe9 ground,
with a single accent stroke in amber #d88a24. The mark must also hold up as solid
monochrome (#171a16) and reversed (off-white on #1e2a20).

OPTIONAL LOCKUP — the symbol to the left of the wordmark "PACA CONSTRUCT" set in
an elegant high-contrast serif (Source Serif style), uppercase, open letter-
spacing, optically aligned, balanced as a horizontal lockup.

TECHNICAL — pure flat vector, crisp clean edges, perfectly centered, isolated on
a plain background; no gradients, no shadows, no 3D, no texture. Fully legible and
balanced from a 16px favicon to large-format site signage.

DO NOT INCLUDE — photographic style, 3D render, gradients, drop shadows, bevels,
mascots, clip-art, literal excavators or bulldozers, hard hats, gears, globes,
broccoli-trees, generic construction clichés, busy detail, distorted or
misspelled text.
```

---

## 2. Construcție & simbolistică (raționamentul de design)

- **De ce „P" din curbe de nivel:** litera distinctivă din PACA devine hartă topografică — exact instrumentul cu care firma lucrează terenul. Un singur semn spune „topografie + modelare teren + precizie".
- **Dualitatea brandului:** curbele exterioare = teren brut/excavare; conturul interior închis = vârf modelat / spațiu finisat → „de la teren brut la spațiu viu".
- **Accentul amber unic:** un singur fir colorat = „reperul de nivel" (survey datum) — punct focal discret, premium, ușor de reținut. Restul rămâne olive → eleganță sobră.
- **Monoline pe grilă modulară:** dă logică inginerească, scalabilitate perfectă și aspect contemporan.

---

## 3. Sistem de culoare (roluri exacte)

| Rol              | Culoare   | Hex       | Utilizare                           |
| ---------------- | --------- | --------- | ----------------------------------- |
| Marcă principală | Olive     | `#1e2a20` | semnul + wordmark pe fundal deschis |
| Accent unic      | Amber     | `#d88a24` | o singură curbă / reperul focal     |
| Fundal cald      | Limestone | `#f1efe9` | fundalul primar                     |
| Monocrom         | Carbon    | `#171a16` | variantă o singură culoare          |
| Negativ          | Off-white | `#f1efe9` | marca pe fundal olive închis        |

Regulă: **maxim 2 culori** simultan (olive + amber). Niciun gradient.

---

## 4. Tipografie (wordmark)

- **Wordmark:** „PACA CONSTRUCT", uppercase, **serif high-contrast** în spiritul **Source Serif 4** (fontul de display din site) — premium, editorial. Tracking lejer, optic aliniat la simbol.
- **Alternativă modern-tehnică:** geometric sans curat (Manrope) dacă vrei o citire mai „industrială".
- **Ierarhie:** „PACA" poate fi ușor mai prezent decât „CONSTRUCT" (greutate sau tracking), pentru memorabilitate.

---

## 5. Geometrie, grilă & spațiu liber

- Construcție pe **grilă modulară** cu spațiere egală între curbe (raport constant; opțional ghidat de proporții 1:1.618).
- **Clear-space** = înălțimea literei „P" în jurul mărcii.
- **Echilibru optic**, nu doar matematic — centrare optică a semnului față de wordmark.
- Test de reducere: la 16px curbele nu trebuie să se „închidă" / să devină pată. Dacă da → reduci numărul de curbe pentru varianta favicon (sistem de simplificare progresivă).

---

## 6. Specificații tehnice & livrabile

**Format:** vector pur (SVG optimizat + AI/EPS sursă). Flat, 2D, fără efecte.

**Variante obligatorii (sistem, nu un singur fișier):**

1. Marcă full color (olive + amber) pe limestone.
2. Monocrom carbon `#171a16`.
3. Negativ (off-white) pe olive `#1e2a20`.
4. **Doar simbol** (icon) — pentru `favicon`, `app/icon.tsx`, avatar.
5. **Lockup orizontal** (simbol + wordmark).
6. **Lockup vertical** (simbol deasupra wordmark-ului).

**Dimensiuni de test:** 16, 32, 180 (apple-touch), 512 (PWA/`icon.png`), + 1200×630 fundal pentru `opengraph-image`.

**Accesibilitate:** contrast marcă/fundal ≥ AA; lizibil în alb-negru și la fotocopiere.

> Notă de legătură: simbolul „doar icon" alimentează direct `app/icon.tsx`, `apple-icon.png` și `opengraph-image` din `PROMPT-SEO-GEO.md` / `PROMPT-PERFORMANTA.md`.

---

## 7. Reguli DO / DON'T

**DO:** minimal, geometric, monoline, mult negative space, scalabil, o singură idee clară, atemporal, premium.

**DON'T:** ilustrație de excavator/buldozer, cască, roți dințate, glob, frunză-clișeu, gradienturi, umbre, 3D, mascotă, mai mult de 2 culori, detalii care dispar la dimensiuni mici, text deformat.

---

## 8. Parametri per tool (iunie 2026)

- **Midjourney v7:** adaugă la final `--style raw --ar 1:1 --s 120 --no photo, 3d, gradient, shadow, mascot, excavator, hardhat, gears, text`. Pentru lockup cu text, generează simbolul în MJ și textul separat (MJ încă greșește litere).
- **Ideogram 3.0:** Style = **Design**, Magic Prompt = **Off**, aspect **1:1**. Bun și pentru wordmark (redă text corect).
- **Recraft V3:** mod **Vector / Logo**, blochează paleta pe `#1e2a20` + `#d88a24` + `#f1efe9`, export **SVG** direct. (Recomandat pentru output vectorial final.)
- **DALL·E 3:** adaugă „flat vector logo, plain solid background, centered, no photographic detail".

---

## 9. Variantă structurată (pentru tooluri cu input pe câmpuri / API)

```json
{
  "brand": "PACA CONSTRUCT",
  "industry": "earthworks, excavation, landscape architecture, equipment rental",
  "concept": "letter P monogram built from topographic contour lines = land surveying + terrain shaping",
  "symbolism": "raw land to living space; technical precision in harmony with nature",
  "style": [
    "minimalist",
    "geometric",
    "monoline",
    "flat vector",
    "editorial",
    "timeless"
  ],
  "colors": {
    "primary": "#1e2a20",
    "accent": "#d88a24",
    "background": "#f1efe9",
    "mono": "#171a16"
  },
  "accent_rule": "exactly one contour line in amber as a survey datum",
  "typography": "uppercase high-contrast serif (Source Serif), open tracking",
  "deliverables": [
    "icon-only",
    "horizontal lockup",
    "vertical lockup",
    "monochrome",
    "reversed"
  ],
  "constraints": [
    "pure 2D vector",
    "no gradient/shadow/3D",
    "legible at 16px",
    "max 2 colors"
  ],
  "avoid": [
    "excavator",
    "hard hat",
    "gears",
    "globe",
    "mascot",
    "clip-art",
    "busy detail"
  ]
}
```

---

_Pot transforma direcția asta într-un **SVG editabil** în paleta reală (icon + lockup), gata de pus în `app/icon.tsx` și `opengraph-image` — spune-mi și îl schițez._
