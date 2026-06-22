import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getFeaturedServices } from "../data/services";
import { SectionContainer } from "./section-container";

// Placeholder blur (12x7 JPEG) derivat din hero.jpg — îmbunătățește percepția
// la încărcare fără să schimbe LCP-ul. Vezi docs next/image > placeholder.
const HERO_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAHAAwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAP/xAAfEAABAwMFAAAAAAAAAAAAAAABAAIDBBMhBRIUMYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AIy61UyAOuYI72jCnz5H5vO8aERFC1//2Q==";

export function HeroSection() {
  // Hero LCP: o singură imagine `next/image` cu `preload` (înlocuitorul lui
  // `priority`, deprecat în Next 16). `preload` injectează automat
  // `<link rel="preload" as="image" imagesrcset imagesizes>` în `<head>`, deci
  // browserul descoperă imaginea LCP imediat după HTML — nu după parsarea CSS.
  // Renunțăm la `<picture>` art-directat: sursele desktop/mobil erau fișiere
  // identice (același md5), deci o singură sursă responsive (sizes=100vw) e
  // suficientă și e calea recomandată pentru LCP. Vezi docs next/image > preload.
  const heroAlt = "Utilaj de terasamente lucrand pe un teren in lumina calda";

  return (
    <section className="relative order-1 flex min-h-[600px] items-end overflow-hidden bg-carbon py-12 text-white md:order-none md:min-h-[760px] md:items-center md:py-24">
      <Image
        src="/hero.jpg"
        alt={heroAlt}
        fill
        preload
        quality={50}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={HERO_BLUR_DATA_URL}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-carbon/65 md:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-carbon via-carbon/85 to-carbon/20 md:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-carbon/60 to-transparent md:block" />

      <SectionContainer className="relative z-10">
        <div className="mx-auto flex max-w-[320px] flex-col items-center text-center md:mx-0 md:max-w-3xl md:items-start md:text-left">
          <div className="hidden md:block">
            <Eyebrow onDark>AMENAJĂRI · TERASAMENTE · EXCAVĂRI</Eyebrow>
          </div>
          <h1 className="font-serif-display text-4xl font-semibold leading-[1.12] text-white md:mt-6 md:text-7xl">
            De la teren brut la spațiu viu
          </h1>
          <p className="mt-6 max-w-[300px] text-base leading-6 text-sage md:mt-7 md:max-w-2xl md:text-xl md:leading-8 md:text-white/80">
            Pregătim terenul, săpăm, nivelăm și construim cadrul pe care stă tot restul:
            casă, hală, grădină sau drum de acces. O singură echipă, cu utilaje proprii,
            de la prima cupă de pământ până la predare.
          </p>
          <div className="mt-10 flex w-full flex-col gap-4 md:w-auto md:flex-row">
            <Link
              href="/contact#form-section"
              className="bg-amber px-8 py-4 text-center text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
            >
              Cere o evaluare
            </Link>
            <Link
              href="#servicii"
              className="border border-white/30 px-8 py-4 text-center text-sm font-bold uppercase text-white transition hover:bg-white/10"
            >
              Vezi serviciile
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
          label="Estetică naturală"
          title={
            <>
              Amenajare
              <br />
              spații verzi
            </>
          }
          description="Transformăm o curte denivelată sau plină de moloz într-un spațiu pe care îl folosești. Pregătim solul, montăm irigații, punem gazon și plantăm, săpăm iazuri și piscine, apoi întreținem ce am construit. Partea grea și partea fină, de la aceeași echipă."
          href="/servicii/amenajare-spatii-verzi"
          linkLabel="Vezi ce facem"
          imageAlign="left"
        />

        <ServicePath
          index="02"
          label="Infrastructură de teren"
          title={
            <>
              Terasamente
              <br />
              și excavări
            </>
          }
          description="Săpăm fundații la cota din proiect, nivelăm și compactăm umplutura în straturi, facem drenaje, branșamente și drumuri de acces. Scoatem pământul în exces din curte, nu îl lăsăm grămadă. Aici se decide dacă tot ce construiești deasupra stă drept."
          href="/servicii/terasamente-excavari"
          linkLabel="Vezi diviziile"
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
  linkLabel: string;
  imageAlign: "left" | "right";
  dark?: boolean;
};

function ServicePath({
  index,
  label,
  title,
  description,
  href,
  linkLabel,
  imageAlign,
  dark = false,
}: ServicePathProps) {
  const mobileImage = (
    <div className="relative h-[280px] w-full overflow-hidden bg-olive/10">
      <Image
        src="/hero.png"
        alt=""
        fill
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
        <p className="mb-3 text-sm font-medium text-amber-strong">SRV-{index}</p>
        <h3 className="font-serif-display text-[28px] font-medium leading-9 text-olive">
          {title}
        </h3>
        <p className="mt-4 line-clamp-3 text-base leading-6 text-stone">{description}</p>
        <Link
          href={href}
          className="mt-8 inline-flex self-start border-b border-olive pb-1 text-xs font-bold uppercase text-olive transition hover:border-amber-strong hover:text-amber-strong"
        >
          Vezi serviciul
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
      <p className="mb-6 text-xs font-bold uppercase text-amber-strong">
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
        className={`mt-9 inline-flex items-center gap-4 border-b border-olive/20 pb-2 text-sm font-bold uppercase text-olive transition hover:text-amber-strong ${
          imageAlign === "right" ? "lg:justify-end" : ""
        }`}
      >
        {linkLabel}
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
        <p className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-transparent text-3xl font-semibold text-amber-strong md:mb-8 md:h-16 md:w-16 md:border-olive/15 md:text-2xl">
          01
        </p>
        <h2 className="mx-auto max-w-[400px] font-serif-display text-3xl font-medium leading-tight text-olive md:max-w-4xl md:text-6xl md:font-semibold md:leading-[1.14]">
          O lucrare bună începe sub pământ, nu deasupra.
        </h2>
        <div className="mx-auto mt-8 h-px w-12 bg-olive/20 md:hidden" />
        <p className="mx-auto mt-8 hidden max-w-3xl text-lg leading-8 text-stone md:block">
          Fie că e o grădină sau pregătirea unei hale, abordăm la fel: vedem terenul,
          planificăm etapele, executăm controlat. Ce e ascuns acum (drenaj, compactare,
          cote) se vede în fisuri și băltiri peste doi ani, dacă e făcut prost.
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
            <Eyebrow>CE FACEM</Eyebrow>
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
                service.featured ? "md:col-span-2 md:row-span-1 md:p-8" : ""
              } ${service.wide ? "md:col-span-2" : ""}`}
            >
              {service.featured ? (
                <>
                  <Image
                    src="/hero.png"
                    alt=""
                    fill
                    quality={50}
                    sizes="(min-width: 768px) 66vw, 350px"
                    className="object-cover opacity-10 transition duration-500 group-hover:opacity-20"
                  />
                  <div className="absolute inset-0 bg-white/70" />
                </>
              ) : null}
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center border border-olive/15 text-sm font-bold text-amber-strong">
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
                  className="text-sm font-bold uppercase text-olive transition group-hover:text-amber-strong"
                >
                  Vezi serviciul -&gt;
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
      title: "Evaluare pe teren",
      text: "Venim, ne uităm la acces, la diferențele de nivel și la natura solului. Îți spunem ce se poate și ce ne îngrijorează.",
    },
    {
      title: "Plan și deviz",
      text: "Stabilim etapele, utilajele potrivite, durata și riscurile. Primești un cost legat de ce e pe teren, nu o cifră aruncată.",
    },
    {
      title: "Execuție controlată",
      text: "Lucrăm cu operatori calificați și verificăm cotele și finisajele pe parcurs, nu la final.",
    },
    {
      title: "Predare",
      text: "Lăsăm terenul gata pentru pasul următor: construcție, plantare sau infrastructură. Curat, nu cu munți de pământ în urmă.",
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
              <Eyebrow onDark>CUM LUCRĂM</Eyebrow>
            </div>
            <h2 className="border-b border-olive/20 pb-4 font-serif-display text-3xl font-medium leading-[1.12] text-olive md:mt-5 md:border-0 md:pb-0 md:text-5xl md:font-semibold md:text-white">
              O lucrare clară, de la teren până la predare.
            </h2>
            <p className="mt-6 hidden max-w-lg text-lg leading-8 text-white/70 md:block">
              Combinăm disciplina de șantier cu înțelegerea proiectelor exterioare, ca
              fiecare intervenție să fie precisă și coerentă.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-2 md:gap-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="grid grid-cols-[32px_1fr_24px] gap-4 border-b border-olive/15 py-6 md:block md:border md:border-white/10 md:bg-white/[0.03] md:p-6"
              >
                <span className="mt-1 text-sm font-bold text-amber-strong md:mt-0 md:text-amber">
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

export function ContactCta() {
  return (
    <section className="order-6 bg-limestone py-16 text-carbon md:order-none md:bg-amber md:py-14">
      <SectionContainer>
        <div className="relative overflow-hidden border-l-4 border-amber bg-olive p-8 text-white shadow-xl shadow-carbon/10 md:flex md:items-center md:justify-between md:gap-6 md:border-0 md:bg-transparent md:p-0 md:text-carbon md:shadow-none">
          <div className="absolute -right-8 -top-8 h-32 w-32 bg-amber/10 blur-2xl md:hidden" />
          <div className="relative max-w-2xl">
            <p className="mt-4 text-xs font-bold uppercase md:mt-0">Estimare rapidă</p>
            <h2 className="mt-2 font-serif-display text-3xl font-semibold md:text-4xl">
              Ai un teren de pregătit sau o lucrare de săpat?
            </h2>
            <p className="mt-3 text-base leading-7 text-white/80 md:text-carbon/80">
              Spune-ne ce vrei să faci. Ne uităm și îți zicem cinstit cum stă treaba.
            </p>
          </div>
          <Link
            href="/contact#form-section"
            className="relative mt-8 inline-flex w-full justify-center bg-white px-7 py-4 text-center text-sm font-bold uppercase text-olive transition hover:bg-amber hover:text-carbon md:mt-0 md:w-auto md:border md:border-carbon/30 md:bg-transparent md:text-carbon md:hover:bg-carbon md:hover:text-white"
          >
            Cere o evaluare
          </Link>
        </div>
      </SectionContainer>
    </section>
  );
}

function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-4 text-sm font-bold uppercase ${
        onDark ? "text-amber" : "text-amber-strong"
      }`}
    >
      <span className={`h-px w-8 ${onDark ? "bg-amber" : "bg-amber-strong"}`} />
      {children}
    </p>
  );
}
