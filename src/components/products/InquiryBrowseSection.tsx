"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  MessageSquare,
  TrendingUp,
  X,
  ShoppingBag,
} from "lucide-react";
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
} from "@/lib/public-inquiries";

// ===== Constants for consistent card sizing =====

const CARD_WIDTH = 300;
const CARD_IMAGE_HEIGHT = 120;
const CARD_TOTAL_HEIGHT = 380;

// ===== Main Component =====

export function InquiryBrowseSection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<InquiryFilters>(emptyFilters);

  const filteredInquiries = useMemo(
    () => filterInquiries(seedPublicInquiries, filters),
    [filters]
  );

  const activeFilterCount = countActiveFilters(filters);

  const updateFilter = (key: keyof InquiryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = CARD_WIDTH + 16;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleQuote = (productName: string) => {
    router.push(`/products?q=${encodeURIComponent(productName)}`);
  };

  const resetFilters = () => setFilters(emptyFilters);

  return (
    <section className="py-8 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              最新采购询盘
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              浏览全球买家实时发布的采购需求，快速对接精准订单
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              共 <span className="font-bold text-brand-600">{filteredInquiries.length}</span> 条询盘
            </span>
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-brand-50 hover:border-brand-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-brand-50 hover:border-brand-300 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Conditional filter bar (条件筛选) - always visible */}
        <div className="bg-white rounded-xl border p-3 mb-4 space-y-2">
          {/* Search row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="搜索产品名、采购商、需求描述..."
                className="pl-9 h-8 text-sm"
              />
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 shrink-0"
              >
                <X className="h-3 w-3" />
                清除筛选 ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Filter dimension rows */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">品类</span>
            <div className="flex flex-wrap gap-1">
              {filterDimensions.category.options.map((opt) => (
                <FilterPill
                  key={opt}
                  label={opt}
                  active={filters.category === opt}
                  onClick={() => updateFilter("category", opt)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">市场</span>
            <div className="flex flex-wrap gap-1">
              {filterDimensions.targetMarket.options.map((opt) => (
                <FilterPill
                  key={opt}
                  label={opt}
                  active={filters.targetMarket === opt}
                  onClick={() => updateFilter("targetMarket", opt)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">认证</span>
            <div className="flex flex-wrap gap-1">
              {filterDimensions.certRequired.options.map((opt) => (
                <FilterPill
                  key={opt}
                  label={opt}
                  active={filters.certRequired === opt}
                  onClick={() => updateFilter("certRequired", opt)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">状态</span>
            <div className="flex flex-wrap gap-1">
              {filterDimensions.status.options.map((opt) => (
                <FilterPill
                  key={opt.value}
                  label={opt.label}
                  active={filters.status === opt.value}
                  onClick={() => updateFilter("status", opt.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal scrollable inquiry cards */}
        {filteredInquiries.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}
          >
            {/* Stats summary card */}
            <div
              className="snap-start shrink-0 bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-4 text-white flex flex-col"
              style={{ width: `${CARD_WIDTH}px`, height: `${CARD_TOTAL_HEIGHT}px` }}
            >
              <div className="flex-1 flex flex-col justify-center">
                <TrendingUp className="h-7 w-7 text-gold-400 mb-2" />
                <h3 className="text-base font-bold mb-1.5 line-clamp-1">实时采购需求</h3>
                <p className="text-xs text-brand-200 line-clamp-2 leading-relaxed">
                  全球采购商正在寻找清真食品供应商，立即报价获取订单
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
                <div>
                  <div className="text-xl font-bold text-gold-400">{filteredInquiries.length}</div>
                  <div className="text-[10px] text-brand-200">活跃询盘</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gold-400">
                    {filteredInquiries.reduce((sum, i) => sum + i.quotesCount, 0)}
                  </div>
                  <div className="text-[10px] text-brand-200">已报价数</div>
                </div>
              </div>
            </div>

            {/* Inquiry cards */}
            {filteredInquiries.map((inquiry) => {
              const status = statusConfig[inquiry.status];
              return (
                <div
                  key={inquiry.id}
                  className="snap-start shrink-0 bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all group flex flex-col"
                  style={{ width: `${CARD_WIDTH}px`, height: `${CARD_TOTAL_HEIGHT}px` }}
                >
                  <div className="relative shrink-0 overflow-hidden" style={{ height: `${CARD_IMAGE_HEIGHT}px` }}>
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

                  <div className="p-3 flex flex-col flex-1 min-h-0">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">
                      {inquiry.productName}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{inquiry.productSpec}</p>

                    <div className="flex items-center gap-1 mb-2 min-h-[20px]">
                      <Badge variant="secondary" className="text-[10px] py-0 shrink-0">
                        <Package className="h-2.5 w-2.5 mr-0.5" />
                        {inquiry.quantity} {inquiry.unit}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0 shrink-0">
                        <MapPin className="h-2.5 w-2.5 mr-0.5" />
                        {inquiry.targetMarket}
                      </Badge>
                      {inquiry.certRequired && (
                        <Badge className="text-[10px] py-0 bg-brand-50 text-brand-700 shrink-0">
                          {inquiry.certRequired}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed" style={{ minHeight: "32px" }}>
                      {inquiry.description}
                    </p>

                    <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b" style={{ minHeight: "20px" }}>
                      <span className="text-muted-foreground">采购预算</span>
                      <span className="font-bold text-brand-600">{inquiry.budget || "面议"}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2" style={{ minHeight: "28px" }}>
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand-600">
                          {inquiry.buyerName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{inquiry.buyerName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{inquiry.buyerCountry} · {inquiry.buyerLevel}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 shrink-0">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleQuote(inquiry.productName)}
                      className="w-full h-8 text-xs bg-brand-600 hover:bg-brand-700 text-white gap-1 mt-auto"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {inquiry.status === "quoted" ? "继续报价" : "立即报价"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-1">未找到匹配的询盘</h3>
            <p className="text-sm text-muted-foreground mb-4">尝试调整筛选条件或清除筛选</p>
            <Button variant="outline" onClick={resetFilters} className="gap-1">
              <X className="h-4 w-4" />
              清除筛选
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// ===== Filter Pill component (条件筛选标签) =====

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
