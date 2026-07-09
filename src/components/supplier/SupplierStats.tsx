import { SectionHeader } from "@/components/shared/SectionHeader";

const supplierStats = [
  { value: "18", label: "上架产品", suffix: "个" },
  { value: "36", label: "收到询盘", suffix: "条" },
  { value: "1,258", label: "店铺访问", suffix: "次" },
  { value: "42", label: "关注粉丝", suffix: "家" },
];

export function SupplierStats() {
  return (
    <section className="py-14 bg-brand-900 text-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="供应商数据"
          subtitle="以数据驱动获客转化，助力中国清真食品产能走向全球"
          className="[&_h2]:text-white [&_p]:text-brand-200 [&_div:last-child]:bg-gold-400"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {supplierStats.map((stat) => (
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
