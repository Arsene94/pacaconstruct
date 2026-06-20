import { createClient } from "@/app/lib/supabase/server";
import type { Database } from "@/app/lib/supabase/database.types";

/**
 * Stratul de date pentru contacte, grupuri și segmente.
 *
 * Totul e admin-only (RLS via `is_admin()`), deci folosim clientul server
 * (cookie-based) direct, fără cache — paginile de admin sunt dinamice. Pentru
 * scrieri din contexte fără sesiune (auto-capture, broadcast) se folosește
 * clientul `service_role` în stratul de email.
 */

export type ContactStatus = Database["public"]["Enums"]["contact_status"];

export const CONTACT_STATUSES: ContactStatus[] = [
  "active",
  "unsubscribed",
  "bounced",
  "complained",
];

export type Contact = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  locale: string;
  source: string;
  marketingConsent: boolean;
  consentAt: string | null;
  unsubscribedAt: string | null;
  status: ContactStatus;
  tags: string[];
  createdAt: string;
};

export type ContactGroup = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  memberCount: number;
};

export type ContactSegment = {
  id: string;
  name: string;
  definition: SegmentDefinition;
  createdAt: string;
};

/**
 * Definiția unui segment dinamic. Toate câmpurile sunt opționale și se combină
 * cu AND. Evaluată la trimitere de `resolveAudience`.
 */
export type SegmentDefinition = {
  status?: ContactStatus;
  source?: string;
  marketingConsent?: boolean;
  tags?: string[]; // contactul trebuie să conțină TOATE tag-urile
  createdWithinDays?: number;
};

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];

function mapContact(row: ContactRow): Contact {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    locale: row.locale,
    source: row.source,
    marketingConsent: row.marketing_consent,
    consentAt: row.consent_at,
    unsubscribedAt: row.unsubscribed_at,
    status: row.status,
    tags: row.tags ?? [],
    createdAt: row.created_at,
  };
}

export type ContactFilter = {
  status?: ContactStatus;
  tag?: string;
  /** Caută în email + nume (ilike). */
  search?: string;
  limit?: number;
};

/** Lista contactelor, cu filtre opționale. */
export async function getContacts(filter: ContactFilter = {}): Promise<Contact[]> {
  const supabase = await createClient();
  let query = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.status) query = query.eq("status", filter.status);
  if (filter.tag) query = query.contains("tags", [filter.tag]);
  if (filter.search) {
    const term = `%${filter.search}%`;
    query = query.or(`email.ilike.${term},name.ilike.${term}`);
  }
  if (filter.limit) query = query.limit(filter.limit);

  const { data, error } = await query.returns<ContactRow[]>();
  if (error) {
    throw new Error(`Nu am putut încărca contactele: ${error.message}`);
  }
  return (data ?? []).map(mapContact);
}

export async function getContactById(id: string): Promise<Contact | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .maybeSingle<ContactRow>();
  if (error) {
    throw new Error(`Nu am putut încărca contactul: ${error.message}`);
  }
  return data ? mapContact(data) : null;
}

export async function getContactByEmail(email: string): Promise<Contact | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle<ContactRow>();
  if (error) {
    throw new Error(`Nu am putut căuta contactul: ${error.message}`);
  }
  return data ? mapContact(data) : null;
}

/** Numărul de contacte, opțional pe un status. */
export async function countContacts(status?: ContactStatus): Promise<number> {
  const supabase = await createClient();
  let query = supabase.from("contacts").select("*", { count: "exact", head: true });
  if (status) query = query.eq("status", status);
  const { count, error } = await query;
  if (error) {
    throw new Error(`Nu am putut număra contactele: ${error.message}`);
  }
  return count ?? 0;
}

// ─── Grupuri ─────────────────────────────────────────────────────────────────

