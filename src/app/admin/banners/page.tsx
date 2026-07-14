"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
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

type BannerPosition = "首页轮播" | "产品页横幅" | "侧边广告";

interface Banner {
  id: string;
  title: string;
  position: BannerPosition;
  image: string;
  isActive: boolean;
  order: number;
}

// ===== Constants =====

const positions: BannerPosition[] = ["首页轮播", "产品页横幅", "侧边广告"];

const positionBadge: Record<BannerPosition, string> = {
  首页轮播: "bg-brand-100 text-brand-700",
  产品页横幅: "bg-trust-100 text-trust-700",
  侧边广告: "bg-gold-100 text-gold-700",
};

// ===== Seed data =====

const seedBanners: Banner[] = [
  {
    id: "BN-001",
    title: "清真食品出口峰会",
    position: "首页轮播",
    image: "https://loremflickr.com/400/225/business,islam",
    isActive: true,
    order: 1,
  },
  {
    id: "BN-002",
    title: "斋月备货专区",
    position: "首页轮播",
    image: "https://loremflickr.com/400/225/ramadan,food",
    isActive: true,
    order: 2,
  },
  {
    id: "BN-003",
    title: "东南亚清真美食节",
    position: "首页轮播",
    image: "https://loremflickr.com/400/225/food,market",
    isActive: true,
    order: 3,
  },
  {
    id: "BN-004",
    title: "认证供应商推荐",
    position: "产品页横幅",
    image: "https://loremflickr.com/400/225/supplier,trade",
    isActive: true,
    order: 1,
  },
  {
    id: "BN-005",
    title: "跨境物流特惠",
    position: "侧边广告",
    image: "https://loremflickr.com/400/225/logistics,shipping",
    isActive: true,
    order: 1,
  },
  {
    id: "BN-006",
    title: "新供应商入驻有礼",
    position: "侧边广告",
    image: "https://loremflickr.com/400/225/business,gift",
    isActive: false,
    order: 2,
  },
];

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
  const [banners, setBanners] = useState<Banner[]>(seedBanners);
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formPosition, setFormPosition] = useState<BannerPosition>("首页轮播");
  const [formImage, setFormImage] = useState("");
  const [formOrder, setFormOrder] = useState("1");

  const filtered = useMemo(() => {
    const list =
      positionFilter === "all"
        ? banners
        : banners.filter((b) => b.position === positionFilter);
    return [...list].sort((a, b) => {
      if (a.position !== b.position) return a.position.localeCompare(b.position);
      return a.order - b.order;
    });
  }, [banners, positionFilter]);

  const stats = useMemo(
    () => ({
      total: banners.length,
      active: banners.filter((b) => b.isActive).length,
      inactive: banners.filter((b) => !b.isActive).length,
    }),
    [banners]
  );

  const resetForm = () => {
    setFormTitle("");
    setFormPosition("首页轮播");
    setFormImage("");
    setFormOrder("1");
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormTitle(banner.title);
    setFormPosition(banner.position);
    setFormImage(banner.image);
    setFormOrder(String(banner.order));
    setDialogOpen(true);
  };

  const toggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该Banner吗？")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const moveOrder = (id: string, dir: "up" | "down") => {
    setBanners((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const target = prev[idx];
      const siblings = prev
        .filter((b) => b.position === target.position)
        .sort((a, b) => a.order - b.order);
      const sibIdx = siblings.findIndex((b) => b.id === id);
      const swapWith =
        dir === "up" ? siblings[sibIdx - 1] : siblings[sibIdx + 1];
      if (!swapWith) return prev;
      return prev.map((b) => {
        if (b.id === id) return { ...b, order: swapWith.order };
        if (b.id === swapWith.id) return { ...b, order: target.order };
        return b;
      });
    });
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      alert("请填写Banner标题");
      return;
    }
    const image =
      formImage.trim() || "https://loremflickr.com/400/225/business,islam";
    if (editingId) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                title: formTitle,
                position: formPosition,
                image,
                order: Number(formOrder) || 1,
              }
            : b
        )
      );
    } else {
      const newBanner: Banner = {
        id: `BN-${String(banners.length + 1).padStart(3, "0")}`,
        title: formTitle,
        position: formPosition,
        image,
        isActive: true,
        order: Number(formOrder) || 1,
      };
      setBanners((prev) => [...prev, newBanner]);
    }
    setDialogOpen(false);
    resetForm();
  };

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

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
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
            {positions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            {/* Preview 16:9 */}
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {!banner.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-slate-600 text-xs font-medium">
                    已禁用
                  </span>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${positionBadge[banner.position]}`}
                >
                  {banner.position}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-medium">
                  排序 {banner.order}
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
                    banner.isActive
                      ? "bg-brand-100 text-brand-700 shrink-0"
                      : "bg-slate-100 text-slate-500 shrink-0"
                  }
                >
                  {banner.isActive ? "启用" : "禁用"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate" title={banner.image}>
                {banner.image}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveOrder(banner.id, "up")}
                    title="上移"
                    className="text-slate-400 hover:text-brand-600"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveOrder(banner.id, "down")}
                    title="下移"
                    className="text-slate-400 hover:text-brand-600"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleActive(banner.id)}
                    title={banner.isActive ? "禁用" : "启用"}
                    className={
                      banner.isActive
                        ? "text-slate-500 hover:text-gold-600"
                        : "text-slate-500 hover:text-brand-600"
                    }
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="预览"
                    className="text-slate-500 hover:text-trust-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEdit(banner)}
                    title="编辑"
                    className="text-slate-500 hover:text-brand-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(banner.id)}
                    title="删除"
                    className="text-slate-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-400">
            暂无Banner
          </div>
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
                    onValueChange={(v) =>
                      setFormPosition((v as BannerPosition) || "首页轮播")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择位置" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
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
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    placeholder="数字越小越靠前"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>图片地址</Label>
                <Input
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://…（留空使用默认占位图）"
                />
                {formImage && (
                  <div className="mt-2 aspect-[16/9] rounded-lg overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formImage}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId ? "保存" : "新增"}
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
