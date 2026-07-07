import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceValueProps } from "@/components/services/ServiceValueProps";
import { ServiceCategoryNav } from "@/components/services/ServiceCategoryNav";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceCases } from "@/components/services/ServiceCases";
import { ServiceStats } from "@/components/services/ServiceStats";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function ServicesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <ServiceHero />
        <ServiceValueProps />
        <ServiceCategoryNav />
        <ServiceGrid />
        <ServiceProcess />
        <ServiceFAQ />
        <ServiceCases />
        <ServiceStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
