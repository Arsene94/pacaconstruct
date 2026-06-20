/**
 * Logger structurat minim (izomorf server/client).
 *
 * Emite o singură linie JSON per eveniment, ușor de ingerat de un log-drain
 * (Vercel, Datadog etc.). Înlocuiește `console.error` ad-hoc cu nivel + context.
 *
 * Seam pentru monitoring extern: `report()` e singurul punct de ieșire — când
 * se adaugă Sentry/echivalent, doar aici se cuplează (`captureException`).
 * Momentan monitoring-ul extern e dezactivat (vezi raportul), deci doar logăm.
 *
 * IMPORTANT: nu pasa date personale sensibile în `context` (telefon, email,
 * mesajul clientului). Loghează doar identificatori și cod/cauză.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

function emit(level: LogLevel, message: string, context?: LogContext): void {
  const entry: Record<string, unknown> = {
    level,
    msg: message,
    time: new Date().toISOString(),
    ...context,
  };

  let line: string;
  try {
    line = JSON.stringify(entry);
  } catch {
    // Context neserializabil — degradează la mesaj simplu.
    line = JSON.stringify({ level, msg: message, time: entry.time });
  }

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (level === "debug") {
    if (process.env.NODE_ENV !== "production") console.debug(line);
  } else console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogContext) => emit("debug", message, context),
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
};

/**
 * Normalizează o valoare aruncată (`unknown`) în context de log fără PII:
 * nume + mesaj + un digest scurt, fără payload-ul brut.
 */
export function errorContext(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      errName: error.name,
      errMessage: error.message,
      ...(error.stack ? { errStack: error.stack.split("\n").slice(0, 4).join(" | ") } : {}),
    };
  }
  return { errMessage: String(error) };
}
