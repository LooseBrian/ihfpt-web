"use client";

import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supplierSortOptions, supplierPageSize } from "@/lib/data";
import type { SupplierSortOption, SupplierPageSize } from "@/lib/data";

export type SupplierViewMode = "grid" | "list";

interface SupplierSortBarProps {
  sort: SupplierSortOption;
  onSortChange: (sort: SupplierSortOption) => void;
  pageSize: SupplierPageSize;
  onPageSizeChange: (size: SupplierPageSize) => void;
  viewMode: SupplierViewMode;
  onViewModeChange: (mode: SupplierViewMode) => void;
  resultCount: number;
  currentRange: string;
}

export function SupplierSortBar({
  sort,
  onSortChange,
  pageSize,
  onPageSizeChange,
  viewMode,
  onViewModeChange,
  resultCount,
  currentRange,
}: SupplierSortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border shadow-sm p-3">
      <div className="flex items-center gap-2 text-sm">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          显示 <span className="font-medium text-foreground">{currentRange}</span> 条，共{" "}
          <span className="font-medium text-brand-700">{resultCount}</span> 家
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {supplierSortOptions.map((opt) => {
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

        <div className="flex items-center gap-1">
          {supplierPageSize.map((size) => (
            <button
              key={size}
              onClick={() => onPageSizeChange(size)}
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
