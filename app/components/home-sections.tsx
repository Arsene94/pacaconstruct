import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { featuredServices } from "../data/services";
import { SectionContainer } from "./section-container";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden bg-carbon py-24 text-white md:min-h-[760px]">
      <Image
        src="/hero.png"
        alt="Utilaj de terasamente lucrand pe un teren in lumina calda"
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-carbon/60 to-transparent" />

      <SectionContainer className="relative z-10">
        <div className="max-w-3xl">
          <Eyebrow>AMENAJARI • TERASAMENTE • EXCAVARI</Eyebrow>
          <h1 className="mt-6 font-serif-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            De la teren brut la spatiu viu.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
            Pregatim terenul, executam lucrarile si construim cadrul potrivit
            pentru proiecte rezidentiale, comerciale si industriale.
            Tehnicitate in armonie cu natura.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="bg-amber px-8 py-4 text-center text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
            >
              Solicita o evaluare
            </Link>
            <Link
              href="#servicii"
              className="border border-white/30 px-8 py-4 text-center text-sm font-bold uppercase text-white transition hover:bg-white/10"
            >
              Descopera serviciile
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export function PrimaryServicePaths() {
  return (
    <section id="servicii" className="bg-limestone py-20 md:py-28 lg:py-32">
      <SectionContainer>
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
          href="#amenajare-spatii-verzi"
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
          href="#terasamente-excavari"
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
  const image = (
    <div
      className={`relative w-full overflow-hidden ${
        dark ? "bg-carbon p-4 md:p-7" : ""
      }`}
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
          loading="eager"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover ${dark ? "opacity-80 saturate-0" : ""}`}
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
            <p className="text-xs font-bold uppercase text-stone">
              Proiect
            </p>
            <p className="font-serif-display text-2xl text-olive">
              Peisagistica
            </p>
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
    <div className="grid items-center gap-12 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
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
  );
}

export function TransformationStatement() {
  return (
    <section className="relative overflow-hidden border-y border-olive/10 bg-[#f1efe9] py-20 md:py-28">
      <div className="bg-topo absolute right-0 top-0 h-full w-full opacity-60 md:w-1/2" />
      <SectionContainer className="relative z-10 text-center">
        <p className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border border-olive/15 text-2xl font-semibold text-amber">
          01
        </p>
        <h2 className="mx-auto max-w-4xl font-serif-display text-4xl font-semibold leading-[1.14] text-olive md:text-6xl">
          Un proiect bun incepe cu un teren pregatit corect.
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-stone">
          Fie ca vorbim de o gradina rezidentiala complexa sau de pregatirea
          terenului pentru o hala industriala, abordam fiecare lucrare cu
          aceeasi rigoare tehnica: evaluam, planificam si executam.
        </p>
      </SectionContainer>
    </section>
  );
}

export function ServicesMosaic() {
  return (
    <section id="proiecte" className="bg-limestone py-20 md:py-28 lg:py-32">
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
                    loading="eager"
                    sizes="(min-width: 768px) 66vw, 100vw"
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
                  href={`#${service.id}`}
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
    <section id="proces" className="bg-carbon py-20 text-white md:py-28">
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Eyebrow>PROCES TEHNIC</Eyebrow>
            <h2 className="mt-5 font-serif-display text-4xl font-semibold leading-[1.12] text-white md:text-5xl">
              O lucrare clara, din teren pana la predare.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
              Combinam disciplina de santier cu intelegerea proiectelor
              exterioare, ca fiecare interventie sa fie precisa si coerenta.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="text-sm font-bold text-amber">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export function ContactCta() {
  return (
    <section className="bg-amber py-14 text-carbon">
      <SectionContainer className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase">
            Estimare rapida
          </p>
          <h2 className="mt-2 font-serif-display text-3xl font-semibold md:text-4xl">
            Ai un teren de pregatit sau o lucrare de excavat?
          </h2>
        </div>
        <Link
          href="tel:+40700000000"
          className="border border-carbon/30 px-7 py-4 text-center text-sm font-bold uppercase transition hover:bg-carbon hover:text-white"
        >
          Suna pentru oferta
        </Link>
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
