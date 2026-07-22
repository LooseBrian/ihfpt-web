"use client";

import { SafeImage } from "@/components/shared/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/shared/ProductCard";
import Link from "next/link";
import type { ViewMode } from "./ProductSortBar";

interface ProductListRowProps {
  product: Product;
}

function ProductListRow({ product }: ProductListRowProps) {
  return (
    <Link href={`/product?id=${product.skuCode || product.id}`} className="block group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-brand-600 hover:bg-brand-700 text-white">
          {product.certType}
        </Badge>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-brand-700/90 px-4 py-2 rounded-lg flex items-center gap-1">
            查看详情
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
          {product.nameEn && (
            <p className="text-xs text-muted-foreground mb-2">{product.nameEn}</p>
          )}
          <p className="text-sm text-muted-foreground mb-3">规格：{product.spec}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.supplierQuals?.map((qual) => (
              <Badge
                key={qual}
                variant="outline"
                className="text-[10px] h-5 border-brand-200 text-brand-700 bg-brand-50"
              >
                {qual}
              </Badge>
            ))}
            {product.services?.map((svc) => (
              <Badge
                key={svc}
                variant="outline"
                className="text-[10px] h-5 border-gold-200 text-gold-700 bg-gold-50"
              >
                {svc}
              </Badge>
            ))}
            {product.exportRegions?.map((region) => (
              <Badge
                key={region}
                variant="outline"
                className="text-[10px] h-5"
              >
                {region}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">供应商：</span>
              <span className="font-medium">{product.supplier}</span>
            </div>
            <div>
              <span className="text-muted-foreground">产地：</span>
              <span className="font-medium">{product.origin}</span>
            </div>
            <div>
              <span className="text-muted-foreground">MOQ：</span>
              <span className="font-medium">{product.moq}</span>
            </div>
          </div>
        </div>

        <div className="sm:w-40 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">参考价</div>
            <div className="text-lg font-bold text-brand-700">
              {product.priceRange}
            </div>
          </div>
          <Button
            size="sm"
            className="bg-brand-600 hover:bg-brand-700 gap-1 w-full"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            立即询盘
          </Button>
        </div>
      </div>
    </Link>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, idx) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-8 min-w-[2rem] px-2.5 text-xs ${
              currentPage === page
                ? "bg-brand-600 hover:bg-brand-700 text-white"
                : ""
            }`}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ProductGrid({
  products,
  viewMode,
  currentPage,
  pageSize,
  onPageChange,
}: ProductGridProps) {
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageProducts = products.slice(start, end);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">未找到符合条件的产品</h3>
        <p className="text-sm text-muted-foreground">
          请尝试调整筛选条件或搜索关键词
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pageProducts.map((product) => (
            <ProductCard key={product.id} product={product} linkable />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pageProducts.map((product) => (
            <ProductListRow key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="pt-4">
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
