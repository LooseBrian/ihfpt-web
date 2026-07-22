"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Eye, Edit, Trash2, CheckCircle2, Clock, XCircle,
  Package, X, Upload, Search, Filter, ChevronDown, ChevronUp,
  ArrowUpDown, Image as ImageIcon, Calendar, Loader2, RotateCcw,
  AlertTriangle, ArrowDownToLine, Send, ChevronLeft, ChevronRight,
  Trash,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUpload, IMAGE_LIMITS, VIDEO_LIMITS } from "@/components/product/MediaUpload";
import { IMAGE_PLACEHOLDER_DATAURI } from "@/lib/product-images";
import type { UploadedImage, UploadedVideo } from "@/components/product/MediaUpload";
import { useAuth } from "@/lib/auth-context";
import { useProducts, type ManagedProduct, type ProductStatus } from "@/lib/product-context";

// ===== Constants =====

const PAGE_SIZE = 20;

// ===== Status config =====

const statusConfig: Record<Exclude<ProductStatus, "deleted">, { icon: typeof CheckCircle2; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50", label: "已上架" },
  pending: { icon: Clock, color: "text-gold-600 bg-gold-50", label: "审核中" },
  offline: { icon: XCircle, color: "text-muted-foreground bg-muted", label: "已下架" },
  rejected: { icon: XCircle, color: "text-red-600 bg-red-50", label: "已驳回" },
  draft: { icon: Edit, color: "text-blue-600 bg-blue-50", label: "草稿" },
};

const deletedStatusConfig = { icon: Trash, color: "text-muted-foreground bg-muted", label: "回收站" };

const categoryOptions = [
  { value: "all", label: "全部品类" },
  { value: "清真肉制品", label: "清真肉制品" },
  { value: "清真预制菜", label: "清真预制菜" },
  { value: "清真零食", label: "清真零食" },
  { value: "清真调味品", label: "清真调味品" },
  { value: "清真烘焙", label: "清真烘焙" },
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "approved", label: "已上架" },
  { value: "pending", label: "审核中" },
  { value: "offline", label: "已下架" },
  { value: "rejected", label: "已驳回" },
  { value: "draft", label: "草稿" },
];

