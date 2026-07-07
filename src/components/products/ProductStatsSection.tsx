import { Package, LayoutGrid, Globe, BadgeCheck } from "lucide-react";

const stats = [
  { icon: Package, value: "2400+", label: "上架清真产品" },
  { icon: LayoutGrid, value: "6", label: "大产品品类" },
  { icon: Globe, value: "28", label: "覆盖出口国家" },
  { icon: BadgeCheck, value: "5+", label: "国际权威认证" },
];

export function ProductStatsSection() {
  return (
    <section className="py-12 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-6 w-6 text-gold-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-brand-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
