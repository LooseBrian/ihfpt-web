import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { AuthHero } from "@/components/auth/AuthHero";
import { AuthPortal } from "@/components/auth/AuthPortal";
import { AuthProcess } from "@/components/auth/AuthProcess";
import { AuthFAQ } from "@/components/auth/AuthFAQ";
import { AuthStats } from "@/components/auth/AuthStats";
import { CTASection } from "@/components/sections/CTASection";

export default function AuthPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <AuthHero />
        <AuthPortal />
        <AuthProcess />
        <AuthFAQ />
        <AuthStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