type SortField = "updatedAt" | "name" | "price" | "status" | "category";
type SortDir = "asc" | "desc";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Tooltip wrapper for action buttons */
function ActionButton({
  icon: Icon,
  tooltip,
  onClick,
  hoverColor = "hover:text-brand-600",
  iconClass = "h-3.5 w-3.5",
}: {
  icon: typeof Edit;
  tooltip: string;
  onClick: () => void;
  hoverColor?: string;
  iconClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative group/btn p-1.5 rounded hover:bg-muted text-muted-foreground ${hoverColor} transition-colors`}
    >
      <Icon className={iconClass} />
      <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover/btn:opacity-100 transition-opacity z-50">
        {tooltip}
      </span>
    </button>
  );
}

// ===== Main Component =====

export function SupplierProducts() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    loading,
    takeDownProduct,
    deleteProduct,
    relistProduct,
    restoreProduct,
    getProductsBySupplier,
    getDeletedProducts,
  } = useProducts();

  // ===== Supplier products (non-deleted) =====
  const supplierProducts = useMemo(
    () =>
      getProductsBySupplier(user?.name || "").filter(
        (p) => p.status !== "deleted"
      ),
    [getProductsBySupplier, user?.name]
  );

  // ===== Recycle bin products =====
  const recycleBinProducts = useMemo(
    () => getDeletedProducts(),
    [getDeletedProducts]
  );

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Recycle bin toggle
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<ManagedProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Action loading state (prevent double-clicks)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Media modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  // ===== Filtered + sorted products =====
  const filteredProducts = useMemo(() => {
    let result = [...supplierProducts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.skuCode || p.id).toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "updatedAt") {
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === "name") {
        cmp = a.name.localeCompare(b.name, "zh-CN");
      } else if (sortField === "price") {
        cmp = (a.priceRange || "").localeCompare(b.priceRange || "");
      } else if (sortField === "status") {
        const aLabel = statusConfig[a.status as Exclude<ProductStatus, "deleted">]?.label || "";
        const bLabel = statusConfig[b.status as Exclude<ProductStatus, "deleted">]?.label || "";
        cmp = aLabel.localeCompare(bLabel, "zh-CN");
      } else if (sortField === "category") {
        cmp = (a.category || "").localeCompare(b.category || "", "zh-CN");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [supplierProducts, searchQuery, filterCategory, filterStatus, sortField, sortDir]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  const resetPage = useCallback(() => setCurrentPage(1), []);

  // ===== Handlers =====

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    resetPage();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterStatus("all");
    setSortField("updatedAt");
    setSortDir("desc");
    resetPage();
  };

  // ===== Action handlers (async, with loading state) =====

  const handleTakeDown = async (product: ManagedProduct) => {
    if (actionLoadingId) return;
    setActionLoadingId(product.id);
    const ok = await takeDownProduct(product.id);
    setActionLoadingId(null);
    if (ok) {
      alert(`「${product.name}」已下架`);
    } else {
      alert("下架失败，请稍后重试");
    }
  };

  const handleRelist = async (product: ManagedProduct) => {
    if (actionLoadingId) return;
    setActionLoadingId(product.id);
    const ok = await relistProduct(product.id);
    setActionLoadingId(null);
    if (ok) {
      alert(`「${product.name}」已重新提交审核，审核通过后自动上架`);
    } else {
      alert("提交失败，请稍后重试");
    }
  };

  const handleRestore = async (product: ManagedProduct) => {
    if (actionLoadingId) return;
    setActionLoadingId(product.id);
    const ok = await restoreProduct(product.id);
    setActionLoadingId(null);
    if (ok) {
      alert(`「${product.name}」已从回收站恢复为下架状态`);
    } else {
      alert("恢复失败，请稍后重试");
    }
  };

  // Delete confirmation flow (two-step)
  const openDeleteConfirm = (product: ManagedProduct) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const ok = await deleteProduct(deleteTarget.id);
    setDeleteLoading(false);
    if (ok) {
      alert(`「${deleteTarget.name}」已移入回收站，30天后将自动清除`);
      setDeleteTarget(null);
    } else {
      alert("删除失败，请稍后重试");
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Pagination helpers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const openMediaModal = (productId: string) => {
    setEditingProduct(productId);
    setUploadedImages([]);
    setUploadedVideos([]);
    setMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setMediaModalOpen(false);
    setEditingProduct(null);
    setUploadedImages([]);
    setUploadedVideos([]);
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (filterCategory !== "all" ? 1 : 0) +
    (filterStatus !== "all" ? 1 : 0);

  const sortLabel =
    sortField === "updatedAt" ? "修改时间" : sortField === "name" ? "名称" : sortField === "price" ? "价格" : sortField === "status" ? "状态" : "品类";

  // Calculate page range for display
  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);

  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="产品管理"
          subtitle="产品 SKU 管理 — 多级分类、属性参数、图片资源、价格库存、上下架审核"
        />

        <div className="max-w-5xl mx-auto">
          {/* Toolbar: search + filter toggle + new product */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
                placeholder="搜索产品名称、编号或品类..."
                className="pl-9 h-10"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "bg-white border-border text-muted-foreground hover:border-brand-300"
              }`}
            >
              <Filter className="h-4 w-4" />
              筛选
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0 bg-brand-600 text-white text-[10px] rounded-full font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* New product */}
            <button
              onClick={() => router.push("/supplier/new-product")}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium text-sm hover:bg-brand-700 transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" />
              发布新产品
            </button>

            {/* Recycle bin toggle */}
            {recycleBinProducts.length > 0 && (
              <button
                onClick={() => setShowRecycleBin(!showRecycleBin)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  showRecycleBin
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-white border-border text-muted-foreground hover:border-red-300"
                }`}
              >
                <Trash className="h-4 w-4" />
                回收站
                <span className="px-1.5 py-0 bg-red-500 text-white text-[10px] rounded-full font-bold">
                  {recycleBinProducts.length}
                </span>
              </button>
            )}
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">品类</span>
                <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v || "all"); resetPage(); }}>
                  <SelectTrigger className="h-8 w-36 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">状态</span>
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v || "all"); resetPage(); }}>
                  <SelectTrigger className="h-8 w-28 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium ml-auto"
                >
                  重置筛选
                </button>
              )}
            </div>
          )}

          {/* Recycle bin section */}
          {showRecycleBin && (
            <div className="bg-red-50/50 rounded-xl border border-red-200 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Trash className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-red-700">回收站</h3>
                <span className="text-xs text-red-500">
                  产品在回收站中保留30天，30天后将自动清除（管理员仍可查阅历史记录）
                </span>
              </div>
              {recycleBinProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">回收站为空</p>
              ) : (
                <div className="space-y-2">
                  {recycleBinProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 bg-white rounded-lg border border-red-100 p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover opacity-60"
                        onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{product.skuCode || product.id}</span>
                          <span className="text-sm text-foreground truncate">{product.name}</span>
                        </div>
                        <span className="text-xs text-red-500">已删除 · {formatDate(product.updatedAt)}</span>
                      </div>
                      <button
                        onClick={() => handleRestore(product)}
                        disabled={actionLoadingId === product.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoadingId === product.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                        恢复
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Result count + sort info */}
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">
              共 <span className="font-bold text-foreground">{loading ? "..." : filteredProducts.length}</span> 个产品
              {!loading && filteredProducts.length !== supplierProducts.length && (
                <span className="text-muted-foreground">（已筛选，共 {supplierProducts.length} 个）</span>
              )}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              按{sortLabel}
              {sortDir === "desc" ? "降序" : "升序"}排列
            </span>
          </div>

          {/* Product table */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Table header (sortable) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1">图片</div>
              <div className="col-span-2">SKU编码</div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                >
                  产品名称
                  {sortField === "name" && (
                    sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleSort("category")}
                  className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                >
                  品类
                </button>
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => toggleSort("price")}
                  className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                >
                  价格
                  {sortField === "price" && (
                    sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => toggleSort("status")}
                  className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                >
                  状态
                  {sortField === "status" && (
                    sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleSort("updatedAt")}
                  className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                >
                  <ArrowUpDown className="h-3 w-3" />
                  修改时间
                  {sortField === "updatedAt" && (
                    sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div className="col-span-1">操作</div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="px-6 py-16 text-center">
                <Loader2 className="h-8 w-8 text-brand-600 mx-auto mb-3 animate-spin" />
                <p className="text-sm text-muted-foreground">加载产品列表中...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {activeFilterCount > 0 ? "没有符合筛选条件的产品" : "暂无产品，点击「发布新产品」开始上架"}
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-sm text-brand-600 hover:text-brand-700 mt-2 font-medium">
                    清除筛选条件
                  </button>
                )}
              </div>
            ) : (
              <>
                {paginatedProducts.map((product) => {
                  const status = statusConfig[product.status as Exclude<ProductStatus, "deleted">] || statusConfig.offline;
                  const StatusIcon = status.icon;
                  const imageCount = product.imageCount ?? 0;
                  const videoCount = product.videoCount ?? 0;
                  const isLoading = actionLoadingId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-border/40 hover:bg-muted/20 transition-colors items-center"
                    >
                      {/* Image + media count badge */}
                      <div className="md:col-span-1 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI;
                          }}
                        />
                        {(imageCount > 1 || videoCount > 0) && (
                          <span className="absolute -bottom-1 -right-1 bg-brand-600 text-white text-[9px] px-1 py-0.5 rounded-full font-bold">
                            {imageCount}+{videoCount}V
                          </span>
                        )}
                      </div>
                      {/* SKU */}
                      <div className="md:col-span-2">
                        <span className="text-xs font-mono text-brand-600 font-medium">{product.skuCode || product.id}</span>
                      </div>
                      {/* Name */}
                      <div className="md:col-span-2">
                        <span className="text-sm text-foreground font-medium">{product.name}</span>
                      </div>
                      {/* Category */}
                      <div className="md:col-span-2">
                        <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-medium">
                          {product.category || "未分类"}
                        </span>
                      </div>
                      {/* Price + MOQ */}
                      <div className="md:col-span-1">
                        <div className="text-sm text-brand-700 font-semibold">{product.priceRange || "面议"}</div>
                        <div className="text-xs text-muted-foreground">MOQ: {product.moq || "面议"}</div>
                      </div>
                      {/* Status */}
                      <div className="md:col-span-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                        {product.status === "rejected" && product.rejectReason && (
                          <div className="mt-1 flex items-start gap-1 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{product.rejectReason}</span>
                          </div>
                        )}
                      </div>
                      {/* Updated time */}
                      <div className="md:col-span-2">
                        <div className="text-xs text-muted-foreground">{formatDate(product.updatedAt)}</div>
                      </div>
                      {/* Actions */}
                      <div className="md:col-span-1 flex items-center gap-1">
                        {/* Edit */}
                        <ActionButton
                          icon={Edit}
                          tooltip="编辑产品"
                          onClick={() => router.push(`/supplier/new-product?edit=${product.id}`)}
                        />
                        {/* Preview */}
                        <ActionButton
                          icon={Eye}
                          tooltip="预览产品"
                          onClick={() => router.push(`/product?id=${product.skuCode || product.id}`)}
                        />
                        {/* Status-specific actions */}
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
                        ) : product.status === "approved" ? (
                          /* Delist button — ArrowDownToLine icon (not Trash2 to avoid confusion) */
                          <ActionButton
                            icon={ArrowDownToLine}
                            tooltip="下架产品"
                            hoverColor="hover:text-gold-600"
                            onClick={() => handleTakeDown(product)}
                          />
                        ) : product.status === "offline" ? (
                          /* Resubmit for review + Delete button */
                          <>
                            <ActionButton
                              icon={Send}
                              tooltip="重新提交审核"
                              hoverColor="hover:text-brand-600"
                              onClick={() => handleRelist(product)}
                            />
                            <ActionButton
                              icon={Trash2}
                              tooltip="删除产品"
                              hoverColor="hover:text-red-600"
                              onClick={() => openDeleteConfirm(product)}
                            />
                          </>
                        ) : (
                          /* Delete button for pending/draft/rejected */
                          <ActionButton
                            icon={Trash2}
                            tooltip="删除产品"
                            hoverColor="hover:text-red-600"
                            onClick={() => openDeleteConfirm(product)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30">
                    <span className="text-xs text-muted-foreground">
                      第 {pageStart} - {pageEnd} 条，共 {filteredProducts.length} 条
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {getPageNumbers().map((p, idx) =>
                        typeof p === "number" ? (
                          <button
                            key={idx}
                            onClick={() => goToPage(p)}
                            className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors ${
                              p === currentPage
                                ? "bg-brand-600 text-white"
                                : "hover:bg-muted text-muted-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span key={idx} className="px-1 text-xs text-muted-foreground">{p}</span>
                        )
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Product management features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">多级分类</span>
              </div>
              <p className="text-xs text-muted-foreground">8 大品类多级分类管理，灵活配置属性参数</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-bold text-brand-900">多语言内容</span>
              </div>
              <p className="text-xs text-muted-foreground">中 / 英 / 印尼语 / 阿拉伯语多语言产品内容管理</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">上下架审核</span>
              </div>
              <p className="text-xs text-muted-foreground">产品上架需平台审核，保障合规与品质标准</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Delete Confirmation Modal ===== */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center gap-3 p-5 border-b">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">确认删除产品</h2>
                <p className="text-xs text-muted-foreground mt-0.5">此操作将把产品移入回收站</p>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <img
                  src={deleteTarget.image}
                  alt={deleteTarget.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI; }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{deleteTarget.name}</div>
                  <div className="text-xs font-mono text-brand-600">{deleteTarget.id}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700 space-y-1">
                    <p>产品将被移入回收站，保留 <strong>30天</strong>。</p>
                    <p>30天内可从回收站恢复为"下架"状态；超过30天将自动清除。</p>
                    <p>管理员后台仍将保留该SKU的历史记录（如询盘记录等），可供查阅。</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                请确认是否要删除此产品？此操作不可撤销，但可在30天内恢复。
              </p>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-white">
              <Button variant="outline" size="sm" onClick={cancelDelete} disabled={deleteLoading}>
                取消
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 gap-1.5"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Media Upload Modal ===== */}
      {mediaModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeMediaModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">媒体资源管理</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SKU编码：{editingProduct} · 图片最多 {IMAGE_LIMITS.maxCount} 张 · 视频最多 {VIDEO_LIMITS.maxCount} 个
                </p>
              </div>
              <button
                onClick={closeMediaModal}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-5">
              <MediaUpload
                images={uploadedImages}
                videos={uploadedVideos}
                onImagesChange={setUploadedImages}
                onVideosChange={setUploadedVideos}
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between p-4 border-t bg-white shrink-0">
              <span className="text-xs text-muted-foreground">
                已选择 {uploadedImages.length} 张图片、{uploadedVideos.length} 个视频
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={closeMediaModal}>
                  取消
                </Button>
                <Button
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-700 gap-1"
                  onClick={closeMediaModal}
                  disabled={uploadedImages.length === 0}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  保存并提交审核
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
