import * as React from "react";
import {
  EmailLayout,
  EmailHeading,
  EmailText,
  EmailWarning,
} from "../components/email-layout";
import { AlertBox } from "../components/alert-box";
import { DataTable } from "../components/data-table";
import { Divider } from "../components/divider";
import type { RentalRequestUserProps } from "../types";

/** Mockup #2 — confirmare către client la o cerere de închiriere utilaj. */
export function RentalRequestUserEmail({
  name,
  code,
  machine,
  period,
  accessReq,
}: RentalRequestUserProps) {
  return (
    <EmailLayout preview={`Solicitarea ta de închiriere — ${code}`}>
      <EmailHeading>Solicitare închiriere utilaj — înregistrată</EmailHeading>
      <EmailText>
        Bună, {name}! Am primit solicitarea ta de închiriere. Verificăm disponibilitatea
        și revenim cu detaliile de programare și acces.
      </EmailText>
      <AlertBox>Referință: {code}</AlertBox>
      <DataTable
        rows={[
          { label: "Utilaj", value: machine },
          { label: "Perioadă", value: period },
          { label: "Cerințe acces", value: accessReq },
        ]}
      />
      <Divider />
      <EmailWarning>
        Important: asigură accesul conform specificațiilor tehnice. Orice întârziere
        cauzată de lipsa accesului poate fi tarifată conform termenilor contractuali.
      </EmailWarning>
    </EmailLayout>
  );
}

RentalRequestUserEmail.PreviewProps = {
  name: "Maria Ionescu",
  code: "#REQ-2026-0915",
  machine: "Excavator pe șenile CAT 320",
  period: "15–18 Iul 2026",
  accessReq: "Lățime minimă poartă 3.5 m, sol stabil pentru platforma de descărcare.",
} satisfies RentalRequestUserProps;

export default RentalRequestUserEmail;
