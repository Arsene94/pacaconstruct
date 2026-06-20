"use client";

import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ServiceGroup } from "../data/services";
import {
  getPrimaryPhone,
  getWhatsAppPhones,
  telLink,
  waLink,
  type ResolvedSettings,
} from "@/app/lib/settings-shared";
import { pushMarketingEvent } from "@/app/lib/marketing/data-layer";

type NavbarProps = {
  serviceGroups: ServiceGroup[];
  settings: ResolvedSettings;
};

const navLinks = [
  { label: "Inchirieri utilaje", href: "/inchiriere-utilaje" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ serviceGroups, settings }: NavbarProps) {
  const primaryPhone = getPrimaryPhone(settings);
  const whatsappPhone = getWhatsAppPhones(settings)[0] ?? null;
  const { announcement } = settings;
  const showTopBar = Boolean(primaryPhone) || announcement.enabled;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function closeMobileMenu() {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
  }

  function toggleMobileMenu() {
    if (isMobileOpen) {
      setIsMobileServicesOpen(false);
    } else {
      pushMarketingEvent({
        event: "pc_mobile_menu_open",
        placement: "navbar",
        source: "navbar",
      });
    }

    setIsMobileOpen((open) => !open);
  }

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus trap + Escape: meniul mobil se comportă ca un dialog modal (a11y).
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((el) => el.offsetParent !== null);

    // Mută focusul în meniu la deschidere.
    getFocusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileOpen]);

  return (
    <>
      {showTopBar ? (
        <div className="relative z-50 hidden w-full bg-carbon text-white md:block">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-5 py-2 text-center text-[11px] font-bold uppercase leading-4 md:flex-row md:px-10 lg:px-16">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-white/80">
              {primaryPhone ? (
                <a
                  href={telLink(primaryPhone)}
                  className="hover:text-amber"
                  onClick={() =>
                    pushMarketingEvent({
                      event: "pc_phone_click",
                      placement: "topbar",
                      source: "navbar",
                    })
                  }
                >
                  {primaryPhone.display}
                </a>
              ) : null}
              {whatsappPhone ? (
                <a
                  href={waLink(whatsappPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber"
                  onClick={() =>
                    pushMarketingEvent({
                      event: "pc_whatsapp_click",
                      placement: "topbar",
                      source: "navbar",
                    })
                  }
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
            {announcement.enabled && announcement.text ? (
              announcement.href ? (
                <Link href={announcement.href} className="text-amber hover:underline">
                  {announcement.text}
                </Link>
              ) : (
                <p className="text-amber">{announcement.text}</p>
              )
            ) : null}
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-olive/15 bg-limestone/90 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[44px_1fr_auto] items-center gap-3 px-5 py-4 md:flex md:justify-between md:px-10 lg:px-16">
          <button
            ref={toggleRef}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            className="flex h-11 w-11 items-center justify-center text-olive lg:hidden"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className="sr-only">Deschide meniul</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 w-6 bg-current" />
              <span className="block h-0.5 w-6 bg-current" />
              <span className="block h-0.5 w-6 bg-current" />
            </span>
          </button>

          <Link
            href="/"
            className="justify-self-center text-center font-serif-display text-xl font-semibold leading-none text-olive md:justify-self-auto md:text-left md:text-3xl"
          >
            PACA CONSTRUCT
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 py-3 text-sm font-semibold uppercase text-stone hover:text-amber"
                type="button"
              >
                Servicii
                <ChevronDown />
              </button>
              <div
                className={`absolute left-1/2 top-full w-[920px] -translate-x-1/2 border border-olive/15 bg-white p-5 shadow-2xl shadow-carbon/10 transition duration-200 ${
                  isServicesOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-3 opacity-0"
                }`}
              >
                <div className="grid grid-cols-4 gap-4">
                  {serviceGroups.map((group) => (
                    <div key={group.title} className="border-l border-olive/10 pl-4">
                      <Link
                        href={group.href}
                        className="mb-4 block text-sm font-bold leading-5 text-olive hover:text-amber"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        {group.title}
                      </Link>
                      <div className="flex flex-col gap-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm leading-5 text-stone hover:text-carbon"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-semibold uppercase text-stone hover:text-amber"
                onClick={() =>
                  pushMarketingEvent({
                    event: "pc_nav_click",
                    placement: "navbar",
                    source: "navbar",
                    link_id: link.href,
                  })
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/contact#form-section"
              className="bg-amber px-4 py-2 text-[10px] font-bold uppercase text-carbon transition hover:bg-[#fea943] md:px-6 md:py-3 md:text-sm"
              onClick={() =>
                pushMarketingEvent({
                  event: "pc_cta_click",
                  placement: "navbar",
                  source: "navbar",
                  link_id: "cere_oferta",
                })
              }
            >
              Cere oferta
            </Link>
          </div>
        </div>

        {isMobileOpen ? (
          <div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu de navigare"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-8.5rem)] overflow-y-auto overscroll-contain border-t border-olive/15 bg-white px-5 py-5 shadow-2xl shadow-carbon/15 lg:hidden"
          >
            <div className="space-y-5">
              <div>
                <button
                  aria-expanded={isMobileServicesOpen}
                  aria-controls="mobile-services-list"
                  className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase text-amber"
                  onClick={() => setIsMobileServicesOpen((open) => !open)}
                  type="button"
                >
                  Servicii
                  <ChevronDown
                    className={`transition-transform ${
                      isMobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileServicesOpen ? (
                  <div id="mobile-services-list" className="mt-4 space-y-4">
                    {serviceGroups.map((group) => (
                      <div key={group.title}>
                        <Link
                          href={group.href}
                          className="block text-base font-bold text-olive"
                          onClick={closeMobileMenu}
                        >
                          {group.title}
                        </Link>
                        <div className="mt-2 grid gap-2 border-l border-olive/15 pl-4">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="text-sm text-stone"
                              onClick={closeMobileMenu}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 border-t border-olive/15 pt-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold uppercase text-stone"
                    onClick={() => {
                      pushMarketingEvent({
                        event: "pc_nav_click",
                        placement: "mobile_menu",
                        source: "navbar",
                        link_id: link.href,
                      });
                      closeMobileMenu();
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact#form-section"
                  className="bg-amber px-5 py-3 text-center text-sm font-bold uppercase text-carbon"
                  onClick={() => {
                    pushMarketingEvent({
                      event: "pc_cta_click",
                      placement: "mobile_menu",
                      source: "navbar",
                      link_id: "cere_oferta",
                    });
                    closeMobileMenu();
                  }}
                >
                  Cere oferta
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return <IconChevronDown aria-hidden="true" className={`h-4 w-4 ${className}`} />;
}
