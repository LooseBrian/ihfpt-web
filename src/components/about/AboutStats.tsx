import { SectionHeader } from "@/components/shared/SectionHeader";

const aboutStats = [
  { value: "50", label: "首批入驻供应商", suffix: "家" },
  { value: "4", label: "覆盖穆斯林主流市场", suffix: "大" },
  { value: "6", label: "核心产品品类", suffix: "类" },
  { value: "4", label: "一站式核心服务", suffix: "项" },
];

export function AboutStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="平台目标数据"
          subtitle="以数据锚定发展目标，稳步迈向全球清真食品贸易枢纽"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                {stat.value}
                <span className="text-lg ml-1">{stat.suffix}</span>
              </div>
              <div className="text-sm text-brand-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
