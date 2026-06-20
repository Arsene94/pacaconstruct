"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { AdminIcon } from "./admin-icons";
import { FieldHint } from "./form-ui";

const labelClass =
  "mb-1.5 block font-serif-display text-[11px] font-semibold uppercase tracking-wide text-[#6b706a]";

/**
 * Câmp de încărcare imagine pentru formularele de admin. Trimite fișierul la
 * `/api/admin/upload`, primește un URL public și îl păstrează:
 *  - în „form mode” (prop `name`) → într-un `<input type="hidden">`, ca
 *    Server Action-ul să primească în continuare un string (URL), neschimbat.
 *  - în „controlled mode” (prop `onValueChange`) → urcat în starea părintelui.
 *
 * Afișează previzualizare, buton de ștergere și stare de încărcare/eroare.
 */
export function ImageUploadField({
  name,
  label,
  defaultValue,
  value,
  onValueChange,
  hint,
  required,
  full = true,
  folder,
}: {
  /** Numele câmpului (form mode). Necesar dacă valoarea merge prin FormData. */
  name?: string;
  label: string;
  defaultValue?: string | null;
  /** Valoarea controlată (controlled mode). Are prioritate față de starea internă. */
  value?: string;
  /** Callback când URL-ul se schimbă (controlled mode). */
  onValueChange?: (url: string) => void;
  hint?: ReactNode;
  required?: boolean;
  full?: boolean;
  /** Subdosar în bucket (ex. „blog”, „servicii”) pentru organizare. */
  folder?: string;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const url = isControlled ? value : internal;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const setUrl = (next: string) => {
    if (isControlled) onValueChange?.(next);
    else setInternal(next);
  };

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      if (folder) body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Încărcarea a eșuat.");
      }
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Încărcarea a eșuat.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className={full ? "block md:col-span-2" : "block"}>
      <span className={labelClass}>
        {label}
        {required ? <span className="text-[#b91c1c]"> *</span> : null}
      </span>

      {name ? <input type="hidden" name={name} value={url} required={required} /> : null}

      <div className="flex items-start gap-3">
        <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3]">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <AdminIcon className="h-5 w-5 text-[#b7b2a6]" name="image" />
          )}
          {busy ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <AdminIcon className="h-4 w-4 animate-spin text-[#58683c]" name="history" />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-3 text-xs font-medium text-[#171a16] transition-colors hover:border-[#58683c] hover:text-[#58683c]"
            >
              <AdminIcon className="h-3.5 w-3.5" name="upload" />
              {busy ? "Se încarcă…" : url ? "Schimbă imaginea" : "Încarcă imagine"}
            </label>
            {url ? (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setError(null);
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-[#e6e1d7] bg-white px-3 text-xs font-medium text-[#6b706a] transition-colors hover:border-[#b91c1c]/40 hover:text-[#b91c1c]"
              >
                <AdminIcon className="h-3.5 w-3.5" name="delete" />
                Elimină
              </button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          {url ? (
            <p className="mt-1 truncate text-[11px] text-[#6b706a]" title={url}>
              {url}
            </p>
          ) : null}
          {error ? (
            <p className="mt-1 text-[11px] font-semibold text-[#b91c1c]">{error}</p>
          ) : null}
          {hint ? <FieldHint>{hint}</FieldHint> : null}
        </div>
      </div>
    </div>
  );
}
