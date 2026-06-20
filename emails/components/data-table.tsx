import * as React from "react";
import { Row, Column, Section } from "@react-email/components";
import { brand, fontFamily } from "../brand";

export type DataRow = { label: string; value: React.ReactNode };

/**
 * Tabel etichetă/valoare (mapează `.data-table` din mockup): coloana stângă
 * (label) cu majuscule gri, valoarea în dreapta, bordură subțire jos.
 */
export function DataTable({ rows }: { rows: DataRow[] }) {
  const visible = rows.filter(
    (r) => r.value !== null && r.value !== undefined && r.value !== "",
  );
  if (visible.length === 0) return null;
  return (
    <Section style={{ margin: "24px 0" }}>
      {visible.map((row, i) => (
        <Row key={i} style={{ borderBottom: `1px solid ${brand.limestone}` }}>
          <Column
            style={{
              width: "40%",
              padding: "12px",
              verticalAlign: "top",
              fontFamily,
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: brand.grey,
            }}
          >
            {row.label}
          </Column>
          <Column
            style={{
              padding: "12px",
              verticalAlign: "top",
              fontFamily,
              fontSize: "14px",
              color: brand.ink,
            }}
          >
            {row.value}
          </Column>
        </Row>
      ))}
    </Section>
  );
}
