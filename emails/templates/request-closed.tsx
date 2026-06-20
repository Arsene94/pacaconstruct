import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { EmailButton } from "../components/button";
import type { RequestClosedProps } from "../types";

/** Ciclu de viață — status „Închisă" (+ CTA recenzie Google). */
export function RequestClosedEmail({ name, code, reviewUrl }: RequestClosedProps) {
  return (
    <EmailLayout preview="Îți mulțumim că ai ales PACA CONSTRUCT">
      <EmailHeading>Îți mulțumim!</EmailHeading>
      <EmailText>
        Bună, {name}! Am finalizat solicitarea {code}. Ne-a făcut plăcere să lucrăm
        împreună și sperăm că rezultatul e pe măsura așteptărilor.
      </EmailText>
      <EmailText muted>
        Dacă ai un minut, o recenzie ne ajută enorm și ne arată ce putem face mai bine.
      </EmailText>
      {reviewUrl ? (
        <EmailButton href={reviewUrl}>Lasă o recenzie Google</EmailButton>
      ) : null}
    </EmailLayout>
  );
}

RequestClosedEmail.PreviewProps = {
  name: "Andrei Pop",
  code: "#REQ-2026-0892",
  reviewUrl: "https://g.page/r/paca-construct/review",
} satisfies RequestClosedProps;

export default RequestClosedEmail;
