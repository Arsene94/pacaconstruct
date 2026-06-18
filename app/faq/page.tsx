import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { SectionContainer } from "../components/section-container";
import { serviceGroups } from "../data/services";

export const metadata: Metadata = {
  title: "Intrebari frecvente - PACA CONSTRUCT",
  description:
    "Raspunsuri despre evaluari, costuri, excavari, fundatii si amenajari exterioare executate de PACA CONSTRUCT.",
};

const shortcuts = [
  {
    eyebrow: "Ghid",
    title: "Vreau o gradina",
    href: "#amenajari",
  },
  {
    eyebrow: "Ghid",
    title: "Construiesc o casa",
    href: "#excavari",
  },
  {
    eyebrow: "Servicii",
    title: "Am nevoie de utilaje",
    href: "#evaluare",
  },
];

const frequentQuestions = [
  "Cat dureaza o lucrare de excavare?",
  "Ce include pregatirea terenului?",
  "Este necesara o vizita la locatie?",
];

const faqSections = [
  {
    id: "evaluare",
    index: "01",
    title: "Evaluare si costuri",
    description:
      "Transparenta in calcularea bugetelor pentru lucrari de terasament, excavare si amenajare.",
    items: [
      {
        question: "Cum se calculeaza pretul unei lucrari?",
        answer:
          "Pretul depinde de volumul de pamant dislocat, tipul de sol, accesul in santier si utilajele necesare. Putem oferi o estimare initiala pe baza fotografiilor si detaliilor trimise, dar oferta finala se stabileste dupa vizita la locatie.",
        highlights: ["Volum si tip de sol", "Acces pentru utilaje", "Durata si logistica"],
      },
      {
        question: "De ce este importanta evaluarea tehnica pe teren?",
        answer:
          "Evaluarea confirma structura solului, diferentele de nivel, accesul si riscurile de executie. Astfel evitam modificari neprevazute de pret si alegem utilajele potrivite pentru lucrare.",
        highlights: ["Masuratori reale", "Solutie tehnica clara", "Oferta ferma"],
      },
      {
        question: "Puteti face o estimare fara proiect tehnic?",
        answer:
          "Da, pentru orientare. Avem nevoie de locatie, fotografii, dimensiuni aproximative si obiectivul lucrarii. Pentru executie, cerintele finale sunt confirmate prin masuratori si verificare in teren.",
        highlights: ["Fotografii", "Dimensiuni aproximative", "Obiectivul lucrarii"],
      },
    ],
  },
  {
    id: "excavari",
    index: "02",
    title: "Excavari si fundatii",
    description:
      "Raspunsuri despre sapaturi, evacuarea pamantului, fundatii si siguranta in santier.",
    items: [
      {
        question: "Evacuati pamantul rezultat?",
        answer:
          "Da, putem coordona evacuarea pamantului excedentar la depozite autorizate. Acest serviciu este ofertat separat, in functie de distanta, volum si numarul de curse necesare.",
        highlights: ["Depozite autorizate", "Transport calculat separat", "Logistica inclusa"],
      },
      {
        question: "Cat de adanc puteti excava pentru o fundatie?",
        answer:
          "Adancimea depinde de proiect, studiul geotehnic si conditiile reale din teren. Pentru sapaturi adanci stabilim solutii de sprijinire a malurilor si reguli de lucru care previn surparile.",
        highlights: ["Studiu geotehnic", "Sprijiniri de maluri", "Norme de siguranta"],
      },
      {
        question: "Lucrati si in spatii inguste?",
        answer:
          "Da. Pentru curti sau zone cu acces limitat folosim utilaje compacte, iar planul de executie este adaptat la latimea accesului si la protectia elementelor existente.",
        highlights: ["Miniutilaje", "Protectie pentru curte", "Plan adaptat accesului"],
      },
    ],
  },
  {
    id: "amenajari",
    index: "03",
    title: "Amenajari exterioare",
    description:
      "Etape si criterii pentru pregatirea terenului inainte de gradini, alei, drenaje sau spatii verzi.",
    items: [
      {
        question: "Ce include pregatirea terenului?",
        answer:
          "Pregatirea poate include decopertare, nivelare, compactare, drenaj si modelarea cotelor. Etapele exacte se aleg dupa evaluarea terenului si dupa obiectivul final al amenajarii.",
        highlights: ["Decopertare", "Nivelare", "Drenaj corect"],
      },
      {
        question: "Puteti prelua si partea de spatii verzi?",
        answer:
          "Da. Executam lucrari de amenajare peisagistica, plantari, gazon, irigatii si intretinere, in functie de proiect si de conditiile terenului.",
        highlights: ["Gazon si plantari", "Irigatii", "Intretinere"],
      },
      {
        question: "Cand este potrivit sa planific lucrarea?",
        answer:
          "Pentru amenajari exterioare, perioadele stabile meteo sunt cele mai eficiente. Recomandam planificarea din timp, mai ales cand lucrarea depinde de utilaje, transport si materiale.",
        highlights: ["Planificare meteo", "Utilaje disponibile", "Materiale pregatite"],
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <Navbar serviceGroups={serviceGroups} />
      <main className="bg-topo">
        <FaqHero />
        <ShortcutCards />
        <CategoryNav />
        <FrequentQuestions />
        <FaqCategories />
        <FaqCta />
      </main>
      <Footer />
    </div>
  );
}

function FaqHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6f3ed] py-24 md:py-32">
      <Image
        src="/hero.png"
        alt=""
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="-z-10 object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-limestone/80" />
      <SectionContainer className="text-center">
        <p className="text-xs font-bold uppercase text-amber">
          Centrul de informatii PACA
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-7xl">
          Intrebari frecvente
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone">
          Claritate pentru fiecare etapa a proiectului: evaluare, excavare,
          pregatirea terenului si amenajari exterioare.
        </p>
        <div className="mx-auto mt-10 flex max-w-2xl items-center border border-olive/15 bg-white p-2 shadow-xl shadow-carbon/5">
          <span className="px-3 text-xl text-olive/50" aria-hidden="true">
            ?
          </span>
          <input
            className="w-full bg-transparent px-2 py-3 text-base text-carbon outline-none placeholder:text-muted"
            placeholder="Cauta o intrebare..."
            type="search"
          />
        </div>
      </SectionContainer>
    </section>
  );
}

