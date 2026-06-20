import "server-only";

import type { EmailCategory } from "@/emails/types";
import { getAdminClientOrNull } from "./templates";

/**
 * Listă de supresie. La marketing, blocăm orice contact dezabonat/bounced/
 * complained. La tranzacțional (critic), lăsăm să treacă dezabonarea, dar NU
 * trimitem către contacte bounced/complained (hard bounce strică reputația).
 */

const HARD = new Set(["bounced", "complained"]);

export async function isSuppressed(
  email: string,
  category: EmailCategory,
): Promise<boolean> {
  const admin = getAdminClientOrNull();
  if (!admin) return false; // fără DB nu putem ști — lăsăm să treacă
  const { data } = await admin
    .from("contacts")
    .select("status")
    .eq("email", email.toLowerCase())
    .maybeSingle<{ status: string }>();
  if (!data) return false; // contact necunoscut → nu e suprimat
  if (category === "marketing") {
    return data.status !== "active";
  }
  // tranzacțional: doar hard bounce/complaint blochează
  return HARD.has(data.status);
}

/** Marchează un contact ca suprimat (din webhook bounce/complaint). */
export async function suppressContact(
  email: string,
  status: "bounced" | "complained",
): Promise<void> {
  const admin = getAdminClientOrNull();
  if (!admin) return;
  await admin
    .from("contacts")
    .update({
      status,
      ...(status === "complained" ? { unsubscribed_at: new Date().toISOString() } : {}),
    })
    .eq("email", email.toLowerCase());
}
