"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Image as ImageIcon,
  ArrowDownToLine,
  RotateCcw,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Package,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { checkSensitive } from "@/lib/sensitive-words";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ===== Types =====

type ProductStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "offline"
  | "deleted";

interface Product {
  id: string;
  supplier_id: string;
  category_id: string | null;
  name: string;
  sku: string;
  sku_code: string | null;
  price: string;
  unit: string;
  status: ProductStatus;
  reject_reason: string | null;
  halal_cert_type: string | null;
  halal_cert_number: string | null;
  origin: string | null;
  view_count: number;
  inquiry_count: number;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  category_name?: string;
  // Media fields (from product_media table via attachMedia)
  images?: string[];
  videos?: { url: string }[];
}

/** Full product detail returned by GET /api/admin/products/{id} */
interface PreviewProduct {
  id: number;
  supplier_id: number;
  category_id: number | null;
  name: string;
  sku: string;
  sku_code: string | null;
  specifications: string | null;
  description: string | null;
  price: string | null;
  unit: string | null;
  min_order_quantity: string | null;
  status: string;
  reject_reason: string | null;
  halal_cert_type: string | null;
  halal_cert_number: string | null;
  halal_cert_expiry: string | null;
  storage_conditions: string | null;
  shelf_life: string | null;
  origin: string | null;
  view_count: number;
  inquiry_count: number;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  supplier_company?: string;
  supplier_email?: string;
  supplier_code?: string;
  supplier_location?: string;
  category_name?: string;
  images?: string[];
  videos?: { url: string; thumbnail?: string; duration?: string; title?: string }[];
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

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-slate-100 text-slate-500" },
  pending: { label: "待审核", className: "bg-gold-100 text-gold-700" },
  approved: { label: "已通过", className: "bg-brand-100 text-brand-700" },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700" },
  offline: { label: "已下架", className: "bg-slate-200 text-slate-600" },
  deleted: { label: "已删除", className: "bg-red-900 text-red-100" },
};

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待审核" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已驳回" },
  { value: "offline", label: "已下架" },
  { value: "deleted", label: "已删除" },
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

/** Small info card for the preview modal */
function InfoCard({ icon: Icon, label, value }: { icon?: typeof Package; label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-100 p-3">
      <div className="flex items-center gap-1 mb-0.5">
        {Icon && <Icon className="h-3 w-3 text-slate-400" />}
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
    </div>
  );
}

// ===== Page Component =====

