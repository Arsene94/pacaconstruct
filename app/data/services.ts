export type ServicePage = {
  slug: string;
  title: string;
  shortTitle?: string;
  eyebrow: string;
  description: string;
  summaryTitle: string;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
  processes: {
    title: string;
    text: string;
  }[];
  specs: {
    label: string;
    value: string;
    impact: string;
  }[];
};

export type ServiceGroup = {
  title: string;
  href: string;
  items: {
    title: string;
    href: string;
  }[];
};

const defaultProcesses = [
  {
    title: "Evaluare tehnica",
    text: "Analizam accesul, cotele, solul si limitarile reale din teren inainte de mobilizare.",
  },
  {
    title: "Planificare executie",
    text: "Stabilim ordinea lucrarilor, utilajele necesare, traseele si masurile de protectie.",
  },
  {
    title: "Executie controlata",
    text: "Lucram cu operatori calificati si verificam permanent adancimile, pantele si finisajele.",
  },
  {
    title: "Predare pregatita",
    text: "Lasam terenul curat, stabilizat si pregatit pentru etapa urmatoare a proiectului.",
  },
];

const defaultSpecs = [
  {
    label: "Trasare si cote",
    value: "Verificare pe etape",
    impact: "Reduce riscul de corectii costisitoare si mentine lucrarea in parametri.",
  },
  {
    label: "Gestionare material",
    value: "Sortare, relocare sau evacuare",
    impact: "Pastreaza santierul organizat si accelereaza lucrarile urmatoare.",
  },
  {
    label: "Protectie teren",
    value: "Acces controlat si compactare adaptata",
    impact: "Limiteaza deteriorarea zonelor adiacente si stabilizeaza suprafetele.",
  },
];

const gardenProcesses = [
  {
    title: "Proiectare spatiu",
    text: "Stabilim functiunile, circulatiile, zonele verzi si relatia dintre plante, apa si acces.",
  },
  {
    title: "Infrastructura ascunsa",
    text: "Pregatim drenajul, irigatiile, stratul vegetal si suportul pentru alei sau borduri.",
  },
  {
    title: "Selectie vegetala",
    text: "Alegem specii adaptate climatului local, expunerii si nivelului de intretinere dorit.",
  },
  {
    title: "Plantare si finisaj",
    text: "Executam plantarea, nivelarea finala, mulcirea si detaliile care dau coerenta spatiului.",
  },
];

const gardenSpecs = [
  {
    label: "Strat vegetal",
    value: "Min. 30-40 cm pentru gazon",
    impact: "Asigura prindere buna, rezistenta la seceta si crestere uniforma.",
  },
  {
    label: "Drenaj si irigatii",
    value: "Trasee ascunse, testate inainte de finisaj",
    impact: "Previne baltirea si mentine vegetatia stabila in perioadele calde.",
  },
  {
    label: "Material vegetal",
    value: "Specii aclimatizate",
    impact: "Reduce pierderile si pastreaza gradina usor de intretinut.",
  },
];

const excavationSpecs = [
  {
    label: "Adancime sapatura",
    value: "Conform trasarii si proiectului",
    impact: "Asigura baza corecta pentru fundatii, utilitati sau elemente tehnice.",
  },
  {
    label: "Pante si evacuare apa",
    value: "Control vizual si instrumental",
    impact: "Reduce riscul de acumulare a apei si instabilitate in timp.",
  },
  {
    label: "Compactare",
    value: "Pe straturi adaptate solului",
    impact: "Creste portanta si pregateste terenul pentru etapa de constructie.",
  },
];

