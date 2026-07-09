import { Target, Compass, Award } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const pillars = [
  {
    icon: Target,
    title: "平台使命",
    content: "链接中国优质清真食品产能与全球穆斯林消费市场，以数字化贸易基础设施赋能清真食品产业全球化。",
  },
  {
    icon: Compass,
    title: "平台愿景",
    content: "打造全球最具公信力的清真食品贸易枢纽，成为连接中国清真产能与全球穆斯林市场的首选平台。",
  },
  {
    icon: Award,
    title: "平台定位",
    content: "国家级、全球化、垂直型清真食品 B2B 贸易与产业服务平台，集产品供需匹配、合规认证代办、跨境供应链服务、产业资源对接于一体。",
  },
];

export function AboutIntro() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="平台背景与使命愿景"
          subtitle="以国家级协会背书为核心信任锚点，构建全球清真食品贸易新格局"
        />

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-muted/30 rounded-2xl p-8 md:p-10 border border-border/40">
            <p className="text-foreground leading-relaxed text-base md:text-lg">
              <strong className="text-brand-900">
                国际清真食品贸易平台（IHFTP）
              </strong>
              由中国食品药品企业质量安全促进会主办，中国-东盟特色产业链出海平台专业委员会运营，是集产品供需匹配、合规认证代办、跨境供应链服务、产业资源对接于一体的国家级 B2B 贸易与产业服务平台。平台核心覆盖东盟、中东、北非、中亚四大穆斯林主流市场，辐射全球清真食品贸易网络。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-muted/30 rounded-xl p-6 border border-border/40 hover:border-brand-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-brand-900 text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
