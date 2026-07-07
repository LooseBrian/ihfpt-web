import { SectionHeader } from "@/components/shared/SectionHeader";

const ecosystemStats = [
  { value: "4", label: "标杆产业园区", suffix: "个" },
  { value: "31", label: "合作机构", suffix: "家" },
  { value: "6", label: "专家委员", suffix: "位" },
  { value: "20", label: "联盟企业", suffix: "家" },
];

export function EcosystemStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="生态资源规模"
          subtitle="以数据呈现产业生态版图，汇聚多方力量共建清真食品出海新格局"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {ecosystemStats.map((stat) => (
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
