import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { DataTable } from "../components/data-table";
import { Divider } from "../components/divider";
import { EmailButton } from "../components/button";
import type { AdminDailyDigestProps } from "../types";

/** Sumar zilnic către admin (cron). */
export function AdminDailyDigestEmail({
  requests,
  counts,
  adminUrl,
  periodLabel,
}: AdminDailyDigestProps) {
  return (
    <EmailLayout
      preview={`${counts.total} cereri noi · ${periodLabel}`}
      footerNote="Sumar automat · sistemul PACA CONSTRUCT."
    >
      <EmailHeading>Sumar zilnic — {periodLabel}</EmailHeading>
      <DataTable
        rows={[
          { label: "Cereri serviciu", value: String(counts.service) },
          { label: "Cereri închiriere", value: String(counts.rental) },
          { label: "Total", value: String(counts.total) },
        ]}
      />
      <Divider />
      {requests.length === 0 ? (
        <EmailText muted>Nicio cerere nouă în această perioadă.</EmailText>
      ) : (
        requests.map((r) => (
          <EmailText key={r.code} muted>
            <b>{r.code}</b> · {r.kind} · {r.name}
            {r.detail ? ` — ${r.detail}` : ""}
          </EmailText>
        ))
      )}
      <EmailButton href={adminUrl}>Deschide panoul</EmailButton>
    </EmailLayout>
  );
}

AdminDailyDigestEmail.PreviewProps = {
  periodLabel: "20 Iun 2026",
  counts: { service: 3, rental: 2, total: 5 },
  requests: [
    { code: "#REQ-2026-0892", name: "Andrei Pop", kind: "Serviciu", detail: "Excavații" },
    {
      code: "#REQ-2026-0915",
      name: "Maria Ionescu",
      kind: "Închiriere",
      detail: "CAT 320",
    },
  ],
  adminUrl: "https://pacaconstruct.ro/admin",
} satisfies AdminDailyDigestProps;

export default AdminDailyDigestEmail;
