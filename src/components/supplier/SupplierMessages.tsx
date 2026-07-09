import { Bell, Mail, MessageSquare, FileCheck, AlertTriangle, RefreshCw, Package } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const messages = [
  {
    icon: Mail,
    type: "询盘提醒",
    title: "印尼雅加达贸易公司发来新询盘",
    desc: "INQ-2026-0045 — 清真冷冻羊腿肉（分割），500 kg，等待您的报价",
    time: "30 分钟前",
    unread: true,
    color: "brand",
  },
  {
    icon: FileCheck,
    type: "审核进度",
    title: "产品「清真速冻调理品 — 烤鸡翅」已通过审核",
    desc: "SKU-2026-0179 审核通过，产品已自动上架，可在产品大厅展示",
    time: "3 小时前",
    unread: true,
    color: "brand",
  },
  {
    icon: AlertTriangle,
    type: "到期预警",
    title: "MUI HALAL 认证证书即将到期",
    desc: "您的 MUI HALAL 证书将于 2026-07-20 到期，请尽快办理续期手续",
    time: "5 小时前",
    unread: true,
    color: "gold",
  },
  {
    icon: RefreshCw,
    type: "服务更新",
    title: "新增跨境物流商对接通道",
    desc: "平台已对接 3 家跨境物流服务商，支持在线下单与物流轨迹查询",
    time: "1 天前",
    unread: false,
    color: "gold",
  },
  {
    icon: Package,
    type: "产品提醒",
    title: "「清真速冻饺子」库存不足",
    desc: "SKU-2026-0168 当前库存低于 MOQ，建议及时补充库存或调整下架状态",
    time: "2 天前",
    unread: false,
    color: "brand",
  },
];

export function SupplierMessages() {
  return (
    <section id="messages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="消息通知中心"
          subtitle="站内信 · 邮件 · 短信多通道通知 — 询盘提醒、审核进度、到期预警、服务更新"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((msg, idx) => {
            const Icon = msg.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
                  msg.unread ? "bg-brand-50/50 border-brand-200" : "bg-muted/30 border-border/40"
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.color === "brand" ? "bg-brand-50" :
                  msg.color === "trust" ? "bg-trust-50" :
                  "bg-gold-50"
                }`}>
                  <Icon className={`h-5 w-5 ${
                    msg.color === "brand" ? "text-brand-600" :
                    msg.color === "trust" ? "text-trust-600" :
                    "text-gold-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      msg.color === "brand" ? "bg-brand-100 text-brand-700" :
                      msg.color === "trust" ? "bg-trust-100 text-trust-700" :
                      "bg-gold-100 text-gold-700"
                    }`}>
                      {msg.type}
                    </span>
                    {msg.unread && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{msg.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{msg.desc}</p>
                </div>

                {/* Time */}
                <span className="text-xs text-muted-foreground shrink-0">{msg.time}</span>
              </div>
            );
          })}
        </div>

        {/* Notification channels */}
        <div className="max-w-3xl mx-auto mt-6">
          <div className="flex items-center justify-center gap-6 bg-muted/30 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bell className="h-4 w-4 text-brand-500" />
              站内信
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-brand-500" />
              邮件通知
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4 text-brand-500" />
              短信通知
            </div>
            <span className="text-xs text-muted-foreground">| 二期上线</span>
          </div>
        </div>
      </div>
    </section>
  );
}
