import Link from "next/link";
import { SectionContainer } from "./section-container";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-olive text-white">
      <SectionContainer className="grid gap-10 py-16 md:grid-cols-4 lg:py-24">
        <div className="md:col-span-1">
          <p className="font-serif-display text-3xl font-semibold text-sage">
            PACA CONSTRUCT
          </p>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
            Tehnicitate in armonie cu natura. Amenajari, terasamente si excavari
            pentru proiecte rezidentiale, comerciale si industriale.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
          <FooterLinks
            title="Companie"
            links={[
              { label: "Servicii", href: "/#servicii" },
              { label: "Proiecte", href: "/#proiecte" },
              { label: "Proces", href: "/#proces" },
              { label: "Contact", href: "#contact" },
            ]}
          />
          <FooterLinks
            title="Legal"
            links={[
              { label: "Politica de confidentialitate", href: "#" },
              { label: "Termeni si conditii", href: "#" },
            ]}
          />
        </div>

        <div className="md:text-right">
          <p className="text-xs font-bold uppercase text-white/50">
            Contact rapid
          </p>
          <a
            href="tel:+40700000000"
            className="mt-4 block text-xl font-semibold text-sage hover:text-amber"
          >
            +40 700 000 000
          </a>
          <a
            href="mailto:contact@pacaconstruct.ro"
            className="mt-2 block text-sm text-white/70 hover:text-white"
          >
            contact@pacaconstruct.ro
          </a>
        </div>
      </SectionContainer>
      <div className="border-t border-white/10 py-5">
        <SectionContainer>
          <p className="text-sm text-white/50">
            (c) 2026 PACA CONSTRUCT SRL. Toate drepturile rezervate.
          </p>
        </SectionContainer>
      </div>
    </footer>
  );
}

type FooterLinksProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase text-white/50">
        {title}
      </p>
      <div className="grid gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm leading-6 text-white/70 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
