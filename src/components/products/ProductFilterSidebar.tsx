"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from "lucide-react";
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

interface FilterSectionProps {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground hover:text-brand-700 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 space-y-2">
          {options.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <label
                key={option.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded border transition-all ${
                    isSelected
                      ? "bg-brand-600 border-brand-600"
                      : "border-border group-hover:border-brand-400"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => onToggle(option.id)}
                />
                <span
                  className={`text-sm transition-colors ${
                    isSelected
                      ? "text-brand-700 font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface ProductFilters {
  certifications: string[];
  categories: string[];
  subcategories: string[];
  exportRegions: string[];
  moqRanges: string[];
  supplierQuals: string[];
  services: string[];
  origins: string[];
}

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  resultCount: number;
}

export function ProductFilterSidebar({
  filters,
  onChange,
  resultCount,
}: ProductFilterSidebarProps) {
  const totalActive = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const updateFilter = (key: keyof ProductFilters, id: string) => {
    const current = filters[key];
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => {
    onChange({
      certifications: [],
      categories: [],
      subcategories: [],
      exportRegions: [],
      moqRanges: [],
      supplierQuals: [],
      services: [],
      origins: [],
    });
  };

  const categoryOptions = categories.map((c) => ({ id: c.id, label: c.name }));
  const subcategoryOptions = filters.categories.length
    ? subcategories
        .filter((s) => filters.categories.includes(s.categoryId))
        .map((s) => ({ id: s.id, label: s.name }))
    : subcategories.map((s) => ({ id: s.id, label: s.name }));

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
            <h3 className="font-semibold text-foreground">筛选条件</h3>
            {totalActive > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-medium">
                {totalActive}
              </span>
            )}
          </div>
          {totalActive > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="h-7 text-xs gap-1 px-2 border-brand-200 text-brand-700 hover:bg-brand-50"
            >
              <RotateCcw className="h-3 w-3" />
              清除全部
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          共找到 <span className="font-semibold text-brand-700">{resultCount}</span> 款产品
        </div>

        {/* Filter sections */}
        <FilterSection
          title="清真认证类型"
          options={filterCertifications}
          selected={filters.certifications}
          onToggle={(id) => updateFilter("certifications", id)}
        />
        <FilterSection
          title="产品品类"
          options={categoryOptions}
          selected={filters.categories}
          onToggle={(id) => updateFilter("categories", id)}
        />
        {subcategoryOptions.length > 0 && (
          <FilterSection
            title="细分品类"
            options={subcategoryOptions}
            selected={filters.subcategories}
            onToggle={(id) => updateFilter("subcategories", id)}
            defaultOpen={filters.categories.length > 0}
          />
        )}
        <FilterSection
          title="可出口地区"
          options={filterExportRegions}
          selected={filters.exportRegions}
          onToggle={(id) => updateFilter("exportRegions", id)}
        />
        <FilterSection
          title="起订量（MOQ）"
          options={filterMoqRanges}
          selected={filters.moqRanges}
          onToggle={(id) => updateFilter("moqRanges", id)}
        />
        <FilterSection
          title="供应商资质"
          options={filterSupplierQuals}
          selected={filters.supplierQuals}
          onToggle={(id) => updateFilter("supplierQuals", id)}
        />
        <FilterSection
          title="服务能力"
          options={filterServices}
          selected={filters.services}
          onToggle={(id) => updateFilter("services", id)}
        />
        <FilterSection
          title="产地省份"
          options={filterOrigins}
          selected={filters.origins}
          onToggle={(id) => updateFilter("origins", id)}
          defaultOpen={false}
        />
      </div>
    </aside>
  );
}
