"use client";

// Admin Logs Page - displays platform operation logs with filtering and pagination

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ScrollText,
  Filter,
  Calendar,
  LogIn,
  CheckCircle2,
  PlusCircle,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ===== Types =====

interface AdminLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: string | null;
  detail: string | null;
  ip_address: string;
  user_agent: string | null;
  created_at: string;
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

const PAGE_SIZE = 10;

// ===== Constants =====

const actionOptions = [
  { value: "login", label: "登录" },
  { value: "logout", label: "登出" },
  { value: "create", label: "创建" },
  { value: "update", label: "修改" },
  { value: "delete", label: "删除" },
  { value: "approve", label: "审核通过" },
  { value: "reject", label: "审核驳回" },
];

// ===== Helpers =====

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

function getActionMeta(
  action: string
): { badge: string; icon: typeof LogIn; label: string } {
  const a = (action || "").toLowerCase();
  if (a.includes("login")) {
    return { badge: "bg-trust-100 text-trust-700", icon: LogIn, label: "登录" };
  }
  if (a.includes("logout")) {
    return { badge: "bg-slate-100 text-slate-600", icon: LogIn, label: "登出" };
  }
  if (a.includes("reject")) {
    return {
      badge: "bg-red-100 text-red-700",
      icon: CheckCircle2,
      label: "驳回",
    };
  }
  if (a.includes("approve") || a.includes("audit") || a.includes("verify")) {
    return {
      badge: "bg-gold-100 text-gold-700",
      icon: CheckCircle2,
      label: "审核",
    };
  }
  if (
    a.includes("create") ||
    a.includes("store") ||
    a.includes("publish") ||
    a.includes("add")
  ) {
    return {
      badge: "bg-brand-100 text-brand-700",
      icon: PlusCircle,
      label: "创建",
    };
  }
  if (
    a.includes("update") ||
    a.includes("edit") ||
    a.includes("patch") ||
    a.includes("modify")
  ) {
    return {
      badge: "bg-purple-100 text-purple-700",
      icon: Pencil,
      label: "修改",
    };
  }
  if (
    a.includes("delete") ||
    a.includes("remove") ||
    a.includes("destroy") ||
    a.includes("ban")
  ) {
    return {
      badge: "bg-red-100 text-red-700",
      icon: Trash2,
      label: "删除",
    };
  }
  return {
    badge: "bg-slate-100 text-slate-600",
    icon: ScrollText,
    label: action || "未知",
  };
}

function isToday(iso: string | null): boolean {
  if (!iso) return false;
  try {
    const d = new Date(iso);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  } catch {
    return false;
  }
}

// ===== Page =====

export default function LogsPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="settings.logs">
        <LogsContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function LogsContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ===== Fetch logs (paginated, backend handles action + date filters) =====
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<AdminLog>(
    (p, pp) =>
      adminApi.logs({
        page: p,
        per_page: pp,
        action: actionFilter === "all" ? undefined : actionFilter,
        start_date: dateFrom || undefined,
        end_date: dateTo || undefined,
      }) as Promise<PaginatedResponse<AdminLog>>,
    PAGE_SIZE,
    { deps: [actionFilter, dateFrom, dateTo] }
  );

  // ===== Debounce search input (400ms) for client-side filtering =====
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const logs = data ?? [];

  // ===== Client-side search filter (backend logs API has no text search) =====
  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return logs;
    const q = debouncedSearch.toLowerCase();
    return logs.filter(
      (log) =>
        log.admin_name.toLowerCase().includes(q) ||
        (log.detail || "").toLowerCase().includes(q) ||
        log.ip_address.includes(q) ||
        (log.target_type || "").toLowerCase().includes(q)
    );
  }, [logs, debouncedSearch]);

  // ===== Stats (approximate from current page + meta.total) =====
  const stats = useMemo(
    () => ({
      total,
      today: logs.filter((l) => isToday(l.created_at)).length,
      login: logs.filter((l) =>
        (l.action || "").toLowerCase().includes("login")
      ).length,
      audit: logs.filter(
        (l) =>
          (l.action || "").toLowerCase().includes("approve") ||
          (l.action || "").toLowerCase().includes("audit") ||
          (l.action || "").toLowerCase().includes("reject")
      ).length,
    }),
    [logs, total]
  );

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActionFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-brand-600" />
          系统日志
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          记录平台所有关键操作，包括登录、审核、创建、修改与删除
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="日志总数" value={stats.total} color="brand" />
        <StatCard label="今日操作" value={stats.today} color="trust" />
        <StatCard label="登录记录" value={stats.login} color="gold" />
        <StatCard label="审核操作" value={stats.audit} color="gold" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索操作人、内容或IP…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={actionFilter}
            onValueChange={(v) => {
              setActionFilter(v || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="动作类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {actionOptions.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="w-36"
            aria-label="开始日期"
          />
          <span className="text-slate-400 text-xs">至</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="w-36"
            aria-label="结束日期"
          />
        </div>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          重置
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="加载日志中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={logs.length === 0 ? "暂无日志记录" : "当前页没有匹配的日志"}
            description={
              logs.length === 0
                ? "还没有任何操作日志记录"
                : "尝试调整筛选条件或搜索关键词"
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="text-left font-medium px-4 py-3">时间</th>
                    <th className="text-left font-medium px-4 py-3">操作人</th>
                    <th className="text-left font-medium px-4 py-3">动作类型</th>
                    <th className="text-left font-medium px-4 py-3">操作内容</th>
                    <th className="text-left font-medium px-4 py-3">IP地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((log) => {
                    const meta = getActionMeta(log.action);
                    const ActionIcon = meta.icon;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {(log.admin_name || "?").slice(0, 1)}
                            </div>
                            <span className="font-medium text-slate-900">
                              {log.admin_name || "未知"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                              meta.badge
                            )}
                          >
                            <ActionIcon className="h-3 w-3" />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-[360px]">
                          {log.detail || "—"}
                          {log.target_type && (
                            <span className="block text-xs text-slate-400 mt-0.5">
                              目标：{log.target_type}
                              {log.target_id ? ` #${log.target_id}` : ""}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.ip_address || "—"}
                          </code>
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "brand" | "trust" | "gold";
}) {
  const colorMap = {
    brand: "text-brand-700 bg-brand-50",
    trust: "text-trust-700 bg-trust-50",
    gold: "text-gold-700 bg-gold-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 inline-block text-2xl font-bold px-2 rounded ${colorMap[color]}`}>
        {value}
      </div>
    </div>
  );
}
