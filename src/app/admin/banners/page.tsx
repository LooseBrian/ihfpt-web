"use client";

// Admin Banners Page - manage homepage and section banners

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Power,
  ExternalLink,
  Search,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ===== Types =====

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string; // 'home', 'products', 'sidebar'
  sort_order: number;
  is_active: number; // 0 or 1
  start_at: string | null;
  end_at: string | null;
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

const positionOptions = [
  { value: "home", label: "首页轮播" },
  { value: "products", label: "产品页横幅" },
  { value: "sidebar", label: "侧边广告" },
];

const positionLabel: Record<string, string> = {
  home: "首页轮播",
  products: "产品页横幅",
  sidebar: "侧边广告",
};

const positionBadge: Record<string, string> = {
  home: "bg-brand-100 text-brand-700",
  products: "bg-trust-100 text-trust-700",
  sidebar: "bg-gold-100 text-gold-700",
};

// Banners are typically few in number — fetch a large page so reordering
// (which swaps sort_order between siblings) works across the full set.
const PAGE_SIZE = 50;

// ===== Page =====

export default function BannersPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="content.banner">
        <BannersContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function BannersContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mutationTick, setMutationTick] = useState(0);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formPosition, setFormPosition] = useState<string>("home");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formLinkUrl, setFormLinkUrl] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("1");
  const [formIsActive, setFormIsActive] = useState(true);

  // ===== Fetch banners (paginated, server-side position filter) =====
  const {
    data,
    loading,
    error,
    refetch,
    total,
  } = useApiPaginated<Banner>(
    (p, pp) =>
      adminApi.banners({
        page: p,
        per_page: pp,
        position: positionFilter === "all" ? undefined : positionFilter,
      }) as Promise<PaginatedResponse<Banner>>,
    PAGE_SIZE,
    { deps: [positionFilter, mutationTick] }
  );

  // ===== Debounce search input (400ms) =====
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ===== Mutations =====
  const createMutation = useApiMutation(
    (payload: Record<string, unknown>) => adminApi.createBanner(payload)
  );
  const updateMutation = useApiMutation(
    (params: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateBanner(params.id, params.data)
  );
  const deleteMutation = useApiMutation((id: string) =>
    adminApi.deleteBanner(id)
  );

  const allBanners = data ?? [];

  // Client-side search filter (the banners API has no search param)
  const filtered = useMemo(() => {
    const s = debouncedSearch.trim().toLowerCase();
    const list = s
      ? allBanners.filter((b) => b.title.toLowerCase().includes(s))
      : allBanners;
    return [...list].sort((a, b) => {
      if (a.position !== b.position)
        return a.position.localeCompare(b.position);
      return a.sort_order - b.sort_order;
    });
  }, [allBanners, debouncedSearch]);

  // ===== Stats =====
  const stats = useMemo(
    () => ({
      total,
      active: allBanners.filter((b) => b.is_active === 1).length,
      inactive: allBanners.filter((b) => b.is_active === 0).length,
    }),
    [allBanners, total]
  );

  // ===== Form helpers =====
  const resetForm = () => {
    setFormTitle("");
    setFormPosition("home");
    setFormImageUrl("");
    setFormLinkUrl("");
    setFormSortOrder("1");
    setFormIsActive(true);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormTitle(banner.title);
    setFormPosition(banner.position || "home");
    setFormImageUrl(banner.image_url || "");
    setFormLinkUrl(banner.link_url || "");
    setFormSortOrder(String(banner.sort_order ?? 1));
    setFormIsActive(banner.is_active === 1);
    setDialogOpen(true);
  };

  const refreshAll = async () => {
    await refetch();
    setMutationTick((t) => t + 1);
  };

  // ===== Action Handlers =====
  const handleToggleActive = async (id: string) => {
    const banner = allBanners.find((b) => b.id === id);
    if (!banner) return;
    setActionLoading(id);
    try {
      await updateMutation.mutate({
        id,
        data: { is_active: banner.is_active === 1 ? 0 : 1 },
      });
      await refreshAll();
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该Banner吗？")) return;
    setActionLoading(id);
    try {
      await deleteMutation.mutate(id);
      await refreshAll();
      alert("Banner已删除");
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleMoveOrder = async (id: string, dir: "up" | "down") => {
    // Sort all banners by position then sort_order to find siblings
    const sorted = [...allBanners].sort((a, b) => {
      if (a.position !== b.position)
        return a.position.localeCompare(b.position);
      return a.sort_order - b.sort_order;
    });
    const target = sorted.find((b) => b.id === id);
    if (!target) return;
    const siblings = sorted.filter((b) => b.position === target.position);
    const sibIdx = siblings.findIndex((b) => b.id === id);
    const swapWith =
      dir === "up" ? siblings[sibIdx - 1] : siblings[sibIdx + 1];
    if (!swapWith) return;

    setActionLoading(id);
    try {
      // Swap sort_order values between the two siblings
      await updateMutation.mutate({
        id,
        data: { sort_order: swapWith.sort_order },
      });
      await updateMutation.mutate({
        id: swapWith.id,
        data: { sort_order: target.sort_order },
      });
      await refreshAll();
    } catch (err) {
      alert(
        "操作失败：" + (err instanceof Error ? err.message : "未知错误")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      alert("请填写Banner标题");
      return;
    }
    const imageUrl =
      formImageUrl.trim() ||
      "https://loremflickr.com/400/225/business,islam";
    const payload: Record<string, unknown> = {
      title: formTitle,
      image_url: imageUrl,
      link_url: formLinkUrl.trim() || null,
      position: formPosition,
      sort_order: Number(formSortOrder) || 1,
      is_active: formIsActive ? 1 : 0,
    };

    setActionLoading(editingId || "form");
    try {
      if (editingId) {
        await updateMutation.mutate({ id: editingId, data: payload });
      } else {
        await createMutation.mutate(payload);
      }
      setDialogOpen(false);
      resetForm();
      await refreshAll();
      alert(editingId ? "Banner已更新" : "Banner已创建");
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
    setDebouncedSearch("");
    setPositionFilter("all");
  };

  const hasActiveFilters = !!search || positionFilter !== "all";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-600" />
            Banner管理
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            管理首页轮播、产品页横幅与侧边广告的展示内容与排序
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          <Plus className="h-4 w-4" />
          新增Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Banner总数" value={stats.total} color="brand" />
        <StatCard label="启用中" value={stats.active} color="trust" />
        <StatCard label="已禁用" value={stats.inactive} color="gold" />
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索Banner标题…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">展示位置：</span>
          <Select
            value={positionFilter}
            onValueChange={(v) => setPositionFilter(v || "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部位置" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部位置</SelectItem>
              {positionOptions.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 text-slate-500"
            >
              重置
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-1 lg:col-span-2">
            <LoadingSpinner text="加载Banner中..." />
          </div>
        ) : error ? (
          <div className="col-span-1 lg:col-span-2">
            <ErrorDisplay error={error} onRetry={refetch} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-1 lg:col-span-2">
            <EmptyState
              title="暂无Banner"
              description="还没有任何Banner，点击右上角新增"
            />
          </div>
        ) : (
          filtered.map((banner) => {
            const isActive = banner.is_active === 1;
            const isLoading = actionLoading === banner.id;
            return (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Preview 16:9 */}
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-slate-600 text-xs font-medium">
                        已禁用
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        positionBadge[banner.position] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {positionLabel[banner.position] || banner.position}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-medium">
                      排序 {banner.sort_order}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {banner.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={
                        isActive
                          ? "bg-brand-100 text-brand-700 shrink-0"
                          : "bg-slate-100 text-slate-500 shrink-0"
                      }
                    >
                      {isActive ? "启用" : "禁用"}
                    </Badge>
                  </div>
                  <p
                    className="text-xs text-slate-400 mt-1 truncate"
                    title={banner.image_url}
                  >
                    {banner.image_url}
                  </p>
                  {banner.link_url && (
                    <p
                      className="text-xs text-trust-500 mt-0.5 truncate"
                      title={banner.link_url}
                    >
                      链接：{banner.link_url}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleMoveOrder(banner.id, "up")}
                        disabled={isLoading}
                        title="上移"
                        className="text-slate-400 hover:text-brand-600"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleMoveOrder(banner.id, "down")}
                        disabled={isLoading}
                        title="下移"
                        className="text-slate-400 hover:text-brand-600"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleToggleActive(banner.id)}
                        disabled={isLoading}
                        title={isActive ? "禁用" : "启用"}
                        className={
                          isActive
                            ? "text-slate-500 hover:text-gold-600"
                            : "text-slate-500 hover:text-brand-600"
                        }
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      {banner.link_url && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="预览链接"
                          className="text-slate-500 hover:text-trust-600"
                          onClick={() => {
                            if (banner.link_url) {
                              window.open(banner.link_url, "_blank");
                            }
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(banner)}
                        disabled={isLoading}
                        title="编辑"
                        className="text-slate-500 hover:text-brand-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(banner.id)}
                        disabled={isLoading}
                        title="删除"
                        className="text-slate-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? "编辑Banner" : "新增Banner"}
              </h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Banner标题</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="如 清真食品出口峰会"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>展示位置</Label>
                  <Select
                    value={formPosition}
                    onValueChange={(v) => setFormPosition(v || "home")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择位置" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>排序</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(e.target.value)}
                    placeholder="数字越小越靠前"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>图片地址</Label>
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://…（留空使用默认占位图）"
                />
                {formImageUrl && (
                  <div className="mt-2 aspect-[16/9] rounded-lg overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formImageUrl}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>链接地址（选填）</Label>
                <Input
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                  placeholder="https://… 点击Banner后跳转"
                />
              </div>
              <div className="space-y-1.5">
                <Label>启用状态</Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormIsActive(true)}
                    className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
                      formIsActive
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Power className="h-4 w-4" />
                    启用
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(false)}
                    className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
                      !formIsActive
                        ? "bg-slate-600 border-slate-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Power className="h-4 w-4" />
                    禁用
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  editingId
                    ? updateMutation.loading
                    : createMutation.loading
                }
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId
                  ? updateMutation.loading
                    ? "保存中..."
                    : "保存"
                  : createMutation.loading
                    ? "创建中..."
                    : "新增"}
              </Button>
            </div>
          </div>
        </div>
      )}
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
