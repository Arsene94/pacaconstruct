import { Footer } from "./components/footer";
import {
  ContactCta,
  HeroSection,
  PrimaryServicePaths,
  ProcessSection,
  ServicesMosaic,
  TransformationStatement,
} from "./components/home-sections";
import { Navbar } from "./components/navbar";
import { serviceGroups } from "./data/services";

export default function Home() {
  return (
    <div className="min-h-screen bg-limestone text-carbon">
      <Navbar serviceGroups={serviceGroups} />
      <main>
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
