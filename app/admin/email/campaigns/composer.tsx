"use client";

import { useState, useTransition } from "react";
import {
  renderEmailPreview,
  sendTestEmail,
  createCampaign,
  sendBroadcast,
  countMarketingAudience,
} from "@/app/actions/campaigns";
import { ImageUploadField } from "@/app/admin/image-upload-field";

type Option = { value: string; label: string };

const inputClass =
  "h-9 w-full rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm text-[#171a16] outline-none focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]";
const labelClass =
  "mb-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#6b706a]";

type Fields = {
  heading: string;
  paragraph: string;
  ctaLabel: string;
  ctaUrl: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
};

const EMPTY: Fields = {
  heading: "",
  paragraph: "",
  ctaLabel: "",
  ctaUrl: "",
  title: "",
  excerpt: "",
  url: "",
  imageUrl: "",
};

function buildPayload(templateKey: string, f: Fields): Record<string, unknown> {
  if (templateKey === "newsletter_article") {
    return {
      title: f.title,
      excerpt: f.excerpt,
      url: f.url,
      imageUrl: f.imageUrl || null,
    };
  }
  // broadcast_generic
  const blocks: Record<string, unknown>[] = [];
  if (f.paragraph) blocks.push({ type: "paragraph", text: f.paragraph });
  if (f.ctaLabel && f.ctaUrl)
    blocks.push({ type: "button", text: f.ctaLabel, href: f.ctaUrl });
  return { heading: f.heading, blocks };
}

