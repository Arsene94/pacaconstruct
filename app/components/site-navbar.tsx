import { getSiteSettings } from "@/app/data/settings";
import type { ServiceGroup } from "../data/services";
import { Navbar } from "./navbar";

/**
 * Wrapper server pentru Navbar (Client Component): aduce setările de site
 * (cache-uite) și le pasează clientului, ca paginile să nu repete fetch-ul.
 * `serviceGroups` rămâne furnizat de fiecare pagină (deja îl încarcă).
 */
export async function SiteNavbar({ serviceGroups }: { serviceGroups: ServiceGroup[] }) {
  const settings = await getSiteSettings();
  return <Navbar serviceGroups={serviceGroups} settings={settings} />;
}