function ShortcutCards() {
  return (
    <SectionContainer className="-mt-12 grid gap-5 md:grid-cols-3">
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.title}
          href={shortcut.href}
          className="group relative min-h-48 overflow-hidden border border-olive/15 bg-carbon p-6 text-white shadow-xl shadow-carbon/10"
        >
          <Image
            src="/hero.png"
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover opacity-35 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/60 to-carbon/10" />
          <div className="relative flex h-full min-h-36 items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase text-amber">
                {shortcut.eyebrow}
              </p>
              <h2 className="mt-2 font-serif-display text-3xl font-medium">
                {shortcut.title}
              </h2>
            </div>
            <span className="text-2xl transition group-hover:translate-x-1" aria-hidden="true">
              -&gt;
            </span>
          </div>
        </Link>
      ))}
    </SectionContainer>
  );
}

function CategoryNav() {
  return (
    <div className="sticky top-[76px] z-30 mt-16 hidden border-y border-olive/10 bg-limestone/90 backdrop-blur lg:block">
      <SectionContainer className="flex h-16 items-center justify-center gap-10">
        <a className="text-xs font-bold uppercase text-olive hover:text-amber" href="#frecvente">
          Cele mai frecvente
        </a>
        {faqSections.map((section) => (
          <a
            key={section.id}
            className="text-xs font-bold uppercase text-stone transition hover:text-amber"
            href={`#${section.id}`}
          >
            {section.title}
          </a>
        ))}
      </SectionContainer>
    </div>
  );
}