export default function ProductReviewPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="products.review">
        <ProductReviewContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function ProductReviewContent() {
  const { hasPermission } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewTarget, setPreviewTarget] = useState<Product | null>(null);
  const [previewDetail, setPreviewDetail] = useState<PreviewProduct | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const showDeleted = statusFilter === "deleted";

  // Fetch products with pagination, search and status filter
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<Product>(
    (p, pp) =>
      adminApi.products({
        page: p,
        per_page: pp,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch.trim() || undefined,
      }) as Promise<PaginatedResponse<Product>>,
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

  // Mutations
  const approveMutation = useApiMutation((id: string) =>
    adminApi.approveProduct(id)
  );
  const rejectMutation = useApiMutation(
    (params: { id: string; reason: string }) =>
      adminApi.rejectProduct(params.id, params.reason)
  );
  const unlistMutation = useApiMutation((id: string) =>
    adminApi.unlistProduct(id)
  );
  const relistMutation = useApiMutation((id: string) =>
    adminApi.relistProduct(id)
  );
  const restoreMutation = useApiMutation((id: string) =>
    adminApi.restoreProduct(id)
  );

  // Sensitive word auto-check across current page products (name only —
  // description is not part of the backend list response)
  const sensitiveMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const p of data ?? []) {
      if (checkSensitive(p.name || "").length > 0) {
        map.set(p.id, true);
      }
    }
    return map;
  }, [data]);

  const products = data ?? [];

  // ===== Action Handlers =====

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveMutation.mutate(id);
      await refetch();
      alert("产品已通过审核");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    try {
      await rejectMutation.mutate({
        id: rejectTarget.id,
        reason: rejectReason || "未提供驳回原因",
      });
      setRejectTarget(null);
      setRejectReason("");
      await refetch();
      alert("产品已驳回");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handlePreview = async (product: Product) => {
    setPreviewTarget(product);
    setPreviewDetail(null);
    setPreviewLoading(true);
    try {
      const res = await adminApi.showProduct(product.id);
      setPreviewDetail(res as unknown as PreviewProduct);
    } catch {
      setPreviewDetail(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewTarget(null);
    setPreviewDetail(null);
  };

  const handleTakedown = async (id: string) => {
    setActionLoading(id);
    try {
      await unlistMutation.mutate(id);
      await refetch();
      alert("产品已下架");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelist = async (id: string) => {
    setActionLoading(id);
    try {
      await relistMutation.mutate(id);
      await refetch();
      alert("产品已重新上架");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (id: string) => {
    setActionLoading(id);
    try {
      await restoreMutation.mutate(id);
      await refetch();
      alert("产品已恢复");
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
    setPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "all";

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <PackageCheck className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">产品审核</h1>
          <p className="text-sm text-slate-500">审核供应商提交的产品上架申请</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索产品名称 / SKU编码 / 供应商"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-9 h-9"
            />
          </div>

          {/* Status filter */}
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

          {/* Show deleted toggle (kept in sync with the status filter) */}
          <button
            type="button"
            onClick={() => {
              setStatusFilter(showDeleted ? "all" : "deleted");
              setPage(1);
            }}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
              showDeleted
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {showDeleted ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            显示已删除
          </button>

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
          <LoadingSpinner text="加载产品数据中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <EmptyState
            title="暂无符合条件的产品"
            description="尝试调整筛选条件或稍后重试"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-slate-200">
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品图片</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">SKU编码</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品名称</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">供应商</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">品类</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">更新时间</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">状态</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const sc = statusConfig[product.status];
                    const hasSensitive = sensitiveMap.get(product.id);
                    const isLoading = actionLoading === product.id;
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Image */}
                        <td className="px-4 py-3">
                          <div className="w-20 h-[60px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-slate-300" />
                            )}
                          </div>
                        </td>
                        {/* ID / SKU */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-slate-500">
                            {product.sku_code || product.sku || product.id}
                          </span>
                        </td>
                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 flex items-center gap-1.5 flex-wrap">
                            {product.name}
                            {hasSensitive && (
                              <Badge
                                className="bg-red-50 text-red-600 border border-red-200 gap-1"
                                title="产品名称中检测到敏感词"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                敏感词
                              </Badge>
                            )}
                          </div>
                          {product.reject_reason && (
                            <div className="text-xs text-red-500 mt-0.5">
                              驳回原因：{product.reject_reason}
                            </div>
                          )}
                        </td>
                        {/* Supplier */}
                        <td className="px-4 py-3 text-slate-600">
                          {product.supplier_name || "—"}
                        </td>
                        {/* Category */}
                        <td className="px-4 py-3 text-slate-600">
                          {product.category_name || "—"}
                        </td>
                        {/* Updated Time */}
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateTime(product.updated_at)}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge className={sc.className}>{sc.label}</Badge>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePreview(product)}
                              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors"
                              title="预览产品详情"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {product.status === "pending" && (
                              <>
                                {hasPermission("products.approve") && (
                                  <Button
                                    size="sm"
                                    className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
                                    disabled={isLoading}
                                    onClick={() => handleApprove(product.id)}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    通过
                                  </Button>
                                )}
                                {hasPermission("products.reject") && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1"
                                    disabled={isLoading}
                                    onClick={() => {
                                      setRejectTarget(product);
                                      setRejectReason("");
                                    }}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    驳回
                                  </Button>
                                )}
                              </>
                            )}
                            {product.status === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                disabled={isLoading}
                                onClick={() => handleTakedown(product.id)}
                              >
                                <ArrowDownToLine className="h-3.5 w-3.5" />
                                下架
                              </Button>
                            )}
                            {product.status === "offline" && (
                              <Button
                                size="sm"
                                className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
                                disabled={isLoading}
                                onClick={() => handleRelist(product.id)}
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                重新上架
                              </Button>
                            )}
                            {product.status === "deleted" &&
                              hasPermission("products.approve") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  disabled={isLoading}
                                  onClick={() => handleRestore(product.id)}
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  恢复
                                </Button>
                              )}
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
                共{" "}
                <span className="font-medium text-slate-700">
                  {total}
                </span>{" "}
                条
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
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                  (p) => (
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
                  )
                )}
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

      {/* Reject Dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setRejectTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                驳回产品
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              产品：
              <span className="font-medium text-slate-700">
                {rejectTarget.name}
              </span>
            </p>
            <p className="text-sm text-slate-500 mb-3">
              供应商：
              <span className="text-slate-700">
                {rejectTarget.supplier_name || "—"}
              </span>
            </p>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              驳回原因 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="请输入驳回原因，将通知供应商修改后重新提交"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectTarget(null)}
              >
                取消
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={!rejectReason.trim() || rejectMutation.loading}
                onClick={handleRejectConfirm}
              >
                {rejectMutation.loading ? "提交中..." : "确认驳回"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closePreview}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">产品详情预览</h3>
                  <p className="text-xs text-slate-400">
                    {previewTarget.sku || previewTarget.id}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {previewLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 text-brand-600 animate-spin mb-3" />
                  <p className="text-sm text-slate-500">加载产品详情中...</p>
                </div>
              ) : previewDetail ? (
                <div className="space-y-5">
                  {/* Product Name + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {previewDetail.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        {previewDetail.sku_code && (
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            SKU: {previewDetail.sku_code}
                          </span>
                        )}
                        {previewDetail.category_name && (
                          <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {previewDetail.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                    {(() => {
                      const sc = statusConfig[previewDetail.status as ProductStatus];
                      return sc ? (
                        <Badge className={sc.className}>{sc.label}</Badge>
                      ) : null;
                    })()}
                  </div>

                  {/* Reject reason banner */}
                  {previewDetail.status === "rejected" && previewDetail.reject_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">驳回原因</span>
                      </div>
                      <p className="text-sm text-red-600">{previewDetail.reject_reason}</p>
                    </div>
                  )}

                  {/* Product Images & Videos */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <ImageIcon className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-800">产品图片与视频</span>
                      {previewDetail.images && previewDetail.images.length > 0 && (
                        <span className="text-xs text-slate-400">({previewDetail.images.length} 张图片{(previewDetail.videos?.length ?? 0) > 0 ? `、${previewDetail.videos.length} 个视频` : ""})</span>
                      )}
                    </div>
                    {previewDetail.images && previewDetail.images.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {previewDetail.images.slice(0, 6).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={`产品图片 ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-300"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>';
                                  }
                                }}
                              />
                              {idx === 0 && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand-600 text-white text-[10px] rounded font-medium">主图</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {previewDetail.images.length > 6 && (
                          <p className="text-xs text-slate-400 mb-2">还有 {previewDetail.images.length - 6} 张图片未显示</p>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-32 rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">暂无图片</span>
                        </div>
                      </div>
                    )}
                    {/* Videos */}
                    {previewDetail.videos && previewDetail.videos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {previewDetail.videos.map((video, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                            <video
                              src={video.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={Package} label="规格" value={previewDetail.specifications || "—"} />
                    <InfoCard label="价格" value={previewDetail.price ? `¥${previewDetail.price} / ${previewDetail.unit || ""}` : "面议"} />
                    <InfoCard label="起订量" value={previewDetail.min_order_quantity ? `${previewDetail.min_order_quantity} ${previewDetail.unit || ""}` : "—"} />
                    <InfoCard label="产地" value={previewDetail.origin || "—"} />
                    <InfoCard label="储存条件" value={previewDetail.storage_conditions || "—"} />
                    <InfoCard label="保质期" value={previewDetail.shelf_life || "—"} />
                  </div>

                  {/* HALAL Certification */}
                  <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <ShieldCheck className="h-4 w-4 text-brand-600" />
                      <span className="text-sm font-semibold text-brand-900">HALAL 认证信息</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <InfoCard label="认证类型" value={previewDetail.halal_cert_type || "—"} />
                      <InfoCard label="证书编号" value={previewDetail.halal_cert_number || "—"} />
                      <InfoCard label="有效期" value={previewDetail.halal_cert_expiry || "—"} />
                    </div>
                  </div>

                  {/* Description */}
                  {previewDetail.description && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">产品描述</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {previewDetail.description}
                      </p>
                    </div>
                  )}

                  {/* Supplier Info */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">供应商信息</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoCard label="供应商名称" value={previewDetail.supplier_name || "—"} />
                      <InfoCard label="公司名称" value={previewDetail.supplier_company || "—"} />
                      <InfoCard label="联系邮箱" value={previewDetail.supplier_email || "—"} />
                      <InfoCard label="供应商编码" value={previewDetail.supplier_code || "—"} />
                      <InfoCard label="所在地" value={previewDetail.supplier_location || "—"} />
                      <InfoCard label="内部SKU" value={previewDetail.sku || "—"} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>浏览量: {previewDetail.view_count ?? 0}</span>
                    <span>询盘数: {previewDetail.inquiry_count ?? 0}</span>
                    <span>创建: {formatDateTime(previewDetail.created_at)}</span>
                    <span>更新: {formatDateTime(previewDetail.updated_at)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-3" />
                  <p className="text-sm text-slate-500">无法加载产品详情</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t bg-white shrink-0">
              <span className="text-xs text-slate-400">
                产品 ID: {previewTarget.id}
              </span>
              <div className="flex items-center gap-2">
                {previewDetail?.status === "pending" && hasPermission("products.approve") && (
                  <Button
                    size="sm"
                    className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
                    onClick={() => {
                      closePreview();
                      handleApprove(previewTarget.id);
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    通过审核
                  </Button>
                )}
                {previewDetail?.status === "pending" && hasPermission("products.reject") && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => {
                      const p = previewTarget;
                      closePreview();
                      setRejectTarget(p);
                      setRejectReason("");
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    驳回
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={closePreview}>
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
