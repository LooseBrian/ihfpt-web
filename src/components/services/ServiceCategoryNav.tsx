import {
  ShieldCheck,
  Truck,
  Globe,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { serviceCategories } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Truck,
  Globe,
  Landmark,
};

export function ServiceCategoryNav() {
  return (
    <section className="py-12 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {serviceCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || ShieldCheck;
            return (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="group relative bg-gradient-to-br from-brand-50 to-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-brand-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-700 transition-colors">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-0.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{cat.nameEn}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {cat.description}
                </p>
                <p className="text-xs text-brand-600 font-medium border-t border-brand-100 pt-3">
                  {cat.highlight}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
