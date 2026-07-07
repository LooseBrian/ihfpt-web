import { SectionHeader } from "@/components/shared/SectionHeader";

const serviceStats = [
  { value: "16", label: "核心服务项目", suffix: "项" },
  { value: "4", label: "服务类别", suffix: "大类" },
  { value: "320", label: "服务案例", suffix: "+" },
  { value: "90", label: "服务满意度", suffix: "%" },
];

export function ServiceStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="平台服务能力"
          subtitle="以数据印证服务实力，全程护航清真食品出海"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {serviceStats.map((stat) => (
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
