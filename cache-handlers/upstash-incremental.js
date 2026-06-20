// Custom Next.js incremental cache handler, alimentat de Upstash Redis.
//
// Backeaza cache-ul de date al Next (`unstable_cache`, raspunsuri ISR/route,
// kind FETCH/APP_PAGE/APP_ROUTE/PAGES) intr-un store partajat, ca toate
// instantele serverless sa imparta acelasi cache si invalidarea pe tag-uri sa
// fie consistenta intre ele.
//
// Degradeaza la un cache in-memory daca UPSTASH_REDIS_REST_* lipsesc (dev/local
// fara Upstash). Defensiv: orice eroare de store inseamna "cache miss", nu crash
// — `get()` nu trebuie sa arunce niciodata (Next nu il prinde in try/catch).
//
// Config in next.config.ts:  cacheHandler: require.resolve(...)
/* eslint-disable @typescript-eslint/no-require-imports */

const { Redis } = require("@upstash/redis");

const ENTRY_PREFIX = "nc:e:"; // o cheie per intrare de cache
const TAGS_HASH = "nc:tags"; // hash: tag -> timestamp(ms) ultimei invalidari
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 zile, plasa de siguranta

// Nu trimitem catre Redis intrari binare (imagini) — Buffer-ele nu trec curat
// prin JSON. Acelea raman in cache-ul in-memory al procesului.
const REDIS_KINDS = new Set(["FETCH", "APP_PAGE", "APP_ROUTE", "PAGES"]);

function redisOrNull() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return Redis.fromEnv();
}

// Fallback in-memory, partajat la nivel de proces.
const memEntries = new Map(); // key -> { value, lastModified, tags }
const memTags = new Map(); // tag -> timestamp(ms)

module.exports = class UpstashCacheHandler {
  constructor() {
    this.redis = redisOrNull();
  }

  /** Cea mai recenta invalidare dintre tag-urile date (0 daca niciuna). */
  async _maxTagStamp(tags) {
    if (!tags || tags.length === 0) return 0;
    if (this.redis) {
      const stamps = await this.redis.hmget(TAGS_HASH, ...tags);
      let max = 0;
      if (stamps) {
        for (const k of Object.keys(stamps)) {
          const v = Number(stamps[k]) || 0;
          if (v > max) max = v;
        }
      }
      return max;
    }
    let max = 0;
    for (const t of tags) max = Math.max(max, memTags.get(t) || 0);
    return max;
  }

  async get(key) {
    try {
      let entry;
      if (this.redis) {
        entry = await this.redis.get(ENTRY_PREFIX + key);
      } else {
        entry = memEntries.get(key);
      }
      if (!entry) return null;

      // Daca vreun tag a fost invalidat dupa scrierea intrarii, e expirata.
      const tagStamp = await this._maxTagStamp(entry.tags);
      if (tagStamp > entry.lastModified) return null;

      return { value: entry.value, lastModified: entry.lastModified };
    } catch (err) {
      // Cache miss in caz de orice eroare — niciodata nu aruncam din get().
      console.error("[cache] get esuat:", err?.message ?? err);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      const tags = (ctx && ctx.tags) || (data && data.tags) || [];
      const entry = { value: data, lastModified: Date.now(), tags };
      const kind = data && data.kind;

      if (this.redis && (!kind || REDIS_KINDS.has(kind))) {
        const ttl =
          ctx && typeof ctx.revalidate === "number" && ctx.revalidate > 0
            ? Math.min(ctx.revalidate * 4, DEFAULT_TTL_SECONDS)
            : DEFAULT_TTL_SECONDS;
        await this.redis.set(ENTRY_PREFIX + key, entry, { ex: ttl });
      } else {
        memEntries.set(key, entry);
      }
    } catch (err) {
      console.error("[cache] set esuat:", err?.message ?? err);
    }
  }

  async revalidateTag(tag) {
    try {
      const tags = Array.isArray(tag) ? tag : [tag];
      if (tags.length === 0) return;
      const now = Date.now();
      if (this.redis) {
        const payload = {};
        for (const t of tags) payload[t] = now;
        await this.redis.hset(TAGS_HASH, payload);
      } else {
        for (const t of tags) memTags.set(t, now);
      }
    } catch (err) {
      console.error("[cache] revalidateTag esuat:", err?.message ?? err);
    }
  }

  // Cache temporar per-request: nu folosim, deci no-op.
  resetRequestCache() {}
};
