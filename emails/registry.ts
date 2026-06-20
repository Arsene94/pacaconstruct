import { ServiceRequestUserEmail } from "./templates/service-request-user";
import { ServiceRequestAdminEmail } from "./templates/service-request-admin";
import { RentalRequestUserEmail } from "./templates/rental-request-user";
import { RentalRequestAdminEmail } from "./templates/rental-request-admin";
import { RequestInReviewEmail } from "./templates/request-in-review";
import { RequestQuotedEmail } from "./templates/request-quoted";
import { RequestConfirmedEmail } from "./templates/request-confirmed";
import { RequestClosedEmail } from "./templates/request-closed";
import { AdminDailyDigestEmail } from "./templates/admin-daily-digest";
import { NewsletterArticleEmail } from "./templates/newsletter-article";
import { BroadcastGenericEmail } from "./templates/broadcast-generic";
import type { EmailPropsMap, EmailTemplateEntry, EmailTemplateKey } from "./types";

/**
 * Sursa unică a tipurilor de email: mapă `key` → componentă + meta + subiect +
 * props de probă. `sampleProps` provine din `Component.PreviewProps`, ca să nu
 * dublăm datele de exemplu (folosite și de serverul de preview React Email).
 */
export const emailRegistry: {
  [K in EmailTemplateKey]: EmailTemplateEntry<K>;
} = {
  service_request_user: {
    key: "service_request_user",
    name: "Confirmare cerere serviciu (client)",
    category: "tranzactional",
    audience: "user",
    component: ServiceRequestUserEmail,
    subject: (p) => `Am înregistrat solicitarea ta — ${p.code}`,
    preheader: (p) => `Referință ${p.code}. Te contactăm în 24h.`,
    sampleProps: ServiceRequestUserEmail.PreviewProps,
  },
  service_request_admin: {
    key: "service_request_admin",
    name: "Cerere serviciu nouă (admin)",
    category: "tranzactional",
    audience: "admin",
    component: ServiceRequestAdminEmail,
    subject: (p) => `Cerere nouă de serviciu — ${p.name}`,
    preheader: (p) => `${p.name} · ${p.phone ?? p.email ?? ""}`,
    sampleProps: ServiceRequestAdminEmail.PreviewProps,
  },
  rental_request_user: {
    key: "rental_request_user",
    name: "Confirmare cerere închiriere (client)",
    category: "tranzactional",
    audience: "user",
    component: RentalRequestUserEmail,
    subject: (p) => `Solicitarea ta de închiriere — ${p.code}`,
    preheader: (p) => `${p.machine} · referință ${p.code}`,
    sampleProps: RentalRequestUserEmail.PreviewProps,
  },
  rental_request_admin: {
    key: "rental_request_admin",
    name: "Cerere închiriere nouă (admin)",
    category: "tranzactional",
    audience: "admin",
    component: RentalRequestAdminEmail,
    subject: (p) => `Cerere nouă de închiriere — ${p.name}`,
    preheader: (p) => `${p.machine} · ${p.name}`,
    sampleProps: RentalRequestAdminEmail.PreviewProps,
  },
  request_in_review: {
    key: "request_in_review",
    name: "Cerere în evaluare (client)",
    category: "tranzactional",
    audience: "user",
    component: RequestInReviewEmail,
    subject: (p) => `Solicitarea ta este în evaluare — ${p.code}`,
    preheader: () => "Un inginer analizează cazul tău.",
    sampleProps: RequestInReviewEmail.PreviewProps,
  },
  request_quoted: {
    key: "request_quoted",
    name: "Cerere ofertată (client)",
    category: "tranzactional",
    audience: "user",
    component: RequestQuotedEmail,
    subject: (p) => `Oferta ta este gata — ${p.code}`,
    preheader: () => "Consultă oferta și revino cu întrebări.",
    sampleProps: RequestQuotedEmail.PreviewProps,
  },
  request_confirmed: {
    key: "request_confirmed",
    name: "Cerere confirmată (client)",
    category: "tranzactional",
    audience: "user",
    component: RequestConfirmedEmail,
    subject: (p) => `Lucrarea ta este confirmată — ${p.code}`,
    preheader: () => "Confirmăm programarea lucrării.",
    sampleProps: RequestConfirmedEmail.PreviewProps,
  },
  request_closed: {
    key: "request_closed",
    name: "Cerere închisă + recenzie (client)",
    category: "tranzactional",
    audience: "user",
    component: RequestClosedEmail,
    subject: () => "Îți mulțumim că ai ales PACA CONSTRUCT",
    preheader: () => "O recenzie ne-ar ajuta enorm.",
    sampleProps: RequestClosedEmail.PreviewProps,
  },
  admin_daily_digest: {
    key: "admin_daily_digest",
    name: "Sumar zilnic (admin)",
    category: "sistem",
    audience: "admin",
    component: AdminDailyDigestEmail,
    subject: (p) => `Sumar zilnic — ${p.counts.total} cereri noi`,
    preheader: (p) => `${p.periodLabel} · ${p.counts.total} cereri`,
    sampleProps: AdminDailyDigestEmail.PreviewProps,
  },
  newsletter_article: {
    key: "newsletter_article",
    name: "Newsletter — articol nou",
    category: "marketing",
    audience: "broadcast",
    component: NewsletterArticleEmail,
    subject: (p) => p.title,
    preheader: (p) => p.excerpt,
    sampleProps: NewsletterArticleEmail.PreviewProps,
  },
  broadcast_generic: {
    key: "broadcast_generic",
    name: "Broadcast generic",
    category: "marketing",
    audience: "broadcast",
    component: BroadcastGenericEmail,
    subject: (p) => p.heading,
    preheader: (p) => p.blocks.find((b) => b.type === "paragraph")?.text ?? p.heading,
    sampleProps: BroadcastGenericEmail.PreviewProps,
  },
};

export const EMAIL_TEMPLATE_KEYS = Object.keys(emailRegistry) as EmailTemplateKey[];

export function getRegistryEntry<K extends EmailTemplateKey>(
  key: K,
): EmailTemplateEntry<K> {
  return emailRegistry[key];
}

export function isEmailTemplateKey(value: string): value is EmailTemplateKey {
  return value in emailRegistry;
}

export type { EmailPropsMap, EmailTemplateKey };
