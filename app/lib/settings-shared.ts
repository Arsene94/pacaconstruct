/**
 * Tipuri + helperi PURI pentru setările de site editabile din admin.
 *
 * Acest modul NU importă clienți Supabase și NU e marcat `server-only`, ca să
 * poată fi folosit și de Client Components (navbar, butoane flotante). Citirea
 * efectivă din DB stă în `app/data/settings.ts`.
 *
 * Sursa de DEFAULT-uri este `siteConfig` (app/lib/site-config.ts): orice secțiune
 * goală/lipsă din DB cade pe valoarea statică, deci site-ul funcționează identic
 * înainte de prima salvare din admin.
 */
import { siteConfig } from "@/app/lib/site-config";

// ─── Tipuri ──────────────────────────────────────────────────────────────────

export type PhoneNumber = {
  /** Identificator stabil (uuid generat la adăugare). */
  id: string;
  /** Etichetă vizibilă („Dispecerat", „Birou", „Vânzări"). */
  label: string;
  /** Format E.164 pentru `tel:` („+40712345678"). */
  e164: string;
  /** Format de afișare („+40 712 345 678"). */
  display: string;
  /** Are WhatsApp? */
  whatsapp: boolean;
  /** Mesaj pre-completat pentru WhatsApp (opțional). */
  whatsappMessage?: string;
  /** Numărul principal (exact unul `true`). */
  isPrimary: boolean;
  /** Apare în butonul flotant. */
  showInFloating: boolean;
  /** Ordinea de afișare. */
  order: number;
};

export type OpeningHours = {
  /** Zilele schema.org („Monday"…„Sunday"). */
  days: string[];
  /** Ora de deschidere („08:00"). */
  opens: string;
  /** Ora de închidere („18:00"). */
  closes: string;
  /** Eticheta de afișare („L-V: 08:00 - 18:00"). */
  label: string;
  /** Interval închis (nu generează OpeningHoursSpecification). */
  closed: boolean;
};

export type FloatingChannels = {
  whatsapp: boolean;
  call: boolean;
  scrollTop: boolean;
  email: boolean;
};

export type FloatingConfig = {
  enabled: boolean;
  position: "right" | "left";
  channels: FloatingChannels;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  /** Etichete vizibile la hover/focus. */
  expandLabels: boolean;
  /** Numărul folosit pentru WhatsApp (implicit: primul cu whatsapp / principal). */
  whatsappPhoneId?: string;
  /** Numărul folosit pentru apel (implicit: principal). */
  callPhoneId?: string;
};

export type Announcement = {
  enabled: boolean;
  text: string;
  href?: string;
};

export type Address = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
};

export type Geo = { latitude: number; longitude: number };

export type ContactInfo = {
  emailPrimary: string;
  emailOffice: string;
  address: Address;
  geo: Geo;
  mapUrl: string;
};

export type SocialLinks = {
  googleBusiness: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
};

/** Setările complet rezolvate (DB peste defaults siteConfig). */
export type ResolvedSettings = {
  phones: PhoneNumber[];
  contact: ContactInfo;
  hours: OpeningHours[];
  social: SocialLinks;
  floating: FloatingConfig;
  announcement: Announcement;
};

/** Rândul brut din DB (coloane jsonb, conținut necunoscut până la validare). */
export type SettingsRow = {
  phones: unknown;
  contact: unknown;
  hours: unknown;
  social: unknown;
  floating: unknown;
  announcement: unknown;
};

// ─── Default-uri (din siteConfig) ────────────────────────────────────────────

export const DEFAULT_WHATSAPP_MESSAGE =
  "Bună ziua, aș dori o ofertă pentru lucrarea mea.";

export function defaultPhones(): PhoneNumber[] {
  // Sintetizează un singur număr din NAP-ul static (compat înainte de prima salvare).
  return [
    {
      id: "primary",
      label: "Telefon",
      e164: siteConfig.phone,
      display: siteConfig.phoneDisplay,
      whatsapp: Boolean(siteConfig.whatsapp),
      isPrimary: true,
      showInFloating: true,
      order: 0,
    },
  ];
}

export function defaultContact(): ContactInfo {
  return {
    emailPrimary: siteConfig.email,
    emailOffice: siteConfig.emailOffice,
    address: { ...siteConfig.address },
    geo: { ...siteConfig.geo },
    mapUrl: siteConfig.mapUrl,
  };
}

