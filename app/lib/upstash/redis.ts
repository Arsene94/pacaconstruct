import "server-only";

import { Redis } from "@upstash/redis";

/**
 * Client Upstash Redis (REST), folosit pentru ce NU intră în cache-ul de
 * conținut al Next.js: rate limiting, chei de idempotency pentru joburile
 * QStash și contoare (ex. vizualizări articol).
 *
 * Citirea/scrierea de pagini publice se face prin handlerul nativ
 * `'use cache: remote'` (vezi `cache-handlers/upstash-remote.js`), nu de aici —
 * ca să nu cache-uim aceleași date de două ori.
 */

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let client: Redis | null = null;

/** Întoarce clientul Redis sau aruncă dacă lipsește configul. */
export function getRedis(): Redis {
  if (!isRedisConfigured()) {
    throw new Error(
      "Lipsesc UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN pentru Upstash Redis.",
    );
  }
  client ??= Redis.fromEnv();
  return client;
}

/** Clientul Redis sau `null` dacă nu e configurat (căi care degradează grațios). */
export function getRedisOrNull(): Redis | null {
  return isRedisConfigured() ? getRedis() : null;
}

/**
 * Rezervă o cheie de idempotency cu TTL. Întoarce `true` dacă a fost rezervată
 * acum (prima oară), `false` dacă exista deja. Dacă Redis nu e configurat,
 * întoarce `true` (nu blocăm execuția în dev/local).
 */
export async function reserveOnce(key: string, ttlSeconds: number): Promise<boolean> {
  const redis = getRedisOrNull();
  if (!redis) return true;
  // NX = setează doar dacă nu există; EX = expiră după ttlSeconds.
  const res = await redis.set(key, "1", { nx: true, ex: ttlSeconds });
  return res === "OK";
}
