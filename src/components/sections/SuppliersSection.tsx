import { SectionHeader } from "@/components/shared/SectionHeader";
import { SupplierCard } from "@/components/shared/SupplierCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { suppliers } from "@/lib/data";

export function SuppliersSection() {
  return (
    <section id="suppliers" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="优质供应商推荐"
          subtitle="严选头部入驻厂商，具备完整资质与出口经验，覆盖全球穆斯林市场"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            查看全部供应商
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
