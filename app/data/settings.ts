import "server-only";

import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/app/lib/supabase/public";
import { createClient } from "@/app/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/app/lib/supabase/database.types";
import {
  resolveSettings,
  type ResolvedSettings,
  type SettingsRow,
} from "@/app/lib/settings-shared";

/** Profil de cache pentru setările publice (Upstash via handler Next). */
const SETTINGS_CACHE = { tags: ["settings"], revalidate: 3600 };

const SETTINGS_COLUMNS =
  "phones, contact, hours, social, floating, announcement" as const;

/**
 * Citește rândul singleton (id = 1). Orice eroare (tabel inexistent, RLS, rețea)
 * întoarce `null` → `resolveSettings` cade complet pe siteConfig, deci site-ul
 * nu se rupe niciodată din cauza setărilor.
 */
async function readSettingsRow(
  client: SupabaseClient<Database>,
): Promise<Partial<SettingsRow> | null> {
  const { data, error } = await client
    .from("site_settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[settings] Citire eșuată, fallback pe siteConfig:", error.message);
    return null;
  }
  return (data as Partial<SettingsRow> | null) ?? null;
}

/**
 * Setările publice rezolvate (DB peste siteConfig), cache-uite cu tag „settings".
 * Folosit de chrome-ul public (navbar, footer, butoane flotante) și de JSON-LD.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<ResolvedSettings> => {
    const supabase = createPublicClient();
    return resolveSettings(await readSettingsRow(supabase));
  },
  ["site-settings"],
  SETTINGS_CACHE,
);

/**
 * Setările pentru panoul de admin: aceeași rezolvare, dar prin clientul cu
 * sesiune (necache-uit), ca formularul să afișeze mereu valorile efective
 * curente imediat după salvare.
 */
export async function getSettingsAdmin(): Promise<ResolvedSettings> {
  const supabase = await createClient();
  return resolveSettings(await readSettingsRow(supabase));
}