export const servicePages: ServicePage[] = [
  {
    slug: "amenajare-spatii-verzi",
    title: "Amenajare spatii verzi",
    eyebrow: "Servicii Premium",
    description:
      "Transformam spatiile exterioare brute in zone verzi coerente, functionale si usor de intretinut.",
    summaryTitle: "De la teren brut la spatiu viu.",
    summary:
      "Abordam fiecare spatiu verde ca pe o structura vie: pregatim solul, apa, accesul si plantarea astfel incat rezultatul sa fie estetic, stabil si durabil.",
    imageSrc: "/hero.png",
    imageAlt: "Amenajare spatii verzi executata cu utilaje si finisaje naturale",
    processes: gardenProcesses,
    specs: gardenSpecs,
  },
  {
    slug: "gradini-si-curti",
    title: "Gradini si curti",
    eyebrow: "Servicii Premium",
    description:
      "Proiectare si executie pentru gradini rezidentiale, curti private, gazon, plantari, alei si irigatii.",
    summaryTitle: "O curte bine gandita incepe sub nivelul gazonului.",
    summary:
      "Integram lucrari de teren, drenaj, strat vegetal si finisaje pentru ca gradina sa arate bine si sa functioneze corect in fiecare sezon.",
    imageSrc: "/hero.png",
    imageAlt: "Gradina si curte amenajate cu zone verzi si alei",
    processes: gardenProcesses,
    specs: gardenSpecs,
  },
  {
    slug: "iazuri-si-piscine",
    title: "Iazuri si piscine",
    eyebrow: "Servicii cu infrastructura",
    description:
      "Sapaturi, modelare teren si pregatire tehnica pentru iazuri decorative si piscine rezidentiale.",
    summaryTitle: "Apa cere cote precise si teren stabil.",
    summary:
      "Pregatim forma, adancimea, accesul si evacuarea materialului astfel incat instalarea bazinului sau a iazului sa aiba o baza sigura.",
    imageSrc: "/hero.png",
    imageAlt: "Pregatire teren pentru iaz sau piscina",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "intretinere-spatii-verzi",
    title: "Intretinere spatii verzi",
    eyebrow: "Servicii periodice",
    description:
      "Interventii pentru gazon, vegetatie, irigatii si mentinerea spatiilor verzi in forma optima.",
    summaryTitle: "Spatiile verzi bune se mentin prin ritm, nu prin improvizatie.",
    summary:
      "Planificam lucrarile recurente in functie de sezon, stare vegetatiei si nivelul de utilizare al spatiului.",
    processes: gardenProcesses,
    specs: gardenSpecs,
  },
  {
    slug: "terasamente-excavari",
    title: "Lucrari terasamente si excavari",
    eyebrow: "Infrastructura teren",
    description:
      "Sapaturi, nivelari, compactari, drenaje si lucrari de pregatire pentru constructii si instalatii.",
    summaryTitle: "Terenul corect pregatit tine proiectul drept.",
    summary:
      "Combinam utilaje potrivite, operatori experimentati si verificari pe etape pentru lucrari rapide, curate si predictibile.",
    imageSrc: "/hero.png",
    imageAlt: "Utilaj de terasamente pe santier",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "fundatii-pivnite",
    title: "Excavari fundatii si pivnite",
    eyebrow: "Excavari controlate",
    description:
      "Excavatii precise pentru fundatii, pivnite, subsoluri si lucrari pregatitoare pentru constructii.",
    summaryTitle: "Sapatura fundatiei trebuie sa fie precisa din prima.",
    summary:
      "Respectam cotele si accesul utilajelor, gestionam materialul excavat si pregatim terenul pentru armare, turnare sau sprijiniri.",
    imageSrc: "/hero.png",
    imageAlt: "Excavare pentru fundatie si pivnita",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "fose-septice",
    title: "Sapaturi fose septice",
    eyebrow: "Instalatii subterane",
    description:
      "Sapaturi pentru fose septice, camine tehnice si instalatii subterane, adaptate conditiilor din teren.",
    summaryTitle: "Volumul corect si accesul bun fac instalatia mai sigura.",
    summary:
      "Pregatim groapa, traseele si zona de lucru pentru montaj rapid, cu atentie la pante si evacuarea pamantului.",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "bransamente-apa-canalizare",
    title: "Bransamente apa si canalizare",
    eyebrow: "Utilitati",
    description:
      "Santuri, trasee si pregatire teren pentru retele de apa, canalizare si utilitati conexe.",
    summaryTitle: "Traseele de utilitati trebuie sa ramana curate si verificabile.",
    summary:
      "Executam sapaturi liniare, pastram pantele necesare si protejam zonele adiacente pentru racordari eficiente.",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "nivelare-teren",
    title: "Nivelare teren",
    eyebrow: "Pregatire suprafete",
    description:
      "Decopertare, umplere, compactare si aducerea terenului la cota necesara proiectului.",
    summaryTitle: "Nivelarea buna face diferenta in fiecare etapa urmatoare.",
    summary:
      "Corectam diferentele de nivel, imbunatatim scurgerea apelor si pregatim suprafata pentru gradina, constructie sau acces auto.",
    imageSrc: "/hero.png",
    imageAlt: "Nivelare teren cu utilaj",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "alei-platforme-drumuri",
    title: "Alei, platforme si drumuri de acces",
    eyebrow: "Acces si circulatii",
    description:
      "Pregatire strat suport, tasare si modelare pentru alei, platforme si cai de acces auto.",
    summaryTitle: "Un drum bun incepe cu suportul, nu cu finisajul.",
    summary:
      "Pregatim infrastructura de baza pentru circulatii stabile, cu pante, compactare si drenaj adaptate utilizarii.",
    imageSrc: "/hero.png",
    imageAlt: "Pregatire platforma si drum de acces",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "drenaje-ape-pluviale",
    title: "Drenaje si evacuare ape pluviale",
    eyebrow: "Management apa",
    description:
      "Sisteme de drenaj pentru captarea, directionarea si evacuarea eficienta a apelor pluviale.",
    summaryTitle: "Apa trebuie directionata inainte sa devina problema.",
    summary:
      "Modelam terenul si pregatim traseele pentru drenuri, rigole sau evacuari care protejeaza constructiile si spatiile verzi.",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "amenajari-garduri",
    title: "Amenajari garduri",
    eyebrow: "Limite si imprejmuiri",
    description:
      "Pregatire teren, sapaturi si suport tehnic pentru fundatii, stalpi si trasee de garduri.",
    summaryTitle: "O imprejmuire dreapta incepe cu traseu si fundatie.",
    summary:
      "Curatam si pregatim traseul, executam sapaturi si nivelari astfel incat montajul gardului sa fie stabil si ordonat.",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "excavari-industriale",
    title: "Excavari pentru proiecte industriale",
    eyebrow: "Proiecte industriale",
    description:
      "Excavari, platforme si pregatiri de teren pentru proiecte industriale, logistice si comerciale.",
    summaryTitle: "Santierul industrial cere ritm si control.",
    summary:
      "Lucram pe suprafete mari cu planificare clara, utilaje potrivite si coordonare cu etapele de infrastructura.",
    imageSrc: "/hero.png",
    imageAlt: "Excavari pentru proiect industrial",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "platforme-industriale",
    title: "Terasamente si platforme industriale",
    eyebrow: "Platforme industriale",
    description:
      "Terasamente, compactari si pregatiri de platforme pentru proiecte industriale si comerciale.",
    summaryTitle: "Platforma industriala trebuie sa fie stabila si masurabila.",
    summary:
      "Pregatim stratificarea, evacuarea apelor si compactarea pentru suprafete tehnice, zone de lucru sau fundatii ulterioare.",
    imageSrc: "/hero.png",
    imageAlt: "Terasamente si platforme industriale",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "drumuri-interne",
    title: "Drumuri interne si infrastructura",
    eyebrow: "Infrastructura interna",
    description:
      "Lucrari de infrastructura pentru circulatii interne, drumuri tehnologice si acces in santiere.",
    summaryTitle: "Circulatia interna tine santierul functional.",
    summary:
      "Executam pregatirea traseelor, stratul suport si pantele necesare pentru acces eficient si sigur.",
    processes: defaultProcesses,
    specs: excavationSpecs,
  },
  {
    slug: "inchirieri-utilaje",
    title: "Inchirieri utilaje cu operator",
    eyebrow: "Serviciu adiacent",
    description:
      "Excavatoare, incarcator frontal si transport agregate, operate de personal calificat.",
    summaryTitle: "Utilajul potrivit conteaza doar cu operatorul potrivit.",
    summary:
      "Punem la dispozitie utilaje deservite de oameni care inteleg terenul, ritmul santierului si executia precisa.",
    imageSrc: "/hero.png",
    imageAlt: "Utilaje de santier cu operator",
    processes: defaultProcesses,
    specs: defaultSpecs,
  },
  {
    slug: "excavatoare",
    title: "Excavatoare",
    eyebrow: "Utilaje cu operator",
    description:
      "Excavatoare pentru sapaturi, terasamente, incarcari si lucrari punctuale in santiere rezidentiale sau industriale.",
    summaryTitle: "Excavatorul aduce precizie si forta acolo unde terenul cere.",
    summary:
      "Alegem utilajul si cupa potrivita pentru volum, acces si tipul solului, cu operator inclus.",
    imageSrc: "/hero.png",
    imageAlt: "Excavator cu operator pe santier",
    processes: defaultProcesses,
    specs: defaultSpecs,
  },
  {
    slug: "incarcator-frontal",
    title: "Incarcator frontal",
    eyebrow: "Utilaje cu operator",
    description:
      "Incarcator frontal pentru manipulare material, nivelari, incarcari si organizarea santierului.",
    summaryTitle: "Manipularea materialului decide viteza santierului.",
    summary:
      "Folosim incarcatorul frontal pentru volume mari, relocari rapide si curatarea eficienta a zonelor de lucru.",
    imageSrc: "/hero.png",
    imageAlt: "Incarcator frontal pentru materiale de constructii",
    processes: defaultProcesses,
    specs: defaultSpecs,
  },
  {
    slug: "transport-agregate",
    title: "Transport agregate",
    eyebrow: "Logistica santier",
    description:
      "Transport pentru agregate, pamant, piatra si materiale necesare lucrarilor de teren.",
    summaryTitle: "Materialele trebuie sa ajunga cand santierul e pregatit.",
    summary:
      "Coordonam transportul cu etapa de executie, astfel incat materialele sa fie disponibile fara blocaje inutile.",
    processes: defaultProcesses,
    specs: defaultSpecs,
  },
];

