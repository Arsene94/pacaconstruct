import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { DataTable } from "../components/data-table";
import { EmailButton } from "../components/button";
import type { RentalRequestAdminProps } from "../types";

/** Notificare către admin la o cerere nouă de închiriere. */
export function RentalRequestAdminEmail({
  name,
  phone,
  email,
  machine,
  period,
  location,
  message,
  adminUrl,
}: RentalRequestAdminProps) {
  return (
    <EmailLayout
      preview={`Cerere nouă de închiriere de la ${name}`}
      footerNote="Notificare internă · sistemul PACA CONSTRUCT."
    >
      <EmailHeading>Cerere nouă de închiriere</EmailHeading>
      <EmailText>
        A fost înregistrată o cerere nouă de închiriere de la <b>{name}</b>.
      </EmailText>
      <DataTable
        rows={[
          { label: "Nume", value: name },
          { label: "Telefon", value: phone },
          { label: "Email", value: email },
          { label: "Utilaj", value: machine },
          { label: "Perioadă", value: period },
          { label: "Locație", value: location },
          { label: "Mesaj", value: message },
        ]}
      />
      <EmailButton href={adminUrl}>Deschide în panou</EmailButton>
    </EmailLayout>
  );
}

RentalRequestAdminEmail.PreviewProps = {
  name: "Maria Ionescu",
  phone: "0721 987 654",
  email: "maria.ionescu@example.com",
  machine: "Excavator pe șenile CAT 320",
  period: "15–18 Iul 2026",
  location: "Florești, Cluj",
  message: "Aș avea nevoie și de operator.",
  adminUrl: "https://pacaconstruct.ro/admin/cereri-inchiriere",
} satisfies RentalRequestAdminProps;

export default RentalRequestAdminEmail;
