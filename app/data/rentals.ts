export type RentalMachine = {
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  specs: {
    label: string;
    value: string;
  }[];
  uses: string[];
  accessRequirements: string[];
};

export const rentalMachines: RentalMachine[] = [
  {
    slug: "excavator-cu-operator",
    category: "Echipament greu",
    title: "Excavator cu operator",
    shortDescription:
      "Ideal pentru excavatii de mare adancime, fundatii, demolari si manipularea volumelor mari de pamant.",
    longDescription:
      "Inchiriere excavator profesional cu operator experimentat pentru lucrari complexe de terasamente, fundatii si amenajari exterioare. Eficienta maxima si precizie tehnica pentru proiectul tau.",
    price: "De la 180 RON / ora",
    imageSrc: "/hero.png",
    imageAlt: "Excavator lucrand pe un teren pregatit pentru amenajare.",
    specs: [
      { label: "Greutate operationala", value: "8.5 - 20 tone" },
      { label: "Adancime sapare", value: "Pana la 6 m" },
      { label: "Latime cupa", value: "400 - 1200 mm" },
      { label: "Disponibilitate", value: "Confirmare rapida" },
    ],
    uses: [
      "Sapaturi fundatii case",
      "Nivelare si terasare teren",
      "Decopertari strat vegetal",
      "Santuri utilitati",
    ],
    accessRequirements: [
      "Latime minima acces: 2.5 m",
      "Sol stabilizat pentru transport",
      "Fara cabluri aeriene joase",
    ],
  },
  {
    slug: "buldoexcavator",
    category: "Include operator",
    title: "Buldoexcavator",
    shortDescription:
      "Combinatie practica intre incarcator frontal si excavator, potrivita pentru santiere urbane si spatii restranse.",
    longDescription:
      "Buldoexcavator cu operator pentru sapaturi, incarcare materiale si nivelari rapide in zone cu acces controlat.",
    price: "De la 160 RON / ora",
    imageSrc: "/hero.png",
    imageAlt: "Buldoexcavator pregatit pentru lucrari de santier.",
    specs: [
      { label: "Configuratie", value: "Cupă fata + brat spate" },
      { label: "Aplicatii", value: "Sapaturi, incarcare, nivelare" },
      { label: "Acces", value: "Potrivit pentru zone urbane" },
      { label: "Operator", value: "Inclus" },
    ],
    uses: ["Sapare santuri utilitati", "Nivelare teren", "Incarcare materiale"],
    accessRequirements: [
      "Acces auto pentru transport",
      "Spatiu minim pentru manevra",
      "Verificare teren inainte de mobilizare",
    ],
  },
  {
    slug: "incarcator-frontal",
    category: "Include operator",
    title: "Incarcator frontal",
    shortDescription:
      "Eficient pentru mutarea rapida a pamantului, pietrisului sau deseurilor din constructii.",
    longDescription:
      "Incarcator frontal cu operator pentru manipularea volumelor mari, curatarea amplasamentelor si alimentarea camioanelor.",
    price: "De la 150 RON / ora",
    imageSrc: "/hero.png",
    imageAlt: "Incarcator frontal pe un santier pregatit.",
    specs: [
      { label: "Utilizare", value: "Manipulare volum mare" },
      { label: "Materiale", value: "Pamant, agregate, resturi" },
      { label: "Productivitate", value: "Ridicata pe suprafete mari" },
      { label: "Operator", value: "Inclus" },
    ],
    uses: ["Manipulare agregate", "Curatare amplasament", "Umpluturi fundatii"],
    accessRequirements: [
      "Suprafata suficienta pentru viraj",
      "Teren portant",
      "Zona de incarcare clar delimitata",
    ],
  },
  {
    slug: "transport-agregate",
    category: "Transport santier",
    title: "Transport agregate",
    shortDescription:
      "Camioane pentru livrarea materialelor granulare necesare amenajarilor sau fundatiilor.",
    longDescription:
      "Transport de agregate pentru santiere rezidentiale, comerciale si industriale, cu planificare adaptata accesului si volumului necesar.",
    price: "De la 250 RON / cursa",
    imageSrc: "/hero.png",
    imageAlt: "Camion pentru transport agregate in zona de santier.",
    specs: [
      { label: "Materiale", value: "Piatra, nisip, balast" },
      { label: "Planificare", value: "In functie de volum" },
      { label: "Transport", value: "Stabilit separat" },
      { label: "Disponibilitate", value: "Cu confirmare" },
    ],
    uses: ["Piatra sparta, refuz ciur", "Nisip, balast", "Pamant vegetal"],
    accessRequirements: [
      "Acces pentru camion",
      "Zona sigura de descarcare",
      "Confirmare traseu inainte de livrare",
    ],
  },
  {
    slug: "transport-pamant",
    category: "Transport santier",
    title: "Transport pamant",
    shortDescription:
      "Evacuarea pamantului rezultat din excavatii sau relocarea acestuia in santier.",
    longDescription:
      "Transport pamant si resturi vegetale cu planificare tehnica pentru evacuare eficienta si coordonare cu lucrarile de excavare.",
    price: "De la 250 RON / cursa",
    imageSrc: "/hero.png",
    imageAlt: "Camion pentru transport pamant de pe santier.",
    specs: [
      { label: "Aplicatie", value: "Evacuare si relocare" },
      { label: "Material", value: "Pamant excavat" },
      { label: "Planificare", value: "Dupa volum estimat" },
      { label: "Disponibilitate", value: "Cu confirmare" },
    ],
    uses: ["Evacuare pamant excavat", "Relocare interna", "Evacuare resturi vegetale"],
    accessRequirements: [
      "Acces pentru incarcare",
      "Volum estimat inainte de cursa",
      "Locatie de descarcare confirmata",
    ],
  },
];

export function getRentalMachine(slug: string) {
  return rentalMachines.find((machine) => machine.slug === slug);
}
