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
import { adminApi } from "@/lib/api-client";
import { useApiQuery } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";

// ===== Types =====

interface DashboardStats {
  counts: {
    products_pending: number;
    products_approved: number;
    products_total: number;
    suppliers_total: number;
    buyers_total: number;
    inquiries_open: number;
    inquiries_total: number;
    news_published: number;
    banners_active: number;
  };
  recent_logs: Array<{
    id: string;
    admin_name: string;
    action: string;
    target_type: string;
    detail: string;
    created_at: string;
  }>;
  admin_info?: {
    id: string;
    name: string;
    email: string;
  };
}

// ===== Stat Card Component =====

interface StatCardData {
  icon: typeof Package;
  label: string;
  stats: { value: number; label: string }[];
  trend: { value: string; up: boolean } | null;
  iconBg: string;
  iconColor: string;
}

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

// ===== Build Stat Cards from API Data =====

function buildStatCards(stats: DashboardStats["counts"]): StatCardData[] {
  return [
    {
      icon: Package,
      label: "总产品数",
      stats: [
        { value: stats.products_total, label: "总产品数" },
        { value: stats.products_approved, label: "已上架" },
        { value: stats.products_pending, label: "审核中" },
      ],
      trend: null,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
    },
    {
      icon: Store,
      label: "供应商总数",
      stats: [
        { value: stats.suppliers_total, label: "供应商总数" },
        { value: stats.buyers_total, label: "采购商总数" },
      ],
      trend: null,
      iconBg: "bg-trust-50",
      iconColor: "text-trust-600",
    },
    {
      icon: Users,
      label: "采购商总数",
      stats: [
        { value: stats.buyers_total, label: "采购商总数" },
        { value: stats.inquiries_total, label: "询盘总数" },
      ],
      trend: null,
      iconBg: "bg-gold-50",
      iconColor: "text-gold-600",
    },
    {
      icon: MessageSquare,
      label: "询盘总数",
      stats: [
        { value: stats.inquiries_total, label: "询盘总数" },
        { value: stats.inquiries_open, label: "待处理" },
        { value: stats.news_published, label: "已发布新闻" },
        { value: stats.banners_active, label: "活跃轮播图" },
      ],
      trend: null,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];
}

// ===== Format Time =====

function formatTime(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin} 分钟前`;
  if (diffHour < 24) return `${diffHour} 小时前`;
  if (diffDay < 30) return `${diffDay} 天前`;
  return date.toLocaleDateString("zh-CN");
}

// ===== Main Page =====

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useApiQuery<DashboardStats>(
    () => adminApi.dashboardStats()
  );

  const statCards = data ? buildStatCards(data.counts) : [];
  const recentLogs = data?.recent_logs ?? [];

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
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-slate-600"
              onClick={() => refetch()}
              disabled={loading}
            >
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {loading ? "刷新中..." : "刷新数据"}
              </span>
            </Button>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner text="正在加载看板数据..." />}

          {/* Error State */}
          {error && !loading && (
            <ErrorDisplay error={error} onRetry={refetch} />
          )}

          {/* Data Loaded */}
          {!loading && !error && data && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <StatCard key={card.label} data={card} />
                ))}
              </div>

              {/* Two Panels Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Recent Activity Logs */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-brand-600" />
                      最近操作日志
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="gap-1 text-slate-500"
                      onClick={() => {
                        window.location.href = "/admin/logs";
                      }}
                    >
                      查看全部
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentLogs.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-400">
                        暂无操作日志记录
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-y border-slate-100 bg-slate-50/50">
                              <th className="text-left font-medium text-slate-500 px-4 py-2.5">
                                操作
                              </th>
                              <th className="text-left font-medium text-slate-500 px-4 py-2.5 hidden sm:table-cell">
                                管理员
                              </th>
                              <th className="text-right font-medium text-slate-500 px-4 py-2.5">
                                时间
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentLogs.slice(0, 8).map((log) => (
                              <tr
                                key={log.id}
                                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                              >
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-800">
                                    {log.action}
                                  </div>
                                  {log.detail && (
                                    <div className="text-xs text-slate-400 truncate max-w-[200px]">
                                      {log.detail}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                                  {log.admin_name}
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500 text-right">
                                  {formatTime(log.created_at)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Right: Quick Stats & Shortcuts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageSquare className="h-4 w-4 text-trust-600" />
                      快捷入口
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <QuickLink
                      href="/admin/products"
                      icon={Package}
                      iconColor="text-brand-600"
                      title="产品审核"
                      count={data.counts.products_pending}
                      countLabel="待审核"
                    />
                    <QuickLink
                      href="/admin/suppliers"
                      icon={Store}
                      iconColor="text-trust-600"
                      title="供应商管理"
                      count={data.counts.suppliers_total}
                      countLabel="供应商"
                    />
                    <QuickLink
                      href="/admin/buyers"
                      icon={Users}
                      iconColor="text-gold-600"
                      title="采购商管理"
                      count={data.counts.buyers_total}
                      countLabel="采购商"
                    />
                    <QuickLink
                      href="/admin/inquiries"
                      icon={MessageSquare}
                      iconColor="text-purple-600"
                      title="询盘管理"
                      count={data.counts.inquiries_open}
                      countLabel="待处理"
                    />
                    <QuickLink
                      href="/admin/news"
                      icon={BarChart3}
                      iconColor="text-pink-600"
                      title="新闻资讯"
                      count={data.counts.news_published}
                      countLabel="已发布"
                    />
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
                      实时统计
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
                  {/* Summary indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                      <TrendingUp className="h-4 w-4 text-brand-500" />
                      <div>
                        <div className="text-xs text-slate-400">产品总数</div>
                        <div className="text-sm font-semibold text-slate-700">
                          {data.counts.products_total}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                      <TrendingUp className="h-4 w-4 text-trust-500" />
                      <div>
                        <div className="text-xs text-slate-400">供应商</div>
                        <div className="text-sm font-semibold text-slate-700">
                          {data.counts.suppliers_total}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                      <TrendingUp className="h-4 w-4 text-gold-500" />
                      <div>
                        <div className="text-xs text-slate-400">采购商</div>
                        <div className="text-sm font-semibold text-slate-700">
                          {data.counts.buyers_total}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                      <TrendingDown className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-slate-400">待处理询盘</div>
                        <div className="text-sm font-semibold text-slate-700">
                          {data.counts.inquiries_open}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && !data && (
            <EmptyState
              title="暂无数据"
              description="看板数据尚未生成，请稍后重试"
            />
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

// ===== Quick Link Component =====

function QuickLink({
  href,
  icon: Icon,
  iconColor,
  title,
  count,
  countLabel,
}: {
  href: string;
  icon: typeof Package;
  iconColor: string;
  title: string;
  count: number;
  countLabel: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors group"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center shrink-0 transition-colors">
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-700">{title}</div>
          <div className="text-xs text-slate-400">
            {count} {countLabel}
          </div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
    </a>
  );
}
