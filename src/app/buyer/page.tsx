import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { BuyerTopBar } from "@/components/buyer/BuyerTopBar";
import { BuyerHero } from "@/components/buyer/BuyerHero";
import { BuyerDashboard } from "@/components/buyer/BuyerDashboard";
import { BuyerInquiries } from "@/components/buyer/BuyerInquiries";
import { BuyerFavorites } from "@/components/buyer/BuyerFavorites";
import { BuyerDemands } from "@/components/buyer/BuyerDemands";
import { BuyerOrders } from "@/components/buyer/BuyerOrders";
import { BuyerMessages } from "@/components/buyer/BuyerMessages";
import { BuyerStats } from "@/components/buyer/BuyerStats";
import { CTASection } from "@/components/sections/CTASection";

export default function BuyerPage() {
  return (
    <>
      <BuyerTopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
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
    </>
  );
}
