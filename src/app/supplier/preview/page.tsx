"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { SupplierStorefront } from "@/components/supplier/SupplierStorefront";

export default function StorePreviewPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <SupplierStorefront isPreview={true} />
    </>
  );
}
