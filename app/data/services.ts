export type ServiceGroup = {
  title: string;
  href: string;
  items: {
    title: string;
    href: string;
  }[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    title: "Amenajare spatii verzi",
    href: "#amenajare-spatii-verzi",
    items: [
      { title: "Gradini si curti", href: "#gradini-si-curti" },
      { title: "Iazuri si piscine", href: "#iazuri-si-piscine" },
      {
        title: "Intretinere spatii verzi",
        href: "#intretinere-spatii-verzi",
      },
    ],
  },
  {
    title: "Lucrari terasamente si excavari",
    href: "#terasamente-excavari",
    items: [
      { title: "Excavari fundatii si pivnite", href: "#fundatii-pivnite" },
      { title: "Sapaturi fose septice", href: "#fose-septice" },
      {
        title: "Bransamente apa si canalizare",
        href: "#bransamente-apa-canalizare",
      },
      { title: "Nivelare teren", href: "#nivelare-teren" },
      {
        title: "Alei, platforme si drumuri de acces",
        href: "#alei-platforme-drumuri",
      },
      {
        title: "Drenaje si evacuare ape pluviale",
        href: "#drenaje-ape-pluviale",
      },
      { title: "Amenajari garduri", href: "#amenajari-garduri" },
    ],
  },
  {
    title: "Excavari pentru proiecte industriale",
    href: "#excavari-industriale",
    items: [
      {
        title: "Terasamente si platforme industriale",
        href: "#platforme-industriale",
      },
      {
        title: "Drumuri interne si infrastructura",
        href: "#drumuri-interne",
      },
    ],
  },
  {
    title: "Inchirieri utilaje cu operator",
    href: "#inchirieri-utilaje",
    items: [
      { title: "Excavatoare", href: "#excavatoare" },
      { title: "Incarcator frontal", href: "#incarcator-frontal" },
      { title: "Transport agregate", href: "#transport-agregate" },
    ],
  },
];

export const featuredServices = [
  {
    id: "gradini-si-curti",
    icon: "01",
    title: "Gradini si curti",
    description:
      "Proiectare si executie pentru spatii verzi rezidentiale, plantari, gazon, sisteme de irigatii si finisaje exterioare.",
    featured: true,
  },
  {
    id: "iazuri-si-piscine",
    icon: "02",
    title: "Iazuri si piscine",
    description:
      "Sapaturi, modelare teren si pregatire infrastructura pentru iazuri decorative si piscine rezidentiale.",
  },
  {
    id: "intretinere-spatii-verzi",
    icon: "03",
    title: "Intretinere spatii verzi",
    description:
      "Interventii periodice pentru gazon, vegetatie, irigatii si mentinerea spatiilor exterioare in forma optima.",
  },
  {
    id: "fundatii-pivnite",
    icon: "04",
    title: "Excavari fundatii si pivnite",
    description:
      "Excavatii controlate pentru fundatii, pivnite, subsoluri si lucrari pregatitoare pentru constructii.",
  },
  {
    id: "fose-septice",
    icon: "05",
    title: "Sapaturi fose septice",
    description:
      "Sapaturi pentru fose septice, camine tehnice si instalatii subterane, adaptate conditiilor din teren.",
  },
  {
    id: "bransamente-apa-canalizare",
    icon: "06",
    title: "Bransamente apa si canalizare",
    description:
      "Santuri, trasee si pregatire teren pentru retele de apa, canalizare si utilitati conexe.",
  },
  {
    id: "nivelare-teren",
    icon: "07",
    title: "Nivelare teren",
    description:
      "Decopertare, umplere, compactare si aducerea terenului la cota necesara proiectului.",
  },
  {
    id: "alei-platforme-drumuri",
    icon: "08",
    title: "Alei, platforme si drumuri de acces",
    description:
      "Pregatire strat suport, tasare si modelare pentru alei, platforme si cai de acces auto.",
  },
  {
    id: "drenaje-ape-pluviale",
    icon: "09",
    title: "Drenaje si evacuare ape pluviale",
    description:
      "Sisteme de drenaj pentru captarea, directionarea si evacuarea eficienta a apelor pluviale.",
  },
  {
    id: "amenajari-garduri",
    icon: "10",
    title: "Amenajari garduri",
    description:
      "Pregatire teren, sapaturi si suport tehnic pentru fundatii si trasee de garduri.",
  },
  {
    id: "platforme-industriale",
    icon: "11",
    title: "Terasamente si platforme industriale",
    description:
      "Terasamente, compactari si pregatiri de platforme pentru proiecte industriale si comerciale.",
  },
  {
    id: "drumuri-interne",
    icon: "12",
    title: "Drumuri interne si infrastructura",
    description:
      "Lucrari de infrastructura pentru circulatii interne, drumuri tehnologice si acces in santiere.",
  },
  {
    id: "inchirieri-utilaje",
    icon: "13",
    title: "Inchirieri utilaje cu operator",
    description:
      "Excavatoare, incarcator frontal si transport agregate, operate de personal calificat.",
    wide: true,
  },
];
