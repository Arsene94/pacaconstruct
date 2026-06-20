"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, type AdminIconName } from "./admin-icons";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type NavItem = { label: string; icon: AdminIconName; href: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Servicii", icon: "engineering", href: "/admin/servicii" },
  { label: "Utilaje de închiriat", icon: "construction", href: "/admin/utilaje" },
  { label: "FAQ", icon: "help", href: "/admin/faq" },
  { label: "Blogs", icon: "article", href: "/admin/blog" },
  { label: "Topice blog", icon: "analytics", href: "/admin/blog/topice" },
  { label: "Programări blog", icon: "eventNote", href: "/admin/blog/schedule" },
  { label: "Proiecte", icon: "architecture", href: "/admin/proiecte" },
  { label: "Cereri servicii", icon: "personSearch", href: "/admin/cereri-servicii" },
  { label: "Cereri închiriere", icon: "truck", href: "/admin/cereri-inchiriere" },
  { label: "Contacte email", icon: "mail", href: "/admin/email/contacts" },
  { label: "Grupuri & segmente", icon: "personAdd", href: "/admin/email/groups" },
  { label: "Campanii email", icon: "notifications", href: "/admin/email" },
];

const utilityNavItems: NavItem[] = [
  { label: "Setări", icon: "settings", href: "#" },
  { label: "Suport", icon: "help", href: "#" },
];

// Sub-secțiuni de blog cu intrare proprie în meniu (nu trebuie să activeze „Blogs").
const BLOG_SUBSECTIONS = ["/admin/blog/topice", "/admin/blog/schedule"];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  // Dashboard de campanii: activ doar pe ruta exactă (sub-rutele au intrări proprii).
  if (href === "/admin/email") {
    return pathname === "/admin/email";
  }
  if (href === "/admin/blog") {
    const inSub = BLOG_SUBSECTIONS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    if (inSub) return false;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({ active, href, icon, label }: NavItem & { active: boolean }) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-[#58683c] text-white"
          : "text-[#e6e1d7] hover:bg-white/10 hover:text-white",
      )}
      href={href}
    >
      <AdminIcon className="h-5 w-5 shrink-0" name={icon} />
      <span>{label}</span>
    </Link>
  );
}

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Prezentare Generală",
  "/admin/servicii": "Servicii",
  "/admin/utilaje": "Utilaje de închiriat",
  "/admin/faq": "Întrebări frecvente",
  "/admin/blog": "Articole blog",
  "/admin/blog/topice": "Topice blog",
  "/admin/blog/schedule": "Programări blog",
  "/admin/proiecte": "Proiecte",
  "/admin/cereri-servicii": "Cereri servicii",
  "/admin/cereri-inchiriere": "Cereri închiriere",
  "/admin/email": "Campanii email",
  "/admin/email/contacts": "Contacte email",
  "/admin/email/groups": "Grupuri & segmente",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const match = Object.keys(breadcrumbLabels)
    .filter((href) =>
      href === "/admin" ? pathname === "/admin" : pathname.startsWith(href),
    )
    .sort((a, b) => b.length - a.length)[0];
  const label = (match && breadcrumbLabels[match]) ?? "Admin";

  return (
    <div className="flex min-w-0 items-center text-xs font-medium leading-4 text-[#6b706a]">
      <span className="hidden sm:inline">Admin</span>
      <AdminIcon className="mx-1 hidden h-4 w-4 shrink-0 sm:block" name="chevronRight" />
      <span className="truncate font-semibold text-[#171a16]">{label}</span>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-50 hidden h-full w-[240px] flex-col border-r border-[#6b706a]/20 bg-[#1e2a20] px-4 py-6 text-white md:flex">
      <div className="mb-8 flex flex-col px-2">
        <h1 className="text-2xl font-bold leading-8 text-white">PACA CONSTRUCT</h1>
        <p className="mt-1 font-serif-display text-xs font-semibold uppercase leading-4 text-[#e6e1d7]">
          Operational Command
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <SidebarLink {...item} active={isActive(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4">
        <ul className="space-y-1">
          {utilityNavItems.map((item) => (
            <li key={item.label}>
              <SidebarLink {...item} active={isActive(pathname, item.href)} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
