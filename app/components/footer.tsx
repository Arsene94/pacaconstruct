import { SectionContainer } from "./section-container";
import { getSiteSettings } from "@/app/data/settings";
import { getPrimaryPhone, telLink } from "@/app/lib/settings-shared";
import { TrackedAnchor, TrackedLink } from "@/app/components/ui/tracked-link";

export async function Footer() {
  const settings = await getSiteSettings();
  const phone = getPrimaryPhone(settings);
  const email = settings.contact.emailPrimary;

  return (
    <footer id="contact" className="border-t border-white/10 bg-olive text-white">
      <SectionContainer className="grid gap-10 py-16 md:grid-cols-4 lg:py-24">
        <div className="md:col-span-1">
          <p className="font-serif-display text-3xl font-semibold text-sage">
            PACA CONSTRUCT
          </p>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
            Tehnicitate in armonie cu natura. Amenajari, terasamente si excavari pentru
            proiecte rezidentiale, comerciale si industriale.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
          <FooterLinks
            title="Companie"
            links={[
              { label: "Acasa", href: "/" },
              { label: "Despre noi", href: "/despre" },
              { label: "Servicii", href: "/#servicii" },
              { label: "Proiecte", href: "/proiecte" },
              { label: "Inchirieri utilaje", href: "/inchiriere-utilaje" },
              { label: "FAQ", href: "/faq" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <FooterLinks
            title="Zone deservite"
            links={[
              { label: "Bucuresti", href: "/zona/bucuresti" },
              { label: "Ilfov", href: "/zona/ilfov" },
              { label: "Prahova", href: "/zona/prahova" },
              { label: "Confidentialitate", href: "/confidentialitate" },
              { label: "Cookie-uri", href: "/cookies" },
              { label: "Termeni si conditii", href: "/termeni" },
            ]}
          />
        </div>

        <div className="md:text-right">
          <p className="text-xs font-bold uppercase text-white/50">Contact rapid</p>
          {phone ? (
            <TrackedAnchor
              href={telLink(phone)}
              className="mt-4 block text-xl font-semibold text-sage hover:text-amber"
              trackingEvent="pc_phone_click"
              trackingPlacement="footer"
              trackingSource="footer"
            >
              {phone.display}
            </TrackedAnchor>
          ) : null}
          <TrackedAnchor
            href={`mailto:${email}`}
            className="mt-2 block text-sm text-white/70 hover:text-white"
            trackingEvent="pc_email_click"
            trackingPlacement="footer"
            trackingSource="footer"
          >
            {email}
          </TrackedAnchor>
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
      <p className="mb-4 text-xs font-bold uppercase text-white/50">{title}</p>
      <div className="grid gap-3">
        {links.map((link) => (
          <TrackedLink
            key={link.label}
            href={link.href}
            className="text-sm leading-6 text-white/70 transition hover:text-white"
            trackingEvent="pc_footer_link_click"
            trackingPlacement="footer"
            trackingSource="footer"
            trackingLinkId={link.href}
          >
            {link.label}
          </TrackedLink>
        ))}
      </div>
    </div>
  );
}
