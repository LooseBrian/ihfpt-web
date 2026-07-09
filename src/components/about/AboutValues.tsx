import { ShieldCheck, Crosshair, TrendingUp, Globe, Layers } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const values = [
  {
    icon: ShieldCheck,
    title: "权威公信优先",
    desc: "以国家级协会背书为核心信任锚点，弱化单一企业商业露出，强化公共服务与行业平台属性，保障中立避嫌。",
  },
  {
    icon: Crosshair,
    title: "垂直专业深耕",
    desc: "聚焦清真食品赛道，内置全品类合规标准与认证体系，区别于通用跨境平台，形成专业壁垒。",
  },
  {
    icon: TrendingUp,
    title: "贸易效率为本",
    desc: "以采购商寻源、供应商获客、供需精准匹配为核心目标，优化全链路转化路径。",
  },
  {
    icon: Globe,
    title: "全球属地适配",
    desc: "原生多语言、多币种架构，标配阿拉伯语 RTL 排版，贴合全球穆斯林市场使用习惯。",
  },
  {
    icon: Layers,
    title: "服务生态闭环",
    desc: "以产品贸易为基础，叠加合规、物流、金融、渠道一站式增值服务，构建平台核心差异化价值。",
  },
];

export function AboutValues() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="核心设计原则"
          subtitle="五大核心设计原则贯穿平台建设全程，确保平台长期竞争力与公信力"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
