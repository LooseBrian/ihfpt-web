import { ClipboardList, Truck, Package, Clock, Lock, FileSignature } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const orderPhases = [
  { phase: "一期", title: "询盘响应", status: "available", desc: "接收询盘、回复报价、跟进客户 — 全流程询盘管理" },
  { phase: "二期", title: "询盘流转管理", status: "coming", desc: "询盘自动分配、跟进记录、转化漏斗统计、超时预警" },
  { phase: "二期", title: "跨境物流对接", status: "coming", desc: "跨境物流商接口对接，物流轨迹查询与发货管理" },
  { phase: "三期", title: "订单交易系统", status: "planned", desc: "线上合同、订单状态跟踪、交付确认 — 全链路交易闭环" },
];

export function SupplierOrders() {
  return (
    <section id="orders" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="订单管理 & 交易闭环"
          subtitle="从询盘到交付的全链路管理 — 分阶段上线，构建完整的贸易交易体系"
        />

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {orderPhases.map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-4 rounded-xl border p-5 ${
                  item.status === "available"
                    ? "bg-white border-brand-200 shadow-sm"
                    : "bg-muted/20 border-border/40"
                }`}
              >
                {/* Phase badge */}
                <div className="flex flex-col items-center shrink-0">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    item.phase === "一期" ? "bg-brand-100 text-brand-700" :
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
                      <Truck className="h-4 w-4 text-brand-600" />
                    ) : item.title.includes("询盘") ? (
                      <ClipboardList className="h-4 w-4 text-brand-600" />
                    ) : (
                      <FileSignature className="h-4 w-4 text-gold-600" />
                    )}
                    <h3 className="font-bold text-brand-900 text-sm">{item.title}</h3>
                    {item.status === "available" ? (
                      <span className="px-1.5 py-0.5 text-[10px] bg-brand-50 text-brand-600 rounded font-medium">已上线</span>
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
                    <Clock className="h-4 w-4 text-brand-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* External interface preview */}
          <div className="mt-6 bg-brand-50 rounded-2xl p-6 border border-brand-200">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold text-brand-900">外部接口预留（分阶段对接）</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <FileSignature className="h-6 w-6 text-brand-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-brand-900">企业内部接口</div>
                <div className="text-[10px] text-muted-foreground mt-1">ERP / CRM 数据打通（一期）</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Truck className="h-6 w-6 text-brand-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-brand-900">物流供应链接口</div>
                <div className="text-[10px] text-muted-foreground mt-1">跨境物流商 / 海外仓（二期）</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Package className="h-6 w-6 text-brand-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-brand-900">第三方平台接口</div>
                <div className="text-[10px] text-muted-foreground mt-1">阿里国际站等同步（三期）</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
