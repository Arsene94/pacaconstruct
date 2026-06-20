"use client";

import {
  IconArrowUp,
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  getFloatingPhones,
  resolveFloatingCall,
  resolveFloatingWhatsApp,
  telLink,
  waLink,
  type PhoneNumber,
  type ResolvedSettings,
} from "@/app/lib/settings-shared";

/** Zone private unde butoanele nu trebuie să apară. */
const HIDDEN_PREFIXES = ["/admin", "/login", "/auth"];

const COLORS = {
  whatsapp: "#25d366",
  call: "#1e2a20",
  email: "#58683c",
  scrollTop: "#6b706a",
} as const;

function isHidden(pathname: string): boolean {
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function FloatingButtons({ settings }: { settings: ResolvedSettings }) {
  const pathname = usePathname();
  const { floating } = settings;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!floating.channels.scrollTop) return;
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [floating.channels.scrollTop]);

  if (!floating.enabled) return null;
  if (isHidden(pathname)) return null;
  if (!floating.showOnMobile && !floating.showOnDesktop) return null;

  const onRight = floating.position !== "left";
  const floatingPhones = getFloatingPhones(settings);
  const waPhones = floatingPhones.filter((p) => p.whatsapp);
  const whatsappPhone = resolveFloatingWhatsApp(settings);
  const callPhone = resolveFloatingCall(settings);

  // Vizibilitate responsivă: ascunde stack-ul întreg pe breakpoint-ul nepermis.
  const visibility =
    floating.showOnMobile && floating.showOnDesktop
      ? "flex"
      : floating.showOnMobile
        ? "flex md:hidden"
        : "hidden md:flex";

  function scrollToTop() {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }

  const side = onRight ? "right-4" : "left-4";

  return (
    <div
      aria-label="Acțiuni rapide de contact"
      className={`fixed z-40 ${side} ${visibility} flex-col items-center gap-3 [animation:float-in_0.4s_ease-out]`}
      role="region"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {floating.channels.scrollTop ? (
        <ActionButton
          bg={COLORS.scrollTop}
          cta="scrolltop-float"
          expandLabels={floating.expandLabels}
          hidden={!scrolled}
          icon={IconArrowUp}
          label="Sus de tot"
          onClick={scrollToTop}
          onRight={onRight}
        />
      ) : null}

      {floating.channels.email ? (
        <ActionLink
          bg={COLORS.email}
          cta="email-float"
          expandLabels={floating.expandLabels}
          href={`mailto:${settings.contact.emailPrimary}`}
          icon={IconMail}
          label="Trimite email"
          onRight={onRight}
        />
      ) : null}

      {floating.channels.call && callPhone ? (
        floatingPhones.length > 1 ? (
          <PhoneMenu
            bg={COLORS.call}
            cta="call-float"
            expandLabels={floating.expandLabels}
            icon={IconPhone}
            label="Sună-ne"
            mode="call"
            onRight={onRight}
            phones={floatingPhones}
          />
        ) : (
          <ActionLink
            bg={COLORS.call}
            cta="call-float"
            expandLabels={floating.expandLabels}
            href={telLink(callPhone)}
            icon={IconPhone}
            label={`Sună: ${callPhone.display}`}
            onRight={onRight}
          />
        )
      ) : null}

      {floating.channels.whatsapp && whatsappPhone ? (
        waPhones.length > 1 ? (
          <PhoneMenu
            bg={COLORS.whatsapp}
            cta="whatsapp-float"
            expandLabels={floating.expandLabels}
            icon={IconBrandWhatsapp}
            label="Scrie pe WhatsApp"
            mode="whatsapp"
            onRight={onRight}
            phones={waPhones}
          />
        ) : (
          <ActionLink
            bg={COLORS.whatsapp}
            cta="whatsapp-float"
            expandLabels={floating.expandLabels}
            external
            href={waLink(whatsappPhone)}
            icon={IconBrandWhatsapp}
            label="Scrie pe WhatsApp"
            onRight={onRight}
          />
        )
      ) : null}
    </div>
  );
}

// ─── Butoane de bază ─────────────────────────────────────────────────────────

const buttonClass =
  "relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-black/5 outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2";

function Tooltip({ label, onRight }: { label: string; onRight: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-carbon px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
        onRight ? "right-full mr-3" : "left-full ml-3"
      }`}
    >
      {label}
    </span>
  );
}

function ActionLink({
  href,
  label,
  icon: Icon,
  bg,
  cta,
  external,
  expandLabels,
  onRight,
}: {
  href: string;
  label: string;
  icon: TablerIcon;
  bg: string;
  cta: string;
  external?: boolean;
  expandLabels: boolean;
  onRight: boolean;
}) {
  return (
    <a
      aria-label={label}
      className={`group ${buttonClass}`}
      data-cta={cta}
      href={href}
      style={{ backgroundColor: bg }}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      <Icon aria-hidden="true" className="h-6 w-6" />
      {expandLabels ? <Tooltip label={label} onRight={onRight} /> : null}
    </a>
  );
}

function ActionButton({
  label,
  icon: Icon,
  bg,
  cta,
  expandLabels,
  onRight,
  onClick,
  hidden,
}: {
  label: string;
  icon: TablerIcon;
  bg: string;
  cta: string;
  expandLabels: boolean;
  onRight: boolean;
  onClick: () => void;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <button
      aria-label={label}
      className={`group ${buttonClass}`}
      data-cta={cta}
      onClick={onClick}
      style={{ backgroundColor: bg }}
      type="button"
    >
      <Icon aria-hidden="true" className="h-6 w-6" />
      {expandLabels ? <Tooltip label={label} onRight={onRight} /> : null}
    </button>
  );
}

// ─── Meniu multi-număr ───────────────────────────────────────────────────────

function PhoneMenu({
  phones,
  mode,
  label,
  icon: Icon,
  bg,
  cta,
  expandLabels,
  onRight,
}: {
  phones: PhoneNumber[];
  mode: "call" | "whatsapp";
  label: string;
  icon: TablerIcon;
  bg: string;
  cta: string;
  expandLabels: boolean;
  onRight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    // Mută focusul pe primul element din meniu la deschidere.
    const first = containerRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      {open ? (
        <div
          aria-label={label}
          className={`absolute bottom-0 flex w-60 flex-col gap-1 rounded-[2px] border border-olive/15 bg-white p-2 shadow-2xl shadow-carbon/15 ${
            onRight ? "right-14" : "left-14"
          }`}
          id={menuId}
          role="menu"
        >
          {phones.map((phone) => (
            <a
              className="flex items-center gap-3 rounded-[2px] px-3 py-2 text-sm text-carbon outline-none hover:bg-limestone focus-visible:bg-limestone"
              data-cta={`${cta}-item`}
              href={mode === "whatsapp" ? waLink(phone) : telLink(phone)}
              key={phone.id}
              role="menuitem"
              {...(mode === "whatsapp"
                ? { rel: "noopener noreferrer", target: "_blank" }
                : {})}
            >
              <Icon
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                style={{ color: bg }}
              />
              <span className="min-w-0">
                <span className="block font-semibold leading-5">{phone.label}</span>
                <span className="block text-xs text-stone">{phone.display}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}

      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={`group ${buttonClass}`}
        data-cta={cta}
        onClick={() => setOpen((value) => !value)}
        ref={buttonRef}
        style={{ backgroundColor: bg }}
        type="button"
      >
        <Icon aria-hidden="true" className="h-6 w-6" />
        {expandLabels && !open ? <Tooltip label={label} onRight={onRight} /> : null}
      </button>
    </div>
  );
}
