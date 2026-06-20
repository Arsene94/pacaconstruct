import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { AlertBox } from "../components/alert-box";
import { EmailButton } from "../components/button";
import type { RequestQuotedProps } from "../types";

/** Ciclu de viață — status „Ofertat". */
export function RequestQuotedEmail({ name, code, offerUrl }: RequestQuotedProps) {
  return (
    <EmailLayout preview={`Oferta ta pentru ${code} este gata`}>
      <EmailHeading>Oferta ta este gata</EmailHeading>
      <EmailText>
        Bună, {name}! Am pregătit oferta pentru solicitarea ta. O poți consulta mai jos și
        ne poți răspunde direct la acest email cu eventuale întrebări.
      </EmailText>
      <AlertBox>Referință: {code}</AlertBox>
      {offerUrl ? (
        <EmailButton href={offerUrl}>Vezi oferta</EmailButton>
      ) : (
        <EmailText muted>Îți trimitem oferta detaliată în scurt timp.</EmailText>
      )}
    </EmailLayout>
  );
}

RequestQuotedEmail.PreviewProps = {
  name: "Andrei Pop",
  code: "#REQ-2026-0892",
  offerUrl: "https://pacaconstruct.ro/oferta/REQ-2026-0892",
} satisfies RequestQuotedProps;

export default RequestQuotedEmail;
