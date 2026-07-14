"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/data";
import { InquiryDialog } from "@/components/inquiry/InquiryDialog";

interface ProductCardProps {
  product: Product;
  linkable?: boolean;
}

export function ProductCard({ product, linkable = false }: ProductCardProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const handleInquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInquiryOpen(true);
  };

  const dialog = (
    <InquiryDialog
      open={inquiryOpen}
      onClose={() => setInquiryOpen(false)}
      product={product}
    />
  );

  const cardContent = (
    <div className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-brand-600 hover:bg-brand-700 text-white">
          {product.certType}
        </Badge>
        {linkable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-brand-700/90 px-4 py-2 rounded-lg flex items-center gap-1">
              查看详情
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{product.spec}</p>

        <div className="space-y-1.5 mb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">MOQ</span>
            <span className="font-medium">{product.moq}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">价格</span>
            <span className="font-medium text-brand-700">{product.priceRange}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">供应商</span>
            <span className="font-medium truncate max-w-[120px]">{product.supplier}</span>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full mt-auto bg-brand-600 hover:bg-brand-700 gap-1"
          onClick={handleInquiryClick}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          立即询价
        </Button>
      </div>
    </div>
  );

  if (linkable) {
    return (
      <>
        <Link href={`/product/${product.id}`} className="block h-full">
          {cardContent}
        </Link>
        {dialog}
      </>
    );
  }

  return (
    <>
      {cardContent}
      {dialog}
    </>
  );
}
