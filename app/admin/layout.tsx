import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/app/lib/dal";
import { logout } from "@/app/actions/auth";
import { AdminIcon } from "./admin-icons";
import { AdminBreadcrumb, AdminSidebar } from "./admin-nav";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

// Zonă privată: niciodată indexată (dublat de Disallow în app/robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Barieră de securitate pentru toate paginile /admin.
  const user = await requireAdmin();
  const initials = (user.email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <div
      className={cx(
        styles.adminPage,
        "min-h-[100dvh] bg-[#f1efe9] text-[#171a16] md:h-[100dvh] md:overflow-hidden",
      )}
    >
      <AdminSidebar />

      <main id="main" className="flex min-h-[100dvh] flex-col bg-[#f1efe9] md:ml-[240px] md:h-full md:min-h-0 md:overflow-hidden">
        <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-[#e6e1d7] bg-white px-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="hidden font-serif-display text-xs font-semibold uppercase leading-4 text-[#6b706a] lg:block">
              Admin Terminal
            </div>
            <div className="hidden h-4 w-px bg-[#e6e1d7] lg:block" />
            <AdminBreadcrumb />
          </div>

          <div className="hidden max-w-md flex-1 px-4 md:block">
            <label className="relative block">
              <span className="sr-only">Caută în panou</span>
              <AdminIcon
                className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#747872]"
                name="search"
              />
              <input
                className="h-8 w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] pl-9 pr-3 text-xs font-medium leading-4 text-[#171a16] outline-none transition focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]"
                placeholder="Caută servicii, articole, proiecte..."
                type="search"
              />
            </label>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 border-r border-[#e6e1d7] pr-3 md:pr-4">
              <button
                aria-label="Notificări"
                className="rounded-[2px] p-1.5 text-[#6b706a] transition-colors hover:text-[#171a16]"
                type="button"
              >
                <AdminIcon className="h-5 w-5" name="notifications" />
              </button>
              <button
                aria-label="Istoric"
                className="rounded-[2px] p-1.5 text-[#6b706a] transition-colors hover:text-[#171a16]"
                type="button"
              >
                <AdminIcon className="h-5 w-5" name="history" />
              </button>
            </div>
            <div
              aria-label={user.email ?? "Administrator"}
              className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#1e2a20] text-[10px] font-bold text-white"
              role="img"
              title={user.email ?? undefined}
            >
              {initials}
            </div>
            <form action={logout}>
              <button
                aria-label="Deconectare"
                className="rounded-[2px] p-1.5 text-[#6b706a] transition-colors hover:text-[#b91c1c]"
                type="submit"
              >
                <AdminIcon className="h-5 w-5" name="logout" />
              </button>
            </form>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
