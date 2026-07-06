"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { ProductLobbyHero } from "@/components/products/ProductLobbyHero";
import { CategoryFloorNav } from "@/components/products/CategoryFloorNav";
import {
  ProductFilterSidebar,
  type ProductFilters,
} from "@/components/products/ProductFilterSidebar";
import {
  ProductSortBar,
  type SortOption,
  type PageSize,
  type ViewMode,
} from "@/components/products/ProductSortBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products, categories, subcategories } from "@/lib/data";

function parsePrice(priceRange: string): number {
  const match = priceRange.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

const initialFilters: ProductFilters = {
  certifications: [],
  categories: [],
  subcategories: [],
  exportRegions: [],
  moqRanges: [],
  supplierQuals: [],
  services: [],
  origins: [],
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>("default");
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Certification filter
    if (filters.certifications.length > 0) {
      result = result.filter((p) =>
        filters.certifications.includes(p.certType)
      );
    }

    // Category filter (map category id to category name)
    if (filters.categories.length > 0) {
      const allowedCategoryNames = categories
        .filter((c) => filters.categories.includes(c.id))
        .map((c) => c.name);
      result = result.filter((p) =>
        allowedCategoryNames.includes(p.category || "")
      );
    }

    // Subcategory filter (map subcategory id to subcategory name)
    if (filters.subcategories.length > 0) {
      const allowedSubNames = subcategories
        .filter((s) => filters.subcategories.includes(s.id))
        .map((s) => s.name);
      result = result.filter((p) =>
        allowedSubNames.includes(p.subcategory || "")
      );
    }

    // Export region filter
    if (filters.exportRegions.length > 0) {
      result = result.filter((p) =>
        p.exportRegions?.some((r) => filters.exportRegions.includes(r))
      );
    }

    // MOQ range filter
    if (filters.moqRanges.length > 0) {
      result = result.filter((p) =>
        p.moqRange ? filters.moqRanges.includes(p.moqRange) : false
      );
    }

    // Supplier qualifications filter
    if (filters.supplierQuals.length > 0) {
      result = result.filter((p) =>
        p.supplierQuals?.some((q) => filters.supplierQuals.includes(q))
      );
    }

    // Services filter
    if (filters.services.length > 0) {
      result = result.filter((p) =>
        p.services?.some((s) => filters.services.includes(s))
      );
    }

    // Origin filter
    if (filters.origins.length > 0) {
      result = result.filter((p) =>
        p.origin ? filters.origins.includes(p.origin) : false
      );
    }

    // Sorting
    switch (sort) {
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "inquiry":
        result.sort((a, b) => {
          const aScore = (a.isHot ? 2 : 0) + (a.isBestSeller ? 1 : 0);
          const bScore = (b.isHot ? 2 : 0) + (b.isBestSeller ? 1 : 0);
          return bScore - aScore;
        });
        break;
      case "priceAsc":
        result.sort(
          (a, b) => parsePrice(a.priceRange) - parsePrice(b.priceRange)
        );
        break;
      case "priceDesc":
        result.sort(
          (a, b) => parsePrice(b.priceRange) - parsePrice(a.priceRange)
        );
        break;
      default:
        // Default: hot/best seller first, then by id
        result.sort((a, b) => {
          const aScore = (a.isHot ? 2 : 0) + (a.isBestSeller ? 1 : 0);
          const bScore = (b.isHot ? 2 : 0) + (b.isBestSeller ? 1 : 0);
          if (bScore !== aScore) return bScore - aScore;
          return a.id.localeCompare(b.id);
        });
    }

    return result;
  }, [filters, sort]);

  // Reset to page 1 when filters or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredProducts.length);
  const currentRange =
    filteredProducts.length > 0 ? `${startIdx}-${endIdx}` : "0";

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <ProductLobbyHero />
        <CategoryFloorNav />

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left sidebar */}
              <ProductFilterSidebar
                filters={filters}
                onChange={setFilters}
                resultCount={filteredProducts.length}
              />

              {/* Right content */}
              <div className="flex-1 min-w-0 space-y-4">
                <ProductSortBar
                  sort={sort}
                  onSortChange={setSort}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  resultCount={filteredProducts.length}
                  currentRange={currentRange}
                />

                <ProductGrid
                  products={filteredProducts}
                  viewMode={viewMode}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
