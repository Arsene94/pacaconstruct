# Graph Report - paca-construct  (2026-06-20)

## Corpus Check
- 257 files · ~314,289 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1477 nodes · 3379 edges · 82 communities (75 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 107 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c86778c`
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
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
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
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 102 edges
2. `requireAdmin` - 52 edges
3. `AdminContent()` - 30 edges
4. `PageHeader()` - 30 edges
5. `getServiceGroups` - 29 edges
6. `breadcrumbSchema()` - 25 edges
7. `siteConfig` - 24 edges
8. `errorContext()` - 23 edges
9. `getAdminClientOrNull()` - 20 edges
10. `Footer()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `saveSection()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/settings.ts → cache-handlers/upstash-incremental.js
- `invalidateBlog()` --calls--> `revalidateTag()`  [INFERRED]
  app/lib/ai/generate.ts → cache-handlers/upstash-incremental.js
- `renderEmailPreview()` --calls--> `renderEmail()`  [EXTRACTED]
  app/actions/campaigns.ts → emails/render.ts
- `revalidateServices()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js
- `revalidateRentals()` --calls--> `revalidateTag()`  [INFERRED]
  app/actions/content.ts → cache-handlers/upstash-incremental.js

## Import Cycles
- None detected.

## Communities (82 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (31): BadgeTone, cx(), FilterSelect(), IconButton(), IconLink(), PrimaryLinkButton(), SearchField(), SecondaryButton() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (45): createFaqItem(), createPost(), createProject(), createRental(), createService(), deleteFaqItem(), deletePost(), deleteProject() (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (20): AdminContent(), PageHeader(), metadata, metadata, metadata, metadata, metadata, metadata (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (11): fromMarketing(), fromTransactional(), getResend(), isResendConfigured(), replyToDefault(), ALREADY_SENT_STATUSES, sendEmail(), SendEmailInput (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, lint-staged, @next/bundle-analyzer, @playwright/test, prettier, tailwindcss (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (39): enqueueArticleGeneration(), GenerateArticlePayload, assertGatewayConfigured(), ArticleSchema, generateAndUploadImage(), generateArticleForTopic(), invalidateBlog(), loadTopic() (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.35
Nodes (12): FormState, AdminFormFrame(), CheckboxField(), FieldHint(), FormGrid(), SelectField(), TextAreaField(), TextField() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (22): contactSchema, createContact(), createGroup(), createSegment(), deleteContact(), deleteGroup(), deleteSegment(), EmailFormState (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): metadata, generateMetadata(), generateStaticParams(), helpfulLinks, metadata, NotFound(), AdminPost, BLOG_CACHE (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): metadata, metadata, reassuranceItems, JsonLd(), SectionContainer(), SectionContainerProps, SiteNavbar(), FaqSection (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (22): 1. Rezumat executiv, 2. Inventarul proiectului (ce există acum), 3.1 Lipsește `robots.txt`, 3.2 Lipsește `sitemap.xml`, 3.3 Zero date structurate (JSON‑LD) pe tot site-ul, 3.4 `metadataBase` absent, 3.5 Imagini remote neconfigurate în `next/image`, 3.6 Pagini private indexabile (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (16): Home(), HeroSection(), PrimaryServicePaths(), ProcessSection(), ServicePathProps, ServicesMosaic(), TransformationStatement(), FeaturedService (+8 more)

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

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (19): AuthState, updatePassword(), cx(), DesktopLogin(), EmailField(), EmailFieldProps, FieldVariant, ForgotPasswordScreen() (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (9): AdminIcon(), AdminIconName, AdminIconProps, icons, getSchedules(), AdminSchedulePage(), FREQUENCY_LABELS, metadata (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (16): Criterii globale de acceptare (Definition of Done), FAZA 1 — Imagini & assets (LCP), FAZA 2 — Headere de securitate, FAZA 3 — Reziliență: error / loading / not-found, FAZA 4 — Securitatea & robustețea formularelor, FAZA 5 — Observabilitate (monitoring + analytics + RUM), FAZA 6 — Modernizare rendering: `use cache` + PPR (Next.js 16.2), FAZA 7 — Accesibilitate (WCAG 2.2 AA) (+8 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (13): logout(), AdminBreadcrumb(), AdminSidebar(), BLOG_SUBSECTIONS, breadcrumbLabels, cx(), NavItem, navItems (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (26): Footer(), FooterLinksProps, ContactCta(), Navbar(), NavbarProps, navLinks, ServiceCta(), buildContactDetails() (+18 more)

### Community 21 - "Community 21"
Cohesion: 0.24
Nodes (11): PublicProject, blogPostingSchema(), imageUrl(), Json, parsePrice(), productSchema(), projectSchema(), serviceSchema() (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (13): checkbox(), emailField, field(), nameField, normalizePhone(), phoneField, readRentalRequest(), readServiceRequest() (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (8): constructor(), get(), _maxTagStamp(), memEntries, memTags, { Redis }, REDIS_KINDS, redisOrNull()

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (9): 1. Cum funcționează (pe scurt), 2. Variabile de mediu, 3. Crearea conturilor de admin, 4. Configurare în panoul Supabase pentru resetarea parolei, 5. Fișiere relevante, 6. Rute, 7. Verificare locală, 8. Note de securitate (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.06
Nodes (35): inter, manrope, metadata, RootLayout(), sourceSerif, viewport, COLORS, FloatingButtons() (+27 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (40): AlertBox(), EmailButton(), DataRow, DataTable(), Divider(), EmailHeading(), EmailLayout(), EmailLayoutProps (+32 more)

### Community 28 - "Community 28"
Cohesion: 0.47
Nodes (4): config, proxy(), PROTECTED_PREFIXES, updateSession()

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (3): docs, index, supabase

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (5): contentSecurityPolicy(), nextConfig, SECURITY_HEADERS, supabaseOrigin(), withBundleAnalyzer

### Community 37 - "Community 37"
Cohesion: 0.24
Nodes (10): addToGroup(), removeFromGroup(), metadata, GET(), AdminContactsPage(), countContacts(), getContacts(), getGroupWithMembers() (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (28): 10. Reziliență & observabilitate, 11. Plan de implementare pe faze (recomandat), 12. Definiție de „gata" (cum verifici), 1. Rezumat executiv, 2. Diagnoza sistemului actual, 3. Traducerea cerințelor tale în componente de arhitectură, 4.1 Stratul de template — React Email (de ce), 4.2 Modelul „hibrid" template (decizie cheie) (+20 more)

### Community 39 - "Community 39"
Cohesion: 0.06
Nodes (34): size, Image(), size, size, Image(), size, Image(), size (+26 more)

### Community 40 - "Community 40"
Cohesion: 0.18
Nodes (10): generateMetadata(), ServiceFaqSection(), ServicePageTemplate(), ServicePageTemplateProps, getServicePage, qaFaqPageSchema(), serviceFaq(), ViewItemTracker() (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (12): generateMetadata(), generateStaticParams(), generateStaticParams(), AdminRental, getRentalMachine, getRentalMachines, RentalMachine, RentalRow (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (11): 1. Fundament de brand (extras din proiect), 2. ⭐ Prompt recomandat (monogramă „P" topografică), 3. Variante de concept (alege direcția), 4. Specificații tehnice (pune-le în brief, indiferent de tool), 5. Recomandarea mea, 6. Tooluri recomandate (iunie 2026), A. Wordmark + simbol (lockup) — cel mai „brand complet", B. „Secțiune de teren" — concept narativ (teren brut → spațiu viu) (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.17
Nodes (11): 0. Esența pe care o codifică logo-ul (din aplicație + domeniu + design), 1. ⭐ PROMPTUL MASTER (copy-paste), 2. Construcție & simbolistică (raționamentul de design), 3. Sistem de culoare (roluri exacte), 4. Tipografie (wordmark), 5. Geometrie, grilă & spațiu liber, 6. Specificații tehnice & livrabile, 7. Reguli DO / DON'T (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.06
Nodes (40): fetchPublishedProjectSlugs(), fetchSlugs(), sitemap(), SlugRow, SlugTable, CampaignRow, CampaignStatus, EMAIL_STATUSES (+32 more)

### Community 45 - "Community 45"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 46 - "Community 46"
Cohesion: 0.11
Nodes (23): countMarketingAudience(), SecondaryLinkButton(), metadata, AudienceKind, Contact, CONTACT_STATUSES, ContactFilter, ContactGroup (+15 more)

### Community 50 - "Community 50"
Cohesion: 0.23
Nodes (16): analyzeTopicsAction(), createSchedule(), createTopic(), deleteSchedule(), deleteTopic(), generateSelectedTopics(), intOrNull(), lines() (+8 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (4): SubmitButton(), DAYS, SECTIONS, SettingsForms()

### Community 52 - "Community 52"
Cohesion: 0.09
Nodes (22): 4.1 Confirmări client + notificări admin la intake, 4.2 Email-uri pe ciclul de viață (din admin), Catalogul de tipuri (implementează toate; `key` = fișier registry + rând DB), CONTEXT EXACT AL REPO-ULUI (respectă aceste convenții), CRITERII GLOBALE DE ACCEPTARE (Definition of Done), DEPENDENȚE DE INSTALAT, FAZA 0 — Fundație template (React Email, conversia `emai.html`), FAZA 1 — Schema bazei de date (migrări + RLS) (+14 more)

### Community 53 - "Community 53"
Cohesion: 0.12
Nodes (21): announcementSchema, contactSchema, DAY_VALUES, floatingSchema, hoursSchema, optionalEmail, optionalTime, optionalUrl (+13 more)

### Community 54 - "Community 54"
Cohesion: 0.17
Nodes (12): metadata, metadata, BlogSchedule, BlogTopic, getScheduleById(), getTopicById(), getTopics(), EditSchedulePage() (+4 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (23): Address, Announcement, asBool(), asNumber(), asString(), ContactInfo, defaultAnnouncement(), defaultContact() (+15 more)

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (13): getProject(), getProjects(), mapProject(), Project, PROJECT_STATUSES, PROJECT_TYPES, ProjectRow, PROJECTS_CACHE (+5 more)

### Community 57 - "Community 57"
Cohesion: 0.10
Nodes (19): CONTEXT, CRITERII GLOBALE (Definition of Done), FAZA 1 — `MarketingScripts` (Consent Mode default + GTM), FAZA 2 — `data-layer.ts` (replica `pushMarketingEvent`), FAZA 3 — `TrackedLink` + `TrackedButton`, FAZA 4 — Instrumentarea punctelor de conversie (evenimente custom), FAZA 5 — Configurare în GTM (blueprint — se face în interfața GTM, nu în cod), FAZA 6 — (Opțional, recomandat) Banner de consimțământ → Consent Mode Advanced (+11 more)

### Community 58 - "Community 58"
Cohesion: 0.11
Nodes (17): CONTEXT (respectă exact), CRITERII DE ACCEPTARE (Definition of Done), INSTALARE, Note pentru tine (Arsene), PASUL 1 — Tokeni de brand (`emails/brand.ts`), PASUL 2 — Layout + componente partajate, PASUL 3 — Template-uri (toate; cu props tipate + `PreviewProps`), PASUL 4 — Registry (`emails/registry.ts`) (+9 more)

### Community 59 - "Community 59"
Cohesion: 0.20
Nodes (13): ActionResult, createCampaign(), CreateCampaignInput, PreviewResult, renderEmailPreview(), sendBroadcast(), sendTestEmail(), Composer() (+5 more)

### Community 60 - "Community 60"
Cohesion: 0.17
Nodes (14): metadata, metadata, AdminFaqItem, FAQ_CACHE, FaqItem, FaqItemRow, FaqSectionRow, getFaqItemById() (+6 more)

### Community 61 - "Community 61"
Cohesion: 0.14
Nodes (14): scripts, analyze, build, check, dev, email, format, format:check (+6 more)

### Community 62 - "Community 62"
Cohesion: 0.13
Nodes (10): IntakeState, ContactForm(), ATTRIBUTION_PARAMS, AttributionParam, cleanAttributionValue(), CLICK_ID_PARAMS, AttributionFields(), AttributionState (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.11
Nodes (18): dependencies, ai, next, @next/third-parties, react, react-dom, react-email, @react-email/components (+10 more)

### Community 64 - "Community 64"
Cohesion: 0.20
Nodes (16): metadata, metadata, reassuranceItems, LegalPage(), getPublishedProjects, getServiceGroups, ServicePage, DesprePage() (+8 more)

### Community 65 - "Community 65"
Cohesion: 0.13
Nodes (14): CONTEXT EXACT AL REPO-ULUI (respectă), CRITERII GLOBALE DE ACCEPTARE (Definition of Done), FAZA 1 — Schema DB + RLS + seed, FAZA 2 — Strat de date (`app/data/settings.ts`), FAZA 3 — Acțiuni server (`app/actions/settings.ts`), FAZA 4 — Pagina de admin `/admin/settings`, FAZA 5 — Componenta Floating Buttons (site public), FAZA 6 — Înlocuirea valorilor hardcodate + legături (+6 more)

### Community 66 - "Community 66"
Cohesion: 0.25
Nodes (11): HARD, isSuppressed(), suppressContact(), getAdminClientOrNull(), handleResendEvent(), ResendEvent, STATUS_MAP, SvixHeaders (+3 more)

### Community 67 - "Community 67"
Cohesion: 0.32
Nodes (11): b64url(), fromB64url(), secret(), sign(), signToken(), unsubscribeUrl(), verifyToken(), GET() (+3 more)

### Community 68 - "Community 68"
Cohesion: 0.15
Nodes (11): AdminCereriInchirierePage(), AdminCereriServiciiPage(), dateFormatter, getRentalRequests(), getServiceRequests(), RentalRequest, RentalRequestRow, RequestChannel (+3 more)

### Community 69 - "Community 69"
Cohesion: 0.28
Nodes (13): login(), requestPasswordReset(), resolveOrigin(), submitRentalRequest(), submitServiceRequest(), captureContact(), firstIssueMessage(), readAttribution() (+5 more)

### Community 70 - "Community 70"
Cohesion: 0.06
Nodes (30): 0. Import & publicare (o singură dată), 1. ⚠️ Constante de înlocuit (OBLIGATORIU), 2.1 Consimțământ (Consent Mode v2) — folder `00 · Consent`, 2.2 Variabile — folder `01 · Variabile`, 2.3 Triggere — folder `02 · Triggere`, 2.4 Tag-uri, 2.5 Consimțământ pe tag-uri (important), 2. Ce e deja construit în container (+22 more)

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (8): @upstash/search, blogIndexOrNull(), BlogSearchContent, BlogSearchHit, BlogSearchMetadata, getSearch(), isSearchConfigured(), searchBlogPosts()

### Community 72 - "Community 72"
Cohesion: 0.22
Nodes (8): 1. Verificarea domeniului în Resend, 2. SPF + DKIM + DMARC, 3. Variabile de mediu (după verificare), 4. Webhook Resend, 5. Compliance 2026, 6. Verificare finală, 7. Securitate (rezumat), Deliverability & compliance email — PACA CONSTRUCT

### Community 73 - "Community 73"
Cohesion: 0.20
Nodes (15): enqueueEmail(), adminTo(), adminUrl(), CaptureContactInput, dispatchIntakeEmails(), IntakeLead, LifecycleInput, RentalLead (+7 more)

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (7): metadata, metadata, getServiceById(), getServiceGroupOptions(), EditServicePage(), NewServicePage(), ServiceForm()

### Community 75 - "Community 75"
Cohesion: 0.29
Nodes (6): lint-staged, *.{json,css,md,mjs,yml,yaml}, *.{ts,tsx}, name, private, version

### Community 76 - "Community 76"
Cohesion: 0.39
Nodes (7): dbSubject(), interpolate(), resolveTemplate(), emailRegistry, RenderedEmail, renderEmail(), EmailPropsMap

### Community 77 - "Community 77"
Cohesion: 0.40
Nodes (4): AuthIcon(), AuthIconName, AuthIconProps, icons

### Community 78 - "Community 78"
Cohesion: 0.30
Nodes (10): BroadcastPayload, { POST }, BroadcastPlan, BroadcastTarget, chunk(), finalizeBroadcast(), getBroadcastPlan(), runBroadcastInline() (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.28
Nodes (3): LogContext, logger, LogLevel

### Community 81 - "Community 81"
Cohesion: 0.25
Nodes (8): getSettingsAdmin(), readSettingsRow(), defaultHours(), defaultPhones(), normalizeHours(), normalizePhones(), resolveSettings(), SettingsPage()

## Knowledge Gaps
- **564 isolated node(s):** `husky.sh script`, `printWidth`, `tabWidth`, `semi`, `singleQuote` (+559 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 37` to `Community 0`, `Community 1`, `Community 2`, `Community 7`, `Community 8`, `Community 11`, `Community 16`, `Community 17`, `Community 19`, `Community 20`, `Community 41`, `Community 44`, `Community 46`, `Community 50`, `Community 53`, `Community 54`, `Community 56`, `Community 59`, `Community 60`, `Community 68`, `Community 69`, `Community 74`, `Community 81`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 63` to `Community 73`, `Community 75`, `Community 69`, `Community 71`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `@upstash/search` connect `Community 71` to `Community 63`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `getServiceGroups` (e.g. with `FaqPage()` and `BlogPage()`) actually correct?**
  _`getServiceGroups` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `husky.sh script`, `printWidth`, `tabWidth` to the rest of the system?**
  _564 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08199643493761141 - nodes in this community are weakly interconnected._