function FrequentQuestions() {
  return (
    <section id="frecvente" className="py-20 md:py-28">
      <SectionContainer>
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase text-amber">Top cautari</p>
          <h2 className="mt-4 font-serif-display text-4xl font-semibold text-olive md:text-5xl">
            Cele mai frecvente intrebari
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <article className="relative overflow-hidden border border-olive/15 bg-white p-8 shadow-xl shadow-carbon/5 lg:col-span-8">
            <div className="absolute right-6 top-4 font-serif-display text-8xl text-olive/5">
              01
            </div>
            <h3 className="relative max-w-2xl font-serif-display text-3xl font-medium text-olive">
              {frequentQuestions[0]}
            </h3>
            <p className="relative mt-5 max-w-3xl text-base leading-7 text-stone">
              Durata depinde de adancime, tipul de sol si conditiile meteo.
              Solurile argiloase sau pietroase pot prelungi executia, iar
              sapaturile adanci pot necesita sprijiniri suplimentare.
            </p>
            <ul className="relative mt-6 grid gap-3 text-sm text-stone md:grid-cols-3">
              {["Tipul solului", "Adancimea sapaturii", "Vremea si accesul"].map(
                (item) => (
                  <li key={item} className="border-l-2 border-amber bg-limestone p-4">
                    {item}
                  </li>
                ),
              )}
            </ul>
          </article>
          <div className="grid gap-6 lg:col-span-4">
            {frequentQuestions.slice(1).map((question) => (
              <article
                key={question}
                className="border border-olive/15 bg-white p-6 shadow-xl shadow-carbon/5"
              >
                <h3 className="font-serif-display text-2xl font-medium text-olive">
                  {question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone">
                  Raspunsul exact se stabileste in functie de teren, acces si
                  obiectivul final al lucrarii. Pentru o oferta ferma,
                  recomandam evaluarea la locatie.
                </p>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function FaqCategories() {
  return (
    <SectionContainer className="space-y-24 pb-20 md:pb-28">
      {faqSections.map((section) => (
        <section key={section.id} id={section.id}>
          <div className="mb-10 flex items-start gap-5">
            <span className="font-serif-display text-6xl font-semibold leading-none text-olive/10 md:text-8xl">
              {section.index}
            </span>
            <div>
              <h2 className="border-b-2 border-amber pb-2 font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                {section.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-stone">
                {section.description}
              </p>
            </div>
          </div>
          <div className="grid gap-5">
            {section.items.map((item) => (
              <details
                key={item.question}
                className="group border border-olive/15 bg-white p-6 shadow-xl shadow-carbon/5 open:border-amber/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <h3 className="font-serif-display text-2xl font-medium text-olive transition group-open:text-amber">
                    {item.question}
                  </h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-olive/15 text-xl text-olive transition group-open:rotate-45 group-open:border-amber group-open:text-amber">
                    +
                  </span>
                </summary>
                <div className="mt-6 border-t border-olive/10 pt-6">
                  <p className="max-w-3xl text-base leading-7 text-stone">
                    {item.answer}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {item.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="border-l-2 border-amber bg-limestone px-4 py-3 text-sm font-semibold text-olive"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </SectionContainer>
  );
}

function FaqCta() {
  return (
    <section className="bg-olive py-16 text-white md:py-24">
      <SectionContainer className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase text-amber">
            Ai nevoie de ajutor tehnic?
          </p>
          <h2 className="mt-3 max-w-3xl font-serif-display text-4xl font-semibold md:text-5xl">
            Proiectul tau necesita o analiza detaliata?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
            Trimite-ne detaliile santierului, iar echipa PACA iti poate pregati
            urmatorul pas: evaluare, oferta si plan de executie.
          </p>
        </div>
        <Link
          href="/contact#form-section"
          className="inline-flex justify-center bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
        >
          Cere oferta
        </Link>
      </SectionContainer>
    </section>
  );
}