export function Composer({
  templates,
  audiences,
  defaultTestEmail,
}: {
  templates: Option[];
  audiences: Option[];
  defaultTestEmail: string;
}) {
  const [templateKey, setTemplateKey] = useState(templates[0]?.value ?? "");
  const [audience, setAudience] = useState(audiences[0]?.value ?? "");
  const [subject, setSubject] = useState("");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [html, setHtml] = useState<string>("");
  const [width, setWidth] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState(defaultTestEmail);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const isNewsletter = templateKey === "newsletter_article";
  const set = (k: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  function previewVars() {
    return { ...buildPayload(templateKey, fields), unsubscribeUrl: "#unsub" };
  }

  function doPreview() {
    start(async () => {
      const res = await renderEmailPreview(templateKey, previewVars());
      if (res.ok) {
        setHtml(res.html);
        setMsg(null);
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  function doTest() {
    start(async () => {
      const res = await sendTestEmail(templateKey, testEmail, previewVars());
      setMsg({ ok: res.ok, text: res.ok ? (res.info ?? "Trimis.") : res.error });
    });
  }

  function parseAudience() {
    const [kind, id] = audience.split(":");
    return { kind: kind as "group" | "segment", id: id ?? "" };
  }

  function doSend() {
    start(async () => {
      const { kind, id } = parseAudience();
      const count = await countMarketingAudience(kind, id);
      if (
        !window.confirm(
          `Trimiți campania către ${count} destinatari (activi + consimțământ marketing)?`,
        )
      ) {
        return;
      }
      const created = await createCampaign({
        templateKey,
        audienceKind: kind,
        audienceId: id,
        subject,
        payload: buildPayload(templateKey, fields),
      });
      if (!created.ok || !created.id) {
        setMsg({ ok: false, text: created.ok ? "Eroare." : created.error });
        return;
      }
      const sent = await sendBroadcast(created.id);
      setMsg({
        ok: sent.ok,
        text: sent.ok ? `Campanie pornită către ${count} destinatari.` : sent.error,
      });
    });
  }

  function doSchedule() {
    start(async () => {
      const when = window.prompt("Programează la (ISO, ex. 2026-07-01T09:00):");
      if (!when) return;
      const { kind, id } = parseAudience();
      const created = await createCampaign({
        templateKey,
        audienceKind: kind,
        audienceId: id,
        subject,
        payload: buildPayload(templateKey, fields),
        scheduledAt: new Date(when).toISOString(),
      });
      setMsg({
        ok: created.ok,
        text: created.ok ? "Campanie programată." : created.error,
      });
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Editor */}
      <div className="space-y-4 rounded-[2px] border border-[#e6e1d7] bg-white p-5 shadow-sm">
        {msg ? (
          <div
            className={`rounded-[2px] px-3 py-2 text-xs font-semibold ${
              msg.ok
                ? "border border-[#15803d]/30 bg-[#15803d]/10 text-[#15803d]"
                : "border border-[#b91c1c]/30 bg-[#ffdad6]/40 text-[#93000a]"
            }`}
          >
            {msg.text}
          </div>
        ) : null}

        <div>
          <label className={labelClass}>Template</label>
          <select
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
            className={inputClass}
          >
            {templates.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Audiență</label>
          {audiences.length === 0 ? (
            <p className="text-xs text-[#b91c1c]">Creează întâi un grup sau segment.</p>
          ) : (
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={inputClass}
            >
              {audiences.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className={labelClass}>Subiect (override, opțional)</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Lăsat gol → subiectul implicit al template-ului"
            className={inputClass}
          />
        </div>

        {isNewsletter ? (
          <>
            <div>
              <label className={labelClass}>Titlu articol</label>
              <input
                value={fields.title}
                onChange={set("title")}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Rezumat</label>
              <textarea
                value={fields.excerpt}
                onChange={set("excerpt")}
                rows={3}
                className="w-full rounded-[2px] border border-[#e6e1d7] bg-white p-3 text-sm outline-none focus:border-[#58683c]"
              />
            </div>
            <div>
              <label className={labelClass}>URL articol</label>
              <input value={fields.url} onChange={set("url")} className={inputClass} />
            </div>
            <ImageUploadField
              label="Imagine (opțional)"
              folder="email"
              value={fields.imageUrl}
              onValueChange={(url) => setFields((f) => ({ ...f, imageUrl: url }))}
            />
          </>
        ) : (
          <>
            <div>
              <label className={labelClass}>Titlu</label>
              <input
                value={fields.heading}
                onChange={set("heading")}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Paragraf</label>
              <textarea
                value={fields.paragraph}
                onChange={set("paragraph")}
                rows={4}
                className="w-full rounded-[2px] border border-[#e6e1d7] bg-white p-3 text-sm outline-none focus:border-[#58683c]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Text buton (opțional)</label>
                <input
                  value={fields.ctaLabel}
                  onChange={set("ctaLabel")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL buton</label>
                <input
                  value={fields.ctaUrl}
                  onChange={set("ctaUrl")}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-[#e6e1d7] pt-4">
          <button
            type="button"
            onClick={doPreview}
            disabled={pending}
            className="h-9 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-4 text-xs font-medium text-[#171a16] hover:bg-white disabled:opacity-60"
          >
            Preview
          </button>
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="email test"
            className="h-9 w-44 rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-sm outline-none focus:border-[#58683c]"
          />
          <button
            type="button"
            onClick={doTest}
            disabled={pending}
            className="h-9 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-4 text-xs font-medium text-[#171a16] hover:bg-white disabled:opacity-60"
          >
            Trimite test
          </button>
          <button
            type="button"
            onClick={doSend}
            disabled={pending || !audience}
            className="h-9 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium text-white hover:bg-[#c27a1f] disabled:opacity-60"
          >
            Trimite acum
          </button>
          <button
            type="button"
            onClick={doSchedule}
            disabled={pending || !audience}
            className="h-9 rounded-[2px] border border-[#58683c] bg-white px-4 text-xs font-medium text-[#58683c] hover:bg-[#fbf9f3] disabled:opacity-60"
          >
            Programează
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-[2px] border border-[#e6e1d7] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#6b706a]">Preview</span>
          <div className="flex gap-1">
            {(["desktop", "mobile"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWidth(w)}
                className={`h-7 rounded-[2px] px-3 text-[11px] font-bold ${
                  width === w
                    ? "bg-[#58683c] text-white"
                    : "border border-[#e6e1d7] bg-[#fbf9f3] text-[#6b706a]"
                }`}
              >
                {w === "desktop" ? "Desktop 600px" : "Mobil 375px"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center overflow-auto bg-[#fbf9f3] p-3">
          {html ? (
            <iframe
              title="Preview email"
              srcDoc={html}
              style={{
                width: width === "desktop" ? 600 : 375,
                height: 720,
                border: "1px solid #e6e1d7",
                background: "#fff",
              }}
            />
          ) : (
            <p className="py-16 text-sm text-[#6b706a]">
              Apasă „Preview” pentru a randa emailul.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
