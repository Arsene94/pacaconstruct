import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/lib/site-config";

/** Zone private — niciodată indexate (dublate de `noindex` pe pagini). */
const DISALLOW = ["/admin", "/login", "/auth", "/api"];

/**
 * Boții AI pe care îi permitem EXPLICIT — vrem citare maximă în răspunsurile
 * generate de LLM-uri și în AI Overviews. Fiecare primește `allow: "/"` și
 * aceleași `disallow` private.
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
