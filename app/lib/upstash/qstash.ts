import "server-only";

import { Client as QstashClient } from "@upstash/qstash";
import { Client as WorkflowClient } from "@upstash/workflow";

/**
 * Acces centralizat la QStash (cozi de joburi) și la clientul de Workflow
 * (declanșarea pipeline-ului durabil de generare articole).
 *
 * Ambii clienți citesc `QSTASH_TOKEN` și, în dev, `QSTASH_URL` (serverul local
 * `npx @upstash/qstash-cli dev`) automat din environment.
 */

export function isQstashConfigured(): boolean {
  return Boolean(process.env.QSTASH_TOKEN);
}

let qstash: QstashClient | null = null;
let workflow: WorkflowClient | null = null;

export function getQstash(): QstashClient {
  if (!process.env.QSTASH_TOKEN) {
    throw new Error("Lipsește QSTASH_TOKEN pentru QStash.");
  }
  qstash ??= new QstashClient({
    token: process.env.QSTASH_TOKEN,
    baseUrl: process.env.QSTASH_URL,
  });
  return qstash;
}

export function getQstashOrNull(): QstashClient | null {
  return isQstashConfigured() ? getQstash() : null;
}

export function getWorkflowClient(): WorkflowClient {
  if (!process.env.QSTASH_TOKEN) {
    throw new Error("Lipsește QSTASH_TOKEN pentru Upstash Workflow.");
  }
  workflow ??= new WorkflowClient({
    token: process.env.QSTASH_TOKEN,
    baseUrl: process.env.QSTASH_URL,
  });
  return workflow;
}

/**
 * Originul public al aplicației, folosit pentru a construi URL-urile de
 * callback ale QStash/Workflow (au nevoie de un URL accesibil din internet în
 * producție, sau de serverul local în dev).
 */
export function appBaseUrl(): string {
  const base =
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return base.replace(/\/+$/, "");
}
