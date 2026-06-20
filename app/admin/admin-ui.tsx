import Link from "next/link";
import type { ReactNode } from "react";
import { AdminIcon, type AdminIconName } from "./admin-icons";
import styles from "./admin.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Containerul scrollabil de conținut, identic ca spațiere cu dashboard-ul. */
export function AdminContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-semibold leading-8 text-[#171a16]">{title}</h1>
        {description ? (
          <p className="mt-1 text-xs font-medium leading-4 text-[#6b706a]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

export function PrimaryButton({
  icon,
  children,
}: {
  icon?: AdminIconName;
  children: ReactNode;
}) {
  return (
    <button
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium leading-4 text-white shadow-sm transition-colors hover:bg-[#c27a1f]"
      type="button"
    >
      {icon ? <AdminIcon className="h-4.5 w-4.5" name={icon} /> : null}
      {children}
    </button>
  );
}

export function SecondaryButton({
  icon,
  children,
}: {
  icon?: AdminIconName;
  children: ReactNode;
}) {
  return (
    <button
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium leading-4 text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3]"
      type="button"
    >
      {icon ? <AdminIcon className="h-4.5 w-4.5" name={icon} /> : null}
      {children}
    </button>
  );
}

/** Variantă „link intern" a butonului principal (ex. „Adaugă"). */
export function PrimaryLinkButton({
  icon,
  href,
  children,
}: {
  icon?: AdminIconName;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium leading-4 text-white shadow-sm transition-colors hover:bg-[#c27a1f]"
      href={href}
    >
      {icon ? <AdminIcon className="h-4.5 w-4.5" name={icon} /> : null}
      {children}
    </Link>
  );
}

/** Link intern stilizat ca buton secundar. */
export function SecondaryLinkButton({
  icon,
  href,
  children,
}: {
  icon?: AdminIconName;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium leading-4 text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3]"
      href={href}
    >
      {icon ? <AdminIcon className="h-4.5 w-4.5" name={icon} /> : null}
      {children}
    </Link>
  );
}

/** Buton-icon pentru navigare internă (ex. „Editează"). */
export function IconLink({
  icon,
  label,
  href,
}: {
  icon: AdminIconName;
  label: string;
  href: string;
}) {
  return (
    <Link
      aria-label={label}
      className="inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors hover:text-[#58683c]"
      href={href}
    >
      <AdminIcon className="h-4 w-4" name={icon} />
    </Link>
  );
}

/** Bara de filtre / căutare de deasupra tabelului. */
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-[2px] border border-[#e6e1d7] bg-white p-3 md:flex-row md:items-center md:justify-between">
      {children}
    </div>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <label className="relative block w-full md:w-72">
      <span className="sr-only">{placeholder}</span>
      <AdminIcon
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#747872]"
        name="search"
      />
      <input
        className="h-8 w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] pl-9 pr-3 text-xs font-medium leading-4 text-[#171a16] outline-none transition focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}

export function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-serif-display text-[10px] font-semibold uppercase leading-4 text-[#6b706a]">
        {label}
      </span>
      <div className="relative">
        <select className="h-8 appearance-none rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] pl-3 pr-8 text-xs font-medium text-[#171a16] outline-none focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <AdminIcon
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b706a]"
          name="expandMore"
        />
      </div>
    </div>
  );
}

export function TableCard({
  children,
  footer,
  minWidth,
}: {
  children: ReactNode;
  footer?: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="overflow-hidden rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
      <div className={cx(styles.tableScroll, "overflow-x-auto")}>
        <table
          className="w-full border-collapse text-left text-xs font-medium leading-4"
          style={minWidth ? { minWidth: `${minWidth}px` } : undefined}
        >
          {children}
        </table>
      </div>
      {footer}
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cx(
        "whitespace-nowrap border-b border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-3 font-serif-display text-[11px] font-semibold uppercase text-[#6b706a]",
        className,
      )}
    >
      {children}
    </th>
  );
}

type BadgeTone = "success" | "warning" | "error" | "forest" | "neutral";

export function StatusBadge({
  tone,
  dot,
  children,
}: {
  tone: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}) {
  const toneClass: Record<BadgeTone, string> = {
    success: "bg-[#15803d]/10 text-[#15803d]",
    warning: "bg-[#d88a24]/10 text-[#d88a24]",
    error: "bg-[#b91c1c]/10 text-[#b91c1c]",
    forest: "bg-[#d4eca1] text-[#586b2f]",
    neutral: "bg-[#e4e2dc] text-[#434843]",
  };
  const dotClass: Record<BadgeTone, string> = {
    success: "bg-[#15803d]",
    warning: "bg-[#d88a24]",
    error: "bg-[#b91c1c]",
    forest: "bg-[#58683c]",
    neutral: "bg-[#6b706a]",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[2px] px-2 py-0.5 text-[11px] font-bold",
        toneClass[tone],
      )}
    >
      {dot ? <span className={cx("h-1.5 w-1.5 rounded-full", dotClass[tone])} /> : null}
      {children}
    </span>
  );
}

export function IconButton({
  icon,
  label,
  href,
  danger,
}: {
  icon: AdminIconName;
  label: string;
  href?: string;
  danger?: boolean;
}) {
  const className = cx(
    "inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors",
    danger ? "hover:text-[#b91c1c]" : "hover:text-[#58683c]",
  );

  if (href) {
    return (
      <a
        aria-label={label}
        className={className}
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        <AdminIcon className="h-4 w-4" name={icon} />
      </a>
    );
  }

  return (
    <button aria-label={label} className={className} type="button">
      <AdminIcon className="h-4 w-4" name={icon} />
    </button>
  );
}

export function TableFooter({
  shown,
  total,
  noun,
}: {
  shown: number;
  total: number;
  noun: string;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#e6e1d7] bg-[#fbf9f3]/70 px-4 py-2 text-xs">
      <span className="text-[#6b706a]">
        Afișezi {shown} din {total} {noun}
      </span>
      <div className="flex gap-1">
        <button
          aria-label="Pagina anterioară"
          className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-white text-[#6b706a] transition-colors hover:bg-[#fbf9f3] disabled:opacity-50"
          disabled
          type="button"
        >
          <AdminIcon className="h-4 w-4" name="chevronLeft" />
        </button>
        <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#58683c] bg-[#58683c] text-xs font-bold text-white">
          1
        </span>
        <button
          aria-label="Pagina următoare"
          className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-white text-[#6b706a] transition-colors hover:bg-[#fbf9f3] disabled:opacity-50"
          disabled
          type="button"
        >
          <AdminIcon className="h-4 w-4" name="chevronRight" />
        </button>
      </div>
    </div>
  );
}
