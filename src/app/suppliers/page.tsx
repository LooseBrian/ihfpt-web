"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { SupplierHero } from "@/components/suppliers/SupplierHero";
import { SupplierValueProps } from "@/components/suppliers/SupplierValueProps";
import { SupplierCategoryNav } from "@/components/suppliers/SupplierCategoryNav";
import { StrategicSuppliers } from "@/components/suppliers/StrategicSuppliers";
import {
  SupplierFilterSidebar,
  type SupplierFilters,
} from "@/components/suppliers/SupplierFilterSidebar";
import {
  SupplierSortBar,
  type SupplierViewMode,
} from "@/components/suppliers/SupplierSortBar";
import { SupplierGrid } from "@/components/suppliers/SupplierGrid";
import { IndustryBeltSection } from "@/components/suppliers/IndustryBeltSection";
import { NewSuppliersSection } from "@/components/suppliers/NewSuppliersSection";
import { SupplierServicesSection } from "@/components/suppliers/SupplierServicesSection";
import { SupplierStatsSection } from "@/components/suppliers/SupplierStatsSection";
import { CTASection } from "@/components/sections/CTASection";
import {
  suppliers,
  categories,
  subcategories,
  type SupplierSortOption,
  type SupplierPageSize,
} from "@/lib/data";

const initialFilters: SupplierFilters = {
  certifications: [],
  categories: [],
  subcategories: [],
  exportRegions: [],
  businessTypes: [],
  qualifications: [],
  services: [],
  origins: [],
};

function tierScore(tier: string): number {
  return tier === "S" ? 3 : tier === "A" ? 2 : 1;
}

export default function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierFilters>(initialFilters);
  const [sort, setSort] = useState<SupplierSortOption>("default");
  const [pageSize, setPageSize] = useState<SupplierPageSize>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<SupplierViewMode>("list");

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];

    if (filters.certifications.length > 0) {
      result = result.filter((s) =>
        s.certs.some((c) => filters.certifications.includes(c))
      );
    }

    if (filters.categories.length > 0) {
      const allowedNames = categories
        .filter((c) => filters.categories.includes(c.id))
        .map((c) => c.name);
      result = result.filter((s) =>
        s.categories.some((c) => allowedNames.includes(c))
      );
    }

    if (filters.subcategories.length > 0) {
      const allowedNames = subcategories
        .filter((s) => filters.subcategories.includes(s.id))
        .map((s) => s.name);
      result = result.filter((s) => {
        // match against categories for simplicity since suppliers don't have subcategory field
        return true;
      });
    }

    if (filters.exportRegions.length > 0) {
      result = result.filter((s) =>
        s.exportRegions?.some((r) => filters.exportRegions.includes(r))
      );
    }

    if (filters.businessTypes.length > 0) {
      result = result.filter((s) =>
        s.businessType ? filters.businessTypes.includes(s.businessType) : false
      );
    }

    if (filters.qualifications.length > 0) {
      result = result.filter((s) =>
        s.qualifications?.some((q) => filters.qualifications.includes(q))
      );
    }

    if (filters.services.length > 0) {
      result = result.filter((s) =>
        s.services?.some((svc) => filters.services.includes(svc))
      );
    }

    if (filters.origins.length > 0) {
      result = result.filter((s) =>
        s.location ? filters.origins.includes(s.location) : false
      );
    }

    switch (sort) {
      case "tier":
        result.sort((a, b) => tierScore(b.tier) - tierScore(a.tier));
        break;
      case "newest":
        result.sort((a, b) => (b.foundedYear || 0) - (a.foundedYear || 0));
        break;
      case "inquiry":
        result.sort(
          (a, b) =>
            tierScore(b.tier) - tierScore(a.tier) ||
            (b.exportCountries || 0) - (a.exportCountries || 0)
        );
        break;
      case "export":
        result.sort((a, b) => {
          const aVal = parseFloat(a.exportVolume.replace(/[^\d.]/g, "")) || 0;
          const bVal = parseFloat(b.exportVolume.replace(/[^\d.]/g, "")) || 0;
          return bVal - aVal;
        });
        break;
      default:
        result.sort(
          (a, b) =>
            tierScore(b.tier) - tierScore(a.tier) ||
            a.name.localeCompare(b.name)
        );
    }

    return result;
  }, [filters, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredSuppliers.length);
  const currentRange =
    filteredSuppliers.length > 0 ? `${startIdx}-${endIdx}` : "0";

  // Handler for SupplierCategoryNav card clicks
  const handleCategorySelect = (tabId: string, optionId: string) => {
    const newFilters: SupplierFilters = { ...initialFilters };
    switch (tabId) {
      case "category":
        newFilters.categories = [optionId];
        break;
      case "cert":
        newFilters.certifications = [optionId];
        break;
      case "type":
        newFilters.businessTypes = [optionId];
        break;
      case "belt":
        // Map belt id to origin (location)
        newFilters.origins = [optionId];
        break;
      default:
        return;
    }
    setFilters(newFilters);
    // Scroll to supplier list smoothly after state update
    setTimeout(() => {
      const listSection = document.getElementById("supplier-list");
      if (listSection) {
        listSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <SupplierHero />
        <SupplierValueProps />
        <SupplierCategoryNav onSelect={handleCategorySelect} />
        <StrategicSuppliers />

        <section id="supplier-list" className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <SupplierFilterSidebar
                filters={filters}
                onChange={setFilters}
                resultCount={filteredSuppliers.length}
              />

              <div className="flex-1 min-w-0 space-y-4">
                <SupplierSortBar
                  sort={sort}
                  onSortChange={setSort}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  resultCount={filteredSuppliers.length}
                  currentRange={currentRange}
                />

                <SupplierGrid
                  suppliers={filteredSuppliers}
                  viewMode={viewMode}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </section>

        <IndustryBeltSection />
        <NewSuppliersSection />
        <SupplierServicesSection />
        <SupplierStatsSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
