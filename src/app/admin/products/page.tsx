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
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard, useAdminAuth } from "@/lib/admin-auth-context";
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

type ProductStatus = "pending" | "approved" | "rejected";

interface ReviewProduct {
  id: string;
  name: string;
  sku: string;
  supplier: string;
  category: string;
  submitTime: string;
  status: ProductStatus;
  image: string;
  rejectReason?: string;
}

// ===== Seed Data =====

const seedProducts: ReviewProduct[] = [
  {
    id: "P001",
    name: "清真牛肉干（原味）",
    sku: "HAL-BJ-2024-001",
    supplier: "惠发食品有限公司",
    category: "肉制品",
    submitTime: "2024-07-13 14:32:00",
    status: "pending",
    image: "https://loremflickr.com/80/60/food,halal?random=1",
  },
  {
    id: "P002",
    name: "清真速冻水饺（牛肉馅）",
    sku: "HAL-BJ-2024-002",
    supplier: "伊利清真食品有限公司",
    category: "速冻食品",
    submitTime: "2024-07-13 10:15:00",
    status: "pending",
    image: "https://loremflickr.com/80/60/food,halal?random=2",
  },
  {
    id: "P003",
    name: "清真特级初榨橄榄油",
    sku: "HAL-BJ-2024-003",
    supplier: "甘肃清香油脂有限公司",
    category: "油脂类",
    submitTime: "2024-07-12 16:48:00",
    status: "pending",
    image: "https://loremflickr.com/80/60/food,halal?random=3",
  },
  {
    id: "P004",
    name: "清真天然蜂蜜（百花蜜）",
    sku: "HAL-BJ-2024-004",
    supplier: "宁夏塞外蜂业有限公司",
    category: "蜂产品",
    submitTime: "2024-07-11 09:20:00",
    status: "approved",
    image: "https://loremflickr.com/80/60/food,halal?random=4",
  },
  {
    id: "P005",
    name: "清真全脂奶粉",
    sku: "HAL-BJ-2024-005",
    supplier: "内蒙古草原乳业有限公司",
    category: "乳制品",
    submitTime: "2024-07-10 11:30:00",
    status: "approved",
    image: "https://loremflickr.com/80/60/food,halal?random=5",
  },
  {
    id: "P006",
    name: "清真红烧牛肉方便面",
    sku: "HAL-BJ-2024-006",
    supplier: "河南白象清真食品有限公司",
    category: "方便食品",
    submitTime: "2024-07-09 15:00:00",
    status: "approved",
    image: "https://loremflickr.com/80/60/food,halal?random=6",
  },
  {
    id: "P007",
    name: "清真黑巧克力（70%可可）",
    sku: "HAL-BJ-2024-007",
    supplier: "上海佳丽清真食品有限公司",
    category: "糖果类",
    submitTime: "2024-07-08 13:45:00",
    status: "rejected",
    image: "https://loremflickr.com/80/60/food,halal?random=7",
    rejectReason: "HALAL认证证书已过期，请更新后重新提交",
  },
  {
    id: "P008",
    name: "清真复合调味料（烧烤味）",
    sku: "HAL-BJ-2024-008",
    supplier: "山东欣鑫调味品有限公司",
    category: "调味品",
    submitTime: "2024-07-07 08:10:00",
    status: "rejected",
    image: "https://loremflickr.com/80/60/food,halal?random=8",
    rejectReason: "产品配料表信息不完整，缺少部分添加剂明细",
  },
];

// ===== Constants =====

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  pending: { label: "待审核", className: "bg-gold-100 text-gold-700" },
  approved: { label: "已通过", className: "bg-brand-100 text-brand-700" },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700" },
};

const categoryOptions = [
  { value: "all", label: "全部品类" },
  { value: "肉制品", label: "肉制品" },
  { value: "速冻食品", label: "速冻食品" },
  { value: "油脂类", label: "油脂类" },
  { value: "蜂产品", label: "蜂产品" },
  { value: "乳制品", label: "乳制品" },
  { value: "方便食品", label: "方便食品" },
  { value: "糖果类", label: "糖果类" },
  { value: "调味品", label: "调味品" },
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待审核" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已驳回" },
];

const PAGE_SIZE = 5;

// ===== Page Component =====

export default function ProductReviewPage() {
  return (
    <AdminLayout>
      <AdminGuard permission="products.review">
        <ProductReviewContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function ProductReviewContent() {
  const { hasPermission } = useAdminAuth();
  const [products, setProducts] = useState<ReviewProduct[]>(seedProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<ReviewProduct | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    result.sort((a, b) => b.submitTime.localeCompare(a.submitTime));
    return result;
  }, [products, search, statusFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleApprove = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === rejectTarget.id
          ? { ...p, status: "rejected", rejectReason: rejectReason || "未提供驳回原因" }
          : p
      )
    );
    setRejectTarget(null);
    setRejectReason("");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "all" || categoryFilter !== "all";

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
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索产品名称 / SKU编号"
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

          {/* Category filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-slate-500">
              重置筛选
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-slate-200">
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品图片</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品编号</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品名称</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">供应商</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">品类</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">提交时间</th>
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
                  return (
                    <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      {/* Image */}
                      <td className="px-4 py-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-[60px] rounded-lg object-cover bg-slate-100"
                          loading="lazy"
                        />
                      </td>
                      {/* SKU */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-500">{product.sku}</span>
                      </td>
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{product.name}</div>
                        {product.rejectReason && (
                          <div className="text-xs text-red-500 mt-0.5">驳回原因：{product.rejectReason}</div>
                        )}
                      </td>
                      {/* Supplier */}
                      <td className="px-4 py-3 text-slate-600">{product.supplier}</td>
                      {/* Category */}
                      <td className="px-4 py-3 text-slate-600">{product.category}</td>
                      {/* Submit Time */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{product.submitTime}</td>
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
                            <span className="text-xs text-slate-400">已审核通过</span>
                          )}
                          {product.status === "rejected" && (
                            <span className="text-xs text-slate-400">已驳回</span>
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
            共 <span className="font-medium text-slate-700">{filtered.length}</span> 条
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[28px] h-7 px-2 rounded-md text-sm transition-colors ${
                  currentPage === page
                    ? "bg-brand-600 text-white font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
              <h3 className="text-base font-semibold text-slate-900">驳回产品</h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              产品：<span className="font-medium text-slate-700">{rejectTarget.name}</span>
            </p>
            <p className="text-sm text-slate-500 mb-3">
              供应商：<span className="text-slate-700">{rejectTarget.supplier}</span>
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
              <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>
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
