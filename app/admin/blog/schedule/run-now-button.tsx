"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { runScheduleNow } from "@/app/actions/blog-ai";
import { AdminIcon } from "@/app/admin/admin-icons";

export function RunNowButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run() {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await runScheduleNow(fd);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-1.5 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-2.5 py-1.5 text-[11px] font-bold text-[#6b706a] transition-colors hover:text-[#58683c] disabled:opacity-60"
    >
      <AdminIcon className="h-4 w-4" name={isPending ? "history" : "article"} />
      {isPending ? "Se generează…" : "Rulează acum"}
    </button>
  );
}
