import * as React from "react";
import { Section, Text } from "@react-email/components";
import { brand, fontFamily } from "../brand";

/** Cutie de evidențiere (mapează `.alert-box`): fundal limestone, bordură olive stânga. */
export function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: brand.limestoneSoft,
        borderLeft: `4px solid ${brand.oliveAccent}`,
        padding: "16px",
        margin: "0 0 24px",
      }}
    >
      <Text
        style={{
          margin: 0,
          fontFamily,
          fontSize: "14px",
          fontWeight: "bold",
          color: brand.ink,
        }}
      >
        {children}
      </Text>
    </Section>
  );
}
