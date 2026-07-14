import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { BuyerHero } from "@/components/buyer/BuyerHero";
import { BuyerDashboard } from "@/components/buyer/BuyerDashboard";
import { BuyerInquiries } from "@/components/buyer/BuyerInquiries";
import { BuyerFavorites } from "@/components/buyer/BuyerFavorites";
import { BuyerDemands } from "@/components/buyer/BuyerDemands";
import { BuyerOrders } from "@/components/buyer/BuyerOrders";
import { BuyerMessages } from "@/components/buyer/BuyerMessages";
import { BuyerStats } from "@/components/buyer/BuyerStats";
import { CTASection } from "@/components/sections/CTASection";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function BuyerPage() {
  return (
    <AuthGuard type="buyer">
      <TopBar />
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: "#F2FAF8" }}>
        <BuyerHero />
        <BuyerDashboard />
        <BuyerInquiries />
        <BuyerFavorites />
        <BuyerDemands />
        <BuyerOrders />
        <BuyerMessages />
        <BuyerStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </AuthGuard>
  );
}