export function defaultHours(): OpeningHours[] {
  return siteConfig.openingHours.map((slot) => ({
    days: [...slot.days],
    opens: slot.opens,
    closes: slot.closes,
    label: slot.label,
    closed: false,
  }));
}

export function defaultSocial(): SocialLinks {
  return {
    googleBusiness: siteConfig.social.googleBusiness,
    facebook: siteConfig.social.facebook,
    instagram: siteConfig.social.instagram,
    linkedin: siteConfig.social.linkedin,
    tiktok: "",
    youtube: "",
  };
}

export function defaultFloating(): FloatingConfig {
  return {
    enabled: true,
    position: "right",
    channels: { whatsapp: true, call: true, scrollTop: true, email: false },
    showOnMobile: true,
    showOnDesktop: true,
    expandLabels: true,
  };
}

export function defaultAnnouncement(): Announcement {
  return {
    enabled: true,
    text: "Evaluare si ofertare pentru proiectul tau",
    href: "",
  };
}

// ─── Normalizare defensivă (DB → tipuri valide, fallback pe default) ──────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function normalizePhone(value: unknown, index: number): PhoneNumber | null {
  if (!isRecord(value)) return null;
  const e164 = asString(value.e164).trim();
  const display = asString(value.display).trim() || e164;
  if (!e164) return null;
  const message = asString(value.whatsappMessage).trim();
  return {
    id: asString(value.id).trim() || `phone-${index}`,
    label: asString(value.label).trim() || "Telefon",
    e164,
    display,
    whatsapp: asBool(value.whatsapp),
    ...(message ? { whatsappMessage: message } : {}),
    isPrimary: asBool(value.isPrimary),
    showInFloating: asBool(value.showInFloating, true),
    order: asNumber(value.order, index),
  };
}

export function normalizePhones(value: unknown): PhoneNumber[] {
  if (!Array.isArray(value)) return defaultPhones();
  const phones = value
    .map((item, i) => normalizePhone(item, i))
    .filter((p): p is PhoneNumber => p !== null)
    .sort((a, b) => a.order - b.order)
    .map((p, i) => ({ ...p, order: i }));
  if (phones.length === 0) return defaultPhones();
  // Garantează exact un număr principal.
  if (!phones.some((p) => p.isPrimary)) {
    phones[0].isPrimary = true;
  } else {
    let seen = false;
    for (const p of phones) {
      if (p.isPrimary && seen) p.isPrimary = false;
      else if (p.isPrimary) seen = true;
    }
  }
  return phones;
}

function normalizeContact(value: unknown): ContactInfo {
  const base = defaultContact();
  if (!isRecord(value)) return base;
  const address = isRecord(value.address) ? value.address : {};
  const geo = isRecord(value.geo) ? value.geo : {};
  return {
    emailPrimary: asString(value.emailPrimary).trim() || base.emailPrimary,
    emailOffice: asString(value.emailOffice).trim() || base.emailOffice,
    address: {
      streetAddress: asString(address.streetAddress).trim() || base.address.streetAddress,
      addressLocality:
        asString(address.addressLocality).trim() || base.address.addressLocality,
      addressRegion: asString(address.addressRegion).trim() || base.address.addressRegion,
      postalCode: asString(address.postalCode).trim() || base.address.postalCode,
      addressCountry:
        asString(address.addressCountry).trim() || base.address.addressCountry,
    },
    geo: {
      latitude: asNumber(geo.latitude, base.geo.latitude),
      longitude: asNumber(geo.longitude, base.geo.longitude),
    },
    mapUrl: asString(value.mapUrl).trim() || base.mapUrl,
  };
}

function normalizeHours(value: unknown): OpeningHours[] {
  if (!Array.isArray(value) || value.length === 0) return defaultHours();
  const hours = value.filter(isRecord).map((slot) => ({
    days: Array.isArray(slot.days)
      ? slot.days.filter((d): d is string => typeof d === "string")
      : [],
    opens: asString(slot.opens, "08:00"),
    closes: asString(slot.closes, "18:00"),
    label: asString(slot.label),
    closed: asBool(slot.closed),
  }));
  return hours.length ? hours : defaultHours();
}

