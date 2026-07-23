"use client";

import { useState } from "react";
import { SafeImage } from "@/components/shared/SafeImage";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Store,
  ShieldCheck,
  Globe,
  Truck,
  Factory,
  MapPin,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Minus,
  Plus,
  FileText,
  ArrowLeft,
} from "lucide-react";
import type { Product } from "@/lib/data";
import { products } from "@/lib/data";
import { InquiryDialog } from "@/components/inquiry/InquiryDialog";
import { ProductGallery } from "@/components/product/ProductGallery";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // 相关产品（同供应商其他产品）
  const relatedProducts = products
    .filter(
      (p) =>
        (p.supplier === product.supplier || p.supplier === "惠发食品") &&
        p.id !== product.id
    )
    .slice(0, 4);

  const moqNumber = parseInt(product.moq.replace(/[^0-9]/g, "")) || 1;

  return (
    <div className="bg-muted/20">
      {/* ===== Breadcrumb ===== */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-600">首页</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/#products" className="hover:text-brand-600">精选产品</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ===== Product Main ===== */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Gallery (images + videos) */}
          <div className="space-y-4">
            <ProductGallery
              images={product.images?.length ? product.images : [product.image]}
              videos={product.videos}
              productName={product.name}
              isHot={product.isHot}
              isBestSeller={product.isBestSeller}
            />
            {/* Cert badge row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-brand-300 text-brand-700 gap-1">
                <ShieldCheck className="h-3 w-3" />
                {product.certType} 认证
              </Badge>
              {product.supplierQuals?.map((q) => (
                <Badge key={q} variant="secondary" className="text-xs">
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-5">
            <div>
              {/* SKU code — ASIN-like identifier, displayed prominently */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                  SKU: {product.skuCode || product.id}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              {product.nameEn && (
                <p className="text-sm text-muted-foreground">{product.nameEn}</p>
              )}
            </div>

            {/* Price bar */}
            <div className="bg-gradient-to-r from-brand-50 to-gold-50 rounded-xl p-5 border border-brand-100">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-sm text-muted-foreground">参考价格</span>
              </div>
              <div className="text-3xl font-bold text-brand-700">
                {product.priceRange}
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  起订量：{product.moq}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  {product.moqRange || "1-5吨"}
                </span>
              </div>
            </div>

            {/* Spec table */}
            <div className="bg-white rounded-xl border p-5 space-y-3">
              <h3 className="font-bold text-foreground mb-3">产品参数</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">规格</span>
                  <p className="font-medium text-foreground mt-0.5">{product.spec}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">品类</span>
                  <p className="font-medium text-foreground mt-0.5">{product.category || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">细分品类</span>
                  <p className="font-medium text-foreground mt-0.5">{product.subcategory || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">产地</span>
                  <p className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.origin || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">认证类型</span>
                  <p className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-brand-500" />
                    {product.certType}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">供应商</span>
                  <p className="font-medium text-foreground mt-0.5">{product.supplier}</p>
                </div>
              </div>
            </div>

            {/* Export regions */}
            {product.exportRegions && product.exportRegions.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-600" />
                  可出口地区
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.exportRegions.map((region) => (
                    <Badge key={region} variant="secondary" className="bg-brand-50 text-brand-700">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {product.services && product.services.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  服务能力
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.services.map((service) => (
                    <div key={service} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-foreground mb-3">采购数量</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold text-foreground min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  最少 {product.moq}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-brand-600 hover:bg-brand-700 gap-2"
                onClick={() => setInquiryOpen(true)}
              >
                <MessageSquare className="h-5 w-5" />
                立即询价
              </Button>
              <Link href={product.supplierCode ? `/store/${product.supplierCode}` : "/store/huifa"} className="flex-1">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <Store className="h-5 w-5" />
                  进入店铺
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Product Description ===== */}
        <div className="mt-10 bg-white rounded-2xl border p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-600" />
            产品详情
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {product.name}由{product.supplier}生产，规格为{product.spec}，
              已通过{product.certType}清真认证，符合国际清真食品标准。
            </p>
            <p>
              产品起订量为{product.moq}，价格区间{product.priceRange}，
              支持出口至{product.exportRegions?.join("、") || "全球"}等地区。
              产地位于{product.origin}，具备完善的出口资质和供应链能力。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-brand-50 rounded-xl p-4">
                <Factory className="h-6 w-6 text-brand-600 mb-2" />
                <h4 className="font-semibold text-foreground text-sm">源头工厂</h4>
                <p className="text-xs mt-1">自有生产线，品质全程可控</p>
              </div>
              <div className="bg-gold-50 rounded-xl p-4">
                <ShieldCheck className="h-6 w-6 text-gold-600 mb-2" />
                <h4 className="font-semibold text-foreground text-sm">清真认证</h4>
                <p className="text-xs mt-1">{product.certType}认证，合规出口</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <Truck className="h-6 w-6 text-emerald-600 mb-2" />
                <h4 className="font-semibold text-foreground text-sm">一站式交付</h4>
                <p className="text-xs mt-1">报关、冷链、清关全程代办</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Related Products ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              同店产品推荐
              <Link href={product.supplierCode ? `/store/${product.supplierCode}` : "/store/huifa"} className="text-sm font-normal text-brand-600 hover:underline">
                查看全部 →
              </Link>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/product?id=${rp.skuCode || rp.id}`}>
                  <div className="bg-white rounded-xl border p-3 hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      <SafeImage
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-foreground line-clamp-1">{rp.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{rp.spec}</p>
                    <p className="text-sm font-bold text-brand-700 mt-1">{rp.priceRange}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link href="/#products">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回产品列表
            </Button>
          </Link>
        </div>
      </div>

      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        product={product}
      />
    </div>
  );
}
