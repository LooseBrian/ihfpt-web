"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Lock,
  Inbox,
  CheckCheck,
  Clock,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminApi } from "@/lib/api-client";
import { useApiQuery, useApiPaginated, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ===== Types =====

type InquiryStatus = "open" | "quoted" | "closed" | "expired";

interface Inquiry {
  id: string;
  buyer_id: string;
  product_id: string | null;
  title: string;
  description: string;
  target_market: string | null;
  budget_min: string | null;
  budget_max: string | null;
  quantity: number | null;
  unit: string;
  required_cert_type: string | null;
  status: InquiryStatus;
  view_count: number;
  quote_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_company?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// ===== Constants =====

const statusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  open: { label: "待回复", className: "bg-gold-100 text-gold-700" },
  quoted: { label: "已报价", className: "bg-brand-100 text-brand-700" },
  closed: { label: "已关闭", className: "bg-muted text-muted-foreground" },
  expired: { label: "已过期", className: "bg-red-100 text-red-700" },
};

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "open", label: "待回复" },
  { value: "quoted", label: "已报价" },
  { value: "closed", label: "已关闭" },
  { value: "expired", label: "已过期" },
];

const PAGE_SIZE = 5;

// Format an ISO date string to "YYYY-MM-DD HH:mm"
function formatDateTime(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

// Format a budget range from min/max decimal strings
function formatBudget(min: string | null, max: string | null): string {
  if (!min && !max) return "—";
  if (min && max) return `${min} ~ ${max}`;
  return (min || max) as string;
}

// ===== Page Component =====

export default function InquiryManagementPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="inquiries.view">
        <InquiryManagementContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function InquiryManagementContent() {
  const { hasPermission } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch status counts in parallel for the stats cards
  const statsQuery = useApiQuery<Record<string, number>>(async () => {
    const statuses: InquiryStatus[] = ["open", "quoted", "closed", "expired"];
    const results = await Promise.all(
      statuses.map((s) => adminApi.inquiries({ status: s, per_page: 1 }))
    );
    return statuses.reduce((acc, s, i) => {
      const res = results[i] as PaginatedResponse<Inquiry> | undefined;
      acc[s] = res?.meta?.total ?? 0;
      return acc;
    }, {} as Record<string, number>);
  });

  // Fetch inquiries with pagination, search and status filter
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<Inquiry>(
    (p, pp) =>
      adminApi.inquiries({
        page: p,
        per_page: pp,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch.trim() || undefined,
      }) as Promise<PaginatedResponse<Inquiry>>,
    PAGE_SIZE,
    { deps: [statusFilter, debouncedSearch] }
  );

  // Debounce search input and reset to page 1 when it changes
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  // Close mutation
  const closeMutation = useApiMutation((id: string) =>
    adminApi.closeInquiry(id)
  );

  // Client-side date filtering on the current page (the backend list API
  // does not expose date params, so we narrow the visible page further)
  const filteredData = useMemo(() => {
    if (!data) return [];
    let result = data;
    if (dateFrom) {
      result = result.filter(
        (i) => (i.created_at || "").slice(0, 10) >= dateFrom
      );
    }
    if (dateTo) {
      result = result.filter(
        (i) => (i.created_at || "").slice(0, 10) <= dateTo
      );
    }
    return result;
  }, [data, dateFrom, dateTo]);

  // Stats derived from the parallel count query
  const stats = {
    total: statsQuery.data
      ? Object.values(statsQuery.data).reduce((a, b) => a + b, 0)
      : 0,
    pending: statsQuery.data?.open ?? 0,
    replied: statsQuery.data?.quoted ?? 0,
    closed: statsQuery.data?.closed ?? 0,
  };

  const handleClose = async (id: string) => {
    setActionLoading(id);
    try {
      await closeMutation.mutate(id);
      await Promise.all([refetch(), statsQuery.refetch()]);
      alert("询盘已关闭");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasActiveFilters =
    search || statusFilter !== "all" || dateFrom || dateTo;

  const statCards = [
    {
      label: "总询盘",
      value: stats.total,
      icon: MessageSquare,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: "待回复",
      value: stats.pending,
      icon: Clock,
      color: "text-gold-600",
      bg: "bg-gold-50",
    },
    {
      label: "已报价",
      value: stats.replied,
      icon: CheckCheck,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: "已关闭",
      value: stats.closed,
      icon: Inbox,
      color: "text-slate-500",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">询盘管理</h1>
          <p className="text-sm text-slate-500">监控与管理平台所有询盘交易</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-4 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {card.value}
                  </div>
                  <div className="text-xs text-slate-500">{card.label}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索询盘标题 / 采购商"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-9 h-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
              }}
              className="h-9 w-[140px] text-sm"
            />
            <span className="text-slate-400 text-xs">至</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
              }}
              className="h-9 w-[140px] text-sm"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 text-slate-500"
            >
              重置筛选
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="加载询盘数据中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : filteredData.length === 0 ? (
          <EmptyState
            title="暂无符合条件的询盘"
            description="尝试调整筛选条件或稍后重试"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-slate-200">
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">询盘编号</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">询盘标题</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">采购商</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">报价数</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">预算</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">状态</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">创建时间</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((inquiry) => {
                    const sc = statusConfig[inquiry.status];
                    const isLoading = actionLoading === inquiry.id;
                    return (
                      <tr
                        key={inquiry.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Inquiry No */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-brand-700 font-medium">
                            #{inquiry.id}
                          </span>
                        </td>
                        {/* Title */}
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {inquiry.title}
                        </td>
                        {/* Buyer */}
                        <td className="px-4 py-3 text-slate-600">
                          {inquiry.buyer_company ||
                            inquiry.buyer_name ||
                            "—"}
                        </td>
                        {/* Quote Count */}
                        <td className="px-4 py-3 text-slate-600">
                          {inquiry.quote_count ?? 0}
                        </td>
                        {/* Budget */}
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-900">
                            {formatBudget(inquiry.budget_min, inquiry.budget_max)}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge className={sc.className}>{sc.label}</Badge>
                        </td>
                        {/* Create Time */}
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateTime(inquiry.created_at)}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          {inquiry.status === "open" ||
                          inquiry.status === "quoted" ? (
                            hasPermission("inquiries.close") ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-slate-600"
                                disabled={isLoading}
                                onClick={() => handleClose(inquiry.id)}
                              >
                                <Lock className="h-3.5 w-3.5" />
                                关闭
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )
                          ) : (
                            <span className="text-xs text-slate-400">
                              {inquiry.status === "closed"
                                ? "已关闭"
                                : "已过期"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                共 <span className="font-medium text-slate-700">{total}</span> 条
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[28px] h-7 px-2 rounded-md text-sm transition-colors ${
                      page === p
                        ? "bg-brand-600 text-white font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page >= lastPage}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
