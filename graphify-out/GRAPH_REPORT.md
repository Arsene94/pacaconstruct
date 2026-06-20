# Graph Report - paca-construct  (2026-06-20)

## Corpus Check
- 147 files · ~304,776 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 838 nodes · 1915 edges · 37 communities (31 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29041314`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 67 edges
2. `requireAdmin` - 33 edges
3. `getServiceGroups` - 27 edges
4. `AdminContent()` - 24 edges
5. `PageHeader()` - 24 edges
6. `breadcrumbSchema()` - 23 edges
7. `siteConfig` - 22 edges
8. `PROMPT MASTER — Implementare completă SEO & GEO (PACA CONSTRUCT)` - 17 edges
9. `compilerOptions` - 16 edges
10. `SectionContainer()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `invalidateBlog()` --calls--> `revalidateTag()`  [INFERRED]
  app/lib/ai/generate.ts → cache-handlers/upstash-incremental.js
- `revalidateServices()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js
- `revalidateRentals()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js
- `revalidateBlog()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js
- `revalidateProjects()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js

## Import Cycles
- None detected.

## Communities (37 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (71): AdminIcon(), AdminIconName, AdminIconProps, AdminContent(), BadgeTone, cx(), FilterSelect(), IconButton() (+63 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (70): analyzeTopicsAction(), createSchedule(), createTopic(), deleteSchedule(), deleteTopic(), generateSelectedTopics(), intOrNull(), lines() (+62 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (32): metadata, AdminPost, BLOG_CACHE, BlogPost, BlogRow, BlogSource, getPostById(), mapPost() (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.21
Nodes (11): generateStaticParams(), ConfidentialitatePage(), metadata, getBlogPosts, searchBlogPosts(), getRentalMachines, getServicePages, addressLine() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (27): FormState, AdminFormFrame(), CheckboxField(), FormGrid(), SelectField(), TextAreaField(), TextField(), metadata (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (50): enqueueArticleGeneration(), GenerateArticlePayload, assertGatewayConfigured(), ArticleSchema, generateAndUploadImage(), generateArticleForTopic(), invalidateBlog(), loadTopic() (+42 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (26): metadata, metadata, metadata, fetchPublishedProjectSlugs(), fetchSlugs(), sitemap(), SlugRow, SlugTable (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.38
Nodes (5): generateMetadata(), generateStaticParams(), getRentalMachine, RentalProductPage(), RentalRouteProps

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (4): metadata, ArticleCardProps, categories, getFeaturedBlogPost

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (19): generateMetadata(), Image(), size, generateMetadata(), Footer(), FooterLinksProps, JsonLd(), Navbar() (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (22): 1. Rezumat executiv, 2. Inventarul proiectului (ce există acum), 3.1 Lipsește `robots.txt`, 3.2 Lipsește `sitemap.xml`, 3.3 Zero date structurate (JSON‑LD) pe tot site-ul, 3.4 `metadataBase` absent, 3.5 Imagini remote neconfigurate în `next/image`, 3.6 Pagini private indexabile (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (21): Home(), ContactCta(), HeroSection(), PrimaryServicePaths(), ProcessSection(), ServicePathProps, ServicesMosaic(), TransformationStatement() (+13 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (15): AdminDashboardPage(), alerts, cx(), enquiries, EnquiryType(), formatAdminDate(), iconToneClass(), KpiCard() (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): 1. Rezumat executiv, 2. Ce e deja bine (de păstrat, nu de atins), 3.1 Migrare la `use cache` + PPR (modernizare Next.js 16.2), 3.2 Lipsă totală de error/loading/not-found boundaries, 3.3 Headere de securitate absente, 3.4 `next/image` fără `remotePatterns`, 3.5 Formulare publice: validare slabă + fără anti-bot, 3. Probleme CRITICE / impact mare (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (18): Criterii globale de acceptare (Definition of Done), FAZA 0 — Config centralizat + variabile de mediu, FAZA 10 — Măsurare & off-page (checklist pentru om + cod unde se poate), FAZA 1 — Fundație metadata (root), FAZA 2 — `robots.ts` (inclusiv boți AI), FAZA 3 — `sitemap.ts` dinamic (din Supabase), FAZA 4 — Icons, manifest, OG images, FAZA 5 — Date structurate JSON‑LD (nucleul GEO) (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (16): Criterii globale de acceptare (Definition of Done), FAZA 1 — Imagini & assets (LCP), FAZA 2 — Headere de securitate, FAZA 3 — Reziliență: error / loading / not-found, FAZA 4 — Securitatea & robustețea formularelor, FAZA 5 — Observabilitate (monitoring + analytics + RUM), FAZA 6 — Modernizare rendering: `use cache` + PPR (Next.js 16.2), FAZA 7 — Accesibilitate (WCAG 2.2 AA) (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (13): logout(), AdminBreadcrumb(), AdminSidebar(), BLOG_SUBSECTIONS, breadcrumbLabels, cx(), NavItem, navItems (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (6): contactDetails, ContactPage(), intentCards, metadata, mobileIntentCards, timeline

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (6): metadata, getFaqSections, FaqPage(), frequentQuestions, shortcuts, faqPageSchema()

### Community 22 - "Community 22"
Cohesion: 0.05
Nodes (40): AuthState, login(), requestPasswordReset(), resolveOrigin(), updatePassword(), IntakeState, submitRentalRequest(), submitServiceRequest() (+32 more)

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (8): constructor(), get(), _maxTagStamp(), memEntries, memTags, { Redis }, REDIS_KINDS, redisOrNull()

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (9): 1. Cum funcționează (pe scurt), 2. Variabile de mediu, 3. Crearea conturilor de admin, 4. Configurare în panoul Supabase pentru resetarea parolei, 5. Fișiere relevante, 6. Rute, 7. Verificare locală, 8. Note de securitate (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.20
Nodes (17): metadata, BlogPage(), LegalPage(), getPublishedProjects, PublicProject, getServiceGroups, DesprePage(), comparisonRows (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.47
Nodes (4): config, proxy(), PROTECTED_PREFIXES, updateSession()

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (3): docs, index, supabase

### Community 39 - "Community 39"
Cohesion: 0.07
Nodes (30): size, Image(), size, size, Image(), size, inter, manrope (+22 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (11): generateMetadata(), ServiceFaqSection(), ServicePageTemplate(), ServicePageTemplateProps, getServicePage, ServicePage, qaFaqPageSchema(), serviceFaq() (+3 more)

### Community 41 - "Community 41"
Cohesion: 0.23
Nodes (13): generateMetadata(), generateStaticParams(), getBlogPost, blogPostingSchema(), imageUrl(), Json, parsePrice(), productSchema() (+5 more)

## Knowledge Gaps
- **297 isolated node(s):** `PROJECT_TYPE_VALUES`, `PROJECT_STATUS_VALUES`, `ProjectTypeValue`, `ProjectStatusValue`, `REQUEST_STATUS_VALUES` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`, `Community 6`, `Community 11`, `Community 19`, `Community 22`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 2` to `Community 17`, `Community 5`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `getServiceGroups` (e.g. with `BlogPage()` and `FaqPage()`) actually correct?**
  _`getServiceGroups` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PROJECT_TYPE_VALUES`, `PROJECT_STATUS_VALUES`, `ProjectTypeValue` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05584192439862543 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06464883925947693 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07058823529411765 - nodes in this community are weakly interconnected._