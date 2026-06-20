import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { DataTable } from "../components/data-table";
import { EmailButton } from "../components/button";
import type { ServiceRequestAdminProps } from "../types";

/** Notificare către admin la o cerere nouă de serviciu. */
export function ServiceRequestAdminEmail({
  name,
  phone,
  email,
  service,
  location,
  surface,
  description,
  adminUrl,
}: ServiceRequestAdminProps) {
  return (
    <EmailLayout
      preview={`Cerere nouă de serviciu de la ${name}`}
      footerNote="Notificare internă · sistemul PACA CONSTRUCT."
    >
      <EmailHeading>Cerere nouă de serviciu</EmailHeading>
      <EmailText>
        A fost înregistrată o cerere nouă de serviciu de la <b>{name}</b>.
      </EmailText>
      <DataTable
        rows={[
          { label: "Nume", value: name },
          { label: "Telefon", value: phone },
          { label: "Email", value: email },
          { label: "Serviciu", value: service },
          { label: "Locație", value: location },
          { label: "Suprafață", value: surface },
          { label: "Detalii", value: description },
        ]}
      />
      <EmailButton href={adminUrl}>Deschide în panou</EmailButton>
    </EmailLayout>
  );
}

ServiceRequestAdminEmail.PreviewProps = {
  name: "Andrei Pop",
  phone: "0740 123 456",
  email: "andrei.pop@example.com",
  service: "Excavații & Terasamente",
  location: "Str. Principală 45, Cluj-Napoca",
  surface: "450 m²",
  description: "Nivelare teren + săpătură fundație casă P+1.",
  adminUrl: "https://pacaconstruct.ro/admin/cereri-servicii",
} satisfies ServiceRequestAdminProps;

export default ServiceRequestAdminEmail;
