/**
 * Sursă unică de adevăr pentru datele de business, URL și identitate.
 *
 * Orice valoare folosită în SEO (metadata, JSON-LD, sitemap, OG) și în
 * componentele de contact (navbar, footer, pagina de contact) trebuie să vină
 * de aici — nu hardcoda NAP-ul (Name/Address/Phone) prin componente, fiindcă
 * Google și agenții AI penalizează inconsistența NAP.
 *
 * Valorile marcate `// TODO` sunt placeholdere și TREBUIE înlocuite cu date
 * reale de către om înainte de lansare (vezi raportul final).
 */

/** Originul public, fără slash final. Fallback la domeniul de producție. */
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.pacaconstruct.ro";
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

/** Construiește un URL absolut dintr-o cale relativă (`/blog` → `https://…/blog`). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig = {
  // ─── Identitate brand / business ──────────────────────────────────────────
  /** Numele afișat (brand). */
  name: "PACA CONSTRUCT",
  /** Numele legal complet, pentru schema `legalName`. */
  legalName: "PACA CONSTRUCT SRL",
  /** Descriere implicită (meta description / OG). */
  description:
    "PACA CONSTRUCT SRL execută terasamente, excavări, amenajări peisagistice și închirieri de utilaje cu operator pentru proiecte rezidențiale, comerciale și industriale.",
  /** Slogan scurt pentru imagini OG. */
  tagline: "Tehnicitate în armonie cu natura",
  siteUrl,
  locale: "ro_RO",
  /** Cod limbă scurt (html lang / manifest). */
  lang: "ro",

  // Date de identificare oficiale (ONRC).
  cui: "49810239", // cod unic de înregistrare
  registrationNumber: "J2024002185233", // nr. Reg. Com. (format ONRC nou)
  euid: "ROONRC.J2024002185233", // identificator unic european
  foundingDate: "2024-03-21", // data înființării (ISO 8601)

  // ─── NAP — Name / Address / Phone ─────────────────────────────────────────
  /** Telefon în format E.164 (folosit la `tel:` și schema). */
  phone: "+40799299644",
  /** Telefon formatat pentru afișare. */
  phoneDisplay: "+40 799 299 644",
  /** WhatsApp (doar cifre, format internațional fără +). */
  whatsapp: "40799299644", // TODO: confirmă că numărul are WhatsApp activ
  /** Email principal de contact. */
  email: "contact@pacaconstruct.ro",
  /** Email secundar (oferte/office). */
  emailOffice: "contact@pacaconstruct.ro",

  /** Adresă poștală completă (schema.org PostalAddress). */
  address: {
    streetAddress: "Str. Voda Cuza nr. 37",
    addressLocality: "Sat Gruiu",
    addressRegion: "Ilfov",
    postalCode: "077115",
    addressCountry: "RO",
  },
  /** Coordonate geo pentru LocalBusiness + hartă.
   *  Geocodate din adresa reală (Strada Cuza-Vodă, Gruiu, Ilfov, 077115) prin
   *  OpenStreetMap Nominatim — potrivire la nivel de stradă (cod poștal exact). */
  geo: {
    latitude: 44.720737,
    longitude: 26.232472,
  },
  /** Link Google Maps către locație (schema `hasMap`). */
  mapUrl: "https://www.google.com/maps?q=44.720737,26.232472",

  /** Interval de preț orientativ (schema `priceRange`). */
  priceRange: "$$",

  /** Program de funcționare (schema OpeningHoursSpecification). */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
      label: "L-V: 08:00 - 18:00",
    },
    {
      days: ["Saturday"],
      opens: "09:00",
      closes: "14:00",
      label: "S: 09:00 - 14:00",
    },
  ],

  // ─── Zonă deservită ───────────────────────────────────────────────────────
  /** Localități/județe deservite (schema `areaServed`, SEO local). */
  areaServed: [
    "București",
    "Ilfov",
    "Prahova",
    "Giurgiu",
    "Dâmbovița",
    "Argeș",
    "România",
  ],

  // ─── Profiluri externe (schema `sameAs`) ──────────────────────────────────
  // TODO: completează cu URL-urile reale; lasă doar pe cele care există.
  social: {
    googleBusiness: "", // TODO: URL Google Business Profile
    facebook: "", // TODO: URL pagină Facebook
    instagram: "", // TODO: URL profil Instagram
    linkedin: "", // TODO: URL pagină LinkedIn
  },

  // ─── Active vizuale ───────────────────────────────────────────────────────
  /** Logo absolut (folosit în schema Organization/publisher). Generat de app/icon.tsx. */
  logo: absoluteUrl("/icon"),
  /** Imaginea OG implicită (generată de app/opengraph-image.tsx). */
  defaultOgImage: absoluteUrl("/opengraph-image"),

  // ─── Culori brand (viewport themeColor, manifest, OG) ─────────────────────
  colors: {
    olive: "#1e2a20",
    amber: "#d88a24",
  },

  // ─── Cuvinte cheie implicite ──────────────────────────────────────────────
  keywords: [
    "terasamente",
    "excavări",
    "amenajări peisagistice",
    "amenajări spații verzi",
    "închiriere utilaje cu operator",
    "nivelare teren",
    "săpături fundații",
    "transport pământ și agregate",
    "PACA CONSTRUCT",
  ],
} as const;

/** Lista `sameAs` pentru schema — doar URL-urile completate. */
export function sameAs(): string[] {
  return Object.values(siteConfig.social as Record<string, string>).filter(
    (url) => url.length > 0,
  );
}

/** Adresa pe un singur rând, pentru afișare. */
export function addressLine(): string {
  const a = siteConfig.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion}, România`;
}
