import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagină negăsită (404)",
  robots: { index: false, follow: false },
};

const helpfulLinks = [
  { label: "Acasă", href: "/" },
  { label: "Servicii", href: "/#servicii" },
  { label: "Închirieri utilaje", href: "/inchiriere-utilaje" },
  { label: "Proiecte", href: "/proiecte" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <main
      id="main"
      className="bg-topo flex min-h-[70vh] flex-1 items-center justify-center bg-background px-5 py-24"
    >
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-amber-strong">
          Eroare 404
        </p>
        <h1 className="mt-5 font-serif-display text-5xl font-semibold leading-[1.05] text-olive md:text-6xl">
          Pagina nu a putut fi găsită
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-stone">
          Linkul accesat este greșit sau pagina a fost mutată. Mai jos găsești cele mai
          utile secțiuni ale site-ului.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {helpfulLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                i === 0
                  ? "bg-amber px-6 py-3 text-sm font-bold uppercase text-carbon transition hover:bg-[#fea943]"
                  : "border border-olive/20 px-6 py-3 text-sm font-bold uppercase text-olive transition hover:border-olive/50 hover:text-amber-strong"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
