import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { SectionContainer } from "../components/section-container";
import { serviceGroups } from "../data/services";

export const metadata: Metadata = {
  title: "Contact si evaluare proiect - PACA CONSTRUCT",
  description:
    "Trimite detaliile proiectului tau pentru evaluare tehnica, oferta si planificare lucrari de excavare, terasamente sau amenajari exterioare.",
};

const contactDetails = [
  {
    icon: "phone",
    label: "Telefon",
    title: "+40 700 000 000",
    subtitle: "Suna acum",
    href: "tel:+40700000000",
  },
  {
    icon: "mail",
    label: "Email",
    title: "office@pacaconstruct.ro",
    subtitle: "Trimite documente si fotografii",
    href: "mailto:office@pacaconstruct.ro",
  },
  {
    icon: "pin",
    label: "Locatie centrala",
    title: "Bucuresti, Romania",
    subtitle: "Servicii la nivel national",
  },
  {
    icon: "clock",
    label: "Program",
    title: "L-V: 08:00 - 18:00",
    subtitle: "S: 09:00 - 14:00",
  },
];

const intentCards = [
  {
    icon: "draft",
    title: "Evaluare lucrare",
    description:
      "Am un proiect clar si am nevoie de o estimare tehnica si de cost.",
    href: "#form-section",
  },
  {
    icon: "compass",
    title: "Nu stiu ce serviciu imi trebuie",
    description:
      "Am o idee sau o problema, dar nu sunt sigur de solutia tehnica.",
    href: "#contact-strip",
  },
  {
    icon: "machine",
    title: "Utilaj cu operator",
    description: "Solicitare specifica pentru inchiriere echipament greu.",
    href: "#form-section",
  },
];

const mobileIntentCards = [
  {
    icon: "landscape",
    title: "Arhitectura peisagistica",
    description: "Design, plantare, drenaj si sisteme de irigatii complexe.",
  },
  {
    icon: "engineering",
    title: "Excavatii si terasamente",
    description: "Nivelare, fundatii, decopertare si pregatire teren.",
  },
  {
    icon: "mixed",
    title: "Proiect mixt",
    description: "Solutie completa de la pamant pregatit la spatiu amenajat.",
  },
];

const timeline = [
  {
    index: "01",
    title: "Analiza preliminara",
    description:
      "Un inginer preia datele si evalueaza fezabilitatea tehnica pe baza locatiei si suprafetei.",
  },
  {
    index: "02",
    title: "Vizita in teren",
    description:
      "Ne deplasam pentru masuratori, verificarea accesului si analiza conditiilor reale de lucru.",
  },
  {
    index: "03",
    title: "Propunere tehnica si oferta",
    description:
      "Primesti un document cu pasii de executie, necesarul de utilaje si devizul estimativ.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <Navbar serviceGroups={serviceGroups} />
      <main className="pb-24 md:pb-0">
        <ContactHero />
        <IntentSelector />
        <ContactStrip />
        <ProjectForm />
        <ResponseTimeline />
      </main>
      <MobileActionBar />
      <Footer />
    </div>
  );
}

