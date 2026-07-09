import { SectionHeader } from "@/components/shared/SectionHeader";

const authStats = [
  { value: "50", label: "首批入驻供应商", suffix: "家" },
  { value: "3-5", label: "资质审核周期", suffix: "天" },
  { value: "4", label: "角色账号体系", suffix: "类" },
  { value: "4", label: "支持语言", suffix: "种" },
];

export function AuthStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="入驻与注册"
          subtitle="高效审核，快速上线，助力您的清真食品贸易全球化"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {authStats.map((stat) => (
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
