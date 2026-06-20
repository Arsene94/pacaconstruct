import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconBackhoe,
  IconCamera,
  IconClock,
  IconCompass,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconMountain,
  IconPencil,
  IconPhone,
  IconStack2,
  IconTool,
  IconUpload,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { Footer } from "../components/footer";
import { SiteNavbar } from "../components/site-navbar";
import { SectionContainer } from "../components/section-container";
import { getServiceGroups } from "../data/services";
import { getSiteSettings } from "../data/settings";
import {
  getPrimaryPhone,
  getWhatsAppPhones,
  telLink,
  waLink,
  type ResolvedSettings,
} from "@/app/lib/settings-shared";
import { ContactForm } from "./contact-form";

type ContactDetail = {
  icon: string;
  label: string;
  title: string;
  subtitle: string;
  href?: string;
};

function buildContactDetails(settings: ResolvedSettings): ContactDetail[] {
  const phone = getPrimaryPhone(settings);
  const email = settings.contact.emailOffice || settings.contact.emailPrimary;
  const a = settings.contact.address;
  const hourLabels = settings.hours
    .map((h) => h.label.trim())
    .filter((label) => label.length > 0);

  const details: ContactDetail[] = [];
  if (phone) {
    details.push({
      icon: "phone",
      label: "Telefon",
      title: phone.display,
      subtitle: "Suna acum",
      href: telLink(phone),
    });
  }
  details.push({
    icon: "mail",
    label: "Email",
    title: email,
    subtitle: "Trimite documente si fotografii",
    href: `mailto:${email}`,
  });
  details.push({
    icon: "pin",
    label: "Locatie centrala",
    title: `${a.addressLocality}, Romania`,
    subtitle: "Servicii la nivel national",
  });
  if (hourLabels.length) {
    details.push({
      icon: "clock",
      label: "Program",
      title: hourLabels[0],
      subtitle: hourLabels[1] ?? "",
    });
  }
  return details;
}

// Conținut din DB, randare dinamică; datele vin din cache-ul Upstash.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact și evaluare proiect",
  description:
    "Trimite detaliile proiectului tău pentru evaluare tehnică, ofertă și planificare lucrări de excavare, terasamente sau amenajări exterioare.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact și evaluare proiect | PACA CONSTRUCT",
    description:
      "Trimite detaliile proiectului tău pentru evaluare tehnică, ofertă și planificare lucrări.",
    url: "/contact",
  },
};

const intentCards = [
  {
    icon: "draft",
    title: "Evaluare lucrare",
    description: "Am un proiect clar si am nevoie de o estimare tehnica si de cost.",
    href: "#form-section",
  },
  {
    icon: "compass",
    title: "Nu stiu ce serviciu imi trebuie",
    description: "Am o idee sau o problema, dar nu sunt sigur de solutia tehnica.",
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

export default async function ContactPage() {
  const [serviceGroups, settings] = await Promise.all([
    getServiceGroups(),
    getSiteSettings(),
  ]);
  const phone = getPrimaryPhone(settings);
  const whatsappPhone = getWhatsAppPhones(settings)[0] ?? null;
  const phoneHref = phone ? telLink(phone) : undefined;
  const whatsappHref = whatsappPhone ? waLink(whatsappPhone) : undefined;
  const details = buildContactDetails(settings);

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="pb-24 md:pb-0">
        <ContactHero whatsappHref={whatsappHref} />
        <IntentSelector />
        <ContactStrip details={details} />
        <ProjectForm />
        <ResponseTimeline />
      </main>
      <MobileActionBar phoneHref={phoneHref} whatsappHref={whatsappHref} />
      <Footer />
    </div>
  );
}

function ContactHero({ whatsappHref }: { whatsappHref?: string }) {
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
          {/* Variantă mobilă a titlului: <p> ca să rămână un singur <h1> per
              pagina (cel din hero-ul desktop). Stilurile sunt identice. */}
          <p className="font-serif-display text-4xl font-semibold leading-tight text-olive">
            Spune-ne ce vrei sa construiesti sau sa amenajezi.
          </p>
          <p className="mt-5 max-w-[22rem] text-base leading-7 text-stone">
            De la excavatii de precizie la arhitectura peisagistica complexa, suntem
            pregatiti sa evaluam terenul tau.
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
              Trimite-ne detaliile proiectului tau, fie ca este vorba de o amenajare
              peisagistica complexa sau de o excavatie de precizie. Echipa noastra tehnica
              va evalua informatiile si te va contacta cu solutii concrete.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#form-section"
                className="inline-flex items-center justify-center gap-2 bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943] hover:shadow-xl hover:shadow-carbon/10"
              >
                Solicita o evaluare
                <span aria-hidden="true">-&gt;</span>
              </Link>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-olive/25 px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:border-olive hover:bg-white"
                >
                  <Icon name="chat" className="h-4 w-4" />
                  WhatsApp
                </a>
              ) : null}
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
                <p className="mt-3 text-base leading-7 text-stone">{card.description}</p>
              </a>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function ContactStrip({ details }: { details: ContactDetail[] }) {
  return (
    <section
      id="contact-strip"
      className="border-y border-olive/10 bg-[#e4e2dc] py-10 md:py-12"
    >
      <SectionContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {details.map((detail) => {
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
                <span className="mt-1 block text-sm text-stone">{detail.subtitle}</span>
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
            Fotografiile, dimensiunile aproximative si locatia ne ajuta sa revenim cu
            intrebari precise si cu un prim scenariu tehnic.
          </p>
        </div>

        <ContactForm />
      </SectionContainer>
    </section>
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

function MobileActionBar({
  phoneHref,
  whatsappHref,
}: {
  phoneHref?: string;
  whatsappHref?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-olive/15 bg-limestone/95 px-4 py-3 backdrop-blur md:hidden">
      {phoneHref ? (
        <a
          href={phoneHref}
          className="flex flex-1 items-center justify-center gap-1 border border-olive/10 bg-white py-3 text-xs font-bold uppercase text-olive"
        >
          <Icon name="phone" className="h-4 w-4" />
          Suna
        </a>
      ) : null}
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1 border border-olive/10 bg-white py-3 text-xs font-bold uppercase text-olive"
        >
          <Icon name="chat" className="h-4 w-4" />
          WhatsApp
        </a>
      ) : null}
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
  const icons: Record<string, TablerIcon> = {
    phone: IconPhone,
    mail: IconMail,
    pin: IconMapPin,
    clock: IconClock,
    chat: IconMessageCircle,
    draft: IconPencil,
    compass: IconCompass,
    machine: IconBackhoe,
    landscape: IconMountain,
    engineering: IconTool,
    mixed: IconStack2,
    camera: IconCamera,
    upload: IconUpload,
  };

  const TablerComp = icons[name] ?? icons.draft;
  return <TablerComp aria-hidden="true" className={className} />;
}
