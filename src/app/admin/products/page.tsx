"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Image as ImageIcon,
  Trash2,
  ArrowDownToLine,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  useProducts,
  type ManagedProduct,
  type ProductStatus,
} from "@/lib/product-context";
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
  const {
    products,
    approveProduct,
    rejectProduct,
    takeDownProduct,
    relistProduct,
    deleteProduct,
    loading,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<ManagedProduct | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Sensitive word auto-check across all products (name + description)
  const sensitiveMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const p of products) {
      const text = `${p.name || ""} ${p.description || ""}`;
      if (checkSensitive(text).length > 0) {
        map.set(p.id, true);
      }
    }
    return map;
  }, [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products];

    // Deleted visibility logic: selecting "deleted" filter shows deleted items
    // explicitly; otherwise deleted items are hidden unless the toggle is on.
    if (statusFilter === "deleted") {
      result = result.filter((p) => p.status === "deleted");
    } else {
      if (!showDeleted) {
        result = result.filter((p) => p.status !== "deleted");
      }
      if (statusFilter !== "all") {
        result = result.filter((p) => p.status === statusFilter);
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.id || "").toLowerCase().includes(q) ||
          (p.supplier || "").toLowerCase().includes(q) ||
          (p.createdBy || "").toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    return result;
  }, [products, search, statusFilter, showDeleted]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleApprove = (id: string) => {
    approveProduct(id);
    alert("产品已通过审核");
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    rejectProduct(rejectTarget.id, rejectReason || "未提供驳回原因");
    setRejectTarget(null);
    setRejectReason("");
    alert("产品已驳回");
  };

  const handleTakedown = (id: string) => {
    takeDownProduct(id);
    alert("产品已下架");
  };

  const handleRelist = (id: string) => {
    relistProduct(id);
    alert("产品已重新上架");
  };

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `确定要删除产品「${name}」吗？\n此操作为软删除，可在"显示已删除"中查看。`
      )
    ) {
      deleteProduct(id);
      alert("产品已删除");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCurrentPage(1);
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
              placeholder="搜索产品名称 / 编号 / 供应商"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v || "all");
              setCurrentPage(1);
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

          {/* Show deleted toggle */}
          <button
            type="button"
            onClick={() => {
              setShowDeleted((v) => !v);
              setCurrentPage(1);
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 text-brand-600 animate-spin" />
            <span className="ml-2 text-sm text-slate-500">
              加载产品数据中…
            </span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-slate-200">
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品图片</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品编号</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品名称</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">供应商</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">品类</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">更新时间</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">状态</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        暂无符合条件的产品
                      </td>
                    </tr>
                  ) : (
                    pageData.map((product) => {
                      const sc = statusConfig[product.status];
                      const hasSensitive = sensitiveMap.get(product.id);
                      return (
                        <tr
                          key={product.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Image */}
                          <td className="px-4 py-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-[60px] rounded-lg object-cover bg-slate-100"
                              loading="lazy"
                            />
                          </td>
                          {/* ID */}
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-slate-500">
                              {product.id}
                            </span>
                          </td>
                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 flex items-center gap-1.5 flex-wrap">
                              {product.name}
                              {hasSensitive && (
                                <Badge
                                  className="bg-red-50 text-red-600 border border-red-200 gap-1"
                                  title="产品名称或描述中检测到敏感词"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  敏感词
                                </Badge>
                              )}
                            </div>
                            {product.rejectReason && (
                              <div className="text-xs text-red-500 mt-0.5">
                                驳回原因：{product.rejectReason}
                              </div>
                            )}
                          </td>
                          {/* Supplier */}
                          <td className="px-4 py-3 text-slate-600">
                            {product.supplier || product.createdBy}
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3 text-slate-600">
                            {product.category || "—"}
                          </td>
                          {/* Updated Time */}
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {formatDateTime(product.updatedAt)}
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <Badge className={sc.className}>{sc.label}</Badge>
                          </td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {product.status === "pending" && (
                                <>
                                  {hasPermission("products.approve") && (
                                    <Button
                                      size="sm"
                                      className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
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
                                  onClick={() => handleRelist(product.id)}
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  重新上架
                                </Button>
                              )}
                              {product.status === "deleted" && (
                                <span className="text-xs text-slate-400">
                                  已删除
                                </span>
                              )}
                              {product.status !== "deleted" &&
                                hasPermission("products.reject") && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    title="删除"
                                    onClick={() =>
                                      handleDelete(product.id, product.name)
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                共{" "}
                <span className="font-medium text-slate-700">
                  {filtered.length}
                </span>{" "}
                条
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[28px] h-7 px-2 rounded-md text-sm transition-colors ${
                        safePage === page
                          ? "bg-brand-600 text-white font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
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
                {rejectTarget.supplier || rejectTarget.createdBy}
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
                disabled={!rejectReason.trim()}
                onClick={handleRejectConfirm}
              >
                确认驳回
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
