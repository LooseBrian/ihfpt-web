"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Eye, Edit, Trash2, CheckCircle2, Clock, XCircle,
  Package, X, Upload, Search, Filter, ChevronDown, ChevronUp,
  ArrowUpDown, Image as ImageIcon, Calendar,
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
import type { UploadedImage, UploadedVideo } from "@/components/product/MediaUpload";

// ===== Types =====

type ProductStatus = "listed" | "pending" | "offline" | "draft";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  moq: string;
  status: ProductStatus;
  statusText: string;
  image: string;
  imageCount: number;
  videoCount: number;
  updatedAt: string; // ISO date string
}

// ===== Seed data =====

const seedProducts: ProductItem[] = [
  {
    id: "SKU-2026-0188",
    name: "清真冷冻羊腿肉（分割）",
    category: "牛羊肉制品",
    price: "¥85 - ¥92 / kg",
    moq: "200 kg",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/meat,lamb",
    imageCount: 6,
    videoCount: 2,
    updatedAt: "2026-07-10T14:30:00.000Z",
  },
  {
    id: "SKU-2026-0185",
    name: "清真预制菜 — 咖喱牛肉",
    category: "清真预制菜",
    price: "¥45 - ¥55 / box",
    moq: "500 box",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/curry,beef",
    imageCount: 4,
    videoCount: 1,
    updatedAt: "2026-07-09T10:15:00.000Z",
  },
  {
    id: "SKU-2026-0179",
    name: "清真速冻调理品 — 烤鸡翅",
    category: "速冻调理品",
    price: "¥32 - ¥38 / kg",
    moq: "300 kg",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/chicken,wings",
    imageCount: 3,
    videoCount: 0,
    updatedAt: "2026-07-08T16:45:00.000Z",
  },
  {
    id: "SKU-2026-0168",
    name: "清真速冻饺子 — 牛肉洋葱",
    category: "速冻面点",
    price: "¥25 - ¥32 / kg",
    moq: "500 kg",
    status: "offline",
    statusText: "已下架",
    image: "https://loremflickr.com/120/80/dumpling,beef",
    imageCount: 2,
    videoCount: 0,
    updatedAt: "2026-07-05T09:20:00.000Z",
  },
  {
    id: "SKU-2026-0155",
    name: "清真复合调味料 — 孜然粉",
    category: "调味料",
    price: "¥18 - ¥25 / kg",
    moq: "1000 kg",
    status: "pending",
    statusText: "审核中",
    image: "https://loremflickr.com/120/80/spice,cumin",
    imageCount: 5,
    videoCount: 1,
    updatedAt: "2026-07-03T11:00:00.000Z",
  },
];

const statusConfig: Record<ProductStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  listed: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50", label: "已上架" },
  pending: { icon: Clock, color: "text-gold-600 bg-gold-50", label: "审核中" },
  offline: { icon: XCircle, color: "text-muted-foreground bg-muted", label: "已下架" },
  draft: { icon: Edit, color: "text-blue-600 bg-blue-50", label: "草稿" },
};

const categoryOptions = [
  { value: "all", label: "全部品类" },
  { value: "牛羊肉制品", label: "牛羊肉制品" },
  { value: "清真预制菜", label: "清真预制菜" },
  { value: "速冻调理品", label: "速冻调理品" },
  { value: "速冻面点", label: "速冻面点" },
  { value: "调味料", label: "调味料" },
  { value: "即食食品", label: "即食食品" },
  { value: "水产品", label: "水产品" },
  { value: "粮油副食", label: "粮油副食" },
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "listed", label: "已上架" },
  { value: "pending", label: "审核中" },
  { value: "offline", label: "已下架" },
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

// ===== Main Component =====