export const serviceGroups: ServiceGroup[] = [
  {
    title: "Amenajare spatii verzi",
    href: "/servicii/amenajare-spatii-verzi",
    items: [
      { title: "Gradini si curti", href: "/servicii/gradini-si-curti" },
      { title: "Iazuri si piscine", href: "/servicii/iazuri-si-piscine" },
      {
        title: "Intretinere spatii verzi",
        href: "/servicii/intretinere-spatii-verzi",
      },
    ],
  },
  {
    title: "Lucrari terasamente si excavari",
    href: "/servicii/terasamente-excavari",
    items: [
      { title: "Excavari fundatii si pivnite", href: "/servicii/fundatii-pivnite" },
      { title: "Sapaturi fose septice", href: "/servicii/fose-septice" },
      {
        title: "Bransamente apa si canalizare",
        href: "/servicii/bransamente-apa-canalizare",
      },
      { title: "Nivelare teren", href: "/servicii/nivelare-teren" },
      {
        title: "Alei, platforme si drumuri de acces",
        href: "/servicii/alei-platforme-drumuri",
      },
      {
        title: "Drenaje si evacuare ape pluviale",
        href: "/servicii/drenaje-ape-pluviale",
      },
      { title: "Amenajari garduri", href: "/servicii/amenajari-garduri" },
    ],
  },
  {
    title: "Excavari pentru proiecte industriale",
    href: "/servicii/excavari-industriale",
    items: [
      {
        title: "Terasamente si platforme industriale",
        href: "/servicii/platforme-industriale",
      },
      {
        title: "Drumuri interne si infrastructura",
        href: "/servicii/drumuri-interne",
      },
    ],
  },
  {
    title: "Inchirieri utilaje cu operator",
    href: "/servicii/inchirieri-utilaje",
    items: [
      { title: "Excavatoare", href: "/servicii/excavatoare" },
      { title: "Incarcator frontal", href: "/servicii/incarcator-frontal" },
      { title: "Transport agregate", href: "/servicii/transport-agregate" },
    ],
  },
];

export const featuredServices = servicePages
  .filter((service) =>
    [
      "gradini-si-curti",
      "iazuri-si-piscine",
      "intretinere-spatii-verzi",
      "fundatii-pivnite",
      "fose-septice",
      "bransamente-apa-canalizare",
      "nivelare-teren",
      "alei-platforme-drumuri",
      "drenaje-ape-pluviale",
      "amenajari-garduri",
      "platforme-industriale",
      "drumuri-interne",
      "inchirieri-utilaje",
    ].includes(service.slug),
  )
  .map((service, index) => ({
    id: service.slug,
    icon: String(index + 1).padStart(2, "0"),
    title: service.shortTitle ?? service.title,
    description: service.description,
    href: `/servicii/${service.slug}`,
    featured: service.slug === "gradini-si-curti",
    wide: service.slug === "inchirieri-utilaje",
  }));

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
