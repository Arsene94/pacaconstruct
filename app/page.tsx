import { Footer } from "./components/footer";
import {
  ContactCta,
  HeroSection,
  PrimaryServicePaths,
  ProcessSection,
  ServicesMosaic,
  TransformationStatement,
} from "./components/home-sections";
import { SiteNavbar } from "./components/site-navbar";
import { getServiceGroups } from "./data/services";

// Conținut din DB: randare dinamică, dar datele vin din cache-ul Upstash
// (getterii `unstable_cache` din app/data/*), deci build-ul nu depinde de DB
// și pe cache hit nu lovim Postgres.
export const dynamic = "force-dynamic";

export default async function Home() {
  const serviceGroups = await getServiceGroups();

  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <SiteNavbar serviceGroups={serviceGroups} />
      <main id="main" className="flex flex-col">
        <HeroSection />
        <PrimaryServicePaths />
        <TransformationStatement />
        <ServicesMosaic />
        <ProcessSection />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
