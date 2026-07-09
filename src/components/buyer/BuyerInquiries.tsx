import { MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const inquiries = [
  {
    id: "INQ-2026-0042",
    product: "清真冷冻牛羊肉分割肉",
    supplier: "山东惠发食品有限公司",
    type: "单品询价",
    status: "replied",
    statusText: "已回复",
    date: "2026-07-08",
    amount: "500 kg",
  },
  {
    id: "INQ-2026-0039",
    product: "清真预制菜系列（多品）",
    supplier: "临沂清真食品有限公司",
    type: "批量询价",
    status: "pending",
    statusText: "待回复",
    date: "2026-07-07",
    amount: "2,000 kg",
  },
  {
    id: "INQ-2026-0035",
    product: "清真速冻调理品",
    supplier: "新疆天山食品集团",
    type: "单品询价",
    status: "replied",
    statusText: "已回复",
    date: "2026-07-05",
    amount: "800 kg",
  },
  {
    id: "INQ-2026-0028",
    product: "清真调味品（复合调味料）",
    supplier: "宁夏塞上香食品",
    type: "定向需求",
    status: "closed",
    statusText: "已关闭",
    date: "2026-06-28",
    amount: "1,500 kg",
  },
];

const statusConfig = {
  replied: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50" },
  pending: { icon: Clock, color: "text-gold-600 bg-gold-50" },
  closed: { icon: AlertCircle, color: "text-muted-foreground bg-muted" },
};

export function BuyerInquiries() {
  return (
    <section id="inquiries" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="询盘记录"
          subtitle="单品询价 · 批量询价 · 需求定向发布 — 全流程跟踪与管理"
        />

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-2">询盘编号</div>
              <div className="col-span-3">产品</div>
              <div className="col-span-2">供应商</div>
              <div className="col-span-1">类型</div>
              <div className="col-span-1">数量</div>
              <div className="col-span-2">状态</div>
              <div className="col-span-1">日期</div>
            </div>

            {/* Table rows */}
            {inquiries.map((inquiry) => {
              const status = statusConfig[inquiry.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div
                  key={inquiry.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-border/40 hover:bg-muted/20 transition-colors"
                >
                  <div className="md:col-span-2">
                    <span className="text-xs font-mono text-brand-600 font-medium">{inquiry.id}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-sm text-foreground font-medium">{inquiry.product}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm text-muted-foreground">{inquiry.supplier}</span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-medium">
                      {inquiry.type}
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-sm text-muted-foreground">{inquiry.amount}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {inquiry.statusText}
                    </span>
                  </div>
                  <div className="md:col-span-1 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                    <button className="text-brand-500 hover:text-brand-700 md:hidden">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inquiry types explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">单品询价</span>
              </div>
              <p className="text-xs text-muted-foreground">针对单个产品发起询价，获取供应商报价与规格信息</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-trust-600" />
                <span className="text-sm font-bold text-brand-900">批量询价</span>
              </div>
              <p className="text-xs text-muted-foreground">同时向多个产品发起批量询价，提升采购效率</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-bold text-brand-900">需求定向发布</span>
              </div>
              <p className="text-xs text-muted-foreground">发布采购需求，系统基于品类、地区、资质智能匹配供应商（二期）</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
