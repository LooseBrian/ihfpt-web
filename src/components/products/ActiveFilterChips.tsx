"use client";

import { X, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  filterCertifications,
  filterExportRegions,
  filterMoqRanges,
  filterSupplierQuals,
  filterServices,
  filterOrigins,
  categories,
  subcategories,
} from "@/lib/data";
import type { ProductFilters } from "./ProductFilterSidebar";

interface ActiveFilterChipsProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  resultCount: number;
  totalCount: number;
}

/**
 * Returns a flat list of { key, id, label } for all currently active filters.
 * `key` is the filter category (e.g. "certifications") so we know which array
 * to remove the item from.
 */
function getActiveFilterEntries(filters: ProductFilters): {
  key: keyof ProductFilters;
  id: string;
  label: string;
}[] {
  const entries: { key: keyof ProductFilters; id: string; label: string }[] = [];

  const labelMaps: Record<
    keyof ProductFilters,
    { id: string; label: string }[]
  > = {
    certifications: filterCertifications,
    categories: categories.map((c) => ({ id: c.id, label: c.name })),
    subcategories: subcategories.map((s) => ({ id: s.id, label: s.name })),
    exportRegions: filterExportRegions,
    moqRanges: filterMoqRanges,
    supplierQuals: filterSupplierQuals,
    services: filterServices,
    origins: filterOrigins,
  };

  (Object.keys(filters) as (keyof ProductFilters)[]).forEach((key) => {
    const selected = filters[key];
    if (selected.length === 0) return;
    const map = labelMaps[key];
    selected.forEach((id) => {
      const match = map.find((m) => m.id === id);
      entries.push({ key, id, label: match?.label || id });
    });
  });

  return entries;
}

const emptyFilters: ProductFilters = {
  certifications: [],
  categories: [],
  subcategories: [],
  exportRegions: [],
  moqRanges: [],
  supplierQuals: [],
  services: [],
  origins: [],
};

export function ActiveFilterChips({
  filters,
  onChange,
  resultCount,
  totalCount,
}: ActiveFilterChipsProps) {
  const activeEntries = getActiveFilterEntries(filters);

  if (activeEntries.length === 0) {
    return null;
  }

  const removeFilter = (key: keyof ProductFilters, id: string) => {
    const current = filters[key];
    const next = current.filter((v) => v !== id);
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => {
    onChange({ ...emptyFilters });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl border shadow-sm p-3">
      {/* Active filter count */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1">
        <span className="font-medium text-foreground">
          {activeEntries.length}
        </span>
        项筛选
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border" />

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {activeEntries.map(({ key, id, label }) => (
          <span
            key={`${key}-${id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-sm text-brand-800 group"
          >
            <span className="max-w-[160px] truncate">{label}</span>
            <button
              onClick={() => removeFilter(key, id)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-brand-200 transition-colors"
              aria-label={`移除筛选: ${label}`}
            >
              <X className="h-3 w-3 text-brand-600" />
            </button>
          </span>
        ))}
      </div>

      {/* Result count */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        共 <span className="font-semibold text-brand-700">{resultCount}</span> /{" "}
        {totalCount} 款
      </div>

      {/* Clear all button */}
      <Button
        variant="outline"
        size="sm"
        onClick={clearAll}
        className="h-7 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
      >
        <FilterX className="h-3.5 w-3.5" />
        清除所有筛选
      </Button>
    </div>
  );
}
