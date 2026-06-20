/**
 * Zone de serviciu pentru SEO local (paginile `/zona/[slug]`). Date statice —
 * fiecare localitate are conținut UNIC (nu doar areaServed generic), ca să
 * justifice o pagină indexabilă proprie, conform cerințelor SEO local 2026.
 *
 * `// TODO`: ajustează intro-urile și notele cu detalii reale (proiecte, repere,
 * timp de mobilizare) pe măsură ce firma acoperă concret fiecare zonă.
 */
export type ServiceArea = {
  /** Slug URL (ex. „bucuresti" → /zona/bucuresti). */
  slug: string;
  /** Numele localității, cu diacritice. */
  name: string;
  /** Județul. */
  county: string;
  /** Forma de caz „în {locativ}" pentru titluri („în București"). */
  locative: string;
  /** Paragraf introductiv unic (answer-first) pentru pagină și meta description. */
  intro: string;
  /** Notă locală scurtă (acces, mobilizare, specific). */
  localNote: string;
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: "bucuresti",
    name: "București",
    county: "București",
    locative: "în București",
    intro:
      "Executăm terasamente, excavări și amenajări peisagistice în București, cu utilaje și operatori proprii. Lucrăm pentru proiecte rezidențiale, comerciale și industriale din toate sectoarele, de la săpături pentru fundații până la sistematizarea și amenajarea finală a terenului.",
    localNote:
      "Mobilizare rapidă în oraș și gestionarea accesului pe șantiere cu spațiu limitat, specifice mediului urban dens.",
  },
  {
    slug: "ilfov",
    name: "Ilfov",
    county: "Ilfov",
    locative: "în Ilfov",
    intro:
      "Oferim servicii de excavări, terasamente și amenajări în județul Ilfov, pentru ansamblurile rezidențiale și halele din jurul Capitalei. Pregătim terenul de la zero: defrișări ușoare, săpături, nivelări și amenajarea spațiilor verzi.",
    localNote:
      "Acoperim comunele limitrofe Bucureștiului, cu timpi scurți de deplasare a utilajelor.",
  },
  {
    slug: "prahova",
    name: "Prahova",
    county: "Prahova",
    locative: "în Prahova",
    intro:
      "Realizăm lucrări de terasamente, excavări și amenajări peisagistice în județul Prahova. De la fundații pentru case în zona Ploiești și împrejurimi, până la amenajarea grădinilor și a curților, acoperim întregul flux de pregătire a terenului.",
    localNote:
      "Experiență cu terenuri în pantă și soluri variate, frecvente în zona de deal a județului.",
  },
  {
    slug: "giurgiu",
    name: "Giurgiu",
    county: "Giurgiu",
    locative: "în Giurgiu",
    intro:
      "Executăm excavări, terasamente și amenajări exterioare în județul Giurgiu, pentru proiecte rezidențiale și agricole. Săpături pentru fundații, nivelări de teren, transport pământ și agregate, cu utilaje cu operator.",
    localNote:
      "Lucrări de sistematizare pe terenuri ample, specifice zonei de câmpie din sudul țării.",
  },
  {
    slug: "dambovita",
    name: "Dâmbovița",
    county: "Dâmbovița",
    locative: "în Dâmbovița",
    intro:
      "Servicii complete de terasamente, excavări și amenajări peisagistice în județul Dâmbovița. Pregătim terenul pentru construcții noi și amenajăm spațiile verzi, cu echipamente deservite de operatori calificați.",
    localNote:
      "Deplasări programate către Târgoviște și localitățile din jur, cu planificarea logisticii din timp.",
  },
  {
    slug: "arges",
    name: "Argeș",
    county: "Argeș",
    locative: "în Argeș",
    intro:
      "Oferim lucrări de excavări, terasamente și amenajări exterioare în județul Argeș. De la săpături și fundații în zona Pitești, până la amenajarea curților și a grădinilor, gestionăm proiectul de la teren brut la spațiu finisat.",
    localNote:
      "Adaptăm utilajele la accesul și relieful variat al județului, de la câmpie la zona subcarpatică.",
  },
];

export function getServiceArea(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug);
}
