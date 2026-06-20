import * as React from "react";
import { Button, Section } from "@react-email/components";
import { brand, fontFamily } from "../brand";

/** CTA amber centrat (mapează clasa `.button` din mockup). */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Section style={{ textAlign: "center", margin: "8px 0" }}>
      <Button
        href={href}
        style={{
          backgroundColor: brand.amber,
          color: brand.white,
          fontFamily,
          fontSize: "16px",
          fontWeight: "bold",
          textDecoration: "none",
          padding: "14px 28px",
          borderRadius: "2px",
          display: "inline-block",
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
