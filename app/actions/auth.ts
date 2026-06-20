"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import {
  authLimiter,
  checkRateLimit,
  clientIp,
} from "@/app/lib/upstash/ratelimit";

/** Starea returnată de acțiunile de formular către `useActionState`. */
export type AuthState = {
  error?: string;
  success?: boolean;
} | undefined;

/**
 * Autentificare admin cu email + parolă.
 * Conturile NU se creează din aplicație — sunt create manual din panoul
 * Supabase (Authentication → Users). Vezi docs/supabase-auth.md.
 */
export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completează adresa de email și parola." };
  }

  // Rate limit pe (IP + email) ca să oprim atacurile de tip brute-force.
  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(
    authLimiter,
    `login:${ip}:${email.toLowerCase()}`,
  );
  if (!allowed) {
    return {
      error: "Prea multe încercări de autentificare. Reîncearcă peste câteva minute.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Mesaj generic, ca să nu dezvăluim dacă emailul există sau nu.
    return { error: "Adresa de email sau parola nu este corectă." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

/** Delogare admin: distruge sesiunea și revine la /login. */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Trimite emailul de resetare a parolei. Întoarce mereu `success: true`
 * (chiar dacă emailul nu există) pentru a preveni enumerarea conturilor.
 * Linkul din email duce la /auth/callback, care apoi deschide pagina de
 * setare a parolei noi.
 */
export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Introdu adresa de email." };
  }

  // Rate limit pe IP. La depășire întoarcem tot `success: true` ca să nu
  // dezvăluim nimic (anti-enumerare) — pur și simplu nu trimitem emailul.
  const ip = await clientIp();
  const { ok: allowed } = await checkRateLimit(authLimiter, `reset:${ip}`);
  if (!allowed) {
    return { success: true };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? (await resolveOrigin());

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/login/update-password`,
  });

  return { success: true };
}

/**
 * Setează parola nouă pentru adminul aflat în sesiunea de recuperare
 * (după ce a accesat linkul din email și a trecut prin /auth/callback).
 */
export async function updatePassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Parola trebuie să aibă minimum 8 caractere." };
  }
  if (password !== confirm) {
    return { error: "Parolele introduse nu coincid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Linkul de resetare a expirat. Reia procesul." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

/** Reconstruiește originul (https://host) din headerele requestului. */
async function resolveOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