function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-topo">
      <div className="absolute inset-0 -z-10 bg-limestone/80" />

      <div className="relative flex min-h-[80vh] items-end overflow-hidden px-5 pb-10 pt-24 md:hidden">
        <Image
          src="/hero-mobile.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-limestone via-limestone/70 to-transparent" />
        <div className="relative max-w-xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
            <span className="h-px w-8 bg-amber" />
            Initiere proiect
          </p>
          <h1 className="font-serif-display text-4xl font-semibold leading-tight text-olive">
            Spune-ne ce vrei sa construiesti sau sa amenajezi.
          </h1>
          <p className="mt-5 max-w-[22rem] text-base leading-7 text-stone">
            De la excavatii de precizie la arhitectura peisagistica complexa,
            suntem pregatiti sa evaluam terenul tau.
          </p>
        </div>
      </div>

      <SectionContainer className="hidden py-20 md:block lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm font-medium text-stone"
            >
              <Link href="/" className="hover:text-amber">
                Acasa
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-olive">Contact</span>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">
              Contact si evaluare proiect
            </p>
            <h1 className="mt-5 max-w-3xl font-serif-display text-5xl font-semibold leading-[1.08] text-olive lg:text-6xl">
              Spune-ne ce vrei sa construiesti sau sa amenajezi.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone">
              Trimite-ne detaliile proiectului tau, fie ca este vorba de o
              amenajare peisagistica complexa sau de o excavatie de precizie.
              Echipa noastra tehnica va evalua informatiile si te va contacta
              cu solutii concrete.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#form-section"
                className="inline-flex items-center justify-center gap-2 bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943] hover:shadow-xl hover:shadow-carbon/10"
              >
                Solicita o evaluare
                <span aria-hidden="true">-&gt;</span>
              </Link>
              <a
                href="https://wa.me/40700000000"
                className="inline-flex items-center justify-center gap-2 border border-olive/25 px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:border-olive hover:bg-white"
              >
                <Icon name="chat" className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-olive/10 bg-white shadow-2xl shadow-carbon/10">
              <Image
                src="/hero.png"
                alt="Excavator lucrand pe un teren langa o gradina amenajata."
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/35 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 border-b border-l border-olive/30" />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function IntentSelector() {
  return (
    <section className="bg-[#f6f3ed] py-12 md:bg-limestone md:py-20">
      <SectionContainer>
        <div className="md:hidden">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Selecteaza domeniul de interes
          </h2>
          <div className="grid gap-4">
            {mobileIntentCards.map((card) => (
              <a
                key={card.title}
                href="#form-section"
                className="group flex items-start gap-4 border border-olive/10 bg-white p-5 shadow-sm shadow-carbon/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-carbon/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-limestone text-olive">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif-display text-xl font-medium leading-6 text-olive">
                    {card.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-stone">
                    {card.description}
                  </span>
                </span>
                <span
                  className="mt-1 text-xl text-muted transition group-hover:text-amber"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <h2 className="mb-10 font-serif-display text-4xl font-semibold text-olive">
            Cu ce te putem ajuta?
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {intentCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group relative min-h-64 overflow-hidden border border-olive/10 bg-white p-6 transition duration-300 hover:border-olive/30 hover:shadow-2xl hover:shadow-carbon/10"
              >
                <div className="mb-12 flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center bg-limestone text-olive transition group-hover:bg-amber group-hover:text-carbon">
                    <Icon name={card.icon} className="h-5 w-5" />
                  </span>
                  <span
                    className="text-2xl text-muted transition group-hover:text-amber"
                    aria-hidden="true"
                  >
                    -&gt;
                  </span>
                </div>
                <h3 className="font-serif-display text-2xl font-medium text-olive">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-stone">
                  {card.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function ContactStrip() {
  return (
    <section
      id="contact-strip"
      className="border-y border-olive/10 bg-[#e4e2dc] py-10 md:py-12"
    >
      <SectionContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {contactDetails.map((detail) => {
          const content = (
            <>
              <Icon name={detail.icon} className="mt-1 h-6 w-6 shrink-0 text-olive" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {detail.label}
                </span>
                <span className="mt-1 block font-mono text-base text-carbon">
                  {detail.title}
                </span>
                <span className="mt-1 block text-sm text-stone">
                  {detail.subtitle}
                </span>
              </span>
            </>
          );

          return detail.href ? (
            <a
              key={detail.label}
              href={detail.href}
              className="flex items-start gap-4 transition hover:text-amber"
            >
              {content}
            </a>
          ) : (
            <div key={detail.label} className="flex items-start gap-4">
              {content}
            </div>
          );
        })}
      </SectionContainer>
    </section>
  );
}

function ProjectForm() {
  return (
    <section id="form-section" className="bg-limestone py-16 md:py-24">
      <SectionContainer className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber">
            Date proiect
          </p>
          <h2 className="mt-4 font-serif-display text-4xl font-semibold leading-tight text-olive md:text-5xl">
            Completeaza informatiile esentiale.
          </h2>
          <p className="mt-5 text-base leading-7 text-stone">
            Fotografiile, dimensiunile aproximative si locatia ne ajuta sa
            revenim cu intrebari precise si cu un prim scenariu tehnic.
          </p>
        </div>

        <form className="border border-olive/10 bg-white p-5 shadow-xl shadow-carbon/5 md:p-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-olive">
                Pasul 1 din 3
              </span>
              <span className="font-mono text-xs uppercase text-muted">
                Date proiect
              </span>
            </div>
            <div className="h-1 overflow-hidden bg-limestone">
              <div className="h-full w-1/3 bg-amber" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              id="name"
              label="Nume si prenume"
              placeholder="Ex: Andrei Popescu"
            />
            <Field
              id="phone"
              label="Telefon"
              placeholder="+40 ..."
              type="tel"
            />
            <Field
              id="location"
              label="Locatie (oras / judet)"
              placeholder="Ex: Bucuresti, Ilfov"
            />
            <Field
              id="surface"
              label="Suprafata aproximativa (mp)"
              placeholder="Ex: 500"
              type="number"
            />
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-stone">
              Descriere pe scurt
            </span>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Ce doresti sa realizezi?"
              className="min-h-32 w-full resize-y border-0 border-b border-olive/20 bg-transparent px-0 py-3 text-base text-carbon outline-none transition placeholder:text-muted focus:border-amber"
            />
          </label>

          <div className="mt-8 border border-dashed border-olive/25 bg-limestone p-6 text-center">
            <Icon name="camera" className="mx-auto h-8 w-8 text-muted" />
            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-olive">
              Adauga fotografii
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone">
              Ajuta-ne sa intelegem starea actuala a terenului, accesul si
              diferentele de nivel.
            </p>
            <label className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-olive/15 bg-white px-5 py-3 text-xs font-bold uppercase text-olive transition hover:border-amber md:w-auto">
              <Icon name="upload" className="h-4 w-4" />
              Fa o poza / incarca
              <input className="sr-only" type="file" accept="image/*" multiple />
            </label>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-amber px-6 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943] md:w-auto"
          >
            Urmatorul pas
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>
      </SectionContainer>
    </section>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-stone">
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full border-0 border-b border-olive/20 bg-transparent px-0 text-base text-carbon outline-none transition placeholder:text-muted focus:border-amber"
      />
    </label>
  );
}

function ResponseTimeline() {
  return (
    <section className="bg-[#e4e2dc] py-16 md:py-24">
      <SectionContainer className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber">
            Dupa solicitare
          </p>
          <h2 className="mt-4 font-serif-display text-4xl font-semibold leading-tight text-olive md:text-5xl">
            Ce se intampla dupa ce trimiti solicitarea?
          </h2>
        </div>
        <div className="space-y-10 border-l border-olive/20 pl-6">
          {timeline.map((step, index) => (
            <article key={step.index} className="relative">
              <span
                className={`absolute -left-[31px] top-2 h-3 w-3 ${
                  index === 0 ? "bg-amber" : "border border-olive/20 bg-limestone"
                }`}
              />
              <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-olive">
                {step.index}. {step.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone md:text-base">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-olive/15 bg-limestone/95 px-4 py-3 backdrop-blur md:hidden">
      <a
        href="tel:+40700000000"
        className="flex flex-1 items-center justify-center gap-1 border border-olive/10 bg-white py-3 text-xs font-bold uppercase text-olive"
      >
        <Icon name="phone" className="h-4 w-4" />
        Suna
      </a>
      <a
        href="https://wa.me/40700000000"
        className="flex flex-1 items-center justify-center gap-1 border border-olive/10 bg-white py-3 text-xs font-bold uppercase text-olive"
      >
        <Icon name="chat" className="h-4 w-4" />
        WhatsApp
      </a>
      <a
        href="#form-section"
        className="flex flex-[1.35] items-center justify-center bg-amber py-3 text-xs font-bold uppercase text-carbon"
      >
        Cere oferta
      </a>
    </div>
  );
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.6 2.63a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.24-1.25a2 2 0 0 1 2.11-.45c.85.28 1.73.48 2.63.6A2 2 0 0 1 22 16.92Z" />
    ),
    mail: (
      <>
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    chat: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    draft: (
      <>
        <path d="M4 20h16" />
        <path d="M6 16 16.5 5.5a2.1 2.1 0 0 1 3 3L9 19l-4 1Z" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m16 8-2.2 5.8L8 16l2.2-5.8Z" />
      </>
    ),
    machine: (
      <>
        <path d="M3 18h18" />
        <path d="M6 18V9l6-4v13" />
        <path d="M12 9h5l3 9" />
      </>
    ),
    landscape: (
      <>
        <path d="m3 19 6-8 4 5 3-4 5 7Z" />
        <path d="M3 19h18" />
      </>
    ),
    engineering: (
      <>
        <path d="M14 6h5v5" />
        <path d="M10 18H5v-5" />
        <path d="m19 6-6 6M5 18l6-6" />
      </>
    ),
    mixed: (
      <>
        <path d="M12 3v18" />
        <path d="M5 8h14" />
        <path d="M7 16h10" />
      </>
    ),
    camera: (
      <>
        <path d="M14.5 4 16 7h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l1.5-3Z" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M20 16v4H4v-4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name] ?? paths.draft}
    </svg>
  );
}
