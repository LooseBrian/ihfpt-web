"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Ban,
  Unlock,
  MessageSquareOff,
  MessageSquare,
  UserCheck,
  Clock,
  UserPlus,
  Mail,
  MapPin,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

type VerifyStatus = "verified" | "pending" | "unverified";
type BuyerStatus = "active" | "suspended";

interface AdminBuyer {
  id: string;
  name: string;
  contact: string;
  email: string;
  region: string;
  inquiryCount: number;
  verifyStatus: VerifyStatus;
  status: BuyerStatus;
  registerTime: string;
}

// Restriction info (used for both ban and silence)
interface RestrictionInfo {
  targetId: string;
  duration: number; // days, 0 = permanent
  appliedAt: string; // ISO string
  expiresAt: string | null; // ISO string, null = permanent
  reason: string;
}

// ===== Seed Data =====

const seedBuyers: AdminBuyer[] = [
  {
    id: "B001",
    name: "迪拜环球食品贸易公司",
    contact: "张明",
    email: "zhangming@dubaiglobal.ae",
    region: "中东/迪拜",
    inquiryCount: 25,
    verifyStatus: "verified",
    status: "active",
    registerTime: "2023-05-10",
  },
  {
    id: "B002",
    name: "吉隆坡清真食品集团",
    contact: "Ahmad Lim",
    email: "ahmad@klhalal.my",
    region: "东南亚/马来西亚",
    inquiryCount: 18,
    verifyStatus: "verified",
    status: "active",
    registerTime: "2023-06-15",
  },
  {
    id: "B003",
    name: "雅加达进出口商行",
    contact: "李华强",
    email: "lihq@jakartaimport.id",
    region: "东南亚/印尼",
    inquiryCount: 12,
    verifyStatus: "verified",
    status: "active",
    registerTime: "2023-07-20",
  },
  {
    id: "B004",
    name: "伦敦清真食品分销商",
    contact: "James Smith",
    email: "j.smith@londonhalal.uk",
    region: "欧洲/英国",
    inquiryCount: 30,
    verifyStatus: "verified",
    status: "active",
    registerTime: "2023-08-05",
  },
  {
    id: "B005",
    name: "利雅得食品贸易公司",
    contact: "王大力",
    email: "wangdl@riyadhfood.sa",
    region: "中东/沙特",
    inquiryCount: 8,
    verifyStatus: "pending",
    status: "active",
    registerTime: "2024-01-12",
  },
  {
    id: "B006",
    name: "伊斯坦布尔清真超市",
    contact: "Mehmet Chen",
    email: "mehmet@istanbulhalal.tr",
    region: "中东/土耳其",
    inquiryCount: 5,
    verifyStatus: "pending",
    status: "active",
    registerTime: "2024-02-28",
  },
  {
    id: "B007",
    name: "卡拉奇食品进口商",
    contact: "Ali Zhang",
    email: "aliz@karachifood.pk",
    region: "南亚/巴基斯坦",
    inquiryCount: 15,
    verifyStatus: "verified",
    status: "suspended",
    registerTime: "2024-03-15",
  },
  {
    id: "B008",
    name: "开罗清真食品批发商",
    contact: "Hassan Liu",
    email: "hassan@cairohalal.eg",
    region: "北非/埃及",
    inquiryCount: 3,
    verifyStatus: "pending",
    status: "active",
    registerTime: "2024-06-01",
  },
];

// ===== Constants =====

const verifyConfig: Record<VerifyStatus, { label: string; className: string }> = {
  verified: { label: "已认证", className: "bg-brand-100 text-brand-700" },
  pending: { label: "待审核", className: "bg-gold-100 text-gold-700" },
  unverified: { label: "未认证", className: "bg-muted text-muted-foreground" },
};

const verifyOptions = [
  { value: "all", label: "全部认证状态" },
  { value: "verified", label: "已认证" },
  { value: "pending", label: "待审核" },
  { value: "unverified", label: "未认证" },
];

const regionOptions = [
  { value: "all", label: "全部地区" },
  { value: "中东", label: "中东" },
  { value: "东南亚", label: "东南亚" },
  { value: "欧洲", label: "欧洲" },
  { value: "南亚", label: "南亚" },
  { value: "北非", label: "北非" },
];

const PAGE_SIZE = 5;

// Restriction duration options (days, 0 = permanent)
const restrictionDurationOptions = [
  { value: 1, label: "1天" },
  { value: 3, label: "3天" },
  { value: 7, label: "7天" },
  { value: 0, label: "永久" },
];

