"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { products as seedProducts, suppliers as seedSuppliers, newsArticles, type Product, type Supplier, type NewsArticle } from "@/lib/data";

// ===== Types =====

export type SearchResultType = "product" | "supplier" | "news";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  image?: string;
  href: string;
  tags?: string[];
  highlights?: string[];
}

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  productResults: SearchResult[];
  supplierResults: SearchResult[];
  newsResults: SearchResult[];
  totalCount: number;
  searching: boolean;
  search: (q: string) => void;
  clearSearch: () => void;
  // Suggestions
  getSuggestions: (q: string) => SearchResult[];
  // Search history
  searchHistory: string[];
  addToHistory: (q: string) => void;
  clearHistory: () => void;
}

// Hot search tags
export const hotSearchTags = [
  "清真鱼豆腐",
  "清真冻鸭",
  "HALAL认证",
  "速冻调理品",
  "牛肉丸",
  "咖喱酱",
  "清真预制菜",
  "中东出口",
  "羊腿肉",
  "调味料",
];

// ===== Search logic =====

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "");
}

function searchProducts(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  return seedProducts
    .filter((p) => {
      const haystack = normalize(
        [p.name, p.nameEn, p.spec, p.supplier, p.certType, p.category, p.subcategory, p.origin]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    })
    .map((p) => ({
      id: p.id,
      type: "product" as const,
      title: p.name,
      subtitle: `${p.supplier} · ${p.priceRange}`,
      image: p.image,
      href: `/product/${p.id}`,
      tags: [p.certType, p.category].filter(Boolean) as string[],
    }));
}

function searchSuppliers(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  return seedSuppliers
    .filter((s) => {
      const haystack = normalize(
        [s.name, s.businessType, s.location, s.description, s.tier, ...s.categories, ...s.certs]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    })
    .map((s) => ({
      id: s.id,
      type: "supplier" as const,
      title: s.name,
      subtitle: `${s.categories.join("、")} · ${s.location}`,
      image: s.logo,
      href: `/suppliers`,
      tags: [s.tier, ...s.certs.slice(0, 1)].filter(Boolean) as string[],
    }));
}

function searchNews(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = normalize(query);
  return newsArticles
    .filter((a) => {
      const haystack = normalize(
        [a.title, a.excerpt, a.source, a.category]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    })
    .map((a) => ({
      id: a.id,
      type: "news" as const,
      title: a.title,
      subtitle: a.excerpt.slice(0, 80) + "...",
      href: "/news",
      tags: [a.category],
    }));
}

// ===== Hook (no Context needed — keeps it decoupled) =====

const HISTORY_KEY = "ihf_search_history";
const MAX_HISTORY = 8;

export function useSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSearchHistory(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const performSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setSearching(true);
    // Simulate async search
    setTimeout(() => {
      const products = searchProducts(trimmed);
      const suppliers = searchSuppliers(trimmed);
      const news = searchNews(trimmed);
      setResults([...products, ...suppliers, ...news]);
      setSearching(false);
    }, 100);
  }, []);

  const search = useCallback((q: string) => {
    setQuery(q);
    performSearch(q);
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  const getSuggestions = useCallback((q: string): SearchResult[] => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 1) return [];
    // Return top 5 instant suggestions
    const products = searchProducts(trimmed).slice(0, 3);
    const suppliers = searchSuppliers(trimmed).slice(0, 2);
    return [...products, ...suppliers].slice(0, 5);
  }, []);

  const addToHistory = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Navigate to search results page
  const navigateToSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [router, addToHistory]);

  const productResults = results.filter((r) => r.type === "product");
  const supplierResults = results.filter((r) => r.type === "supplier");
  const newsResults = results.filter((r) => r.type === "news");

  return {
    query,
    setQuery,
    results,
    productResults,
    supplierResults,
    newsResults,
    totalCount: results.length,
    searching,
    search,
    clearSearch,
    getSuggestions,
    searchHistory,
    addToHistory,
    clearHistory,
    navigateToSearch,
  };
}

// ===== Standalone search function (for use in server components / pages) =====

export function searchAll(query: string): {
  products: SearchResult[];
  suppliers: SearchResult[];
  news: SearchResult[];
  total: number;
} {
  const products = searchProducts(query);
  const suppliers = searchSuppliers(query);
  const news = searchNews(query);
  return {
    products,
    suppliers,
    news,
    total: products.length + suppliers.length + news.length,
  };
}
