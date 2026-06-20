import * as React from "react";
import { Hr } from "@react-email/components";
import { brand } from "../brand";

/** Linie de separare (mapează `.divider`). */
export function Divider() {
  return (
    <Hr
      style={{
        border: "none",
        borderTop: `1px solid ${brand.limestone}`,
        margin: "24px 0",
      }}
    />
  );
}
