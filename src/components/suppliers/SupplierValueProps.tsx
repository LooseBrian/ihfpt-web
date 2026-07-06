import { ShieldCheck, Globe, Truck, Warehouse } from "lucide-react";
import { supplierValueBadges } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Globe,
  Truck,
  Warehouse,
};

export function SupplierValueProps() {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supplierValueBadges.map((badge, idx) => {
            const keys = Object.keys(iconMap);
            const Icon = iconMap[keys[idx]] || ShieldCheck;
            return (
              <div
                key={badge.id}
                className="bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
