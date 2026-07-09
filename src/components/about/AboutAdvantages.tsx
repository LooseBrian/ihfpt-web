import { BadgeCheck, Globe2, Package, Wrench, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const trustBadges = [
  { title: "国际 HALAL 认证互认", desc: "对接 JAKIM、SFDA 等权威认证机构" },
  { title: "海关官方合作", desc: "海关数据接口，资质在线核验" },
  { title: "多国政府对接", desc: "东盟、中东、北非、中亚多国政企资源" },
  { title: "全程合规保障", desc: "从源头到终端的全链路合规追溯体系" },
];

const categories = [
  "清真预制菜",
  "速冻调理品",
  "牛羊肉制品",
  "米面粮油",
  "休闲食品",
  "调味品",
];

const services = [
  "合规认证代办",
  "跨境物流仓储",
  "海外渠道拓展",
  "金融配套服务",
];

const markets = [
  { name: "东盟", desc: "ASEAN", icon: "🇮🇩" },
  { name: "中东", desc: "GCC", icon: "🇸🇦" },
  { name: "北非", desc: "MENA", icon: "🇪🇬" },
  { name: "中亚", desc: "Central Asia", icon: "🇰🇿" },
];

export function AboutAdvantages() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="核心优势与平台价值"
          subtitle="四大信任背书、六大核心品类、四大服务板块，构建清真食品贸易全链路生态闭环"
        />

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {trustBadges.map((badge) => (
            <div
              key={badge.title}
              className="bg-white rounded-xl border shadow-sm p-5 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-3">
                <BadgeCheck className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-brand-900 text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* Categories & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-brand-900">六大核心品类</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 bg-brand-50 text-brand-700 text-sm rounded-lg font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-brand-900">四大核心服务</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((srv) => (
                <span
                  key={srv}
                  className="px-3 py-1.5 bg-gold-50 text-gold-600 text-sm rounded-lg font-medium"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Market Coverage */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe2 className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-brand-900">市场覆盖</h3>
              <span className="text-sm text-muted-foreground">— 核心覆盖四大穆斯林主流市场</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {markets.map((market) => (
                <div
                  key={market.name}
                  className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
                >
                  <span className="text-2xl">{market.icon}</span>
                  <div>
                    <div className="font-semibold text-brand-900 text-sm">{market.name}</div>
                    <div className="text-xs text-muted-foreground">{market.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
