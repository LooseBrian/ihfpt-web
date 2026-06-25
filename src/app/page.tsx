import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { SuppliersSection } from "@/components/sections/SuppliersSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { CTASection } from "@/components/sections/CTASection";
import { BackToTop } from "@/components/shared/BackToTop";

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <CategoriesSection />
        <ProductsSection />
        <SuppliersSection />
        <ServicesSection />
        <StatsSection />
        <ProjectsSection />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