// Calculate remaining days; returns null if permanent, -1 if expired
function getRemainingDays(expiresAt: string | null): number {
  if (!expiresAt) return 0; // permanent
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return -1;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

// ===== Page Component =====

export default function BuyerManagementPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="buyers.suspend">
        <BuyerManagementContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function BuyerManagementContent() {
  const { hasPermission } = useAdminAuth();
  const [buyers, setBuyers] = useState<AdminBuyer[]>(seedBuyers);
  const [search, setSearch] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Restriction state: ban (禁止登录) and silence (禁言), keyed by buyer id
  const [banInfo, setBanInfo] = useState<Record<string, RestrictionInfo>>(() => {
    const now = new Date().toISOString();
    const init: Record<string, RestrictionInfo> = {};
    for (const b of seedBuyers) {
      if (b.status === "suspended") {
        init[b.id] = {
          targetId: b.id,
          duration: 0,
          appliedAt: now,
          expiresAt: null,
          reason: "历史暂停记录",
        };
      }
    }
    return init;
  });
  const [silenceInfo, setSilenceInfo] = useState<Record<string, RestrictionInfo>>({});

  // Shared dialog state for applying a restriction (ban or silence)
  const [dialogType, setDialogType] = useState<"ban" | "silence" | null>(null);
  const [dialogTarget, setDialogTarget] = useState<AdminBuyer | null>(null);
  const [dialogDuration, setDialogDuration] = useState<number>(1);
  const [dialogReason, setDialogReason] = useState("");

  // Stats
  const stats = useMemo(() => {
    const total = buyers.length;
    const verified = buyers.filter((b) => b.verifyStatus === "verified").length;
    const pending = buyers.filter((b) => b.verifyStatus === "pending").length;
    // Simulate "this month new" — buyers registered in June 2024
    const thisMonth = buyers.filter((b) => b.registerTime.startsWith("2024-06")).length;
    return { total, verified, pending, thisMonth };
  }, [buyers]);

  // Active restriction lookups (auto-expire)
  const getActiveBan = (id: string): RestrictionInfo | null => {
    const info = banInfo[id];
    if (!info) return null;
    if (getRemainingDays(info.expiresAt) === -1) return null;
    return info;
  };
  const getActiveSilence = (id: string): RestrictionInfo | null => {
    const info = silenceInfo[id];
    if (!info) return null;
    if (getRemainingDays(info.expiresAt) === -1) return null;
    return info;
  };

  // Filter
  const filtered = useMemo(() => {
    let result = [...buyers];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.contact.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q)
      );
    }
    if (verifyFilter !== "all") {
      result = result.filter((b) => b.verifyStatus === verifyFilter);
    }
    if (regionFilter !== "all") {
      result = result.filter((b) => b.region.includes(regionFilter));
    }
    return result;
  }, [buyers, search, verifyFilter, regionFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const openRestrictionDialog = (type: "ban" | "silence", buyer: AdminBuyer) => {
    setDialogType(type);
    setDialogTarget(buyer);
    setDialogDuration(1);
    setDialogReason("");
  };

  const handleRestrictionConfirm = () => {
    if (!dialogTarget || !dialogType) return;
    const now = new Date();
    const appliedAt = now.toISOString();
    const expiresAt =
      dialogDuration === 0
        ? null
        : new Date(now.getTime() + dialogDuration * 24 * 60 * 60 * 1000).toISOString();
    const record: RestrictionInfo = {
      targetId: dialogTarget.id,
      duration: dialogDuration,
      appliedAt,
      expiresAt,
      reason: dialogReason || "未填写原因",
    };
    if (dialogType === "ban") {
      setBanInfo((prev) => ({ ...prev, [dialogTarget.id]: record }));
      setBuyers((prev) =>
        prev.map((b) =>
          b.id === dialogTarget.id ? { ...b, status: "suspended" } : b
        )
      );
    } else {
      setSilenceInfo((prev) => ({ ...prev, [dialogTarget.id]: record }));
    }
    const label = dialogType === "ban" ? "禁止登录" : "禁言";
    alert(
      dialogDuration === 0
        ? `已永久${label}该采购商`
        : `已${label}该采购商 ${dialogDuration} 天`
    );
    setDialogType(null);
    setDialogTarget(null);
    setDialogReason("");
  };

  const handleLiftBan = (id: string) => {
    setBanInfo((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "active" } : b))
    );
    alert("已解除禁止登录");
  };

  const handleLiftSilence = (id: string) => {
    setSilenceInfo((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    alert("已解除禁言");
  };

  const resetFilters = () => {
    setSearch("");
    setVerifyFilter("all");
    setRegionFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || verifyFilter !== "all" || regionFilter !== "all";

  const statCards = [
    { label: "总采购商", value: stats.total, icon: Users, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "已认证", value: stats.verified, icon: UserCheck, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "待审核", value: stats.pending, icon: Clock, color: "text-gold-600", bg: "bg-gold-50" },
    { label: "本月新增", value: stats.thisMonth, icon: UserPlus, color: "text-trust-600", bg: "bg-trust-50" },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Users className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">采购商管理</h1>
          <p className="text-sm text-slate-500">管理平台采购商认证与账户状态</p>
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
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

          <Select
            value={verifyFilter}
            onValueChange={(v) => {
              setVerifyFilter(v || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {verifyOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={regionFilter}
            onValueChange={(v) => {
              setRegionFilter(v || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map((opt) => (
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
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">联系人</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">邮箱</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">地区</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">询盘数</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">认证状态</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">账户状态</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">消息状态</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">注册时间</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    暂无符合条件的采购商
                  </td>
                </tr>
              ) : (
                pageData.map((buyer) => {
                  const vc = verifyConfig[buyer.verifyStatus];
                  const activeBan = getActiveBan(buyer.id);
                  const banRemaining = activeBan
                    ? getRemainingDays(activeBan.expiresAt)
                    : null;
                  const activeSilence = getActiveSilence(buyer.id);
                  const silenceRemaining = activeSilence
                    ? getRemainingDays(activeSilence.expiresAt)
                    : null;
                  return (
                    <tr key={buyer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">{buyer.name}</span>
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{buyer.contact}</td>
                      {/* Email */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {buyer.email}
                        </span>
                      </td>
                      {/* Region */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {buyer.region}
                        </span>
                      </td>
                      {/* Inquiry Count */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <span className="font-medium text-slate-900">{buyer.inquiryCount}</span>
                          条
                        </span>
                      </td>
                      {/* Verify Status */}
                      <td className="px-4 py-3">
                        <Badge className={vc.className}>{vc.label}</Badge>
                      </td>
                      {/* Account Status (ban) */}
                      <td className="px-4 py-3">
                        {activeBan ? (
                          <Badge className="bg-red-100 text-red-700">
                            {banRemaining === 0
                              ? "永久禁止"
                              : `已禁止 (剩余 ${banRemaining}天)`}
                          </Badge>
                        ) : (
                          <Badge className="bg-brand-100 text-brand-700">正常</Badge>
                        )}
                      </td>
                      {/* Messaging Status (silence) */}
                      <td className="px-4 py-3">
                        {activeSilence ? (
                          <Badge className="bg-gold-100 text-gold-700">
                            {silenceRemaining === 0
                              ? "永久禁言"
                              : `已禁言 (剩余 ${silenceRemaining}天)`}
                          </Badge>
                        ) : (
                          <Badge className="bg-brand-100 text-brand-700">正常</Badge>
                        )}
                      </td>
                      {/* Register Time */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{buyer.registerTime}</td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        {hasPermission("buyers.suspend") ? (
                          <div className="flex flex-col gap-1.5">
                            {activeBan ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 h-8"
                                onClick={() => handleLiftBan(buyer.id)}
                              >
                                <Unlock className="h-3.5 w-3.5" />
                                解除禁止
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1 h-8"
                                onClick={() => openRestrictionDialog("ban", buyer)}
                              >
                                <Ban className="h-3.5 w-3.5" />
                                禁止登录
                              </Button>
                            )}
                            {activeSilence ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 h-8"
                                onClick={() => handleLiftSilence(buyer.id)}
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                解除禁言
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 h-8 border-gold-200 text-gold-700 hover:bg-gold-50"
                                onClick={() => openRestrictionDialog("silence", buyer)}
                              >
                                <MessageSquareOff className="h-3.5 w-3.5" />
                                禁言
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
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
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
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
      </div>

      {/* Restriction Dialog (ban / silence) */}
      {dialogTarget && dialogType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDialogType(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  dialogType === "ban" ? "bg-red-50" : "bg-gold-50"
                }`}
              >
                {dialogType === "ban" ? (
                  <Ban className="h-4 w-4 text-red-600" />
                ) : (
                  <MessageSquareOff className="h-4 w-4 text-gold-600" />
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {dialogType === "ban" ? "禁止登录" : "禁言"}采购商
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              企业：
              <span className="font-medium text-slate-700">
                {dialogTarget.name}
              </span>
            </p>
            <p className="text-sm text-slate-500 mb-3">
              联系人：
              <span className="text-slate-700">{dialogTarget.contact}</span>
            </p>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              {dialogType === "ban" ? "禁止登录时长" : "禁言时长"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {restrictionDurationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDialogDuration(opt.value)}
                  className={`h-9 rounded-md text-sm border transition-colors ${
                    dialogDuration === opt.value
                      ? dialogType === "ban"
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-gold-600 border-gold-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.value === 0 ? "永久" : `${opt.label}`}
                </button>
              ))}
            </div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              {dialogType === "ban" ? "禁止原因" : "禁言原因"}
            </label>
            <Textarea
              placeholder="请输入原因（选填）"
              value={dialogReason}
              onChange={(e) => setDialogReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setDialogType(null)}>
                取消
              </Button>
              <Button
                size="sm"
                variant={dialogType === "ban" ? "destructive" : "outline"}
                onClick={handleRestrictionConfirm}
              >
                <X className="h-3.5 w-3.5" />
                确认{dialogType === "ban" ? "禁止" : "禁言"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
