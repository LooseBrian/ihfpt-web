"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Lock,
  Inbox,
  CheckCheck,
  Clock,
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

type InquiryStatus = "pending" | "replied" | "closed";

interface AdminInquiry {
  id: string;
  inquiryNo: string;
  product: string;
  buyer: string;
  supplier: string;
  amount: string;
  status: InquiryStatus;
  createTime: string;
}

// ===== Seed Data =====

const seedInquiries: AdminInquiry[] = [
  {
    id: "I001",
    inquiryNo: "INQ-2024-001",
    product: "清真牛肉干（原味）",
    buyer: "迪拜环球食品贸易公司",
    supplier: "惠发食品有限公司",
    amount: "$50,000",
    status: "pending",
    createTime: "2024-07-13 14:30",
  },
  {
    id: "I002",
    inquiryNo: "INQ-2024-002",
    product: "清真速冻水饺（牛肉馅）",
    buyer: "吉隆坡清真食品集团",
    supplier: "伊利清真食品有限公司",
    amount: "$35,000",
    status: "pending",
    createTime: "2024-07-12 10:20",
  },
  {
    id: "I003",
    inquiryNo: "INQ-2024-003",
    product: "清真特级初榨橄榄油",
    buyer: "雅加达进出口商行",
    supplier: "甘肃清香油脂有限公司",
    amount: "$80,000",
    status: "replied",
    createTime: "2024-07-11 16:45",
  },
  {
    id: "I004",
    inquiryNo: "INQ-2024-004",
    product: "清真天然蜂蜜（百花蜜）",
    buyer: "伦敦清真食品分销商",
    supplier: "宁夏塞外蜂业有限公司",
    amount: "$25,000",
    status: "replied",
    createTime: "2024-07-10 09:15",
  },
  {
    id: "I005",
    inquiryNo: "INQ-2024-005",
    product: "清真全脂奶粉",
    buyer: "利雅得食品贸易公司",
    supplier: "内蒙古草原乳业有限公司",
    amount: "$120,000",
    status: "pending",
    createTime: "2024-07-09 11:00",
  },
  {
    id: "I006",
    inquiryNo: "INQ-2024-006",
    product: "清真红烧牛肉方便面",
    buyer: "伊斯坦布尔清真超市",
    supplier: "河南白象清真食品有限公司",
    amount: "$45,000",
    status: "replied",
    createTime: "2024-07-08 15:30",
  },
  {
    id: "I007",
    inquiryNo: "INQ-2024-007",
    product: "清真黑巧克力（70%可可）",
    buyer: "卡拉奇食品进口商",
    supplier: "上海佳丽清真食品有限公司",
    amount: "$15,000",
    status: "closed",
    createTime: "2024-07-07 13:20",
  },
  {
    id: "I008",
    inquiryNo: "INQ-2024-008",
    product: "清真复合调味料（烧烤味）",
    buyer: "开罗清真食品批发商",
    supplier: "山东欣鑫调味品有限公司",
    amount: "$8,000",
    status: "closed",
    createTime: "2024-07-06 08:10",
  },
];

// ===== Constants =====

const statusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  pending: { label: "待回复", className: "bg-gold-100 text-gold-700" },
  replied: { label: "已回复", className: "bg-brand-100 text-brand-700" },
  closed: { label: "已关闭", className: "bg-muted text-muted-foreground" },
};

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待回复" },
  { value: "replied", label: "已回复" },
  { value: "closed", label: "已关闭" },
];

const PAGE_SIZE = 5;

// ===== Page Component =====

export default function InquiryManagementPage() {
  return (
    <AdminLayout>
      <AdminGuard permission="inquiries.view">
        <InquiryManagementContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function InquiryManagementContent() {
  const { hasPermission } = useAdminAuth();
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(seedInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const stats = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter((i) => i.status === "pending").length;
    const replied = inquiries.filter((i) => i.status === "replied").length;
    const closed = inquiries.filter((i) => i.status === "closed").length;
    return { total, pending, replied, closed };
  }, [inquiries]);

  // Filter
  const filtered = useMemo(() => {
    let result = [...inquiries];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.inquiryNo.toLowerCase().includes(q) ||
          i.product.toLowerCase().includes(q) ||
          i.buyer.toLowerCase().includes(q) ||
          i.supplier.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (dateFrom) {
      result = result.filter((i) => i.createTime.split(" ")[0] >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((i) => i.createTime.split(" ")[0] <= dateTo);
    }
    result.sort((a, b) => b.createTime.localeCompare(a.createTime));
    return result;
  }, [inquiries, search, statusFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClose = (id: string) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "closed" } : i))
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search || statusFilter !== "all" || dateFrom || dateTo;

  const statCards = [
    { label: "总询盘", value: stats.total, icon: MessageSquare, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "待回复", value: stats.pending, icon: Clock, color: "text-gold-600", bg: "bg-gold-50" },
    { label: "已回复", value: stats.replied, icon: CheckCheck, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "已关闭", value: stats.closed, icon: Inbox, color: "text-slate-500", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">询盘管理</h1>
          <p className="text-sm text-slate-500">监控与管理平台所有询盘交易</p>
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
              placeholder="搜索询盘编号 / 产品 / 采购商 / 供应商"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

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

          {/* Date range */}
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-[140px] text-sm"
            />
            <span className="text-slate-400 text-xs">至</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-[140px] text-sm"
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-slate-200">
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">询盘编号</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">产品</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">采购商</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">供应商</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">金额</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">状态</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">创建时间</th>
                <th className="text-left font-medium text-slate-600 px-4 py-3 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    暂无符合条件的询盘
                  </td>
                </tr>
              ) : (
                pageData.map((inquiry) => {
                  const sc = statusConfig[inquiry.status];
                  return (
                    <tr key={inquiry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      {/* Inquiry No */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-brand-700 font-medium">{inquiry.inquiryNo}</span>
                      </td>
                      {/* Product */}
                      <td className="px-4 py-3 font-medium text-slate-900">{inquiry.product}</td>
                      {/* Buyer */}
                      <td className="px-4 py-3 text-slate-600">{inquiry.buyer}</td>
                      {/* Supplier */}
                      <td className="px-4 py-3 text-slate-600">{inquiry.supplier}</td>
                      {/* Amount */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900">{inquiry.amount}</span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge className={sc.className}>{sc.label}</Badge>
                      </td>
                      {/* Create Time */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{inquiry.createTime}</td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        {inquiry.status !== "closed" ? (
                          hasPermission("inquiries.close") ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-slate-600"
                              onClick={() => handleClose(inquiry.id)}
                            >
                              <Lock className="h-3.5 w-3.5" />
                              关闭
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400">已关闭</span>
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