/** Grupurile statice, cu numărul de membri. */
export async function getGroups(): Promise<ContactGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_groups")
    .select("id, name, description, created_at, contact_group_members(count)")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Nu am putut încărca grupurile: ${error.message}`);
  }
  type GroupRow = {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    contact_group_members: { count: number }[];
  };
  return ((data ?? []) as GroupRow[]).map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    createdAt: g.created_at,
    memberCount: g.contact_group_members?.[0]?.count ?? 0,
  }));
}

export type GroupWithMembers = ContactGroup & { members: Contact[] };

export async function getGroupWithMembers(id: string): Promise<GroupWithMembers | null> {
  const supabase = await createClient();
  const { data: group, error: groupErr } = await supabase
    .from("contact_groups")
    .select("id, name, description, created_at")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      name: string;
      description: string | null;
      created_at: string;
    }>();
  if (groupErr) {
    throw new Error(`Nu am putut încărca grupul: ${groupErr.message}`);
  }
  if (!group) return null;

  const { data: members, error: memErr } = await supabase
    .from("contact_group_members")
    .select("contacts(*)")
    .eq("group_id", id);
  if (memErr) {
    throw new Error(`Nu am putut încărca membrii grupului: ${memErr.message}`);
  }
  type MemberRow = { contacts: ContactRow | null };
  const list = ((members ?? []) as unknown as MemberRow[])
    .map((m) => m.contacts)
    .filter((c): c is ContactRow => Boolean(c))
    .map(mapContact);

  return {
    id: group.id,
    name: group.name,
    description: group.description,
    createdAt: group.created_at,
    memberCount: list.length,
    members: list,
  };
}

// ─── Segmente ────────────────────────────────────────────────────────────────

export async function getSegments(): Promise<ContactSegment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_segments")
    .select("id, name, definition, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Nu am putut încărca segmentele: ${error.message}`);
  }
  type SegRow = {
    id: string;
    name: string;
    definition: SegmentDefinition;
    created_at: string;
  };
  return ((data ?? []) as SegRow[]).map((s) => ({
    id: s.id,
    name: s.name,
    definition: s.definition ?? {},
    createdAt: s.created_at,
  }));
}

// ─── Rezolvarea audienței ────────────────────────────────────────────────────

export type AudienceKind = "group" | "segment";

/**
 * Întoarce contactele active dintr-un grup sau segment.
 *
 * Exclude mereu contactele `unsubscribed | bounced | complained` (doar
 * `status = 'active'`). Pentru marketing, apelantul filtrează suplimentar pe
 * `marketingConsent` (vezi broadcast-ul din Faza 6).
 */
export async function resolveAudience(
  kind: AudienceKind,
  id: string,
): Promise<Contact[]> {
  const supabase = await createClient();

  if (kind === "group") {
    const { data, error } = await supabase
      .from("contact_group_members")
      .select("contacts(*)")
      .eq("group_id", id);
    if (error) {
      throw new Error(`Nu am putut rezolva grupul: ${error.message}`);
    }
    type MemberRow = { contacts: ContactRow | null };
    return ((data ?? []) as unknown as MemberRow[])
      .map((m) => m.contacts)
      .filter((c): c is ContactRow => Boolean(c))
      .map(mapContact)
      .filter((c) => c.status === "active");
  }

  // segment: traduce definiția în query
  const { data: seg, error: segErr } = await supabase
    .from("contact_segments")
    .select("definition")
    .eq("id", id)
    .maybeSingle<{ definition: SegmentDefinition }>();
  if (segErr) {
    throw new Error(`Nu am putut încărca segmentul: ${segErr.message}`);
  }
  const def: SegmentDefinition = seg?.definition ?? {};

  let query = supabase.from("contacts").select("*");
  // Implicit doar contacte active, dacă definiția nu specifică alt status.
  query = query.eq("status", def.status ?? "active");
  if (def.source) query = query.eq("source", def.source);
  if (typeof def.marketingConsent === "boolean") {
    query = query.eq("marketing_consent", def.marketingConsent);
  }
  if (def.tags && def.tags.length > 0) {
    query = query.contains("tags", def.tags);
  }
  if (def.createdWithinDays && def.createdWithinDays > 0) {
    const since = new Date(
      Date.now() - def.createdWithinDays * 24 * 60 * 60 * 1000,
    ).toISOString();
    query = query.gte("created_at", since);
  }

  const { data, error } = await query.returns<ContactRow[]>();
  if (error) {
    throw new Error(`Nu am putut rezolva segmentul: ${error.message}`);
  }
  return (data ?? []).map(mapContact).filter((c) => c.status === "active");
}
