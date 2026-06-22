import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { SiteNavbar } from "@/app/components/site-navbar";
import { SectionContainer } from "@/app/components/section-container";
import {
  getBlogPosts,
  getFeaturedBlogPost,
  searchBlogPosts,
  type BlogPost,
} from "@/app/data/blog";
import { getServiceGroups } from "@/app/data/services";
import { JsonLd } from "@/app/components/json-ld";
import { SearchTracker } from "@/app/components/marketing/search-tracker";
import { breadcrumbSchema, itemListSchema } from "@/app/lib/schema";

// Date din DB + searchParams (?q): randare dinamică; datele de listă vin din
// cache-ul Upstash (`unstable_cache`), căutarea din Upstash Search.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description:
    "Ghiduri practice despre excavări, nivelare teren și amenajări peisagistice.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog | PACA CONSTRUCT",
    description:
      "Ghiduri practice despre excavări, nivelare teren și amenajări peisagistice.",
    url: "/blog",
  },
};

const categories = [
  "Toate articolele",
  "Construiești o casă",
  "Probleme cu apa",
  "Amenajări exterioare",
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [serviceGroups, blogPosts, featured] = await Promise.all([
    getServiceGroups(),
    query ? Promise.resolve<BlogPost[]>([]) : getBlogPosts(),
    query ? Promise.resolve(null) : getFeaturedBlogPost(),
  ]);

  const searchResults = query ? await searchBlogPosts(query) : [];

  const featuredBlogPost = featured ?? blogPosts[0];
  const compactPosts = blogPosts.filter((post) => post.slug !== featuredBlogPost?.slug);

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
        id="breadcrumb"
      />
      {!query && blogPosts.length > 0 ? (
        <JsonLd
          data={itemListSchema(
            "Articole blog PACA CONSTRUCT",
            blogPosts.map((post) => ({
              name: post.title,
              path: `/blog/${post.slug}`,
            })),
          )}
          id="itemlist"
        />
      ) : null}
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="overflow-hidden">
        <BlogHero query={query} />

        {query ? (
          <>
            <SearchTracker term={query} />
            <SearchResults query={query} results={searchResults} />
          </>
        ) : (
          <>
            {featuredBlogPost ? (
              <section className="bg-[#fbf9f3] py-12">
                <SectionContainer className="grid items-center gap-10 lg:grid-cols-12">
                  <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-10">
                    <p className="mb-5 inline-flex border border-olive/15 bg-white px-3 py-1 text-xs font-bold uppercase text-olive">
                      Articol recomandat
                    </p>
                    <Link href={`/blog/${featuredBlogPost.slug}`}>
                      <h2 className="font-serif-display text-4xl font-semibold leading-tight text-olive transition hover:text-amber-strong md:text-5xl">
                        {featuredBlogPost.title}
                      </h2>
                    </Link>
                    <p className="mt-6 text-lg leading-8 text-stone">
                      {featuredBlogPost.excerpt}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
                      <span className="font-bold uppercase text-amber-strong">
                        {featuredBlogPost.category}
                      </span>
                      <span aria-hidden="true">•</span>
                      <span>{featuredBlogPost.readTime} citire</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredBlogPost.slug}`}
                    className="relative order-1 h-[360px] overflow-hidden border border-olive/15 bg-olive/10 lg:order-2 lg:col-span-7 lg:h-[600px]"
                  >
                    <Image
                      src={featuredBlogPost.imageSrc}
                      alt={featuredBlogPost.imageAlt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover transition duration-700 hover:scale-105"
                    />
                  </Link>
                </SectionContainer>
              </section>
            ) : null}

            <section className="bg-olive py-20 text-white md:py-28">
              <SectionContainer>
                <div className="mb-12 flex flex-col gap-4 border-b border-white/15 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="font-serif-display text-4xl font-semibold md:text-5xl">
                      Excavații și fundații
                    </h2>
                    <p className="mt-3 text-lg text-white/70">
                      Bază tehnică pentru orice proiect durabil.
                    </p>
                  </div>
                  <Link
                    href="/servicii/terasamente-excavari"
                    className="text-xs font-bold uppercase text-amber hover:text-white"
                  >
                    Servicii de excavații -&gt;
                  </Link>
                </div>

                <div className="grid gap-10 lg:grid-cols-12">
                  <ArticleCard
                    post={compactPosts[1]}
                    className="lg:col-span-8"
                    dark
                    large
                  />
                  <div className="grid gap-8 border-white/15 lg:col-span-4 lg:border-l lg:pl-8">
                    {compactPosts.slice(2, 4).map((post) => (
                      <TextArticleCard key={post.slug} post={post} dark />
                    ))}
                  </div>
                </div>
              </SectionContainer>
            </section>

            <section className="bg-[#f6f3ed] py-20 md:py-28">
              <SectionContainer>
                <p className="mb-8 text-xs font-bold uppercase text-amber-strong">
                  Studiu de caz
                </p>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div className="grid h-[400px] grid-cols-2 overflow-hidden border border-olive/15">
                    <div className="relative border-r border-olive/15">
                      <Image
                        src="/hero.png"
                        alt="Șantier înainte de nivelare"
                        fill
                        sizes="50vw"
                        className="object-cover grayscale"
                      />
                      <span className="absolute bottom-4 left-4 bg-limestone px-3 py-1 text-xs font-bold uppercase">
                        Înainte
                      </span>
                    </div>
                    <div className="relative">
                      <Image
                        src="/hero.png"
                        alt="Teren pregătit după nivelare"
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                      <span className="absolute bottom-4 right-4 bg-limestone px-3 py-1 text-xs font-bold uppercase">
                        După
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-serif-display text-4xl font-semibold leading-tight text-olive md:text-5xl">
                      Stabilizarea unui versant argilos în regim de urgență
                    </h2>
                    <div className="my-8 grid grid-cols-2 gap-6 border-y border-olive/15 py-6">
                      <Metric label="Volum excavat" value="1,200 m3" />
                      <Metric label="Durată execuție" value="14 zile" />
                    </div>
                    <p className="text-base leading-7 text-stone">
                      Un proiect complex de consolidare cu terasare în trepte și sisteme
                      de drenaj de adâncime pentru prevenirea alunecărilor de teren într-o
                      zonă rezidențială.
                    </p>
                  </div>
                </div>
              </SectionContainer>
            </section>

            <section className="bg-[#fbf9f3] py-20 md:py-28">
              <SectionContainer>
                <div className="mb-12 flex flex-col gap-4 border-b border-olive/15 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="font-serif-display text-4xl font-semibold text-olive md:text-5xl">
                      Amenajări exterioare
                    </h2>
                    <p className="mt-3 text-lg text-stone">
                      Design organic și soluții verzi pentru spațiul tău.
                    </p>
                  </div>
                  <Link
                    href="/servicii/amenajare-spatii-verzi"
                    className="text-xs font-bold uppercase text-olive hover:text-amber-strong"
                  >
                    Servicii peisagistică -&gt;
                  </Link>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  {compactPosts.slice(0, 3).map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              </SectionContainer>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function BlogHero({ query }: { query: string }) {
  return (
    <section className="bg-[#fbf9f3] py-16 md:py-24">
      <SectionContainer>
        <div className="max-w-4xl">
          <nav className="flex gap-2 text-sm font-medium text-muted">
            <Link href="/" className="hover:text-olive">
              Acasă
            </Link>
            <span>/</span>
            <span className="font-bold text-olive">Blog</span>
          </nav>
          <h1 className="mt-6 font-serif-display text-4xl font-semibold leading-tight text-olive md:text-6xl">
            Tot ce trebuie să știi înainte să începi lucrarea
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone">
            Ghiduri practice despre teren: excavări, nivelare, drenaj și amenajări.
            Lucruri pe care e bine să le știi înainte să începi.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-b border-olive/15 pb-6 md:flex-row md:items-end">
          <form action="/blog" className="relative block w-full md:w-96">
            <label className="sr-only" htmlFor="blog-search">
              Caută articole
            </label>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted">/</span>
            <input
              id="blog-search"
              name="q"
              defaultValue={query}
              className="w-full border-0 border-b border-olive/20 bg-transparent py-3 pl-7 pr-4 text-base outline-none transition placeholder:text-muted focus:border-olive"
              placeholder="Caută articole..."
              type="search"
            />
          </form>
          <nav className="flex gap-6 overflow-x-auto whitespace-nowrap pb-2 text-xs font-bold uppercase text-stone">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={index === 0 ? "/blog" : `/blog?q=${encodeURIComponent(category)}`}
                className={`border-b-2 pb-2 transition ${
                  (index === 0 && !query) || category === query
                    ? "border-olive text-olive"
                    : "border-transparent hover:border-amber hover:text-olive"
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </SectionContainer>
    </section>
  );
}

function SearchResults({ query, results }: { query: string; results: BlogPost[] }) {
  return (
    <section className="bg-[#fbf9f3] py-16 md:py-24">
      <SectionContainer>
        <p className="mb-2 text-xs font-bold uppercase text-amber-strong">
          Rezultate căutare
        </p>
        <h2 className="font-serif-display text-3xl font-semibold text-olive md:text-4xl">
          {results.length} {results.length === 1 ? "articol găsit" : "articole găsite"}{" "}
          pentru &bdquo;{query}&rdquo;
        </h2>

        {results.length === 0 ? (
          <p className="mt-8 text-lg text-stone">
            Nu am găsit articole pentru căutarea ta.{" "}
            <Link href="/blog" className="font-bold text-olive hover:text-amber-strong">
              Vezi toate articolele
            </Link>
            .
          </p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {results.map((post) => (
              <ArticleCard
                key={post.slug}
                post={{ ...post, imageSrc: post.imageSrc || "/hero.png" }}
              />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
}

type ArticleCardProps = {
  post: BlogPost;
  className?: string;
  dark?: boolean;
  large?: boolean;
};

function ArticleCard({
  post,
  className = "",
  dark = false,
  large = false,
}: ArticleCardProps) {
  return (
    <article className={`group ${className}`}>
      <Link
        href={`/blog/${post.slug}`}
        className={`relative mb-6 block overflow-hidden border ${
          dark ? "border-white/20 bg-white/10" : "border-olive/15 bg-olive/10"
        } ${large ? "h-96" : "h-64"}`}
      >
        <Image
          src={post.imageSrc}
          alt={post.imageAlt}
          fill
          sizes={
            large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"
          }
          className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
      </Link>
      <p
        className={`mb-3 text-xs font-bold uppercase ${
          dark ? "text-amber" : "text-amber-strong"
        }`}
      >
        {post.category}
      </p>
      <Link href={`/blog/${post.slug}`}>
        <h3
          className={`font-serif-display text-3xl font-medium leading-tight transition ${
            dark
              ? "text-white group-hover:text-amber"
              : "text-olive group-hover:text-amber-strong"
          }`}
        >
          {post.title}
        </h3>
      </Link>
      <p className={`mt-4 text-base leading-7 ${dark ? "text-white/70" : "text-stone"}`}>
        {post.excerpt}
      </p>
    </article>
  );
}

function TextArticleCard({ post, dark = false }: { post: BlogPost; dark?: boolean }) {
  return (
    <article className="group">
      <p className="mb-2 text-xs font-bold uppercase text-amber">{post.category}</p>
      <Link href={`/blog/${post.slug}`}>
        <h3
          className={`font-serif-display text-3xl font-medium leading-tight transition group-hover:text-amber ${
            dark ? "text-white" : "text-olive"
          }`}
        >
          {post.title}
        </h3>
      </Link>
      <p className={`mt-3 text-base leading-7 ${dark ? "text-white/70" : "text-stone"}`}>
        {post.excerpt}
      </p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="font-serif-display text-3xl font-semibold text-olive">{value}</p>
    </div>
  );
}
