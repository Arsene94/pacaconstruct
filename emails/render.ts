import { createElement } from "react";
import { render } from "@react-email/render";
import { emailRegistry } from "./registry";
import type { EmailPropsMap, EmailTemplateKey } from "./types";

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

/**
 * Randează un template în HTML cross-client + variantă text + subiect.
 *
 * `overrides.subject` permite subiectul editabil din DB (`email_templates`);
 * altfel folosește subiectul implicit din registry.
 */
export async function renderEmail<K extends EmailTemplateKey>(
  key: K,
  props: EmailPropsMap[K],
  overrides?: { subject?: string },
): Promise<RenderedEmail> {
  const entry = emailRegistry[key];
  const element = createElement(entry.component, props);
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  return {
    subject: overrides?.subject?.trim() || entry.subject(props),
    html,
    text,
  };
}
