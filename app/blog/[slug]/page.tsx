import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { SectionContainer } from "../../components/section-container";
import { blogPosts, getBlogPost } from "../../data/blog";
import { serviceGroups } from "../../data/services";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | PACA CONSTRUCT`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <Navbar serviceGroups={serviceGroups} />
      <main className="bg-topo pb-20 pt-12 md:pb-28">
        <article>
          <SectionContainer>
            <div className="flex flex-col justify-between gap-6 border-b border-olive/15 pb-6 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="font-bold uppercase text-amber">{post.category}</span>
                <span className="h-4 w-px bg-olive/20" />
                <span>{post.readTime}</span>
                <span className="h-4 w-px bg-olive/20" />
                <span>Publicat: {post.publishedAt}</span>
              </div>
              <Link
                href="/blog"
                className="self-start border border-olive/20 px-4 py-2 text-xs font-bold uppercase text-olive transition hover:bg-white md:self-auto"
              >
                Inapoi la blog
              </Link>
            </div>

            <div className="mb-12 mt-8 max-w-5xl">
              <h1 className="font-serif-display text-4xl font-semibold leading-tight text-olive md:text-7xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl border-l-2 border-amber pl-6 text-lg leading-8 text-stone">
                Fie ca pregatesti terenul pentru o constructie, o amenajare
                peisagistica sau un drum de acces, executia corecta este baza
                invizibila care previne problemele scumpe.
              </p>
            </div>

            <figure className="relative mb-16 aspect-video overflow-hidden border border-olive/15 md:aspect-[21/9]">
              <Image
                src={post.imageSrc}
                alt={post.imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/70 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-sm font-medium text-white/85">
                Proiect de pregatire teren, Ilfov.
              </figcaption>
            </figure>

            <div className="grid gap-10 lg:grid-cols-12">
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-32">
                  <p className="mb-4 text-xs font-bold uppercase text-muted">
                    In acest articol
                  </p>
                  <nav className="grid border-l border-olive/15">
                    {[
                      ["#importanta", "Importanta nivelarii"],
                      ["#etape", "Etapele procesului"],
                      ["#verificare", "Lista de verificare"],
                      ["#utilaje", "Alegerea utilajelor"],
                      ["#costuri", "Factori de cost"],
                    ].map(([href, label]) => (
                      <a
                        key={href}
                        href={href}
                        className="border-l-[3px] border-transparent py-2 pl-4 text-sm font-medium text-stone transition hover:border-amber hover:bg-white/60 hover:text-olive"
                      >
                        {label}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-12 border border-olive/15 bg-white/60 p-6">
                    <h2 className="font-serif-display text-2xl font-medium leading-tight text-olive">
                      Ai un teren de pregatit?
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone">
                      Evaluam topografia si structura solului pentru o solutie
                      tehnica corecta.
                    </p>
                    <a
                      href="/contact#form-section"
                      className="mt-5 inline-flex text-xs font-bold uppercase text-olive hover:text-amber"
                    >
                      Cere evaluare -&gt;
                    </a>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-7">
                <div className="space-y-12 text-lg leading-8 text-stone">
                  <section id="importanta">
                    <p>
                      Nivelarea terenului este procesul tehnic prin care pantele
                      naturale si cotele de relief sunt ajustate pentru planeitate,
                      drenaj si capacitate portanta. Nu inseamna doar o suprafata
                      dreapta, ci controlul maselor de pamant si pregatirea bazei
                      pentru etapele urmatoare.
                    </p>
                    <div className="mt-10 border-l-4 border-amber bg-white p-8">
                      <p className="mb-3 text-xs font-bold uppercase text-olive">
                        Pe scurt
                      </p>
                      <p className="font-serif-display text-2xl leading-9 text-olive">
                        Un teren aparent plat poate necesita decopertare,
                        compactare si corectii de panta pentru ca apa sa fie
                        condusa controlat, nu spre fundatie sau alei.
                      </p>
                    </div>
                  </section>

                  <section id="etape">
                    <h2 className="mb-6 font-serif-display text-4xl font-medium leading-tight text-olive">
                      Etapele tehnice ale nivelarii
                    </h2>
                    <p>
                      Un proces profesional urmeaza o ordine stricta, dictata de
                      ridicarea topografica, studiul geotehnic si obiectivul
                      final al terenului.
                    </p>
                    <div className="mt-8 grid gap-6">
                      {[
                        [
                          "01",
                          "Ridicarea topografica si trasarea",
                          "Masurarea cotelor existente fata de cotele proiectate si stabilirea zonelor de sapatura sau umplutura.",
                        ],
                        [
                          "02",
                          "Decopertarea stratului vegetal",
                          "Indepartarea solului organic fara capacitate portanta si depozitarea lui pentru reamenajari ulterioare.",
                        ],
                        [
                          "03",
                          "Sapatura si umplutura",
                          "Mutarea pamantului din zonele inalte in cele joase, in straturi controlate.",
                        ],
                        [
                          "04",
                          "Compactarea in straturi",
                          "Stabilizarea suprafetelor pentru a preveni tasarile si deformarile in timp.",
                        ],
                      ].map(([index, title, text]) => (
                        <div key={index} className="flex gap-4">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber/15 text-sm font-bold text-amber">
                            {index}
                          </span>
                          <div>
                            <h3 className="text-xl font-bold text-olive">{title}</h3>
                            <p className="mt-2 text-base leading-7">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="border border-red-700/20 bg-red-50 p-6">
                    <h2 className="mb-2 text-sm font-bold uppercase text-red-700">
                      Avertisment tehnic: retele subterane
                    </h2>
                    <p className="text-base leading-7">
                      Inainte de orice excavatie, trebuie verificate traseele de
                      utilitati. O conducta sau un cablu afectat poate produce
                      riscuri majore si costuri greu de controlat.
                    </p>
                  </div>

                  <section id="verificare">
                    <h2 className="mb-6 font-serif-display text-4xl font-medium leading-tight text-olive">
                      Lista de verificare pre-santier
                    </h2>
                    <ul className="grid gap-4 border border-olive/15 bg-white/70 p-6">
                      {[
                        "Studiu topografic actualizat pentru calculul volumelor.",
                        "Studiu geotehnic pentru tipul solului si nivelul apei freatice.",
                        "Avize utilitati pentru traseele subterane existente.",
                        "Plan de evacuare sau relocare pentru pamantul excedentar.",
                      ].map((item) => (
                        <li key={item} className="flex gap-3 text-base leading-7">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-amber" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section id="utilaje">
                    <h2 className="mb-6 font-serif-display text-4xl font-medium leading-tight text-olive">
                      Alegerea utilajelor: excavator vs buldoexcavator
                    </h2>
                    <p>
                      Utilajul corect optimizeaza timpul si bugetul. Alegerea se
                      face in functie de volum, acces, sol si tipul lucrarii.
                    </p>
                    <div className="mt-8 overflow-x-auto">
                      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b-2 border-olive/25 text-xs uppercase text-olive">
                            <th className="px-4 py-4">Criteriu</th>
                            <th className="bg-white/70 px-4 py-4">Excavator senilat</th>
                            <th className="px-4 py-4">Buldoexcavator</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Volum dislocat / ora", "Mare", "Mediu"],
                            ["Mobilitate pe drumuri", "Necesita transport", "Autopropulsat"],
                            ["Amprenta pe sol", "Buna pe teren dificil", "Mai potrivit pentru acces rapid"],
                            ["Aplicatie principala", "Sapaturi de volum", "Lucrari mixte"],
                          ].map(([criterion, excavator, backhoe]) => (
                            <tr key={criterion} className="border-b border-olive/15">
                              <td className="px-4 py-4 text-stone">{criterion}</td>
                              <td className="bg-white/70 px-4 py-4 text-olive">
                                {excavator}
                              </td>
                              <td className="px-4 py-4 text-olive">{backhoe}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section id="costuri">
                    <h2 className="mb-6 font-serif-display text-4xl font-medium leading-tight text-olive">
                      Factori care influenteaza costul nivelarii
                    </h2>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {[
                        "Tipul solului si rezistenta la sapatura.",
                        "Volumul de pamant dislocat sau adus.",
                        "Accesibilitatea pentru utilaje si basculante.",
                        "Distanta pana la zona de depozitare.",
                        "Prezenta apei freatice sau a zonelor instabile.",
                        "Gradul de compactare cerut prin proiect.",
                      ].map((item) => (
                        <li key={item} className="flex gap-3 text-base leading-7">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-amber" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <aside className="hidden lg:col-span-2 lg:block">
                <div className="grid gap-6">
                  {[
                    ["Decopertare strat vegetal", "Pregatirea bazei prin inlaturarea materiei organice."],
                    ["Sisteme de drenaj", "Captarea si redirectionarea apelor pluviale sau freatice."],
                  ].map(([title, text]) => (
                    <div key={title} className="border border-olive/15 bg-white/60 p-4">
                      <h2 className="font-bold leading-5 text-olive">{title}</h2>
                      <p className="mt-3 text-sm leading-6 text-stone">{text}</p>
                      <Link
                        href="/servicii/terasamente-excavari"
                        className="mt-4 inline-flex text-xs font-bold uppercase text-amber"
                      >
                        Vezi serviciul -&gt;
                      </Link>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </SectionContainer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
