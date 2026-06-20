import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { AlertBox } from "../components/alert-box";
import { DataTable } from "../components/data-table";
import type { RequestConfirmedProps } from "../types";

/** Ciclu de viață — status „Confirmat". */
export function RequestConfirmedEmail({
  name,
  code,
  scheduleInfo,
}: RequestConfirmedProps) {
  return (
    <EmailLayout preview={`Lucrarea ${code} este confirmată`}>
      <EmailHeading>Lucrarea ta este confirmată</EmailHeading>
      <EmailText>
        Bună, {name}! Confirmăm programarea lucrării. Echipa noastră se ocupă de tot — mai
        jos găsești pașii următori.
      </EmailText>
      <AlertBox>Referință: {code}</AlertBox>
      <DataTable rows={[{ label: "Programare", value: scheduleInfo }]} />
      <EmailText muted>
        Dacă apare orice schimbare, te anunțăm din timp. Ne poți contacta oricând
        răspunzând la acest email.
      </EmailText>
    </EmailLayout>
  );
}

RequestConfirmedEmail.PreviewProps = {
  name: "Andrei Pop",
  code: "#REQ-2026-0892",
  scheduleInfo: "Începere lucrări: 22 Iul 2026, ora 08:00.",
} satisfies RequestConfirmedProps;

export default RequestConfirmedEmail;
