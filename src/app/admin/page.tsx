"use client";

import {
  Package,
  Store,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

// ===== Stat Card Data =====

interface StatCardData {
  icon: typeof Package;
  label: string;
  stats: { value: number; label: string }[];
  trend: { value: string; up: boolean } | null;
  iconBg: string;
  iconColor: string;
}

const statCards: StatCardData[] = [
  {
    icon: Package,
    label: "总产品数",
    stats: [
      { value: 28, label: "总产品数" },
      { value: 22, label: "已上架" },
      { value: 3, label: "审核中" },
      { value: 3, label: "已下架" },
    ],
    trend: { value: "12.5%", up: true },
    iconBg: "bg-brand-50",
    iconColor: "text-brand-600",
  },
  {
    icon: Store,
    label: "供应商总数",
    stats: [
      { value: 10, label: "供应商总数" },
      { value: 2, label: "S级" },
      { value: 4, label: "A级" },
      { value: 4, label: "认证" },
    ],
    trend: { value: "8.3%", up: true },
    iconBg: "bg-trust-50",
    iconColor: "text-trust-600",
  },
  {
    icon: Users,
    label: "采购商总数",
    stats: [
      { value: 156, label: "采购商总数" },
      { value: 23, label: "本月新增" },
    ],
    trend: { value: "15.2%", up: true },
    iconBg: "bg-gold-50",
    iconColor: "text-gold-600",
  },
  {
    icon: MessageSquare,
    label: "询盘总数",
    stats: [
      { value: 89, label: "询盘总数" },
      { value: 12, label: "待回复" },
      { value: 67, label: "已回复" },
      { value: 10, label: "已关闭" },
    ],
    trend: { value: "3.1%", up: false },
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

// ===== Pending Products =====

const pendingProducts = [
  {
    id: "PRD-001",
    name: "清真冷冻牛肉卷",
    supplier: "宁夏伊品清真食品有限公司",
    time: "2026-07-14 09:32",
  },
  {
    id: "PRD-002",
    name: "HALAL 认证椰枣礼盒",
    supplier: "新疆西域果园贸易有限公司",
    time: "2026-07-14 08:15",
  },
  {
    id: "PRD-003",
    name: "清真即食鸡肉肠",
    supplier: "山东 halal 食品加工厂",
    time: "2026-07-13 17:48",
  },
  {
    id: "PRD-004",
    name: "阿拉伯风味咖喱酱",
    supplier: "广州丝路食品进出口公司",
    time: "2026-07-13 14:20",
  },
  {
    id: "PRD-005",
    name: "清真认证橄榄油",
    supplier: "甘肃陇原特产商贸有限公司",
    time: "2026-07-13 10:05",
  },
];

// ===== Recent Inquiries =====

const recentInquiries = [
  {
    id: "INQ-2026-089",
    product: "清真冷冻牛肉卷",
    buyer: "迪拜 Al-Safa 贸易",
    status: "pending" as const,
  },
  {
    id: "INQ-2026-088",
    product: "HALAL 椰枣礼盒",
    buyer: "雅加达 PT. Halal Jaya",
    status: "replied" as const,
  },
  {
    id: "INQ-2026-087",
    product: "清真即食鸡肉肠",
    buyer: "吉隆坡 MyHalal Sdn Bhd",
    status: "pending" as const,
  },
  {
    id: "INQ-2026-086",
    product: "阿拉伯咖喱酱",
    buyer: "伊斯坦布尔 TurkFood A.S.",
    status: "replied" as const,
  },
  {
    id: "INQ-2026-085",
    product: "清真橄榄油",
    buyer: "开罗 Egypt Halal Trade",
    status: "closed" as const,
  },
];

const inquiryStatusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  pending: { label: "待回复", variant: "default" },
  replied: { label: "已回复", variant: "secondary" },
  closed: { label: "已关闭", variant: "outline" },
};

// ===== Stat Card Component =====

function StatCard({ data }: { data: StatCardData }) {
  const Icon = data.icon;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-lg ${data.iconBg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${data.iconColor}`} />
          </div>
          <CardTitle className="text-sm font-medium text-slate-600">
            {data.label}
          </CardTitle>
        </div>
        {data.trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              data.trend.up ? "text-brand-600" : "text-red-500"
            }`}
          >
            {data.trend.up ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {data.trend.value}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((stat, idx) => (
            <div
              key={idx}
              className={idx === 0 ? "col-span-2 pb-2 border-b border-slate-100" : ""}
            >
              <div
                className={`font-bold text-slate-900 ${
                  idx === 0 ? "text-2xl" : "text-lg"
                }`}
              >
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ===== Main Page =====

export default function AdminDashboardPage() {
  return (
    <AdminGuard requiredPermission="dashboard.view">
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">数据看板</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                平台运营数据总览 · 实时更新
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">更新于 2 分钟前</span>
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <StatCard key={card.label} data={card} />
            ))}
          </div>

          {/* Two Panels Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Pending Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-brand-600" />
                  待审核产品
                </CardTitle>
                <Button variant="ghost" size="xs" className="gap-1 text-slate-500">
                  查看全部
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y border-slate-100 bg-slate-50/50">
                        <th className="text-left font-medium text-slate-500 px-4 py-2.5">
                          产品名称
                        </th>
                        <th className="text-left font-medium text-slate-500 px-4 py-2.5 hidden sm:table-cell">
                          提交时间
                        </th>
                        <th className="text-right font-medium text-slate-500 px-4 py-2.5">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800 truncate max-w-[140px]">
                              {product.name}
                            </div>
                            <div className="text-xs text-slate-400 truncate max-w-[140px]">
                              {product.supplier}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                            {product.time}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="xs"
                                className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
                              >
                                <Check className="h-3 w-3" />
                                通过
                              </Button>
                              <Button
                                size="xs"
                                variant="destructive"
                                className="gap-1"
                              >
                                <X className="h-3 w-3" />
                                驳回
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Right: Recent Inquiries */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-trust-600" />
                  最近询盘
                </CardTitle>
                <Button variant="ghost" size="xs" className="gap-1 text-slate-500">
                  查看全部
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {recentInquiries.map((inquiry) => {
                  const status = inquiryStatusMap[inquiry.status];
                  return (
                    <div
                      key={inquiry.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {inquiry.id}
                          </span>
                          <Badge variant={status.variant} className="text-[10px]">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium text-slate-800 truncate mt-0.5">
                          {inquiry.product}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {inquiry.buyer}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Bottom: Trend Placeholder */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-brand-600" />
                平台运营趋势
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  近 30 天
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-brand-500" />
                </div>
                <p className="text-sm font-medium text-slate-600">图表区域</p>
                <p className="text-xs text-slate-400 mt-1 text-center max-w-md">
                  此区域将展示平台运营趋势图表（产品上架趋势、询盘转化率、供应商增长、采购商活跃度等）。
                  <br />
                  图表组件将在后续迭代中集成。
                </p>
              </div>
              {/* Trend indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                  <TrendingUp className="h-4 w-4 text-brand-500" />
                  <div>
                    <div className="text-xs text-slate-400">产品上架</div>
                    <div className="text-sm font-semibold text-slate-700">+12.5%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                  <TrendingUp className="h-4 w-4 text-trust-500" />
                  <div>
                    <div className="text-xs text-slate-400">询盘增长</div>
                    <div className="text-sm font-semibold text-slate-700">+8.7%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-xs text-slate-400">回复时长</div>
                    <div className="text-sm font-semibold text-slate-700">-5.2%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                  <TrendingUp className="h-4 w-4 text-gold-500" />
                  <div>
                    <div className="text-xs text-slate-400">转化率</div>
                    <div className="text-sm font-semibold text-slate-700">+3.4%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
