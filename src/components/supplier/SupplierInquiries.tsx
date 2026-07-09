import { MessageSquare, Clock, CheckCircle2, AlertCircle, ArrowRight, Mail, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const inquiries = [
  {
    id: "INQ-2026-0045",
    product: "清真冷冻羊腿肉（分割）",
    buyer: "印尼雅加达贸易公司",
    type: "单品询价",
    status: "pending",
    statusText: "待回复",
    date: "2026-07-09",
    amount: "500 kg",
    country: "印度尼西亚",
  },
  {
    id: "INQ-2026-0042",
    product: "清真预制菜系列（多品）",
    buyer: "马来西亚巴生港商超",
    type: "批量询价",
    status: "replied",
    statusText: "已回复",
    date: "2026-07-08",
    amount: "2,000 kg",
    country: "马来西亚",
  },
  {
    id: "INQ-2026-0038",
    product: "清真冷冻牛羊肉分割肉",
    buyer: "沙特利雅得经销商",
    type: "单品询价",
    status: "replied",
    statusText: "已回复",
    date: "2026-07-06",
    amount: "1,000 kg",
    country: "沙特阿拉伯",
  },
  {
    id: "INQ-2026-0031",
    product: "清真速冻调理品",
    buyer: "迪拜餐饮连锁",
    type: "定向需求",
    status: "closed",
    statusText: "已关闭",
    date: "2026-07-01",
    amount: "800 kg",
    country: "阿联酋",
  },
];

const statusConfig = {
  replied: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50" },
  pending: { icon: Clock, color: "text-gold-600 bg-gold-50" },
  closed: { icon: AlertCircle, color: "text-muted-foreground bg-muted" },
};

export function SupplierInquiries() {
  return (
    <section id="inquiries" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="询盘管理"
          subtitle="接收采购商询价 — 单品询价 · 批量询价 · 需求定向发布 — 全流程跟进与转化"
        />

        <div className="max-w-5xl mx-auto">
          <div className="bg-muted/30 rounded-2xl border shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-2">询盘编号</div>
              <div className="col-span-3">产品</div>
              <div className="col-span-2">采购商</div>
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
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-border/40 hover:bg-white transition-colors"
                >
                  <div className="md:col-span-2">
                    <span className="text-xs font-mono text-brand-600 font-medium">{inquiry.id}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-sm text-foreground font-medium">{inquiry.product}</span>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">{inquiry.buyer}</div>
                    <div className="text-xs text-muted-foreground/70">{inquiry.country}</div>
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

          {/* Inquiry workflow info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">询盘自动分配</span>
              </div>
              <p className="text-xs text-muted-foreground">系统按品类、地区、资质自动将询盘分配给匹配供应商（二期）</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-bold text-brand-900">超时预警</span>
              </div>
              <p className="text-xs text-muted-foreground">询盘超时未回复自动预警，保障响应效率与转化率</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">转化漏斗</span>
              </div>
              <p className="text-xs text-muted-foreground">询盘转化漏斗统计，分析获客与成交转化效果（二期）</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
