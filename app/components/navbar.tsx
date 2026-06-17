"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ServiceGroup } from "../data/services";

type NavbarProps = {
  serviceGroups: ServiceGroup[];
};

const navLinks = [
  { label: "Proiecte", href: "/#proiecte" },
  { label: "Proces", href: "/#proces" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ serviceGroups }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
  }

  function toggleMobileMenu() {
    if (isMobileOpen) {
      setIsMobileServicesOpen(false);
    }

    setIsMobileOpen((open) => !open);
  }

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  return (
    <>
      <div className="relative z-50 w-full bg-carbon text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-5 py-2 text-center text-[11px] font-bold uppercase leading-4 md:flex-row md:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-white/80">
            <a href="tel:+40700000000" className="hover:text-amber">
              +40 700 000 000
            </a>
            <a href="https://wa.me/40700000000" className="hover:text-amber">
              WhatsApp
            </a>
          </div>
          <p className="text-amber">Evaluare si ofertare pentru proiectul tau</p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-olive/15 bg-limestone/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-10 lg:px-16">
          <Link
            href="/"
            className="font-serif-display text-2xl font-semibold leading-none text-olive md:text-3xl"
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
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="#contact"
              className="bg-amber px-6 py-3 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
            >
              Cere oferta
            </Link>
          </div>

          <button
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center border border-olive/20 text-olive lg:hidden"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className="sr-only">Deschide meniul</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {isMobileOpen ? (
          <div
            id="mobile-navigation"
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
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="#contact"
                  className="bg-amber px-5 py-3 text-center text-sm font-bold uppercase text-carbon"
                  onClick={closeMobileMenu}
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
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
