import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SupplierTopBar } from "@/components/supplier/SupplierTopBar";
import { SupplierHero } from "@/components/supplier/SupplierHero";
import { SupplierDashboard } from "@/components/supplier/SupplierDashboard";
import { SupplierProducts } from "@/components/supplier/SupplierProducts";
import { SupplierInquiries } from "@/components/supplier/SupplierInquiries";
import { SupplierStore } from "@/components/supplier/SupplierStore";
import { SupplierQualifications } from "@/components/supplier/SupplierQualifications";
import { SupplierOrders } from "@/components/supplier/SupplierOrders";
import { SupplierMessages } from "@/components/supplier/SupplierMessages";
import { SupplierStats } from "@/components/supplier/SupplierStats";
import { CTASection } from "@/components/sections/CTASection";

export default function SupplierPage() {
  return (
    <>
      <SupplierTopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <SupplierHero />
        <SupplierDashboard />
        <SupplierProducts />
        <SupplierInquiries />
        <SupplierStore />
        <SupplierQualifications />
        <SupplierOrders />
        <SupplierMessages />
        <SupplierStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
