import type { ComponentType } from "react";

/**
 * Sursa unică de adevăr pentru tipurile de email.
 *
 * `EmailTemplateKey` corespunde 1:1 cu rândurile din tabelul `email_templates`
 * (coloana `key`) și cu fișierele din `emails/templates/`.
 */
export type EmailCategory = "tranzactional" | "marketing" | "sistem";
export type EmailAudience = "user" | "admin" | "broadcast";

export type EmailTemplateKey =
  | "service_request_user"
  | "service_request_admin"
  | "rental_request_user"
  | "rental_request_admin"
  | "request_in_review"
  | "request_quoted"
  | "request_confirmed"
  | "request_closed"
  | "admin_daily_digest"
  | "newsletter_article"
  | "broadcast_generic";

// ─── Props per template ──────────────────────────────────────────────────────

/** Câmpuri comune injectate de stratul de randare (nu de apelant). */
export type CommonEmailProps = {
  /** Link de dezabonare semnat (doar marketing). */
  unsubscribeUrl?: string;
};

export type ServiceRequestUserProps = CommonEmailProps & {
  name: string;
  code: string;
  service?: string | null;
  location?: string | null;
  surface?: string | null;
};

export type ServiceRequestAdminProps = CommonEmailProps & {
  name: string;
  phone?: string | null;
  email?: string | null;
  service?: string | null;
  location?: string | null;
  surface?: string | null;
  description?: string | null;
  adminUrl: string;
};

export type RentalRequestUserProps = CommonEmailProps & {
  name: string;
  code: string;
  machine: string;
  period?: string | null;
  accessReq?: string | null;
};

export type RentalRequestAdminProps = CommonEmailProps & {
  name: string;
  phone?: string | null;
  email?: string | null;
  machine: string;
  period?: string | null;
  location?: string | null;
  message?: string | null;
  adminUrl: string;
};

export type RequestInReviewProps = CommonEmailProps & {
  name: string;
  code: string;
};

export type RequestQuotedProps = CommonEmailProps & {
  name: string;
  code: string;
  offerUrl?: string | null;
};

export type RequestConfirmedProps = CommonEmailProps & {
  name: string;
  code: string;
  scheduleInfo?: string | null;
};

export type RequestClosedProps = CommonEmailProps & {
  name: string;
  code: string;
  reviewUrl?: string | null;
};

export type DigestRequest = {
  code: string;
  name: string;
  kind: "Serviciu" | "Închiriere";
  detail?: string | null;
};

export type AdminDailyDigestProps = CommonEmailProps & {
  requests: DigestRequest[];
  counts: { service: number; rental: number; total: number };
  adminUrl: string;
  /** Etichetă perioadă, ex. „20 Iun 2026". */
  periodLabel: string;
};

export type NewsletterArticleProps = CommonEmailProps & {
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string | null;
};

/** Bloc de conținut pentru un broadcast compus din admin. */
export type BroadcastBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "button"; text: string; href: string };

export type BroadcastGenericProps = CommonEmailProps & {
  heading: string;
  blocks: BroadcastBlock[];
};

/** Mapă key → props, pentru type-safety la apel (`render`, `sendEmail`). */
export type EmailPropsMap = {
  service_request_user: ServiceRequestUserProps;
  service_request_admin: ServiceRequestAdminProps;
  rental_request_user: RentalRequestUserProps;
  rental_request_admin: RentalRequestAdminProps;
  request_in_review: RequestInReviewProps;
  request_quoted: RequestQuotedProps;
  request_confirmed: RequestConfirmedProps;
  request_closed: RequestClosedProps;
  admin_daily_digest: AdminDailyDigestProps;
  newsletter_article: NewsletterArticleProps;
  broadcast_generic: BroadcastGenericProps;
};

export type AnyEmailProps = EmailPropsMap[EmailTemplateKey];

/** O intrare din registru: componenta + meta + subiect + props de probă. */
export type EmailTemplateEntry<K extends EmailTemplateKey = EmailTemplateKey> = {
  key: K;
  name: string;
  category: EmailCategory;
  audience: EmailAudience;
  component: ComponentType<EmailPropsMap[K]>;
  /** Subiectul implicit (poate fi suprascris din DB). */
  subject: (props: EmailPropsMap[K]) => string;
  /** Preheader implicit. */
  preheader: (props: EmailPropsMap[K]) => string;
  /** Props de probă pentru preview-ul React Email + admin. */
  sampleProps: EmailPropsMap[K];
};
