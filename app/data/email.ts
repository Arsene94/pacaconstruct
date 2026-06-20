import { createClient } from "@/app/lib/supabase/server";
import type { Database } from "@/app/lib/supabase/database.types";
import { emailRegistry, isEmailTemplateKey } from "@/emails/registry";
import type { EmailAudience, EmailCategory, EmailTemplateKey } from "@/emails/types";

/**
 * Stratul de date pentru email: template-uri (DB ⨝ registry), jurnal de
 * trimiteri, campanii și statistici agregate. Admin-only (RLS), client server.
 */

export type EmailStatus = Database["public"]["Enums"]["email_status"];
export type CampaignStatus = Database["public"]["Enums"]["campaign_status"];

type TemplateRow = Database["public"]["Tables"]["email_templates"]["Row"];

/** Un template: meta editabilă din DB + structura/variabilele din registry. */
export type EmailTemplate = {
  key: EmailTemplateKey;
  name: string;
  category: EmailCategory;
  audience: EmailAudience;
  subject: string;
  preheader: string | null;
  blocks: Record<string, unknown>;
  isActive: boolean;
  /** Provine din registry — sample props pentru preview. */
  sampleProps: unknown;
  updatedAt: string;
};

function mapTemplate(row: TemplateRow): EmailTemplate | null {
  if (!isEmailTemplateKey(row.key)) return null; // template orfan (cod șters)
  const entry = emailRegistry[row.key];
  return {
    key: row.key,
    name: row.name,
    category: row.category,
    audience: row.audience,
    subject: row.subject,
    preheader: row.preheader,
    blocks: (row.blocks as Record<string, unknown>) ?? {},
    isActive: row.is_active,
    sampleProps: entry.sampleProps,
    updatedAt: row.updated_at,
  };
}

/** Toate template-urile din DB care au și o intrare validă în registry. */
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .order("category")
    .returns<TemplateRow[]>();
  if (error) {
    throw new Error(`Nu am putut încărca template-urile: ${error.message}`);
  }
  return (data ?? []).map(mapTemplate).filter((t): t is EmailTemplate => t !== null);
}

export async function getEmailTemplate(key: string): Promise<EmailTemplate | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select("*")
    .eq("key", key)
    .maybeSingle<TemplateRow>();
  if (error) {
    throw new Error(`Nu am putut încărca template-ul: ${error.message}`);
  }
  return data ? mapTemplate(data) : null;
}

// ─── Jurnal trimiteri ────────────────────────────────────────────────────────

type MessageRow = Database["public"]["Tables"]["email_messages"]["Row"];

export type EmailMessage = {
  id: string;
  providerId: string | null;
  templateKey: string;
  toEmail: string;
  campaignId: string | null;
  subject: string;
  category: EmailCategory;
  status: EmailStatus;
  error: string | null;
  createdAt: string;
};

function mapMessage(row: MessageRow): EmailMessage {
  return {
    id: row.id,
    providerId: row.provider_id,
    templateKey: row.template_key,
    toEmail: row.to_email,
    campaignId: row.campaign_id,
    subject: row.subject,
    category: row.category,
    status: row.status,
    error: row.error,
    createdAt: row.created_at,
  };
}

export type EmailMessageFilter = {
  status?: EmailStatus;
  campaignId?: string;
  templateKey?: string;
  limit?: number;
};

export async function getEmailMessages(
  filter: EmailMessageFilter = {},
): Promise<EmailMessage[]> {
  const supabase = await createClient();
  let query = supabase
    .from("email_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter.status) query = query.eq("status", filter.status);
  if (filter.campaignId) query = query.eq("campaign_id", filter.campaignId);
  if (filter.templateKey) query = query.eq("template_key", filter.templateKey);
  query = query.limit(filter.limit ?? 100);

  const { data, error } = await query.returns<MessageRow[]>();
  if (error) {
    throw new Error(`Nu am putut încărca jurnalul de email: ${error.message}`);
  }
  return (data ?? []).map(mapMessage);
}

// ─── Campanii ────────────────────────────────────────────────────────────────

type CampaignRow = Database["public"]["Tables"]["email_campaigns"]["Row"];

export type EmailCampaign = {
  id: string;
  templateKey: string;
  audienceKind: string;
  audienceId: string | null;
  subjectOverride: string | null;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentCount: number;
  createdAt: string;
};

function mapCampaign(row: CampaignRow): EmailCampaign {
  return {
    id: row.id,
    templateKey: row.template_key,
    audienceKind: row.audience_kind,
    audienceId: row.audience_id,
    subjectOverride: row.subject_override,
    status: row.status,
    scheduledAt: row.scheduled_at,
    sentCount: row.sent_count,
    createdAt: row.created_at,
  };
}

export async function getCampaigns(): Promise<EmailCampaign[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<CampaignRow[]>();
  if (error) {
    throw new Error(`Nu am putut încărca campaniile: ${error.message}`);
  }
  return (data ?? []).map(mapCampaign);
}

export async function getCampaign(id: string): Promise<EmailCampaign | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle<CampaignRow>();
  if (error) {
    throw new Error(`Nu am putut încărca campania: ${error.message}`);
  }
  return data ? mapCampaign(data) : null;
}

// ─── Statistici ──────────────────────────────────────────────────────────────

export type EmailStats = Record<EmailStatus, number> & { total: number };

const EMAIL_STATUSES: EmailStatus[] = [
  "queued",
  "sent",
  "delivered",
  "bounced",
  "complained",
  "opened",
  "failed",
];

/** Counts pe status pentru dashboard (opțional limitat la o campanie). */
export async function getEmailStats(campaignId?: string): Promise<EmailStats> {
  const supabase = await createClient();
  const base: EmailStats = {
    queued: 0,
    sent: 0,
    delivered: 0,
    bounced: 0,
    complained: 0,
    opened: 0,
    failed: 0,
    total: 0,
  };

  const counts = await Promise.all(
    EMAIL_STATUSES.map(async (status) => {
      let query = supabase
        .from("email_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      if (campaignId) query = query.eq("campaign_id", campaignId);
      const { count, error } = await query;
      if (error) {
        throw new Error(`Nu am putut agrega statisticile: ${error.message}`);
      }
      return [status, count ?? 0] as const;
    }),
  );

  for (const [status, count] of counts) {
    base[status] = count;
    base.total += count;
  }
  return base;
}
