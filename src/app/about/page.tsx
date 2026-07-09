import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutOrganizers } from "@/components/about/AboutOrganizers";
import { AboutAdvantages } from "@/components/about/AboutAdvantages";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutStats } from "@/components/about/AboutStats";
import { CTASection } from "@/components/sections/CTASection";

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <AboutHero />
        <AboutIntro />
        <AboutValues />
        <AboutOrganizers />
        <AboutAdvantages />
        <AboutTimeline />
        <AboutStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
