"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, ArrowRight } from "lucide-react";
import { hotSearchTags } from "@/lib/search";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative bg-brand-900 text-white overflow-hidden min-h-[calc(100vh-160px)] flex items-center">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/Hero/6月25日.mp4" type="video/mp4" />
      </video>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-brand-900/60" />

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-800/80 backdrop-blur-sm border border-brand-700 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-sm text-brand-100">
              中国食品药品企业质量安全促进会主办
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
            国际清真食品产业平台
          </h1>
          <p className="text-lg md:text-2xl text-brand-200 mb-2">
            International Halal Food Industrial Platform
          </p>
          <p className="text-xl md:text-3xl font-semibold text-gold-400 mb-2">
            中国特色产业链出海平台
          </p>
          <p className="text-base md:text-lg text-brand-300 mb-5 max-w-xl mx-auto">
            国家级、全球化、垂直型清真食品 B2B 贸易与产业服务平台
            <br className="hidden md:block" />
            链接中国优质清真食品产能与全球穆斯林消费市场
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-3">
            <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索产品名、供应商、认证类型..."
                  className="h-12 pl-11 border-0 focus-visible:ring-0 text-base text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-6 h-12 gap-2"
              >
                <Search className="h-5 w-5" />
                搜索
              </Button>
            </div>
          </form>

          {/* Hot search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="text-xs text-brand-300">热门搜索:</span>
            {hotSearchTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 text-xs bg-brand-800/60 hover:bg-brand-700 border border-brand-700/50 rounded-full text-brand-100 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-8 gap-2 cursor-pointer"
              onClick={() => router.push("/products")}
            >
              <Search className="h-5 w-5" />
              寻找产品
            </Button>
            <a href="/login?tab=supplier&mode=signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-brand-400 bg-transparent text-white hover:bg-brand-800 hover:text-white px-8 gap-2 w-full cursor-pointer"
              >
                <UserPlus className="h-5 w-5" />
                申请入驻
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-300">
            {["覆盖 28+ 国家", "首批 50+ 供应商", "6 大核心品类", "一站式服务"].map(
              (item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
