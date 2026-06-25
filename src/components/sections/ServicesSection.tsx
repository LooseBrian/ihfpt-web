import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { services } from "@/lib/data";

export function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-brand-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="一站式服务中心"
          subtitle="以产品贸易为基础，叠加合规、物流、金融、渠道一站式增值服务，构建平台核心差异化价值"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
