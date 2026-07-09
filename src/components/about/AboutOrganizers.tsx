import { Building2, Users, Crown } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const organizers = [
  {
    icon: Building2,
    role: "主办单位",
    name: "中国食品药品企业质量安全促进会",
    desc: "国家级食品药品行业权威组织，致力于推动食品药品企业质量安全建设与行业规范发展，为平台提供权威背书与公信力保障。",
  },
  {
    icon: Users,
    role: "运营单位",
    name: "中国-东盟特色产业链出海平台专业委员会",
    desc: "专注于中国-东盟特色产业链国际化与出海服务的专业机构，负责平台日常运营、资源对接与产业服务落地。",
  },
  {
    icon: Crown,
    role: "主任委员单位",
    name: "惠发食品",
    desc: "平台核心支撑企业，开放 ERP、CRM、供应链系统接口为平台提供自营产品数据与订单数据支撑，是线下贸易市场与线上平台对接的关键纽带。",
  },
];

export function AboutOrganizers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="主办与运营单位"
          subtitle="国家级协会主办、专业委员会运营、龙头企业支撑，构建三位一体的公信力基石"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {organizers.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="bg-muted/30 rounded-xl border border-border/40 p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                    {item.role}
                  </span>
                </div>
                <h3 className="font-bold text-brand-900 text-base mb-3 leading-snug">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
