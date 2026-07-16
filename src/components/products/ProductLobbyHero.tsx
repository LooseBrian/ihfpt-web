"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hotSearchTags } from "@/lib/search";

export function ProductLobbyHero() {
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

  const handleInquiry = () => {
    router.push("/buyer#demands");
  };

  return (
    <section className="relative text-white py-16 md:py-24 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/media/product-hero-bg.png')`,
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-brand-900/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            全球清真食品一站式采购平台
          </h1>
          <p className="text-brand-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            严选国内合规产能 · 全链路出海服务兜底 · 直通东盟中东亿万市场
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索产品名、供应商、认证类型..."
                className="pl-10 h-12 bg-white text-foreground border-0 shadow-lg rounded-lg text-base"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 bg-gold-500 hover:bg-gold-600 text-white font-semibold shadow-lg rounded-lg"
            >
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button
              type="button"
              onClick={handleInquiry}
              className="h-12 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg rounded-lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              发布采购询盘
            </Button>
          </form>

          {/* Hot search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-brand-200">热门搜索：</span>
            {hotSearchTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-brand-50 transition-colors cursor-pointer"
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
