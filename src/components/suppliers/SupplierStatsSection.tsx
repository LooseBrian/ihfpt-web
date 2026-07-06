import { Factory, Globe, Handshake, TrendingUp } from "lucide-react";

const stats = [
  { icon: Factory, value: "50+", label: "入驻优质供应商" },
  { icon: Globe, value: "28", label: "覆盖国家和地区" },
  { icon: Handshake, value: "320+", label: "年对接交易案例" },
  { icon: TrendingUp, value: "$120M+", label: "年对接交易额" },
];

export function SupplierStatsSection() {
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
