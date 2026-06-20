import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { appBaseUrl } from "@/app/lib/upstash/qstash";

/**
 * Token de dezabonare semnat HMAC. Garantează că nimeni nu poate dezabona alt
 * contact ghicind un id — tokenul leagă `contactId` de un secret server
 * (`EMAIL_UNSUBSCRIBE_SECRET`). Folosit în header-ul List-Unsubscribe (one-click)
 * și în linkul din footer-ul email-urilor de marketing.
 */

function secret(): string | null {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET || null;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(contactId: string, key: string): string {
  return b64url(createHmac("sha256", key).update(contactId).digest());
}

/** Token = base64url(contactId).base64url(hmac). Null dacă secretul lipsește. */
export function signToken(contactId: string): string | null {
  const key = secret();
  if (!key) return null;
  return `${b64url(contactId)}.${sign(contactId, key)}`;
}

/** Verifică tokenul și întoarce `contactId`, sau null dacă e invalid. */
export function verifyToken(token: string): string | null {
  const key = secret();
  if (!key) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  let contactId: string;
  try {
    contactId = fromB64url(parts[0]).toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(contactId, key);
  const a = Buffer.from(expected);
  const b = Buffer.from(parts[1]);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? contactId : null;
}

/** URL public de dezabonare pentru un contact (null dacă secretul lipsește). */
export function unsubscribeUrl(contactId: string): string | null {
  const token = signToken(contactId);
  if (!token) return null;
  return `${appBaseUrl()}/unsubscribe?token=${encodeURIComponent(token)}`;
}
