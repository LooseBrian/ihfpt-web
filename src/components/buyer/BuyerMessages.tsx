"use client";

import { Bell, Mail, MessageSquare, FileCheck, AlertTriangle, RefreshCw, Clock } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useAuth } from "@/lib/auth-context";
import { useInquiry } from "@/lib/inquiry-context";

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN");
}

const messages = [
  {
    icon: Mail,
    type: "询盘提醒",
    title: "山东惠发食品有限公司回复了您的询盘",
    desc: "INQ-2026-0042 — 清真冷冻牛羊肉分割肉，供应商已提供报价方案",
    time: "2 小时前",
    unread: true,
    color: "trust",
  },
  {
    icon: FileCheck,
    type: "审核进度",
    title: "您的采购商认证已通过",
    desc: "恭喜！您的企业信息审核已通过，现在可以使用全部采购商功能",
    time: "1 天前",
    unread: true,
    color: "trust",
  },
  {
    icon: RefreshCw,
    type: "服务更新",
    title: "合规认证代办服务已更新",
    desc: "新增 JAKIM 认证快速通道，平均办理周期缩短至 7 个工作日",
    time: "2 天前",
    unread: true,
    color: "gold",
  },
  {
    icon: AlertTriangle,
    type: "到期预警",
    title: "收藏产品资质证书即将到期",
    desc: "您收藏的「清真速冻饺子」供应商 HALAL 证书将于 30 天后到期",
    time: "3 天前",
    unread: false,
    color: "gold",
  },
  {
    icon: Mail,
    type: "询盘提醒",
    title: "新疆天山食品集团发送了新品报价",
    desc: "基于您的采购偏好，为您推荐 3 款清真速冻调理品新品",
    time: "5 天前",
    unread: false,
    color: "trust",
  },
];

export function BuyerMessages() {
  const { user } = useAuth();
  const { getBuyerInquiries, loading } = useInquiry();
  const buyerInquiries = getBuyerInquiries(user?.name || "测试采购商");

  // Generate notifications for unread supplier replies
  const inquiryNotifications = buyerInquiries
    .filter((inq) => inq.status !== "closed")
    .flatMap((inq) =>
      inq.messages
        .filter((m) => m.sender === "supplier" && !m.read)
        .map((m) => ({
          icon: Mail,
          type: "询盘提醒",
          title: `${inq.supplier}回复了您的询盘`,
          desc: `${inq.id} — ${inq.productName}，${m.content.slice(0, 60)}${m.content.length > 60 ? "..." : ""}`,
          time: formatRelativeTime(m.createdAt),
          unread: true,
          color: "trust" as const,
        }))
    );

  // Generate notifications for pending inquiries (no reply yet)
  const pendingNotifications = buyerInquiries
    .filter((inq) => inq.status === "pending")
    .map((inq) => ({
      icon: Clock,
      type: "询盘提醒",
      title: `询盘${inq.id}等待供应商回复`,
      desc: `${inq.productName} — 已发送询盘，等待${inq.supplier}回复中`,
      time: formatRelativeTime(inq.createdAt),
      unread: false,
      color: "gold" as const,
    }));

  const allMessages = [...inquiryNotifications, ...pendingNotifications, ...messages];

  return (
    <section id="messages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="消息通知中心"
          subtitle="站内信 · 邮件 · 短信多通道通知 — 询盘提醒、审核进度、服务更新、到期预警"
          theme="trust"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {allMessages.map((msg, idx) => {
            const Icon = msg.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm ${
                  msg.unread ? "bg-trust-50/50 border-trust-200" : "bg-white border-border/40"
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.color === "trust" ? "bg-trust-50" :
                  msg.color === "trust" ? "bg-trust-50" :
                  "bg-gold-50"
                }`}>
                  <Icon className={`h-5 w-5 ${
                    msg.color === "trust" ? "text-trust-600" :
                    msg.color === "trust" ? "text-trust-600" :
                    "text-gold-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      msg.color === "trust" ? "bg-trust-100 text-trust-700" :
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
          <div className="flex items-center justify-center gap-6 bg-white rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bell className="h-4 w-4 text-trust-500" />
              站内信
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-trust-500" />
              邮件通知
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4 text-trust-500" />
              短信通知
            </div>
            <span className="text-xs text-muted-foreground">| 二期上线</span>
          </div>
        </div>
      </div>
    </section>
  );
}
