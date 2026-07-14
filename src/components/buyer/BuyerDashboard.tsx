import { Search, FileText, Heart, MessageSquare, TrendingUp, Package } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const quickActions = [
  {
    icon: Search,
    title: "浏览产品大厅",
    desc: "探索 6 大品类清真食品，筛选认证供应商",
    href: "/products",
    color: "trust",
  },
  {
    icon: FileText,
    title: "发布采购需求",
    desc: "定向发布采购需求，精准匹配供应商",
    href: "#demands",
    color: "trust",
  },
  {
    icon: MessageSquare,
    title: "查看询盘记录",
    desc: "跟踪询盘进度，管理供应商回复",
    href: "#inquiries",
    color: "gold",
  },
  {
    icon: Heart,
    title: "我的收藏夹",
    desc: "管理收藏的产品与供应商",
    href: "#favorites",
    color: "trust",
  },
];

const discoverySteps = [
  { step: "01", title: "品类导航", desc: "浏览 6 大清真食品品类，快速定位需求" },
  { step: "02", title: "精选产品", desc: "查看 HALAL 认证产品，对比价格与规格" },
  { step: "03", title: "供应商详情", desc: "查看企业资质、产能、出口案例" },
  { step: "04", title: "在线询价", desc: "单品询价或批量询价，定向发布需求" },
];

export function BuyerDashboard() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="采购商工作台"
          subtitle="一站式管理询盘、收藏、需求发布与消息通知"
          theme="trust"
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.title}
                href={action.href}
                className="group bg-white rounded-xl border border-border/40 p-5 hover:shadow-md hover:border-trust-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-trust-50 flex items-center justify-center mb-3 group-hover:bg-trust-100 transition-colors">
                  <Icon className="h-6 w-6 text-trust-600" />
                </div>
                <h3 className="font-bold text-trust-900 text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
              </a>
            );
          })}
        </div>

        {/* Discovery Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-border/40">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5 text-trust-600" />
              <h3 className="font-bold text-trust-900">采购寻源流程</h3>
              <span className="text-sm text-muted-foreground">— 品类导航 → 精选产品 → 供应商详情 → 在线询价</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {discoverySteps.map((item, idx) => (
                <div key={item.step} className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-trust-300">{item.step}</span>
                    <Package className="h-4 w-4 text-trust-500" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  {idx < discoverySteps.length - 1 && (
                    <div className="hidden md:block absolute top-3 -right-2 text-trust-300">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
