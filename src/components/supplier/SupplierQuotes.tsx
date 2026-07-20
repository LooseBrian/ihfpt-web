"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Package,
  User,
  Clock,
  DollarSign,
  Scale,
  Truck,
  CalendarClock,
  Search,
  X,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useQuote } from "@/lib/quote-context";

function formatQuoteDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

type StatusFilter = "all" | "active" | "closing-soon" | "quoted" | "closed";

// Map inquiry status to label (we don't store inquiry status in quote, infer from age)
function inferQuoteStatus(createdAt: string): { label: string; color: string; dot: string } {
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000;
  if (ageDays < 3) return { label: "待查看", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" };
  if (ageDays < 7) return { label: "处理中", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" };
  return { label: "已报价", color: "bg-gray-50 text-gray-500 border-gray-200", dot: "bg-gray-400" };
}

export function SupplierQuotes() {
  const { user } = useAuth();
  const { getQuotesBySupplier } = useQuote();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const myQuotes = useMemo(() => {
    if (!user?.email) return [];
    return getQuotesBySupplier(user.email).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [user, getQuotesBySupplier]);

  const filteredQuotes = useMemo(() => {
    let result = [...myQuotes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (quote) =>
          quote.inquiryProductName.toLowerCase().includes(q) ||
          quote.inquiryBuyerName.toLowerCase().includes(q) ||
          quote.message.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((quote) => {
        const status = inferQuoteStatus(quote.createdAt).label;
        const map: Record<StatusFilter, string> = {
          all: "",
          active: "待查看",
          "closing-soon": "处理中",
          quoted: "已报价",
          closed: "已报价",
        };
        return status === map[statusFilter];
      });
    }
    return result;
  }, [myQuotes, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = myQuotes.length;
    const pending = myQuotes.filter((q) => inferQuoteStatus(q.createdAt).label === "待查看").length;
    const processing = myQuotes.filter((q) => inferQuoteStatus(q.createdAt).label === "处理中").length;
    const done = myQuotes.filter((q) => inferQuoteStatus(q.createdAt).label === "已报价").length;
    return { total, pending, processing, done };
  }, [myQuotes]);

  const activeFilterCount = (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <section id="quotes" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="我的报价"
          subtitle="查看您向采购商提交的报价记录，跟踪报价状态与买家反馈"
        />

        {/* Stats cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-brand-600" />
              <span className="text-xs text-muted-foreground">总报价数</span>
            </div>
            <div className="text-2xl font-bold text-brand-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/40">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">待查看</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{stats.pending}</div>
          </div>
          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-200/40">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">处理中</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{stats.processing}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/40">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-muted-foreground">已报价</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">{stats.done}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索产品名、采购商、报价内容..."
              className="pl-9 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5">
            {[
              { key: "all" as StatusFilter, label: "全部" },
              { key: "active" as StatusFilter, label: "待查看" },
              { key: "closing-soon" as StatusFilter, label: "处理中" },
              { key: "quoted" as StatusFilter, label: "已报价" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === opt.key
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              重置筛选
            </button>
          )}
        </div>

        {/* Quote list */}
        <div className="max-w-5xl mx-auto">
          {filteredQuotes.length > 0 ? (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => {
                const status = inferQuoteStatus(quote.createdAt);
                return (
                  <div
                    key={quote.id}
                    className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow p-5"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product image */}
                      <div className="relative w-full md:w-28 h-28 rounded-lg overflow-hidden bg-muted shrink-0 border">
                        <img
                          src={quote.inquiryProductImage}
                          alt={quote.inquiryProductName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-medium ${status.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                {status.label}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">{quote.id}</span>
                            </div>
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {quote.inquiryProductName}
                            </h3>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatQuoteDate(quote.createdAt)}
                          </span>
                        </div>

                        {/* Quote details grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-1.5 text-xs">
                            <DollarSign className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                            <div>
                              <div className="text-muted-foreground">报价单价</div>
                              <div className="font-semibold text-foreground">{quote.unitPrice} / {quote.unit}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Scale className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                            <div>
                              <div className="text-muted-foreground">起订量</div>
                              <div className="font-semibold text-foreground">{quote.moq}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Truck className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                            <div>
                              <div className="text-muted-foreground">交货期</div>
                              <div className="font-semibold text-foreground">{quote.deliveryDays} 天</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <CalendarClock className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                            <div>
                              <div className="text-muted-foreground">报价有效期</div>
                              <div className="font-semibold text-foreground">{quote.validDays} 天</div>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="bg-muted/30 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">报价说明</span>
                          </div>
                          <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                            {quote.message}
                          </p>
                        </div>

                        {/* Buyer info */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                            <User className="h-3 w-3 text-brand-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-medium text-foreground truncate">
                              {quote.inquiryBuyerName}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-[10px] py-0">
                            采购商
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium mb-1">
                {myQuotes.length === 0 ? "暂无报价记录" : "未找到匹配的报价"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {myQuotes.length === 0
                  ? "前往产品大厅的采购需求看板，向采购商提交报价"
                  : "尝试调整筛选条件或清除筛选"}
              </p>
              {myQuotes.length === 0 ? (
                <a href="/products">
                  <Button className="bg-brand-600 hover:bg-brand-700 gap-2">
                    <TrendingUp className="h-4 w-4" />
                    前往采购需求看板
                  </Button>
                </a>
              ) : (
                <Button variant="outline" onClick={resetFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  清除筛选
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Result count */}
        {filteredQuotes.length > 0 && (
          <div className="max-w-5xl mx-auto mt-4 text-center text-sm text-muted-foreground">
            共 <span className="font-bold text-brand-600">{filteredQuotes.length}</span> 条报价记录
            {filteredQuotes.length !== myQuotes.length && (
              <span className="ml-2">（总计 {myQuotes.length} 条）</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
