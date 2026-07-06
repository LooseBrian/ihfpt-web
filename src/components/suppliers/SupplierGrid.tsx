"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Store,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Supplier } from "@/lib/data";
import type { SupplierViewMode } from "./SupplierSortBar";

function TierBadge({ tier }: { tier: string }) {
  const styles = {
    S: "bg-gold-500 text-brand-900 font-bold",
    A: "bg-brand-600 text-white",
    认证: "bg-muted text-muted-foreground",
  };
  return (
    <Badge className={`${styles[tier as keyof typeof styles] || styles.认证} text-xs`}>
      {tier === "S" ? "S 级战略" : tier === "A" ? "A 级核心" : "认证入驻"}
    </Badge>
  );
}

function SupplierListCard({ supplier }: { supplier: Supplier }) {
  return (
    <div className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-52 shrink-0 p-5 flex flex-col items-center justify-center gap-3 border-b sm:border-b-0 sm:border-r bg-muted/20">
        <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center">
          <span className="text-brand-700 font-bold text-xl">{supplier.logo}</span>
        </div>
        <div className="text-center">
          <TierBadge tier={supplier.tier} />
          {supplier.isNew && (
            <Badge className="ml-1 bg-blue-500 text-white text-[10px]">新入驻</Badge>
          )}
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{supplier.name}</h3>
            {supplier.isTangyuanhui && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 border-brand-200 text-brand-700 bg-brand-50"
              >
                棠源汇可看样
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {supplier.location}
            </span>
            {supplier.foundedYear && (
              <span>成立于 {supplier.foundedYear} 年</span>
            )}
            {supplier.employeeCount && (
              <span>{supplier.employeeCount} 员工</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {supplier.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {supplier.categories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-[10px] bg-brand-50 text-brand-700"
              >
                {cat}
              </Badge>
            ))}
            {supplier.certs.map((cert) => (
              <Badge
                key={cert}
                variant="outline"
                className="text-[10px] border-gold-200 text-gold-700"
              >
                {cert}
              </Badge>
            ))}
          </div>

          {supplier.productImages && supplier.productImages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">主营产品：</span>
              <div className="flex gap-1.5">
                {supplier.productImages.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-10 h-10 rounded-md overflow-hidden bg-muted"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sm:w-40 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">年出口额</div>
            <div className="text-lg font-bold text-brand-700">{supplier.exportVolume}</div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Button size="sm" variant="outline" className="w-full gap-1">
              <Store className="h-3.5 w-3.5" />
              查看商铺
            </Button>
            <Button size="sm" className="w-full bg-brand-600 hover:bg-brand-700 gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              立即询盘
            </Button>
            {supplier.isTangyuanhui && (
              <Button size="sm" variant="outline" className="w-full gap-1 border-brand-300 text-brand-700">
                <Calendar className="h-3.5 w-3.5" />
                预约看样
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
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

interface SupplierGridProps {
  suppliers: Supplier[];
  viewMode: SupplierViewMode;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SupplierGrid({
  suppliers,
  viewMode,
  currentPage,
  pageSize,
  onPageChange,
}: SupplierGridProps) {
  const totalPages = Math.max(1, Math.ceil(suppliers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageSuppliers = suppliers.slice(start, end);

  if (suppliers.length === 0) {
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
        <h3 className="text-lg font-semibold text-foreground mb-1">未找到符合条件的企业</h3>
        <p className="text-sm text-muted-foreground">请尝试调整筛选条件或搜索关键词</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pageSuppliers.map((supplier) => (
            <SupplierListCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pageSuppliers.map((supplier) => (
            <SupplierListCard key={supplier.id} supplier={supplier} />
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
