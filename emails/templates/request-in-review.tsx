import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { AlertBox } from "../components/alert-box";
import type { RequestInReviewProps } from "../types";

/** Ciclu de viață — status „În evaluare". */
export function RequestInReviewEmail({ name, code }: RequestInReviewProps) {
  return (
    <EmailLayout preview={`Solicitarea ${code} este în evaluare`}>
      <EmailHeading>Solicitarea ta este în evaluare</EmailHeading>
      <EmailText>
        Bună, {name}! Un inginer PACA CONSTRUCT analizează acum cazul tău și pregătește
        pașii următori.
      </EmailText>
      <AlertBox>Referință: {code}</AlertBox>
      <EmailText muted>
        Revenim cu o ofertă sau cu detalii suplimentare cât de curând. Nu e nevoie să faci
        nimic în acest moment.
      </EmailText>
    </EmailLayout>
  );
}

RequestInReviewEmail.PreviewProps = {
  name: "Andrei Pop",
  code: "#REQ-2026-0892",
} satisfies RequestInReviewProps;

export default RequestInReviewEmail;
