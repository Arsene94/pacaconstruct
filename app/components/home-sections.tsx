import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getFeaturedServices } from "../data/services";
import { getSiteSettings } from "../data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";
import { SectionContainer } from "./section-container";

export function HeroSection() {
  return (
    <section className="relative order-1 flex min-h-[600px] items-end overflow-hidden bg-carbon py-12 text-white md:order-none md:min-h-[760px] md:items-center md:py-24">
      {/* Hero LCP art-directed (desktop + mobil): `priority` => eager + fetch
          high + preload. Ambele imagini sunt oricum încărcate eager, iar `sizes`
          cu `0px` ține varianta din afara viewport-ului la cel mai mic candidat,
          deci preload-ul nu adaugă fetch real. `priority` e și fix-ul pe care îl
          cere detectorul LCP din Next (verifică `priority`, nu `loading`). */}
      <Image
        src="/hero.png"
        alt="Utilaj de terasamente lucrand pe un teren in lumina calda"
        fill
        priority
        sizes="(min-width: 768px) 100vw, 0px"
        className="hidden object-cover md:block"
      />
      <Image
        src="/hero-mobile.png"
        alt="Utilaj de terasamente lucrand pe un teren in lumina calda"
        fill
        priority
        sizes="(max-width: 767px) 100vw, 0px"
        className="object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-carbon/65 md:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-carbon via-carbon/85 to-carbon/20 md:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-carbon/60 to-transparent md:block" />

      <SectionContainer className="relative z-10">
        <div className="mx-auto flex max-w-[320px] flex-col items-center text-center md:mx-0 md:max-w-3xl md:items-start md:text-left">
          <div className="hidden md:block">
            <Eyebrow>AMENAJARI • TERASAMENTE • EXCAVARI</Eyebrow>
          </div>
          <h1 className="font-serif-display text-4xl font-semibold leading-[1.12] text-white md:mt-6 md:text-7xl">
            De la teren brut la spatiu viu
          </h1>
          <p className="mt-6 max-w-[300px] text-base leading-6 text-sage md:mt-7 md:max-w-2xl md:text-xl md:leading-8 md:text-white/80">
            Pregatim terenul, executam lucrarile si construim cadrul potrivit pentru
            proiecte rezidentiale, comerciale si industriale. Tehnicitate in armonie cu
            natura.
          </p>
          <div className="mt-10 flex w-full flex-col gap-4 md:w-auto md:flex-row">
            <Link
              href="#proiecte"
              className="bg-amber px-8 py-4 text-center text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
            >
              Exploreaza proiectele
            </Link>
            <Link
              href="#servicii"
              className="border border-white/30 px-8 py-4 text-center text-sm font-bold uppercase text-white transition hover:bg-white/10"
            >
              Serviciile noastre
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export function PrimaryServicePaths() {
  return (
    <section
      id="servicii"
      className="order-3 bg-limestone py-16 md:order-none md:py-28 lg:py-32"
    >
      <SectionContainer className="flex flex-col gap-12 md:block">
        <ServicePath
          index="01"
          label="Estetica organica"
          title={
            <>
              Amenajare
              <br />
              spatii verzi
            </>
          }
          description="Proiectare si executie peisagistica pentru gradini, curti si spatii comerciale. Sisteme de irigatii, gazon, plantari specializate, iazuri, piscine si intretinere adaptata climei locale."
          href="/servicii/amenajare-spatii-verzi"
          imageAlign="left"
        />

        <ServicePath
          index="02"
          label="Infrastructura grea"
          title={
            <>
              Terasamente
              <br />
              si excavari
            </>
          }
          description="Lucrari de infrastructura, sapaturi fundatii, nivelari, compactari, drenaje, bransamente si drumuri de acces. Flota proprie de utilaje pentru executie rapida si precisa."
          href="/servicii/terasamente-excavari"
          imageAlign="right"
          dark
        />
      </SectionContainer>
    </section>
  );
}

type ServicePathProps = {
  index: string;
  label: string;
  title: ReactNode;
  description: string;
  href: string;
  imageAlign: "left" | "right";
  dark?: boolean;
};

function ServicePath({
  index,
  label,
  title,
  description,
  href,
  imageAlign,
  dark = false,
}: ServicePathProps) {
  const mobileImage = (
    <div className="relative h-[280px] w-full overflow-hidden bg-olive/10">
      <Image
        src="/hero.png"
        alt=""
        fill
        loading="eager"
        sizes="(max-width: 767px) 350px, 50vw"
        className={`object-cover transition duration-700 ${
          dark ? "opacity-80" : "opacity-95"
        }`}
      />
      <div className="absolute inset-0 border border-carbon/10" />
    </div>
  );

  const mobileCard = (
    <article className="overflow-hidden border border-olive/15 bg-[#f6f3ed] md:hidden">
      {mobileImage}
      <div className="flex flex-col p-8">
        <p className="mb-3 text-sm font-medium text-amber">SRV-{index}</p>
        <h3 className="font-serif-display text-[28px] font-medium leading-9 text-olive">
          {title}
        </h3>
        <p className="mt-4 line-clamp-3 text-base leading-6 text-stone">{description}</p>
        <Link
          href={href}
          className="mt-8 inline-flex self-start border-b border-olive pb-1 text-xs font-bold uppercase text-olive transition hover:border-amber hover:text-amber"
        >
          Detalii serviciu
          <span aria-hidden="true" className="ml-2">
            -&gt;
          </span>
        </Link>
      </div>
    </article>
  );

  const image = (
    <div
      className={`relative w-full overflow-hidden ${dark ? "bg-carbon p-4 md:p-7" : ""}`}
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden ${
          dark ? "aspect-square" : ""
        }`}
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover ${dark ? "opacity-80" : ""}`}
        />
        {dark ? (
          <>
            <div className="absolute inset-4 border border-white/15" />
            <div className="absolute bottom-7 right-7 flex w-24 flex-col gap-1">
              <span className="h-1 bg-amber/80" />
              <span className="h-2 bg-amber/60" />
              <span className="h-4 bg-amber/40" />
              <span className="h-8 bg-amber/20" />
            </div>
          </>
        ) : (
          <div className="absolute -bottom-0 left-0 bg-limestone/95 p-5">
            <p className="text-xs font-bold uppercase text-stone">Proiect</p>
            <p className="font-serif-display text-2xl text-olive">Peisagistica</p>
          </div>
        )}
      </div>
    </div>
  );

  const content = (
    <div className={imageAlign === "right" ? "lg:text-right" : ""}>
      <p className="mb-6 text-xs font-bold uppercase text-amber">
        {index} / {label}
      </p>
      <h2 className="font-serif-display text-4xl font-semibold leading-[1.08] text-olive sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p
        className={`mt-7 max-w-xl text-lg leading-8 text-stone ${
          imageAlign === "right" ? "lg:ml-auto" : ""
        }`}
      >
        {description}
      </p>
      <Link
        href={href}
        className={`mt-9 inline-flex items-center gap-4 border-b border-olive/20 pb-2 text-sm font-bold uppercase text-olive transition hover:text-amber ${
          imageAlign === "right" ? "lg:justify-end" : ""
        }`}
      >
        Exploreaza divizia
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  );

  return (
    <div className="py-0 md:grid md:items-center md:gap-12 md:py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      {mobileCard}
      <div className="hidden md:contents">
        {imageAlign === "left" ? (
          <>
            {image}
            {content}
          </>
        ) : (
          <>
            {content}
            {image}
          </>
        )}
      </div>
    </div>
  );
}

export function TransformationStatement() {
  return (
    <section className="relative order-2 overflow-hidden border-y border-olive/10 bg-[#fbf9f3] py-20 text-center md:order-none md:bg-[#f1efe9] md:py-28">
      <div className="bg-topo absolute right-0 top-0 h-full w-full opacity-60 md:w-1/2" />
      <SectionContainer className="relative z-10 text-center">
        <p className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-transparent text-3xl font-semibold text-amber md:mb-8 md:h-16 md:w-16 md:border-olive/15 md:text-2xl">
          01
        </p>
        <h2 className="mx-auto max-w-[400px] font-serif-display text-3xl font-medium leading-tight text-olive md:max-w-4xl md:text-6xl md:font-semibold md:leading-[1.14]">
          Un proiect bun incepe cu un teren pregatit corect.
        </h2>
        <div className="mx-auto mt-8 h-px w-12 bg-olive/20 md:hidden" />
        <p className="mx-auto mt-8 hidden max-w-3xl text-lg leading-8 text-stone md:block">
          Fie ca vorbim de o gradina rezidentiala complexa sau de pregatirea terenului
          pentru o hala industriala, abordam fiecare lucrare cu aceeasi rigoare tehnica:
          evaluam, planificam si executam.
        </p>
      </SectionContainer>
    </section>
  );
}

export async function ServicesMosaic() {
  const featuredServices = await getFeaturedServices();

  return (
    <section
      id="proiecte"
      className="order-4 bg-limestone py-16 md:order-none md:py-28 lg:py-32"
    >
      <SectionContainer>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>EXPERTIZA COMPLETA</Eyebrow>
            <h2 className="mt-5 font-serif-display text-4xl font-semibold text-carbon md:text-5xl">
              Serviciile noastre
            </h2>
          </div>
          <Link
            href="#servicii"
            className="w-max border border-olive/25 px-6 py-3 text-sm font-bold uppercase text-olive transition hover:bg-sage"
          >
            Toate serviciile
          </Link>
        </div>

        <div className="grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-5 md:grid-cols-3">
          {featuredServices.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className={`group relative overflow-hidden border border-olive/15 bg-white p-6 transition hover:border-amber/60 hover:shadow-xl hover:shadow-carbon/5 ${
                service.featured ? "md:col-span-2 md:row-span-2 md:p-8" : ""
              } ${service.wide ? "md:col-span-2" : ""}`}
            >
              {service.featured ? (
                <>
                  <Image
                    src="/hero.png"
                    alt=""
                    fill
                    sizes="(min-width: 768px) 66vw, 350px"
                    className="object-cover opacity-10 transition duration-500 group-hover:opacity-20"
                  />
                  <div className="absolute inset-0 bg-white/70" />
                </>
              ) : null}
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center border border-olive/15 text-sm font-bold text-amber">
                    {service.icon}
                  </span>
                  <h3
                    className={`font-semibold text-carbon ${
                      service.featured
                        ? "font-serif-display text-4xl md:text-5xl"
                        : "text-xl"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-stone md:text-base">
                    {service.description}
                  </p>
                </div>
                <Link
                  href={service.href}
                  className="text-sm font-bold uppercase text-olive transition group-hover:text-amber"
                >
                  Detalii -&gt;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    {
      title: "Evaluare teren",
      text: "Analizam accesul, diferentele de nivel, natura solului si cerintele tehnice.",
    },
    {
      title: "Plan de executie",
      text: "Stabilim etapele, utilajele potrivite, durata lucrarii si riscurile din santier.",
    },
    {
      title: "Executie controlata",
      text: "Lucram cu operatori calificati si verificam permanent cotele si finisajele.",
    },
    {
      title: "Predare lucrare",
      text: "Lasam terenul pregatit pentru etapa urmatoare: constructie, plantare sau infrastructura.",
    },
  ];

  return (
    <section
      id="proces"
      className="order-5 bg-[#f0eee8] py-16 text-carbon md:order-none md:bg-carbon md:py-28 md:text-white"
    >
      <SectionContainer>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="hidden md:block">
              <Eyebrow>PROCES TEHNIC</Eyebrow>
            </div>
            <h2 className="border-b border-olive/20 pb-4 font-serif-display text-3xl font-medium leading-[1.12] text-olive md:mt-5 md:border-0 md:pb-0 md:text-5xl md:font-semibold md:text-white">
              O lucrare clara, din teren pana la predare.
            </h2>
            <p className="mt-6 hidden max-w-lg text-lg leading-8 text-white/70 md:block">
              Combinam disciplina de santier cu intelegerea proiectelor exterioare, ca
              fiecare interventie sa fie precisa si coerenta.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-2 md:gap-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="grid grid-cols-[32px_1fr_24px] gap-4 border-b border-olive/15 py-6 md:block md:border md:border-white/10 md:bg-white/[0.03] md:p-6"
              >
                <span className="mt-1 text-sm font-bold text-amber md:mt-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-olive md:mt-8 md:text-xl md:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone md:mt-3 md:text-white/65">
                    {step.text}
                  </p>
                </div>
                <span className="mt-1 text-olive/60 md:hidden" aria-hidden="true">
                  -&gt;
                </span>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export async function ContactCta() {
  const settings = await getSiteSettings();
  const phone = getPrimaryPhone(settings);

  return (
    <section className="order-6 bg-limestone py-16 text-carbon md:order-none md:bg-amber md:py-14">
      <SectionContainer>
        <div className="relative overflow-hidden border-l-4 border-amber bg-olive p-8 text-white shadow-xl shadow-carbon/10 md:flex md:items-center md:justify-between md:gap-6 md:border-0 md:bg-transparent md:p-0 md:text-carbon md:shadow-none">
          <div className="absolute -right-8 -top-8 h-32 w-32 bg-amber/10 blur-2xl md:hidden" />
          <p className="text-4xl text-amber md:hidden" aria-hidden="true">
            13
          </p>
          <div className="relative">
            <p className="mt-4 text-xs font-bold uppercase md:mt-0">Estimare rapida</p>
            <h2 className="mt-2 font-serif-display text-3xl font-semibold md:text-4xl">
              Ai un teren de pregatit sau o lucrare de excavat?
            </h2>
          </div>
          {phone ? (
            <Link
              href={telLink(phone)}
              className="relative mt-8 inline-flex w-full justify-center bg-white px-7 py-4 text-center text-sm font-bold uppercase text-olive transition hover:bg-amber hover:text-carbon md:mt-0 md:w-auto md:border md:border-carbon/30 md:bg-transparent md:text-carbon md:hover:bg-carbon md:hover:text-white"
            >
              Suna pentru oferta
            </Link>
          ) : null}
        </div>
      </SectionContainer>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-4 text-sm font-bold uppercase text-amber">
      <span className="h-px w-8 bg-amber" />
      {children}
    </p>
  );
}
