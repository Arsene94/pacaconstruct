import type { CSSProperties } from "react";

/**
 * Tokeni de brand PACA CONSTRUCT pentru email-uri.
 *
 * Aceleași culori ca site-ul (vezi `design/admin/emai.html`). Email-urile NU pot
 * folosi Tailwind/variabile CSS în mod fiabil între clienți, așa că totul e
 * exprimat ca valori statice și aplicat inline.
 */
export const brand = {
  // Paleta
  olive: "#1e2a20", // header + footer (primary-container)
  oliveAccent: "#526529", // border alert-box (secondary)
  amber: "#d88a24", // CTA (safety-amber)
  limestone: "#e6e1d7", // borduri
  limestoneSoft: "#f0eee8", // fundal alert-box / surface-container
  carbon: "#171a16",
  surface: "#fbf9f3", // fundal pagină (body)
  paper: "#ffffff", // fundal container
  ink: "#1b1c18", // text principal (on-surface)
  inkMuted: "#434843", // text secundar (on-surface-variant)
  grey: "#6b706a", // text terțiar (technical-grey)
  footerText: "#849284", // text footer (on-primary-container)
  error: "#b91c1c", // avertismente
  success: "#15803d",
  white: "#ffffff",
} as const;

export const fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif' as const;

/** Lățimea canonică a email-ului (px). */
export const EMAIL_WIDTH = 600;

// ─── Stiluri partajate (inline) ──────────────────────────────────────────────

export const styles = {
  body: {
    backgroundColor: brand.surface,
    fontFamily,
    color: brand.ink,
    margin: 0,
    padding: 0,
  } satisfies CSSProperties,

  container: {
    width: "100%",
    maxWidth: `${EMAIL_WIDTH}px`,
    margin: "0 auto",
    backgroundColor: brand.paper,
    border: `1px solid ${brand.limestone}`,
  } satisfies CSSProperties,

  header: {
    backgroundColor: brand.olive,
    // Pattern „topo" — clienții care ignoră background-image cad pe culoare plină.
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
    padding: "24px",
    textAlign: "center" as const,
  } satisfies CSSProperties,

  headerLogo: {
    color: brand.white,
    fontSize: "24px",
    fontWeight: "bold" as const,
    letterSpacing: "1px",
    textDecoration: "none",
    margin: 0,
  } satisfies CSSProperties,

  content: {
    padding: "32px 24px",
  } satisfies CSSProperties,

  h1: {
    fontSize: "20px",
    fontWeight: "bold" as const,
    color: brand.ink,
    margin: "0 0 16px",
  } satisfies CSSProperties,

  paragraph: {
    fontSize: "16px",
    lineHeight: "24px",
    color: brand.inkMuted,
    margin: "0 0 24px",
  } satisfies CSSProperties,

  small: {
    fontSize: "14px",
    lineHeight: "22px",
    color: brand.grey,
    margin: "0 0 24px",
  } satisfies CSSProperties,

  footer: {
    backgroundColor: brand.olive,
    padding: "24px",
    textAlign: "center" as const,
    color: brand.footerText,
    fontSize: "12px",
    lineHeight: "18px",
  } satisfies CSSProperties,

  footerLink: {
    color: brand.footerText,
    textDecoration: "underline",
  } satisfies CSSProperties,
} as const;