export function SupplierProducts() {
  const router = useRouter();

  // Product list state (seed + localStorage additions)
  const [products, setProducts] = useState<ProductItem[]>(seedProducts);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Media modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  // ===== Load newly added products from localStorage =====
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ihf_new_products");
      if (stored) {
        const newProducts: ProductItem[] = JSON.parse(stored);
        if (Array.isArray(newProducts) && newProducts.length > 0) {
          // Merge: only add products that don't already exist
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const toAdd = newProducts.filter((p) => !existingIds.has(p.id));
            return [...toAdd, ...prev];
          });
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // ===== Filtered + sorted products =====
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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
        cmp = a.price.localeCompare(b.price);
      } else if (sortField === "status") {
        cmp = a.statusText.localeCompare(b.statusText, "zh-CN");
      } else if (sortField === "category") {
        cmp = a.category.localeCompare(b.category, "zh-CN");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [products, searchQuery, filterCategory, filterStatus, sortField, sortDir]);

  // ===== Handlers =====

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterStatus("all");
    setSortField("updatedAt");
    setSortDir("desc");
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">品类</span>
                <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v || "all")}>
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
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || "all")}>
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

          {/* Result count */}
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">
              共 <span className="font-bold text-foreground">{filteredProducts.length}</span> 个产品
              {filteredProducts.length !== products.length && (
                <span className="text-muted-foreground">（已筛选，共 {products.length} 个）</span>
              )}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              按{sortField === "updatedAt" ? "修改时间" : sortField === "name" ? "名称" : sortField === "price" ? "价格" : "状态"}
              {sortDir === "desc" ? "降序" : "升序"}排列
            </span>
          </div>

          {/* Product table */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Table header (sortable) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1">图片</div>
              <div className="col-span-2">产品编号</div>
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

            {/* Table rows */}
            {filteredProducts.length === 0 ? (
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
              filteredProducts.map((product) => {
                const status = statusConfig[product.status as ProductStatus] || statusConfig.offline;
                const StatusIcon = status.icon;
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
                      />
                      {(product.imageCount > 1 || product.videoCount > 0) && (
                        <span className="absolute -bottom-1 -right-1 bg-brand-600 text-white text-[9px] px-1 py-0.5 rounded-full font-bold">
                          {product.imageCount}+{product.videoCount}V
                        </span>
                      )}
                    </div>
                    {/* SKU */}
                    <div className="md:col-span-2">
                      <span className="text-xs font-mono text-brand-600 font-medium">{product.id}</span>
                    </div>
                    {/* Name */}
                    <div className="md:col-span-2">
                      <span className="text-sm text-foreground font-medium">{product.name}</span>
                    </div>
                    {/* Category */}
                    <div className="md:col-span-2">
                      <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-medium">
                        {product.category}
                      </span>
                    </div>
                    {/* Price + MOQ */}
                    <div className="md:col-span-1">
                      <div className="text-sm text-brand-700 font-semibold">{product.price}</div>
                      <div className="text-xs text-muted-foreground">MOQ: {product.moq}</div>
                    </div>
                    {/* Status */}
                    <div className="md:col-span-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {product.statusText}
                      </span>
                    </div>
                    {/* Updated time */}
                    <div className="md:col-span-2">
                      <div className="text-xs text-muted-foreground">{formatDate(product.updatedAt)}</div>
                    </div>
                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center gap-1">
                      <button
                        onClick={() => router.push(`/supplier/new-product?edit=${product.id}`)}
                        className="relative group/btn p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-brand-600 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover/btn:opacity-100 transition-opacity z-50">
                          编辑产品
                        </span>
                      </button>
                      <button
                        onClick={() => router.push(`/supplier/preview?sku=${product.id}`)}
                        className="relative group/btn p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-brand-600 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover/btn:opacity-100 transition-opacity z-50">
                          预览产品
                        </span>
                      </button>
                      <button
                        className="relative group/btn p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover/btn:opacity-100 transition-opacity z-50">
                          下架产品
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
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
                  产品编号：{editingProduct} · 图片最多 {IMAGE_LIMITS.maxCount} 张 · 视频最多 {VIDEO_LIMITS.maxCount} 个
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
