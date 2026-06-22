"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger, errorContext } from "@/app/lib/logger";

/**
 * Fallback branded pentru erori dintr-un segment de rută (Client Component
 * cerut de Next). `reset()` reîncearcă randarea segmentului. Logăm eroarea
 * către logger-ul structurat (seam pentru monitoring extern) — fără PII.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled segment error", {
      digest: error.digest,
      ...errorContext(error),
    });
  }, [error]);

  return (
    <main
      id="main"
      className="bg-topo flex min-h-[70vh] flex-1 items-center justify-center bg-background px-5 py-24"
    >
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-amber-strong">
          A apărut o eroare
        </p>
        <h1 className="mt-5 font-serif-display text-4xl font-semibold leading-[1.1] text-olive md:text-5xl">
          Ceva nu a funcționat
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-stone">
          Am întâmpinat o problemă la încărcarea acestei pagini. Poți reîncerca sau reveni
          la pagina principală.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted">
            Cod referință: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-amber px-6 py-3 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
          >
            Reîncearcă
          </button>
          <Link
            href="/"
            className="border border-olive/20 px-6 py-3 text-sm font-bold uppercase text-olive transition hover:border-olive/50 hover:text-amber-strong"
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </main>
  );
}
