"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  analyzeTopicsAction,
  deleteTopic,
  generateSelectedTopics,
} from "@/app/actions/blog-ai";
import { AdminIcon } from "@/app/admin/admin-icons";
import {
  IconLink,
  StatusBadge,
  TableCard,
  TableFooter,
  Th,
} from "@/app/admin/admin-ui";
import { DeleteButton } from "@/app/admin/form-client";
import type { BlogTopic } from "@/app/data/blog-ai";

const STATUS_META: Record<
  string,
  { label: string; tone: "neutral" | "warning" | "success" | "error" }
> = {
  idee: { label: "Idee", tone: "neutral" },
  in_coada: { label: "În coadă", tone: "warning" },
  generat: { label: "Generat", tone: "success" },
  esuat: { label: "Eșuat", tone: "error" },
};

export function TopicsManager({ topics }: { topics: BlogTopic[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState<null | "analyze" | "generate">(null);

  const selectable = topics.filter((t) => t.status !== "generat");
  const allSelected =
    selectable.length > 0 && selectable.every((t) => selected.has(t.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(selectable.map((t) => t.id)));
  }

  function runAnalyze() {
    setBusy("analyze");
    startTransition(async () => {
      await analyzeTopicsAction();
      setBusy(null);
      router.refresh();
    });
  }

  function runGenerate() {
    if (selected.size === 0) return;
    const fd = new FormData();
    selected.forEach((id) => fd.append("topicId", id));
    setBusy("generate");
    startTransition(async () => {
      await generateSelectedTopics(fd);
      setSelected(new Set());
      setBusy(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-[2px] border border-[#e6e1d7] bg-white p-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-medium text-[#6b706a]">
          {selected.size > 0
            ? `${selected.size} topice selectate pentru generare`
            : "Selectează topice și generează articole, sau analizează automat întrebările clienților."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runAnalyze}
            disabled={isPending}
            className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3] disabled:opacity-60"
          >
            <AdminIcon
              className="h-4.5 w-4.5"
              name={busy === "analyze" ? "history" : "analytics"}
            />
            {busy === "analyze" ? "Se analizează…" : "Analizează automat"}
          </button>
          <button
            type="button"
            onClick={runGenerate}
            disabled={isPending || selected.size === 0}
            className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#c27a1f] disabled:opacity-50"
          >
            <AdminIcon
              className="h-4.5 w-4.5"
              name={busy === "generate" ? "history" : "article"}
            />
            {busy === "generate"
              ? "Se generează…"
              : `Generează selectate${selected.size ? ` (${selected.size})` : ""}`}
          </button>
        </div>
      </div>

      <TableCard
        minWidth={960}
        footer={
          <TableFooter shown={topics.length} total={topics.length} noun="topice" />
        }
      >
        <thead>
          <tr>
            <Th className="w-10">
              <input
                type="checkbox"
                aria-label="Selectează toate"
                className="h-4 w-4 accent-[#58683c]"
                checked={allSelected}
                onChange={toggleAll}
              />
            </Th>
            <Th className="w-2/5">Topic</Th>
            <Th>Categorie</Th>
            <Th>Sursă</Th>
            <Th>Scor</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {topics.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-[#6b706a]">
                Niciun topic încă. Apasă „Analizează automat” sau adaugă unul manual.
              </td>
            </tr>
          ) : (
            topics.map((topic) => {
              const meta = STATUS_META[topic.status] ?? STATUS_META.idee;
              return (
                <tr
                  className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
                  key={topic.id}
                >
                  <td className="px-4 py-3 align-top">
                    <input
                      type="checkbox"
                      aria-label={`Selectează ${topic.title}`}
                      className="h-4 w-4 accent-[#58683c]"
                      checked={selected.has(topic.id)}
                      disabled={topic.status === "generat"}
                      onChange={() => toggle(topic.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#171a16]">{topic.title}</div>
                    {topic.angle ? (
                      <div className="mt-0.5 max-w-xl text-[11px] leading-4 text-[#6b706a]">
                        {topic.angle}
                      </div>
                    ) : null}
                    {topic.status === "esuat" && topic.last_error ? (
                      <div className="mt-1 max-w-xl text-[11px] leading-4 text-[#b91c1c]">
                        {topic.last_error}
                      </div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {topic.category ? (
                      <StatusBadge tone="forest">{topic.category}</StatusBadge>
                    ) : (
                      <span className="text-[#6b706a]">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                    {topic.source === "analiza" ? "Analiză AI" : "Manual"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                    {topic.score}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={meta.tone} dot>
                      {meta.label}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {topic.generated_post_id ? (
                        <Link
                          aria-label="Vezi articolul generat"
                          href="/admin/blog"
                          className="inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors hover:text-[#58683c]"
                        >
                          <AdminIcon className="h-4 w-4" name="openInNew" />
                        </Link>
                      ) : null}
                      <IconLink
                        icon="edit"
                        label="Editează"
                        href={`/admin/blog/topice/${topic.id}`}
                      />
                      <DeleteButton action={deleteTopic} id={topic.id} />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </TableCard>
    </>
  );
}
