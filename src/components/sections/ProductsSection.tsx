import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data";

// 惠发食品产品（首页精选展示）
const huifaProducts = products.filter(
  (p) => p.supplier === "惠发食品" || p.supplier === "Huifa Foods"
);

export function ProductsSection() {
  const displayProducts = huifaProducts.length >= 4 ? huifaProducts : products;

  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="精选产品推荐"
          subtitle="严选优质供应商爆款产品，通过 HALAL 认证，支持小批量试单"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            查看更多产品
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
