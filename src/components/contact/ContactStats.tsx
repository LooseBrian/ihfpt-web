import { SectionHeader } from "@/components/shared/SectionHeader";

const contactStats = [
  { value: "1", label: "工作日内响应", suffix: "个" },
  { value: "4", label: "服务角色通道", suffix: "类" },
  { value: "4", label: "支持语言", suffix: "种" },
  { value: "2", label: "线上线下办公点", suffix: "处" },
];

export function ContactStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="服务承诺"
          subtitle="以高效响应与专业服务，确保每一次沟通都有回音"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactStats.map((stat) => (
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
