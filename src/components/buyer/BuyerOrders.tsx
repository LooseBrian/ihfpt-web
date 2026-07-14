import { ClipboardList, Truck, Package, Clock, Lock } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const orderPhases = [
  { phase: "一期", title: "询盘管理", status: "available", desc: "单品询价、批量询价、需求定向发布 — 全流程询盘跟踪" },
  { phase: "二期", title: "在线询价系统", status: "coming", desc: "询盘流转管理、自动分配、转化漏斗统计、超时预警" },
  { phase: "二期", title: "物流轨迹查询", status: "coming", desc: "跨境物流商接口对接，物流轨迹实时查询与库存同步" },
  { phase: "三期", title: "订单交易系统", status: "planned", desc: "线上合同、订单状态跟踪、交付确认 — 全链路交易闭环" },
];

export function BuyerOrders() {
  return (
    <section id="orders" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="订单管理 & 物流跟踪"
          subtitle="从询盘到交付的全链路管理 — 分阶段上线，构建完整的贸易交易闭环"
          theme="trust"
        />

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {orderPhases.map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-4 rounded-xl border p-5 ${
                  item.status === "available"
                    ? "bg-white border-trust-200 shadow-sm"
                    : "bg-[#F2FAF8] border-border/40"
                }`}
              >
                {/* Phase badge */}
                <div className="flex flex-col items-center shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    item.phase === "一期" ? "bg-trust-100 text-trust-700" :
                    item.phase === "二期" ? "bg-gold-100 text-gold-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {item.phase}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.title.includes("物流") ? (
                      <Truck className="h-4 w-4 text-trust-600" />
                    ) : item.title.includes("询盘") ? (
                      <ClipboardList className="h-4 w-4 text-trust-600" />
                    ) : (
                      <Package className="h-4 w-4 text-gold-600" />
                    )}
                    <h3 className="font-bold text-trust-900 text-sm">{item.title}</h3>
                    {item.status === "available" ? (
                      <span className="px-1.5 py-0.5 text-[10px] bg-trust-50 text-trust-600 rounded font-medium">已上线</span>
                    ) : item.status === "coming" ? (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gold-50 text-gold-600 rounded font-medium">即将上线</span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded font-medium">规划中</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>

                {/* Status icon */}
                <div className="shrink-0 mt-0.5">
                  {item.status === "available" ? (
                    <Clock className="h-4 w-4 text-trust-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Logistics tracking preview */}
          <div id="logistics" className="mt-6 bg-trust-50 rounded-2xl p-6 border border-trust-200">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-trust-600" />
              <h3 className="font-bold text-trust-900">物流跟踪（二期上线）</h3>
              <span className="px-2 py-0.5 bg-gold-100 text-gold-700 text-xs font-bold rounded">即将上线</span>
            </div>
            <p className="text-sm text-trust-700 leading-relaxed mb-4">
              二期上线后，采购商可实时查看跨境物流轨迹、海外仓库存状态，
              对接跨境物流商与海外仓系统，实现物流轨迹查询与库存实时同步。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <Truck className="h-6 w-6 text-trust-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-trust-900">物流轨迹查询</div>
                <div className="text-[10px] text-muted-foreground mt-1">跨境物流实时跟踪</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Package className="h-6 w-6 text-trust-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-trust-900">库存实时同步</div>
                <div className="text-[10px] text-muted-foreground mt-1">海外仓库存状态</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Clock className="h-6 w-6 text-trust-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-trust-900">预计到达时间</div>
                <div className="text-[10px] text-muted-foreground mt-1">智能 ETA 预测</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
