"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { ProductLobbyHero } from "@/components/products/ProductLobbyHero";
import { InquiryBrowseSection } from "@/components/products/InquiryBrowseSection";
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
import { ActiveFilterChips } from "@/components/products/ActiveFilterChips";
import { ProductServicesSection } from "@/components/products/ProductServicesSection";
import { ProductStatsSection } from "@/components/products/ProductStatsSection";
import { CTASection } from "@/components/sections/CTASection";
import { categories, subcategories } from "@/lib/data";
import { useProducts } from "@/lib/product-context";

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
  const { getApprovedProducts, loading, refreshFromBackend } = useProducts();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>("default");
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Sync from backend when page loads (picks up admin-approved products)
  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  const approvedProducts = getApprovedProducts();

  const filteredProducts = useMemo(() => {
    let result = [...approvedProducts];

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
        // Sort by creation/update timestamp (newest first).
        // Previously used b.id.localeCompare(a.id) which sorted by string ID,
        // causing seed products (id="p1".."p24") to always appear before
        // backend products (id="PT3KQ7YBF9") due to lowercase > uppercase.
        result.sort((a, b) => {
          const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bTime - aTime;
        });
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
  }, [approvedProducts, filters, sort]);

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
        <InquiryBrowseSection />
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

                <ActiveFilterChips
                  filters={filters}
                  onChange={setFilters}
                  resultCount={filteredProducts.length}
                  totalCount={approvedProducts.length}
                />

                {loading ? (
                  <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-brand-600" />
                      <span>产品加载中...</span>
                    </div>
                  </div>
                ) : (
                  <ProductGrid
                    products={filteredProducts}
                    viewMode={viewMode}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <ProductServicesSection />
        <ProductStatsSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
