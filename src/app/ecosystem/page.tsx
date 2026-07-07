import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { EcosystemHero } from "@/components/ecosystem/EcosystemHero";
import { EcosystemValueProps } from "@/components/ecosystem/EcosystemValueProps";
import { EcosystemParks } from "@/components/ecosystem/EcosystemParks";
import { EcosystemMatrix } from "@/components/ecosystem/EcosystemMatrix";
import { EcosystemExperts } from "@/components/ecosystem/EcosystemExperts";
import { EcosystemAlliance } from "@/components/ecosystem/EcosystemAlliance";
import { EcosystemFAQ } from "@/components/ecosystem/EcosystemFAQ";
import { EcosystemStats } from "@/components/ecosystem/EcosystemStats";
import { CTASection } from "@/components/sections/CTASection";

export default function EcosystemPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <EcosystemHero />
        <EcosystemValueProps />
        <EcosystemParks />
        <EcosystemMatrix />
        <EcosystemExperts />
        <EcosystemAlliance />
        <EcosystemFAQ />
        <EcosystemStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
