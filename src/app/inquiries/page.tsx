"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  MapPin,
  Package,
  MessageSquare,
  X,
  ShoppingBag,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  seedPublicInquiries,
  filterDimensions,
  statusConfig,
  formatDate,
  filterInquiries,
  countActiveFilters,
  emptyFilters,
  type InquiryFilters,
  type PublicInquiry,
} from "@/lib/public-inquiries";

const PAGE_SIZE = 8; // Number of cards per load

export default function InquiriesPage() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<InquiryFilters>(emptyFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // Filter all inquiries
  const filteredInquiries = useMemo(
    () => filterInquiries(seedPublicInquiries, filters),
    [filters]
  );

  // Visible slice
  const visibleInquiries = filteredInquiries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredInquiries.length;

  const activeFilterCount = countActiveFilters(filters);

  const updateFilter = (key: keyof InquiryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  // Load more function
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate async loading
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoading(false);
    }, 600);
  }, [loading, hasMore]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleQuote = (inquiry: PublicInquiry) => {
    router.push(`/products?q=${encodeURIComponent(inquiry.productName)}`);
  };

  const resetFilters = () => setFilters(emptyFilters);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => router.push("/")} className="hover:text-brand-600">
              首页
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-600 font-medium">采购询盘</span>
          </div>

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              采购询盘大厅
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              浏览全球买家实时发布的采购需求，快速对接精准订单
            </p>
          </div>

          {/* Conditional filter bar (条件筛选) */}
          <div className="bg-white rounded-xl border p-4 mb-6 space-y-3 sticky top-20 z-30 shadow-sm">
            {/* Search row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="搜索产品名、采购商、需求描述..."
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                共 <span className="font-bold text-brand-600">{filteredInquiries.length}</span> 条询盘
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 shrink-0"
                >
                  <X className="h-3 w-3" />
                  清除 ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Filter dimension rows */}
            <FilterRow label="品类" options={filterDimensions.category.options} activeValue={filters.category} onSelect={(v) => updateFilter("category", v)} />
            <FilterRow label="市场" options={filterDimensions.targetMarket.options} activeValue={filters.targetMarket} onSelect={(v) => updateFilter("targetMarket", v)} />
            <FilterRow label="认证" options={filterDimensions.certRequired.options} activeValue={filters.certRequired} onSelect={(v) => updateFilter("certRequired", v)} />
            <FilterRow
              label="状态"
              options={filterDimensions.status.options.map((s) => ({ value: s.value, label: s.label }))}
              activeValue={filters.status}
              onSelect={(v) => updateFilter("status", v)}
            />
          </div>

          {/* Vertical inquiry cards list */}
          {visibleInquiries.length > 0 ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {visibleInquiries.map((inquiry) => (
                <VerticalInquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  onQuote={() => handleQuote(inquiry)}
                />
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                  <span className="ml-2 text-sm text-muted-foreground">加载更多询盘...</span>
                </div>
              )}

              {/* Sentinel for infinite scroll */}
              {hasMore && !loading && <div ref={sentinelRef} className="h-4" />}

              {/* All loaded message */}
              {!hasMore && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                    更多询盘持续更新中
                  </div>
                </div>
              )}

              {/* Load more button (manual fallback) */}
              {hasMore && !loading && (
                <div className="flex justify-center py-4">
                  <Button variant="outline" onClick={loadMore} className="gap-2">
                    加载更多
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">未找到匹配的询盘</h3>
              <p className="text-sm text-muted-foreground mb-4">尝试调整筛选条件或清除筛选</p>
              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <X className="h-4 w-4" />
                清除筛选
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

// ===== Vertical Inquiry Card =====

function VerticalInquiryCard({
  inquiry,
  onQuote,
}: {
  inquiry: PublicInquiry;
  onQuote: () => void;
}) {
  const status = statusConfig[inquiry.status];

  return (
    <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all group">
      <div className="flex flex-col sm:flex-row">
        {/* Image - left side on desktop */}
        <div className="relative sm:w-48 shrink-0 overflow-hidden" style={{ height: "160px" }}>
          <img
            src={inquiry.productImage}
            alt={inquiry.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-medium ${status.color} bg-white/90`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            {inquiry.quotesCount} 人报价
          </div>
        </div>

        {/* Content - right side */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Top: product name + spec */}
          <div className="mb-2">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base text-foreground line-clamp-1">
                {inquiry.productName}
              </h3>
              {inquiry.budget && (
                <span className="font-bold text-brand-600 text-sm shrink-0">
                  {inquiry.budget}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{inquiry.productSpec}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              {inquiry.quantity} {inquiry.unit}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {inquiry.targetMarket}
            </Badge>
            {inquiry.certRequired && (
              <Badge className="text-xs bg-brand-50 text-brand-700">
                {inquiry.certRequired}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {inquiry.category}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {inquiry.description}
          </p>

          {/* Bottom: buyer info + quote button */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-brand-600">
                  {inquiry.buyerName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{inquiry.buyerName}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {inquiry.buyerCountry} · {inquiry.buyerLevel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(inquiry.createdAt)}
              </span>
              <Button
                onClick={onQuote}
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white gap-1"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {inquiry.status === "quoted" ? "继续报价" : "立即报价"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Filter Row component =====

function FilterRow({
  label,
  options,
  activeValue,
  onSelect,
}: {
  label: string;
  options: readonly string[] | readonly { value: string; label: string }[];
  activeValue: string;
  onSelect: (value: string) => void;
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">{label}</span>
      <div className="flex flex-wrap gap-1">
        {normalizedOptions.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={activeValue === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer shrink-0 ${
        active
          ? "bg-brand-600 text-white border-brand-600 font-medium"
          : "bg-white text-muted-foreground border-border hover:border-brand-300 hover:text-brand-600"
      }`}
    >
      {label}
    </button>
  );
}
