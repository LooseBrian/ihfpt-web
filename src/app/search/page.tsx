"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  Store,
  Newspaper,
  ChevronRight,
  Loader2,
  ArrowLeft,
  TrendingUp,
  X,
  History,
} from "lucide-react";
import { searchAll, hotSearchTags, type SearchResult } from "@/lib/search";
import { useSearch } from "@/lib/search";

type TabId = "all" | "product" | "supplier" | "news";

const tabs: { id: TabId; label: string; icon: typeof Package }[] = [
  { id: "all", label: "全部", icon: Search },
  { id: "product", label: "产品", icon: Package },
  { id: "supplier", label: "供应商", icon: Store },
  { id: "news", label: "资讯", icon: Newspaper },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [searchResults, setSearchResults] = useState<{
    products: SearchResult[];
    suppliers: SearchResult[];
    news: SearchResult[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ihf_search_history");
      if (stored) setSearchHistory(JSON.parse(stored));
    } catch {}
  }, []);

  // Perform search
  const doSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSearchResults(searchAll(trimmed));
      setLoading(false);
      // Save to history
      try {
        const stored = localStorage.getItem("ihf_search_history");
        const prev: string[] = stored ? JSON.parse(stored) : [];
        const updated = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, 8);
        localStorage.setItem("ihf_search_history", JSON.stringify(updated));
        setSearchHistory(updated);
      } catch {}
    }, 150);
  };

  // Search on mount and when query param changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      doSearch(trimmed);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    doSearch(tag);
  };

  const handleHistoryClick = (h: string) => {
    setQuery(h);
    router.push(`/search?q=${encodeURIComponent(h)}`);
    doSearch(h);
  };

  const clearHistory = () => {
    localStorage.removeItem("ihf_search_history");
    setSearchHistory([]);
  };

  const allResults = searchResults
    ? [...searchResults.products, ...searchResults.suppliers, ...searchResults.news]
    : [];

  const filteredResults = activeTab === "all"
    ? allResults
    : activeTab === "product"
    ? searchResults?.products || []
    : activeTab === "supplier"
    ? searchResults?.suppliers || []
    : searchResults?.news || [];

  const tabCounts = {
    all: allResults.length,
    product: searchResults?.products.length || 0,
    supplier: searchResults?.suppliers.length || 0,
    news: searchResults?.news.length || 0,
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => router.push("/")} className="hover:text-brand-600">
              首页
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-600 font-medium">搜索结果</span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索产品名、供应商、认证类型..."
                  className="h-12 pl-12 pr-4 text-base rounded-lg"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setSearchResults(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button type="submit" size="lg" className="bg-brand-600 hover:bg-brand-700 text-white px-8">
                <Search className="h-5 w-5" />
                搜索
              </Button>
            </div>
          </form>

          {/* Hot tags + history */}
          {!searchResults && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Hot search tags */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-brand-600" />
                  <h3 className="text-sm font-semibold text-foreground">热门搜索</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotSearchTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 text-sm bg-white border rounded-full hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search history */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">搜索历史</h3>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-muted-foreground hover:text-red-500"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleHistoryClick(h)}
                        className="px-3 py-1.5 text-sm bg-muted/50 rounded-full hover:bg-muted transition-colors flex items-center gap-1"
                      >
                        <History className="h-3 w-3 text-muted-foreground" />
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search results */}
          {searchResults && (
            <div className="max-w-5xl mx-auto">
              {/* Results summary */}
              <div className="mb-4">
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    搜索中...
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    搜索 <span className="font-bold text-foreground">"{initialQuery}"</span> 共找到{" "}
                    <span className="font-bold text-brand-600">{searchResults.total}</span> 条结果
                  </p>
                )}
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 mb-6 border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count = tabCounts[tab.id];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? "border-brand-600 text-brand-600"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      <span className="text-xs text-muted-foreground">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Results list */}
              {!loading && filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((result) => (
                    <ResultCard key={`${result.type}-${result.id}`} result={result} />
                  ))}
                </div>
              ) : !loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">未找到相关结果</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    尝试更换关键词或使用热门搜索
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/products")}
                    className="gap-2"
                  >
                    <Package className="h-4 w-4" />
                    浏览全部产品
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

// ===== Result Card =====

function ResultCard({ result }: { result: SearchResult }) {
  const typeConfig = {
    product: { icon: Package, color: "text-brand-600 bg-brand-50", label: "产品" },
    supplier: { icon: Store, color: "text-trust-600 bg-trust-50", label: "供应商" },
    news: { icon: Newspaper, color: "text-gold-600 bg-gold-50", label: "资讯" },
  };
  const config = typeConfig[result.type];
  const Icon = config.icon;

  return (
    <a
      href={result.href}
      className="block bg-white rounded-xl border p-4 hover:shadow-md hover:border-brand-200 transition-all group"
    >
      <div className="flex gap-4">
        {/* Image / icon */}
        {result.image ? (
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
            <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0 bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-medium ${config.color}`}>
              <Icon className="h-3 w-3" />
              {config.label}
            </span>
            {result.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-brand-600 transition-colors line-clamp-1">
            {result.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.subtitle}</p>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-600 transition-colors shrink-0 mt-1" />
      </div>
    </a>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
