"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/product-context";

export function ProductsSection() {
  const { getApprovedProducts, loading } = useProducts();
  const approvedProducts = getApprovedProducts();

  // 优先展示惠发食品产品，不足时用其他产品补齐，最多 8 个
  const huifaProducts = approvedProducts.filter(
    (p) => p.supplier === "惠发食品" || p.supplier === "Huifa Foods"
  );
  const otherProducts = approvedProducts.filter(
    (p) => p.supplier !== "惠发食品" && p.supplier !== "Huifa Foods"
  );
  const displayProducts = [...huifaProducts, ...otherProducts].slice(0, 8);

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
            : displayProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} linkable={index < 4} />
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
