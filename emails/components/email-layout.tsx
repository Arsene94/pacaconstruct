import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { brand, styles } from "../brand";

export type EmailLayoutProps = {
  /** Preheader — textul scurt afișat în inbox lângă subiect. */
  preview: string;
  children: React.ReactNode;
  /** Link de dezabonare (doar marketing). Generat per-contact, semnat HMAC. */
  unsubscribeUrl?: string;
  /** Override pentru linia mică din footer (ex. mesaj „generat automat"). */
  footerNote?: string;
};

/**
 * Cadrul comun al tuturor email-urilor PACA CONSTRUCT.
 *
 * Reproduce structura din `design/admin/emai.html`: header olive cu pattern
 * topo + logo, container 600px alb, footer olive. Stiluri inline, layout pe
 * tabele (via componentele React Email), `color-scheme: light` pentru a evita
 * inversarea automată în dark mode.
 */
export function EmailLayout({
  preview,
  children,
  unsubscribeUrl,
  footerNote,
}: EmailLayoutProps) {
  return (
    <Html lang="ro">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.headerLogo}>PACA CONSTRUCT</Text>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Section style={styles.footer}>
            <Text style={{ ...styles.footer, padding: 0, margin: 0 }}>
              {footerNote ?? "© PACA CONSTRUCT SRL · Tehnicitate în armonie cu natura."}
            </Text>
            {unsubscribeUrl ? (
              <Text style={{ ...styles.footer, padding: 0, margin: "8px 0 0" }}>
                Nu mai vrei aceste mesaje?{" "}
                <a href={unsubscribeUrl} style={styles.footerLink}>
                  Dezabonează-te
                </a>
                .
              </Text>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Titlu de secțiune (h1) brandat. */
export function EmailHeading({ children }: { children: React.ReactNode }) {
  return <Heading style={styles.h1}>{children}</Heading>;
}

/** Paragraf standard. */
export function EmailText({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return <Text style={muted ? styles.small : styles.paragraph}>{children}</Text>;
}

/** Paragraf de avertisment (roșu, bold) — vezi mockup #2. */
export function EmailWarning({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        ...styles.small,
        color: brand.error,
        fontWeight: "bold",
        margin: 0,
      }}
    >
      {children}
    </Text>
  );
}
