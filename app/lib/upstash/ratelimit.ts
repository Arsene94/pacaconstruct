import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { getRedisOrNull } from "./redis";

/**
 * Rate limiting distribuit cu Upstash. Limiterele sunt singleton-uri la nivel
 * de modul. Dacă Redis nu e configurat (dev/local fără Upstash), limiterele
 * sunt `null` și `checkRateLimit` lasă cererea să treacă (fail-open), ca să nu
 * blocăm dezvoltarea locală.
 */

const redis = getRedisOrNull();

/** Formulare publice de intake: max 5 trimiteri / 10 min / IP. */
export const intakeLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "rl:intake",
    })
  : null;

/** Autentificare/reset parolă: max 8 încercări / 5 min / (IP+email). */
export const authLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "5 m"),
      prefix: "rl:auth",
    })
  : null;

/** Acțiuni de trimitere din admin (test send / broadcast): max 20 / 5 min. */
export const emailSendLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "5 m"),
      prefix: "rl:email-send",
    })
  : null;

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

/**
 * Verifică un limiter pentru o cheie. Fail-open dacă limiterul lipsește.
 * Întoarce și câte secunde mai are de așteptat clientul (pentru mesaj/UI).
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string,
): Promise<RateLimitResult> {
  if (!limiter) return { ok: true, retryAfterSeconds: 0 };
  const { success, reset } = await limiter.limit(key);
  const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return { ok: success, retryAfterSeconds };
}

/** Extrage IP-ul clientului din headerele requestului (în spatele Vercel). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "anonim";
}
