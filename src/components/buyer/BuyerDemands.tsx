import { Plus, Users, Tag, Globe, Eye, Clock } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const demands = [
  {
    id: "DM-2026-008",
    title: "清真冷冻牛羊肉 — 月度采购",
    category: "牛羊肉制品",
    quantity: "5,000 kg / 月",
    targetRegion: "印尼",
    status: "active",
    statusText: "招标中",
    views: 23,
    replies: 8,
    date: "2026-07-06",
  },
  {
    id: "DM-2026-006",
    title: "清真预制菜 — 餐饮连锁供应",
    category: "清真预制菜",
    quantity: "10,000 box / 月",
    targetRegion: "马来西亚",
    status: "active",
    statusText: "招标中",
    views: 45,
    replies: 12,
    date: "2026-07-02",
  },
  {
    id: "DM-2026-003",
    title: "清真调味料 — 批量采购",
    category: "调味品",
    quantity: "2,000 kg",
    targetRegion: "沙特阿拉伯",
    status: "closed",
    statusText: "已结束",
    views: 67,
    replies: 15,
    date: "2026-06-20",
  },
];

export function BuyerDemands() {
  return (
    <section id="demands" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="需求发布管理"
          subtitle="发布采购需求，基于品类、地区、资质精准匹配供应商（二期智能匹配）"
        />

        <div className="max-w-5xl mx-auto">
          {/* New demand button */}
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-trust-500 text-white rounded-lg font-medium text-sm hover:bg-trust-600 transition-colors">
              <Plus className="h-4 w-4" />
              发布新需求
            </button>
          </div>

          {/* Demand cards */}
          <div className="space-y-4">
            {demands.map((demand) => (
              <div
                key={demand.id}
                className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-trust-600 font-medium">{demand.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        demand.status === "active"
                          ? "bg-brand-50 text-brand-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {demand.statusText}
                      </span>
                    </div>
                    <h3 className="font-bold text-brand-900 text-sm mb-2">{demand.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {demand.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        目标地区: {demand.targetRegion}
                      </span>
                      <span>采购量: {demand.quantity}</span>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex gap-4 text-xs">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Eye className="h-3 w-3" />
                        浏览
                      </div>
                      <div className="font-bold text-brand-900">{demand.views}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        回复
                      </div>
                      <div className="font-bold text-brand-900">{demand.replies}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        发布
                      </div>
                      <div className="font-bold text-brand-900">{demand.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phase note */}
          <div className="mt-6 bg-trust-50 rounded-xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-trust-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-sm text-trust-700 leading-relaxed">
              <strong>智能匹配（二期上线）：</strong>
              系统将基于您的采购需求、品类偏好、目标地区与资质要求，
              自动推荐匹配的供应商与产品，提升寻源效率。
              三期上线「采购商需求发布大厅」，支持公开招标与定向邀请。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
