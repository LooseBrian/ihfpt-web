"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Store,
  ShieldCheck,
  Pause,
  Play,
  ExternalLink,
  Users2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard, useAdminAuth } from "@/lib/admin-auth-context";
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

type SupplierTier = "S" | "A" | "certified";
type SupplierStatus = "active" | "suspended";

interface AdminSupplier {
  id: string;
  name: string;
  tier: SupplierTier;
  categories: string[];
  exportVolume: string;
  certCount: number;
  status: SupplierStatus;
  registerTime: string;
  storeId: string;
}

// ===== Seed Data =====

const seedSuppliers: AdminSupplier[] = [
  {
    id: "S001",
    name: "惠发食品有限公司",
    tier: "S",
    categories: ["肉制品", "速冻食品"],
    exportVolume: "$5,000万",
    certCount: 5,
    status: "active",
    registerTime: "2023-03-15",
    storeId: "huifa-food",
  },
  {
    id: "S002",
    name: "伊利清真食品有限公司",
    tier: "S",
    categories: ["乳制品", "饮品"],
    exportVolume: "$2亿",
    certCount: 8,
    status: "active",
    registerTime: "2023-01-20",
    storeId: "yili-halal",
  },
  {
    id: "S003",
    name: "河南白象清真食品有限公司",
    tier: "S",
    categories: ["方便食品", "调味品"],
    exportVolume: "$1.2亿",
    certCount: 6,
    status: "active",
    registerTime: "2023-05-08",
    storeId: "baixiang-halal",
  },
  {
    id: "S004",
    name: "甘肃清香油脂有限公司",
    tier: "A",
    categories: ["油脂类"],
    exportVolume: "$4,500万",
    certCount: 5,
    status: "active",
    registerTime: "2023-06-12",
    storeId: "qingxiang-oil",
  },
  {
    id: "S005",
    name: "宁夏塞外蜂业有限公司",
    tier: "A",
    categories: ["蜂产品"],
    exportVolume: "$3,000万",
    certCount: 4,
    status: "active",
    registerTime: "2023-07-03",
    storeId: "saiwai-honey",
  },
  {
    id: "S006",
    name: "内蒙古草原乳业有限公司",
    tier: "A",
    categories: ["乳制品"],
    exportVolume: "$6,000万",
    certCount: 5,
    status: "active",
    registerTime: "2023-08-19",
    storeId: "caoyuan-dairy",
  },
  {
    id: "S007",
    name: "新疆阿凡提干果有限公司",
    tier: "A",
    categories: ["干果类", "休闲食品"],
    exportVolume: "$3,500万",
    certCount: 4,
    status: "active",
    registerTime: "2023-09-25",
    storeId: "afanti-nuts",
  },
  {
    id: "S008",
    name: "上海佳丽清真食品有限公司",
    tier: "certified",
    categories: ["糖果类"],
    exportVolume: "$800万",
    certCount: 3,
    status: "active",
    registerTime: "2023-11-10",
    storeId: "jiali-candy",
  },
  {
    id: "S009",
    name: "山东欣鑫调味品有限公司",
    tier: "certified",
    categories: ["调味品"],
    exportVolume: "$1,200万",
    certCount: 3,
    status: "suspended",
    registerTime: "2024-01-05",
    storeId: "xinxin-seasoning",
  },
  {
    id: "S010",
    name: "青海雪域牦牛肉业有限公司",
    tier: "certified",
    categories: ["肉制品"],
    exportVolume: "$2,000万",
    certCount: 4,
    status: "suspended",
    registerTime: "2024-02-18",
    storeId: "xueyu-yak",
  },
];

// ===== Constants =====

const tierConfig: Record<SupplierTier, { label: string; className: string }> = {
  S: { label: "S级", className: "bg-gold-100 text-gold-700" },
  A: { label: "A级", className: "bg-brand-100 text-brand-700" },
  certified: { label: "认证级", className: "bg-muted text-muted-foreground" },
};

