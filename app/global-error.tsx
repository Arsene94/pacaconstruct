"use client";

import { useEffect } from "react";
import { logger, errorContext } from "@/app/lib/logger";

/**
 * Prinde erorile din root layout-ul însuși. Trebuie să-și definească propriile
 * `<html>`/`<body>` fiindcă înlocuiește complet layout-ul. Stiluri inline ca să
 * nu depindă de globals.css (care s-ar putea să nu se fi încărcat).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled root error", {
      digest: error.digest,
      ...errorContext(error),
    });
  }, [error]);

  return (
    <html lang="ro">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf9f3",
          color: "#171a16",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "560px", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#d88a24",
            }}
          >
            Eroare critică
          </p>
          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "40px",
              lineHeight: 1.1,
              fontWeight: 600,
              color: "#1e2a20",
            }}
          >
            Site-ul a întâmpinat o problemă
          </h1>
          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "400px",
              lineHeight: 1.7,
              color: "#434843",
            }}
          >
            Încercăm să rezolvăm. Te rugăm să reîncerci în câteva momente.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "12px", fontSize: "12px", color: "#747872" }}>
              Cod referință: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "32px",
              border: "none",
              cursor: "pointer",
              background: "#d88a24",
              color: "#171a16",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Reîncearcă
          </button>
        </div>
      </body>
    </html>
  );
}
