import { SectionHeader } from "@/components/shared/SectionHeader";

const buyerStats = [
  { value: "12", label: "历史询盘", suffix: "条" },
  { value: "28", label: "收藏产品", suffix: "个" },
  { value: "3", label: "活跃需求", suffix: "条" },
  { value: "4", label: "支持语言", suffix: "种" },
];

export function BuyerStats() {
  return (
    <section className="py-14 bg-trust-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="采购商数据"
          subtitle="以数据驱动采购决策，助力全球清真食品贸易高效对接"
          theme="trust"
          className="[&_h2]:text-white [&_p]:text-trust-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {buyerStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                {stat.value}
                <span className="text-lg ml-1">{stat.suffix}</span>
              </div>
              <div className="text-sm text-trust-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