const statusConfig: Record<SupplierStatus, { label: string; className: string }> = {
  active: { label: "正常", className: "bg-brand-100 text-brand-700" },
  suspended: { label: "暂停", className: "bg-red-100 text-red-700" },
};

const tierOptions = [
  { value: "all", label: "全部等级" },
  { value: "S", label: "S级" },
  { value: "A", label: "A级" },
  { value: "certified", label: "认证级" },
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "active", label: "正常" },
  { value: "suspended", label: "暂停" },
];

const PAGE_SIZE = 5;

// ===== Page Component =====

export default function SupplierManagementPage() {
  return (
    <AdminLayout>
      <AdminGuard permission="suppliers.view">
        <SupplierManagementContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function SupplierManagementContent() {
  const { hasPermission } = useAdminAuth();
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>(seedSuppliers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const stats = useMemo(() => {
    const total = suppliers.length;
    const sCount = suppliers.filter((s) => s.tier === "S").length;
    const aCount = suppliers.filter((s) => s.tier === "A").length;
    const certCount = suppliers.filter((s) => s.tier === "certified").length;
    return { total, sCount, aCount, certCount };
  }, [suppliers]);

  // Filter
  const filtered = useMemo(() => {
    let result = [...suppliers];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (tierFilter !== "all") {
      result = result.filter((s) => s.tier === tierFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }
    return result;
  }, [suppliers, search, tierFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleToggleStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "suspended" : "active" }
          : s
      )
    );
  };

  const resetFilters = () => {
    setSearch("");
    setTierFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || tierFilter !== "all" || statusFilter !== "all";

  const statCards = [
    { label: "总供应商", value: stats.total, icon: Store, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "S级", value: stats.sCount, icon: ShieldCheck, color: "text-gold-600", bg: "bg-gold-50" },
    { label: "A级", value: stats.aCount, icon: ShieldCheck, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "认证级", value: stats.certCount, icon: ShieldCheck, color: "text-slate-500", bg: "bg-slate-100" },
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
          <p className="text-sm text-slate-500">管理平台供应商资质与会员等级</p>
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
              placeholder="搜索企业名称"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

          <Select
            value={tierFilter}
            onValueChange={(v) => {
              setTierFilter(v || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tierOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">企业名称</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">会员等级</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">品类</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">出口额</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">认证数量</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">状态</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">注册时间</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Users2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    暂无符合条件的供应商
                  </td>
                </tr>
              ) : (
                pageData.map((supplier) => {
                  const tc = tierConfig[supplier.tier];
                  const sc = statusConfig[supplier.status];
                  return (
                    <tr key={supplier.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/store/${supplier.storeId}`}
                          className="font-medium text-brand-700 hover:underline inline-flex items-center gap-1"
                        >
                          {supplier.name}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </Link>
                      </td>
                      {/* Tier */}
                      <td className="px-4 py-3">
                        <Badge className={tc.className}>{tc.label}</Badge>
                      </td>
                      {/* Categories */}
                      <td className="px-4 py-3 text-slate-600">
                        {supplier.categories.join("、")}
                      </td>
                      {/* Export Volume */}
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{supplier.exportVolume}</td>
                      {/* Cert Count */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
                          {supplier.certCount} 项
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge className={sc.className}>{sc.label}</Badge>
                      </td>
                      {/* Register Time */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{supplier.registerTime}</td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {hasPermission("suppliers.verify") && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              资质审核
                            </Button>
                          )}
                          {hasPermission("suppliers.suspend") && (
                            <Button
                              size="sm"
                              variant={supplier.status === "active" ? "destructive" : "outline"}
                              className="gap-1"
                              onClick={() => handleToggleStatus(supplier.id)}
                            >
                              {supplier.status === "active" ? (
                                <>
                                  <Pause className="h-3.5 w-3.5" />
                                  暂停
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5" />
                                  恢复
                                </>
                              )}
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
    </div>
  );
}