function normalizeSocial(value: unknown): SocialLinks {
  const base = defaultSocial();
  if (!isRecord(value)) return base;
  return {
    googleBusiness: asString(value.googleBusiness).trim() || base.googleBusiness,
    facebook: asString(value.facebook).trim() || base.facebook,
    instagram: asString(value.instagram).trim() || base.instagram,
    linkedin: asString(value.linkedin).trim() || base.linkedin,
    tiktok: asString(value.tiktok).trim() || base.tiktok,
    youtube: asString(value.youtube).trim() || base.youtube,
  };
}

function normalizeFloating(value: unknown): FloatingConfig {
  const base = defaultFloating();
  if (!isRecord(value)) return base;
  const channels = isRecord(value.channels) ? value.channels : {};
  const position = value.position === "left" ? "left" : "right";
  const whatsappPhoneId = asString(value.whatsappPhoneId).trim();
  const callPhoneId = asString(value.callPhoneId).trim();
  return {
    enabled: asBool(value.enabled, base.enabled),
    position,
    channels: {
      whatsapp: asBool(channels.whatsapp, base.channels.whatsapp),
      call: asBool(channels.call, base.channels.call),
      scrollTop: asBool(channels.scrollTop, base.channels.scrollTop),
      email: asBool(channels.email, base.channels.email),
    },
    showOnMobile: asBool(value.showOnMobile, base.showOnMobile),
    showOnDesktop: asBool(value.showOnDesktop, base.showOnDesktop),
    expandLabels: asBool(value.expandLabels, base.expandLabels),
    ...(whatsappPhoneId ? { whatsappPhoneId } : {}),
    ...(callPhoneId ? { callPhoneId } : {}),
  };
}

function normalizeAnnouncement(value: unknown): Announcement {
  const base = defaultAnnouncement();
  if (!isRecord(value)) return base;
  // `enabled` lipsă din DB → cade pe default (true). `text` gol → default.
  const text = asString(value.text).trim() || base.text;
  const href = asString(value.href).trim();
  return {
    enabled: asBool(value.enabled, base.enabled),
    text,
    ...(href ? { href } : {}),
  };
}

/** Combină un rând brut din DB peste default-urile siteConfig. */
export function resolveSettings(
  row: Partial<SettingsRow> | null | undefined,
): ResolvedSettings {
  return {
    phones: normalizePhones(row?.phones),
    contact: normalizeContact(row?.contact),
    hours: normalizeHours(row?.hours),
    social: normalizeSocial(row?.social),
    floating: normalizeFloating(row?.floating),
    announcement: normalizeAnnouncement(row?.announcement),
  };
}

// ─── Helperi de selecție / linkuri ───────────────────────────────────────────

export function getPrimaryPhone(s: ResolvedSettings): PhoneNumber | null {
  return s.phones.find((p) => p.isPrimary) ?? s.phones[0] ?? null;
}

export function getWhatsAppPhones(s: ResolvedSettings): PhoneNumber[] {
  return s.phones.filter((p) => p.whatsapp);
}

export function getFloatingPhones(s: ResolvedSettings): PhoneNumber[] {
  return s.phones.filter((p) => p.showInFloating);
}

/** Doar cifrele dintr-un număr (pentru wa.me). */
export function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

export function telLink(phone: PhoneNumber): string {
  return `tel:${phone.e164}`;
}

export function waLink(
  phone: PhoneNumber,
  fallbackMessage = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const digits = digitsOf(phone.e164);
  const message = phone.whatsappMessage?.trim() || fallbackMessage;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/** Telefonul folosit de butonul flotant WhatsApp (config explicit → fallback). */
export function resolveFloatingWhatsApp(s: ResolvedSettings): PhoneNumber | null {
  const id = s.floating.whatsappPhoneId;
  if (id) {
    const found = s.phones.find((p) => p.id === id && p.whatsapp);
    if (found) return found;
  }
  return getWhatsAppPhones(s)[0] ?? getPrimaryPhone(s);
}

/** Telefonul folosit de butonul flotant de apel (config explicit → principal). */
export function resolveFloatingCall(s: ResolvedSettings): PhoneNumber | null {
  const id = s.floating.callPhoneId;
  if (id) {
    const found = s.phones.find((p) => p.id === id);
    if (found) return found;
  }
  return getPrimaryPhone(s);
}

/** URL-urile sociale completate, pentru schema `sameAs`. */
export function socialSameAs(social: SocialLinks): string[] {
  return Object.values(social).filter((url) => url.trim().length > 0);
}
