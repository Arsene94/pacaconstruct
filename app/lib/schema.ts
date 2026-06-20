/**
 * Generatoare de date structurate (schema.org / JSON-LD) alimentate din
 * `siteConfig` și din datele entităților. Toate obiectele folosesc `@id`-uri
 * stabile ca să lege entitățile între scheme (Organization ↔ Service ↔ Product).
 *
 * Randate server-side prin `<JsonLd>` (vezi app/components/json-ld.tsx).
 */
import {
  siteConfig,
  siteUrl,
  absoluteUrl,
  sameAs,
  addressLine,
} from "@/app/lib/site-config";
import type { ServicePage } from "@/app/data/services";
import type { RentalMachine } from "@/app/data/rentals";
import type { BlogPost } from "@/app/data/blog";
import type { FaqSection } from "@/app/data/faq";
import type { PublicProject } from "@/app/data/projects";

type Json = Record<string, unknown>;

/** `@id`-uri canonice pentru entitățile-cheie. */
export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

/** Elimină tag-uri HTML și normalizează spațiile (răspunsuri FAQ etc.). */
function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extrage prima imagine absolută utilizabilă, sau OG-ul implicit. */
function imageUrl(src?: string | null): string {
  if (src && /^https?:\/\//i.test(src)) return src;
  if (src) return absoluteUrl(src);
  return siteConfig.defaultOgImage;
}

/** Parsează un preț numeric dintr-un string liber („450 RON/zi" → 450). */
function parsePrice(value: string): number | null {
  const match = value.replace(/\./g, "").match(/(\d+(?:,\d+)?)/);
  if (!match) return null;
  const n = Number(match[1].replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * Organization + LocalBusiness (GeneralContractor). Montat în layout, deci
 * apare pe toate paginile. Conține NAP complet, geo, program, areaServed, sameAs.
 */
export function organizationSchema(): Json {
  const a = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "GeneralContractor", "LocalBusiness"],
    "@id": ORG_ID,
    name: siteConfig.legalName,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.logo,
    },
    image: siteConfig.defaultOgImage,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.streetAddress,
      addressLocality: a.addressLocality,
      addressRegion: a.addressRegion,
      postalCode: a.postalCode,
      addressCountry: a.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: siteConfig.mapUrl,
    openingHoursSpecification: siteConfig.openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    ...(sameAs().length ? { sameAs: sameAs() } : {}),
  };
}

/** WebSite + SearchAction (caută în blog). Montat în layout. */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "ro-RO",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** BreadcrumbList dintr-o listă de pași {name, path}. */
export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** ItemList pentru paginile de listă (blog, utilaje, servicii). */
export function itemListSchema(
  name: string,
  items: { name: string; path: string }[],
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** FAQPage dintr-o listă simplă de întrebări/răspunsuri (pagini de serviciu). */
export function qaFaqPageSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: stripHtml(item.question),
      acceptedAnswer: { "@type": "Answer", text: stripHtml(item.answer) },
    })),
  };
}

/** FAQPage din secțiunile FAQ (curăță HTML din răspunsuri). */
export function faqPageSchema(sections: FaqSection[]): Json {
  const questions = sections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: stripHtml(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answer),
      },
    })),
  );
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions,
  };
}

/** Service pentru /servicii/[slug]. Leagă provider-ul la Organization prin @id. */
export function serviceSchema(service: ServicePage): Json {
  const path = `/servicii/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: service.title,
    serviceType: service.shortTitle || service.title,
    description: service.description,
    url: absoluteUrl(path),
    ...(service.imageSrc ? { image: imageUrl(service.imageSrc) } : {}),
    provider: { "@id": ORG_ID },
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    ...(service.specs.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `Specificații ${service.title}`,
            itemListElement: service.specs.map((spec) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `${spec.label}: ${spec.value}`,
              },
            })),
          },
        }
      : {}),
  };
}

/** Product + Offer pentru /inchiriere-utilaje/[slug]. */
export function productSchema(machine: RentalMachine): Json {
  const path = `/inchiriere-utilaje/${machine.slug}`;
  const price = parsePrice(machine.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(path)}#product`,
    name: machine.title,
    description: machine.longDescription || machine.shortDescription,
    image: imageUrl(machine.imageSrc),
    category: machine.category,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(machine.specs.length
      ? {
          additionalProperty: machine.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      availability: "https://schema.org/InStock",
      priceCurrency: "RON",
      ...(price !== null
        ? {
            price,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price,
              priceCurrency: "RON",
            },
          }
        : {}),
      seller: { "@id": ORG_ID },
    },
  };
}

/**
 * Proiect din portofoliu pentru /proiecte/[slug]. Modelat ca `CreativeWork`
 * (schema.org n-are tip „Project"). Include doar imaginile existente (înainte/după).
 */
export function projectSchema(project: PublicProject): Json {
  const path = `/proiecte/${project.slug}`;
  const images = [project.imageBeforeSrc, project.imageSrc]
    .filter((src): src is string => Boolean(src))
    .map((src) => imageUrl(src));
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(path)}#project`,
    name: project.name,
    description: project.summary,
    url: absoluteUrl(path),
    ...(images.length ? { image: images } : {}),
    about: project.type,
    ...(project.location
      ? { locationCreated: { "@type": "Place", name: project.location } }
      : {}),
    creator: { "@id": ORG_ID },
    inLanguage: "ro-RO",
  };
}

/** BlogPosting/Article pentru /blog/[slug]. Datele ISO vin din strat (Faza 6). */
export function blogPostingSchema(
  post: BlogPost & { publishedAtISO?: string; updatedAtISO?: string },
): Json {
  const path = `/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#article`,
    headline: post.title,
    description: post.excerpt,
    image: imageUrl(post.imageSrc),
    ...(post.publishedAtISO ? { datePublished: post.publishedAtISO } : {}),
    dateModified: post.updatedAtISO || post.publishedAtISO,
    inLanguage: "ro-RO",
    author: {
      "@type": "Organization",
      name: `Echipa ${siteConfig.name}`,
      url: siteUrl,
    },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    articleSection: post.category,
    ...(post.sources.length
      ? { citation: post.sources.map((s) => s.url) }
      : {}),
  };
}

export { addressLine };
