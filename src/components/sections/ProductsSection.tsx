"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/product-context";
import { useBackendProducts, mapBackendProduct } from "@/lib/use-backend-products";

export function ProductsSection() {
  const { getApprovedProducts, loading: localLoading } = useProducts();
  const { products: backendProducts, loading: backendLoading } = useBackendProducts({ per_page: 60 });

  const localApproved = getApprovedProducts();
  const mappedBackend = backendProducts.map(mapBackendProduct);

  // Merge: backend products first, then local-only products (dedup by name)
  const backendNames = new Set(mappedBackend.map((p) => p.name));
  const localOnly = localApproved.filter((p) => !backendNames.has(p.name));

  const allProducts = [...mappedBackend, ...localOnly];

  // 优先展示惠发食品产品，不足时用其他产品补齐，最多 8 个
  const huifaProducts = allProducts.filter(
    (p) =>
      p.supplier === "惠发食品" ||
      p.supplier === "惠发食品有限公司" ||
      p.supplier === "Huifa Foods"
  );
  const otherProducts = allProducts.filter(
    (p) =>
      p.supplier !== "惠发食品" &&
      p.supplier !== "惠发食品有限公司" &&
      p.supplier !== "Huifa Foods"
  );
  const displayProducts = [...huifaProducts, ...otherProducts].slice(0, 8);

  const loading = localLoading || backendLoading;

  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="精选产品推荐"
          subtitle="严选优质供应商爆款产品，通过 HALAL 认证，支持小批量试单"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded" />
                  </div>
                </div>
              ))
            : displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} linkable />
              ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/products">
            <Button variant="outline" size="lg" className="gap-2">
              查看更多产品
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
