"use client";

import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supplierHotSearchTags } from "@/lib/data";

export function SupplierHero() {
  return (
    <section className="relative text-white py-16 md:py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/media/supplier-hero-bg.png')`,
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-brand-900/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            全球清真食品优质源头供应商
          </h1>
          <p className="text-brand-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            严选国内合规出口产能 · 全链路出海服务兜底 · 现场看样信任可及
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="搜索企业名称、主营品类、认证类型..."
                className="pl-10 h-12 bg-white text-foreground border-0 shadow-lg rounded-lg text-base"
              />
            </div>
            <Button className="h-12 px-6 bg-gold-500 hover:bg-gold-600 text-white font-semibold shadow-lg rounded-lg">
              <Search className="h-4 w-4 mr-2" />
              搜索供应商
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-brand-200">热门搜索：</span>
            {supplierHotSearchTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-brand-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
