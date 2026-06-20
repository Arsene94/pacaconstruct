import Image from "next/image";
import Link from "next/link";
import type { ServicePage } from "../data/services";
import { serviceFaq } from "../lib/service-faq";
import { serviceAreas } from "../data/service-areas";
import { siteConfig } from "../lib/site-config";
import { SectionContainer } from "./section-container";

type ServicePageTemplateProps = {
  service: ServicePage;
};

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  return (
    <main className="bg-topo flex-grow bg-limestone">
      <ServiceHero service={service} />
      <ServiceProcess service={service} />
      <ServiceSpecs service={service} />
      <ServiceFaqSection service={service} />
      <ServiceAreas service={service} />
      <ServiceCta service={service} />
    </main>
  );
}

function ServiceHero({ service }: ServicePageTemplateProps) {
  const hasImage = Boolean(service.imageSrc);

  return (
    <section
      className={`relative mx-auto mb-20 flex min-h-[560px] w-full max-w-7xl items-center justify-center overflow-hidden px-5 text-center md:mb-28 md:min-h-[680px] md:px-16 ${
        hasImage ? "bg-limestone" : "bg-[#fbf9f3]"
      } service-organic-mask`}
    >
      {service.imageSrc ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={service.imageSrc}
            alt={service.imageAlt ?? service.title}
            fill
            preload
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-limestone/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-limestone via-limestone/25 to-limestone/35" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-topo opacity-80" />
      )}

      <div className="relative z-10 mx-auto max-w-3xl pt-16">
        <p className="mb-4 text-xs font-bold uppercase text-[#7c9150]">
          {service.eyebrow}
        </p>
        <h1 className="font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-7xl">
          {service.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone md:text-xl">
          {service.description}
        </p>
        <Link
          href="/contact#form-section"
          className="mt-8 inline-flex bg-amber px-8 py-4 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
        >
          Programeaza o consultanta
        </Link>
      </div>
    </section>
  );
}

function ServiceProcess({ service }: ServicePageTemplateProps) {
  return (
    <section className="mb-20 md:mb-28">
      <SectionContainer>
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 md:flex md:flex-col md:justify-center">
            <h2 className="font-serif-display text-4xl font-semibold leading-[1.12] text-olive md:text-5xl">
              {service.summaryTitle}
            </h2>
            <p className="mt-6 text-base leading-7 text-stone md:text-lg">
              {service.summary}
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="grid gap-5 md:grid-cols-2">
              {service.processes.map((process, index) => (
                <article
                  key={process.title}
                  className="group relative overflow-hidden border border-olive/10 bg-white p-6 transition hover:shadow-xl hover:shadow-carbon/5"
                >
                  <div className="absolute right-4 top-2 font-serif-display text-6xl font-semibold text-[#58683c]/10 transition group-hover:text-[#58683c]/20">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#7c9150]/30 text-sm font-bold text-[#7c9150]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-serif-display text-2xl font-medium text-olive">
                    {process.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-stone">
                    {process.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function ServiceSpecs({ service }: ServicePageTemplateProps) {
  return (
    <section className="mb-20 md:mb-28">
      <SectionContainer>
        <h2 className="border-b border-olive/15 pb-4 font-serif-display text-3xl font-medium text-olive md:text-4xl">
          Standarde de executie
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-olive/15">
                <th className="py-4 text-xs font-bold uppercase text-stone">
                  Specificatie
                </th>
                <th className="py-4 text-xs font-bold uppercase text-stone">
                  Parametri PACA
                </th>
                <th className="py-4 text-xs font-bold uppercase text-stone">
                  Impact vizual / functional
                </th>
              </tr>
            </thead>
            <tbody>
              {service.specs.map((spec) => (
                <tr
                  key={spec.label}
                  className="border-b border-olive/10 transition hover:bg-white/70"
                >
                  <td className="py-5 pr-6 text-base font-semibold text-olive">
                    <span className="mr-3 inline-block h-2 w-2 bg-amber" />
                    {spec.label}
                  </td>
                  <td className="py-5 pr-6 text-sm font-medium text-stone">
                    {spec.value}
                  </td>
                  <td className="py-5 text-base leading-7 text-stone">
                    {spec.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>
    </section>
  );
}

function ServiceFaqSection({ service }: ServicePageTemplateProps) {
  // Întrebări editate din admin; dacă lipsesc, folosim setul generat automat.
  const faq = service.faqs.length > 0 ? service.faqs : serviceFaq(service.title);
  return (
    <section className="mb-20 md:mb-28">
      <SectionContainer>
        <h2 className="border-b border-olive/15 pb-4 font-serif-display text-3xl font-medium text-olive md:text-4xl">
          Întrebări frecvente despre {service.title.toLowerCase()}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group border border-olive/15 bg-white p-6 open:border-amber/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="font-serif-display text-xl font-medium text-olive transition group-open:text-amber">
                  {item.question}
                </h3>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-olive/15 text-lg text-olive transition group-open:rotate-45 group-open:border-amber group-open:text-amber">
                  +
                </span>
              </summary>
              <p className="mt-4 border-t border-olive/10 pt-4 text-base leading-7 text-stone">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

function ServiceAreas({ service }: ServicePageTemplateProps) {
  return (
    <section className="mb-20 md:mb-28">
      <SectionContainer>
        <h2 className="font-serif-display text-3xl font-medium text-olive md:text-4xl">
          Executăm {service.title.toLowerCase()} în zona ta
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone">
          Acoperim {siteConfig.address.addressLocality} și județele din jur.
          Vezi detalii pentru fiecare zonă:
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {serviceAreas.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/zona/${area.slug}`}
                className="inline-flex border border-olive/20 bg-white px-4 py-2 text-sm font-semibold text-olive transition hover:border-amber hover:text-amber"
              >
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </section>
  );
}

function ServiceCta({ service }: ServicePageTemplateProps) {
  return (
    <section className="bg-amber py-14 text-carbon">
      <SectionContainer className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase">Urmatorul pas</p>
          <h2 className="mt-2 font-serif-display text-3xl font-semibold md:text-4xl">
            Ai nevoie de {service.title.toLowerCase()}?
          </h2>
        </div>
        <Link
          href={`tel:${siteConfig.phone}`}
          className="border border-carbon/30 px-7 py-4 text-center text-sm font-bold uppercase transition hover:bg-carbon hover:text-white"
        >
          Suna pentru oferta
        </Link>
      </SectionContainer>
    </section>
  );
}
