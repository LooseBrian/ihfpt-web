import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SupplierStorefront } from "@/components/supplier/SupplierStorefront";
import { suppliers } from "@/lib/data";
import { notFound } from "next/navigation";

// Pre-generate static params for known suppliers
export function generateStaticParams() {
  return [
    { id: "huifa" },
    { id: "s1" },
    { id: "s2" },
    { id: "s3" },
    { id: "s4" },
    { id: "s5" },
    { id: "s6" },
  ];
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Map "huifa" to the test supplier
  if (id === "huifa") {
    return (
      <>
        <TopBar />
        <Navbar />
        <SupplierStorefront />
        <Footer />
        <BackToTop />
      </>
    );
  }

  // For known suppliers, map data
  const supplier = suppliers.find((s) => s.id === id);

  if (!supplier) {
    notFound();
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <SupplierStorefront />
      <Footer />
      <BackToTop />
    </>
  );
}
