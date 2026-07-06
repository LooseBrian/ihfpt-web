"use client";

import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortOption =
  | "default"
  | "newest"
  | "inquiry"
  | "priceAsc"
  | "priceDesc";

export type PageSize = 20 | 40 | 60;

export type ViewMode = "grid" | "list";

interface ProductSortBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  pageSize: PageSize;
  onPageSizeChange: (size: PageSize) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  currentRange: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "综合排序" },
  { value: "newest", label: "新品优先" },
  { value: "inquiry", label: "询盘量高" },
  { value: "priceAsc", label: "价格升序" },
  { value: "priceDesc", label: "价格降序" },
];

export function ProductSortBar({
  sort,
  onSortChange,
  pageSize,
  onPageSizeChange,
  viewMode,
  onViewModeChange,
  resultCount,
  currentRange,
}: ProductSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border shadow-sm p-3">
      {/* Left: result info */}
      <div className="flex items-center gap-2 text-sm">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          显示 <span className="font-medium text-foreground">{currentRange}</span> 条，共{" "}
          <span className="font-medium text-brand-700">{resultCount}</span> 款
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort buttons */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {sortOptions.map((opt) => {
            const active = sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  active
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="w-px h-5 bg-border hidden sm:block" />

        {/* Page size selector */}
        <div className="flex items-center gap-1">
          {[20, 40, 60].map((size) => (
            <button
              key={size}
              onClick={() => onPageSizeChange(size as PageSize)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                pageSize === size
                  ? "bg-brand-600 text-white font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-border hidden sm:block" />

        {/* View mode toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-none ${
              viewMode === "grid"
                ? "bg-brand-50 text-brand-700"
                : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewModeChange("list")}
            className={`rounded-none ${
              viewMode === "list"
                ? "bg-brand-50 text-brand-700"
                : "text-muted-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
