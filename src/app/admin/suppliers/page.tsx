"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Store,
  ShieldCheck,
  Ban,
  Unlock,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ===== Types =====

// Backend Supplier record (User table, type='supplier')
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  type: "supplier";
  avatar: string | null;
  is_active: number; // 0 or 1
  email_verified: number; // 0 or 1
  banned_until: string | null;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
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

// Ban duration options; value is the string expected by the backend API
// ('1' | '3' | '7' | 'permanent')
const banDurationOptions = [
  { value: "1", label: "禁止1天" },
  { value: "3", label: "禁止3天" },
  { value: "7", label: "禁止7天" },
  { value: "permanent", label: "永久禁止" },
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

// Determine whether a supplier is currently banned.
// - banned_until null & ban_reason null  -> not banned
// - banned_until null & ban_reason set    -> permanent ban
// - banned_until set                      -> banned while the date is in the future
function getBanStatus(s: Supplier): {
  isBanned: boolean;
  isPermanent: boolean;
  remainingDays: number;
} {
  const hasReason = !!s.ban_reason;
  if (!s.banned_until) {
    if (hasReason) {
      return { isBanned: true, isPermanent: true, remainingDays: 0 };
    }
    return { isBanned: false, isPermanent: false, remainingDays: 0 };
  }
  const ms = new Date(s.banned_until).getTime() - Date.now();
  if (ms <= 0) {
    return { isBanned: false, isPermanent: false, remainingDays: 0 };
  }
  return {
    isBanned: true,
    isPermanent: false,
    remainingDays: Math.ceil(ms / (24 * 60 * 60 * 1000)),
  };
}

// ===== Page Component =====

export default function SupplierManagementPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="suppliers.view">
        <SupplierManagementContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function SupplierManagementContent() {
  const { hasPermission } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Ban dialog state
  const [banTarget, setBanTarget] = useState<Supplier | null>(null);
  const [banDuration, setBanDuration] = useState<string>("1");
  const [banReason, setBanReason] = useState("");

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch suppliers with pagination + debounced search
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<Supplier>(
    (p, pp) =>
      adminApi.suppliers({
        page: p,
        per_page: pp,
        search: debouncedSearch.trim() || undefined,
      }) as Promise<PaginatedResponse<Supplier>>,
    PAGE_SIZE,
    { deps: [debouncedSearch] }
  );

  // Debounce search input (400ms) and reset to page 1 when it changes
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  // Mutations
  const verifyMutation = useApiMutation((id: string) =>
    adminApi.verifySupplier(id)
  );
  const banMutation = useApiMutation(
    (params: { id: string; reason: string; duration: string }) =>
      adminApi.banSupplier(params.id, params.reason, params.duration)
  );
  const unbanMutation = useApiMutation((id: string) =>
    adminApi.unbanSupplier(id)
  );

  const suppliers = data ?? [];

  // Stats — total is accurate (from meta), the rest reflect the current page
  const stats = useMemo(() => {
    const verified = suppliers.filter((s) => s.email_verified === 1).length;
    const banned = suppliers.filter((s) => getBanStatus(s).isBanned).length;
    const active = suppliers.filter(
      (s) => !getBanStatus(s).isBanned && s.is_active === 1
    ).length;
    return { total, verified, banned, active };
  }, [suppliers, total]);

  // ===== Action Handlers =====

  const openBanDialog = (supplier: Supplier) => {
    setBanTarget(supplier);
    setBanDuration("1");
    setBanReason("");
  };

  const handleVerify = async (id: string) => {
    setActionLoading(id);
    try {
      await verifyMutation.mutate(id);
      await refetch();
      alert("已认证该供应商");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanConfirm = async () => {
    if (!banTarget) return;
    const id = banTarget.id;
    setActionLoading(id);
    try {
      await banMutation.mutate({
        id,
        reason: banReason || "未填写原因",
        duration: banDuration,
      });
      setBanTarget(null);
      setBanReason("");
      await refetch();
      alert(
        banDuration === "permanent"
          ? "已永久禁止该供应商"
          : `已禁止该供应商 ${banDuration} 天`
      );
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (id: string) => {
    setActionLoading(id);
    try {
      await unbanMutation.mutate(id);
      await refetch();
      alert("已解除禁止");
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
    setPage(1);
  };

  const hasActiveFilters = !!search;

  const statCards = [
    { label: "总供应商", value: stats.total, icon: Store, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "已认证", value: stats.verified, icon: ShieldCheck, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "已封禁", value: stats.banned, icon: Ban, color: "text-red-600", bg: "bg-red-50" },
    { label: "正常运营", value: stats.active, icon: ShieldCheck, color: "text-slate-500", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Store className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">供应商管理</h1>
          <p className="text-sm text-slate-500">管理平台供应商资质与账户状态</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-4 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{card.value}</div>
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
              placeholder="搜索企业名称 / 联系人 / 邮箱"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-9 h-9"
            />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-slate-500">
              重置筛选
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="加载供应商数据中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : suppliers.length === 0 ? (
          <EmptyState
            title="暂无符合条件的供应商"
            description="尝试调整搜索条件或稍后重试"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-slate-200">
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">企业名称</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">联系邮箱</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">联系电话</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">邮箱认证</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">账户状态</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">注册时间</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => {
                    const banStatus = getBanStatus(supplier);
                    const verified = supplier.email_verified === 1;
                    const isLoading = actionLoading === supplier.id;
                    return (
                      <tr key={supplier.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {supplier.company_name || supplier.name}
                          </div>
                          {supplier.company_name && (
                            <div className="text-xs text-slate-400">
                              联系人：{supplier.name}
                            </div>
                          )}
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {supplier.email}
                          </span>
                        </td>
                        {/* Phone */}
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {supplier.phone ? (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {supplier.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        {/* Email Verified */}
                        <td className="px-4 py-3">
                          {verified ? (
                            <Badge className="bg-brand-100 text-brand-700">已认证</Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground">未认证</Badge>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          {banStatus.isBanned ? (
                            <div className="flex flex-col gap-1">
                              <Badge className="bg-red-100 text-red-700">
                                {banStatus.isPermanent
                                  ? "永久禁止"
                                  : `已禁止 (剩余 ${banStatus.remainingDays}天)`}
                              </Badge>
                              {supplier.ban_reason && (
                                <span className="text-xs text-slate-400">
                                  原因：{supplier.ban_reason}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-brand-100 text-brand-700">正常</Badge>
                          )}
                        </td>
                        {/* Register Time */}
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateTime(supplier.created_at)}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {hasPermission("suppliers.verify") && !verified && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                disabled={isLoading}
                                onClick={() => handleVerify(supplier.id)}
                              >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                认证
                              </Button>
                            )}
                            {hasPermission("suppliers.suspend") &&
                              (banStatus.isBanned ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  disabled={isLoading}
                                  onClick={() => handleUnban(supplier.id)}
                                >
                                  <Unlock className="h-3.5 w-3.5" />
                                  解除禁止
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  disabled={isLoading}
                                  onClick={() => openBanDialog(supplier)}
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                  停用
                                </Button>
                              ))}
                          </div>
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

      {/* Ban Dialog */}
      {banTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setBanTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Ban className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                禁止供应商
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              企业：
              <span className="font-medium text-slate-700">
                {banTarget.company_name || banTarget.name}
              </span>
            </p>
            <p className="text-sm text-slate-500 mb-3">
              联系人：
              <span className="text-slate-700">{banTarget.name}</span>
            </p>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              禁止时长 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {banDurationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBanDuration(opt.value)}
                  className={`h-9 rounded-md text-sm border transition-colors ${
                    banDuration === opt.value
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              禁止原因
            </label>
            <Textarea
              placeholder="请输入禁止原因（选填）"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setBanTarget(null)}>
                取消
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={banMutation.loading}
                onClick={handleBanConfirm}
              >
                <X className="h-3.5 w-3.5" />
                确认禁止
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
