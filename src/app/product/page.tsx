"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { ProductDetail } from "@/components/product/ProductDetail";
import { products as seedProducts, type Product } from "@/lib/data";
import { useProducts } from "@/lib/product-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getProductById, loading } = useProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On server or first client render, show loading to avoid hydration mismatch
  // (localStorage isn't available on server, so getProductById would return undefined)
  if (!mounted || loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-brand-600" />
          <span>产品加载中...</span>
        </div>
      </div>
    );
  }

  // The `id` query param may now be either a legacy product id
  // (e.g. "huifa-beef-balls") or an ASIN-like SKU code (e.g. "PTJJUHG5T7").
  // Lookup therefore matches against both the `id` and `skuCode` fields so all
  // existing bookmarks/links keep working after the SKU rollout.
  let product: Product | undefined = id ? getProductById(id) : undefined;

  // Fall back to seed products (search by both id and skuCode)
  if (!product && id) {
    product = seedProducts.find(
      (p) => p.id === id || (p.skuCode && p.skuCode === id)
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">产品未找到</h1>
        <p className="text-muted-foreground mb-6">
          该产品可能已下架或链接无效。
        </p>
        <Link href="/products">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回产品大厅
          </Button>
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

export default function ProductPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
            加载中...
          </div>
        }
      >
        <ProductDetailContent />
      </Suspense>
      <Footer />
      <BackToTop />
    </>
  );
}
