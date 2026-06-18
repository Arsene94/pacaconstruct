export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  imageSrc: string;
  imageAlt: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "nivelarea-unui-teren",
    title: "Cum se face nivelarea unui teren: etape, utilaje si factori de cost",
    excerpt:
      "Nivelarea corecta previne baltirea, tasarile si corectiile scumpe. Vezi etapele tehnice, utilajele potrivite si variabilele care influenteaza bugetul.",
    category: "Nivelare si pregatire teren",
    readTime: "6 min",
    publishedAt: "15 Oct 2024",
    imageSrc: "/hero.png",
    imageAlt: "Utilaj pe santier pentru nivelarea terenului",
  },
  {
    slug: "pregatire-teren-constructie-casa",
    title: "Cum pregatesti corect terenul inainte de constructia unei case",
    excerpt:
      "O fundatie solida incepe mult inainte de turnarea betonului: analiza solului, decopertare, cote, drenaj si compactare controlata.",
    category: "Excavari si fundatii",
    readTime: "8 min",
    publishedAt: "02 Oct 2024",
    imageSrc: "/hero.png",
    imageAlt: "Sapatura pentru fundatia unei case",
  },
  {
    slug: "alegerea-utilajului-potrivit",
    title: "Ce utilaj este potrivit pentru lucrarea ta?",
    excerpt:
      "De la miniexcavatoare pentru spatii inguste la excavatoare senilate pentru volume mari, alegerea utilajului schimba ritmul si costul lucrarii.",
    category: "Echipamente",
    readTime: "5 min",
    publishedAt: "24 Sep 2024",
    imageSrc: "/hero.png",
    imageAlt: "Excavator pregatit pentru lucrari de santier",
  },
  {
    slug: "drenaj-curte",
    title: "Cum se face drenajul unei curti?",
    excerpt:
      "Sistemele de drenaj protejeaza fundatia, gazonul si aleile. Afla cand ai nevoie de santuri drenante, rigole sau dren francez.",
    category: "Amenajari peisagistice",
    readTime: "7 min",
    publishedAt: "10 Sep 2024",
    imageSrc: "/hero.png",
    imageAlt: "Pregatire drenaj pentru o curte rezidentiala",
  },
  {
    slug: "calcul-volume-pamant",
    title: "Calculul volumelor de pamant la sapaturi si umpluturi",
    excerpt:
      "Estimarea corecta a volumelor ajuta la planificarea orelor de utilaj, a transportului si a costurilor de evacuare.",
    category: "Nivelare",
    readTime: "4 min",
    publishedAt: "28 Aug 2024",
    imageSrc: "/hero.png",
    imageAlt: "Santier cu lucrari de sapatura si mutare pamant",
  },
];

export const featuredBlogPost = blogPosts[1];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
