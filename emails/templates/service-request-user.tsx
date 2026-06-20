import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { AlertBox } from "../components/alert-box";
import { DataTable } from "../components/data-table";
import type { ServiceRequestUserProps } from "../types";

/** Mockup #1 — confirmare către client la o cerere de serviciu/evaluare. */
export function ServiceRequestUserEmail({
  name,
  code,
  service,
  location,
  surface,
}: ServiceRequestUserProps) {
  return (
    <EmailLayout preview={`Am înregistrat solicitarea ta — ${code}`}>
      <EmailHeading>Confirmare solicitare evaluare</EmailHeading>
      <EmailText>
        Bună, {name}! Îți mulțumim pentru interesul acordat serviciilor PACA CONSTRUCT. Am
        înregistrat solicitarea ta și un inginer va prelua cazul în curând.
      </EmailText>
      <AlertBox>Referință: {code}</AlertBox>
      <DataTable
        rows={[
          { label: "Tip lucrare", value: service },
          { label: "Locație", value: location },
          { label: "Suprafață", value: surface },
        ]}
      />
      <EmailText muted>
        Te vom contacta telefonic în următoarele 24 de ore lucrătoare pentru a stabili
        detaliile necesare elaborării ofertei.
      </EmailText>
    </EmailLayout>
  );
}

ServiceRequestUserEmail.PreviewProps = {
  name: "Andrei Pop",
  code: "#REQ-2026-0892",
  service: "Excavații & Terasamente",
  location: "Str. Principală 45, Cluj-Napoca",
  surface: "450 m²",
} satisfies ServiceRequestUserProps;

export default ServiceRequestUserEmail;
