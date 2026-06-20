import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Footer } from "../../components/footer";
import { SiteNavbar } from "../../components/site-navbar";
import { SectionContainer } from "../../components/section-container";
import { getBlogPost, getBlogPosts } from "../../data/blog";
import { getServiceGroups } from "../../data/services";
import { JsonLd } from "@/app/components/json-ld";
import { blogPostingSchema, breadcrumbSchema } from "@/app/lib/schema";

// Pagini pre-randate (ISR). Datele vin din cache-ul Upstash; revalidare la 10
// minute, coerent cu profilul de cache al blogului.
export const revalidate = 600;

/** Pre-randează slug-urile articolelor publicate. Tolerant la DB indisponibil
 *  la build (paginile se randează atunci on-demand prin ISR). */
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getBlogPost(slug);

  // Slug inexistent → 404. Ruta de detaliu nu are `loading.tsx` (skeletonul
  // listei stă în route group-ul `(list)`), deci nu se face streaming și
  // `notFound()` setează status HTTP 404 real, nu soft-404 (200).
  // Vezi docs Next 16: loading#status-codes.
  if (!post) {
    notFound();
  }

  const canonical = `/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${post.title} | PACA CONSTRUCT`,
      description: post.excerpt,
      url: canonical,
      publishedTime: post.publishedAtISO || undefined,
      modifiedTime: post.updatedAtISO || undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | PACA CONSTRUCT`,
      description: post.excerpt,
    },
  };
}

// Stiluri pentru conținutul Markdown, în paleta olive/amber a site-ului.
const PROSE_CLASS = [
  "max-w-none text-lg leading-8 text-stone",
  "[&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:font-serif-display [&>h2]:text-3xl [&>h2]:font-medium [&>h2]:leading-tight [&>h2]:text-olive md:[&>h2]:text-4xl",
  "[&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-olive",
  "[&>p]:mt-5",
  "[&>ul]:mt-5 [&>ul]:grid [&>ul]:gap-3 [&>ul]:border [&>ul]:border-olive/15 [&>ul]:bg-white/70 [&>ul]:p-6",
  "[&>ul>li]:list-disc [&>ul>li]:ml-5",
  "[&>ol]:mt-5 [&>ol]:grid [&>ol]:gap-3 [&>ol>li]:list-decimal [&>ol>li]:ml-5",
  "[&_a]:text-amber [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-olive",
  "[&_strong]:font-bold [&_strong]:text-olive",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-amber [&_blockquote]:bg-white [&_blockquote]:p-6 [&_blockquote]:font-serif-display [&_blockquote]:text-2xl [&_blockquote]:leading-9 [&_blockquote]:text-olive",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-base",
  "[&_th]:border-b-2 [&_th]:border-olive/25 [&_th]:px-4 [&_th]:py-3 [&_th]:text-olive",
  "[&_td]:border-b [&_td]:border-olive/15 [&_td]:px-4 [&_td]:py-3",
].join(" ");

export default async function BlogArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const [post, serviceGroups] = await Promise.all([
    getBlogPost(slug),
    getServiceGroups(),
  ]);

  if (!post) {
    notFound();
  }

  // Linking intern: primele servicii din meniu, ca legături contextuale din
  // articol către paginile de serviciu (ancore descriptive).
  const relatedServices = serviceGroups.flatMap((group) => group.items).slice(0, 5);

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd data={blogPostingSchema(post)} id="article" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ])}
        id="breadcrumb"
      />
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="bg-topo pb-20 pt-12 md:pb-28">
        <article>
          <SectionContainer>
            <div className="flex flex-col justify-between gap-6 border-b border-olive/15 pb-6 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                {post.category ? (
                  <>
                    <span className="font-bold uppercase text-amber">
                      {post.category}
                    </span>
                    <span className="h-4 w-px bg-olive/20" />
                  </>
                ) : null}
                {post.readTime ? (
                  <>
                    <span>{post.readTime}</span>
                    <span className="h-4 w-px bg-olive/20" />
                  </>
                ) : null}
                <span>
                  Publicat:{" "}
                  <time dateTime={post.publishedAtISO || undefined}>
                    {post.publishedAt}
                  </time>
                </span>
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
              {post.excerpt ? (
                <p className="mt-6 max-w-3xl border-l-2 border-amber pl-6 text-lg leading-8 text-stone">
                  {post.excerpt}
                </p>
              ) : null}
              {post.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-olive/20 bg-white/60 px-3 py-1 text-xs font-bold uppercase text-olive"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {post.imageSrc ? (
              <figure className="relative mb-16 aspect-video overflow-hidden border border-olive/15 md:aspect-[21/9]">
                <Image
                  src={post.imageSrc}
                  alt={post.imageAlt || post.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-olive/70 to-transparent" />
              </figure>
            ) : null}

            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                {post.body ? (
                  <div className={PROSE_CLASS}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-lg leading-8 text-stone">{post.excerpt}</p>
                )}

                {post.sources.length > 0 ? (
                  <section className="mt-14 border-t border-olive/15 pt-8">
                    <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
                      Surse
                    </h2>
                    <ul className="grid gap-2">
                      {post.sources.map((source) => (
                        <li key={source.url} className="flex gap-3 text-base leading-7">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-amber" />
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer nofollow"
                            className="text-olive underline underline-offset-2 hover:text-amber"
                          >
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>

              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-32 space-y-6">
                  <div className="border border-olive/15 bg-white/60 p-6">
                    <h2 className="font-serif-display text-2xl font-medium leading-tight text-olive">
                      Ai un proiect in plan?
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone">
                      Evaluam terenul si lucrarea pentru o solutie tehnica si un deviz
                      corect.
                    </p>
                    <a
                      href="/contact#form-section"
                      className="mt-5 inline-flex text-xs font-bold uppercase text-olive hover:text-amber"
                    >
                      Cere evaluare -&gt;
                    </a>
                  </div>

                  {relatedServices.length > 0 ? (
                    <nav
                      aria-label="Servicii relevante"
                      className="border border-olive/15 bg-white/60 p-6"
                    >
                      <h2 className="font-serif-display text-2xl font-medium leading-tight text-olive">
                        Servicii relevante
                      </h2>
                      <ul className="mt-4 grid gap-2">
                        {relatedServices.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="text-sm leading-6 text-stone underline underline-offset-2 transition hover:text-amber"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ) : null}
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
