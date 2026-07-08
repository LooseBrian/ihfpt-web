"use client";

import { useState } from "react";
import { TrendingUp, Calendar, Building2, Newspaper } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { newsArticles, type NewsArticle } from "@/lib/data";

const categories = ["全部", "平台动态", "政策法规", "市场分析", "行业资讯", "合作伙伴"];

const categoryColors: Record<string, string> = {
  平台动态: "bg-brand-100 text-brand-700",
  政策法规: "bg-amber-100 text-amber-700",
  市场分析: "bg-blue-100 text-blue-700",
  行业资讯: "bg-purple-100 text-purple-700",
  合作伙伴: "bg-rose-100 text-rose-700",
};

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="break-inside-avoid mb-4 bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-brand-300 transition-all overflow-hidden">
      {article.image && (
        <div className="relative w-full h-40 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}
            >
              {article.category}
            </span>
            {article.isHot && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/90 text-white backdrop-blur-sm">
                热门
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-5">
        {!article.image && (
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}
            >
              {article.category}
            </span>
            {article.isHot && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                热门
              </span>
            )}
            {article.sourceType === "partner" && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">
                合作伙伴
              </span>
            )}
          </div>
        )}

        <h3 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-muted/60 text-muted-foreground rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const filteredArticles =
    activeCategory === "全部"
      ? newsArticles
      : newsArticles.filter((a) => a.category === activeCategory);

  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="资讯信息流"
          subtitle="平台官方发布与重要合作伙伴新闻，瀑布流实时更新"
        />

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? "bg-brand-600 text-white border-brand-600 shadow-md"
                  : "bg-white text-foreground border-border hover:border-brand-300 hover:bg-brand-50"
              }`}
            >
              {cat}
              <span
                className={`ml-1.5 text-xs ${
                  activeCategory === cat ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {cat === "全部"
                  ? newsArticles.length
                  : newsArticles.filter((a) => a.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry feed with independent scroll */}
        <div className="max-h-[640px] overflow-y-auto pr-2 -mr-2">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <Newspaper className="h-4 w-4" />
          <span>滚动查看更多资讯 · 共 {filteredArticles.length} 条</span>
        </div>
      </div>
    </section>
  );
}
