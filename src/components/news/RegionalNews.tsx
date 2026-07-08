"use client";

import { useState } from "react";
import { Globe, Calendar, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { newsRegions, regionalNewsData } from "@/lib/data";

const regionIcons: Record<string, string> = {
  OIC: "🌍",
  GCC: "🕌",
  ASEAN: "🌴",
  MENA: "🏜️",
};

export function RegionalNews() {
  const [activeRegion, setActiveRegion] = useState("OIC");
  const activeData = regionalNewsData[activeRegion] || [];
  const regionInfo = newsRegions.find((r) => r.id === activeRegion);

  return (
    <section className="py-14 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="区域资讯"
          subtitle="按国际组织与大区分类，精准追踪目标市场政策与动态"
        />

        {/* Region tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {newsRegions.map((region) => {
            const count = regionalNewsData[region.id]?.length || 0;
            const isActive = region.id === activeRegion;
            return (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 shadow-md"
                    : "bg-white text-foreground border-border hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <span className="text-base">{regionIcons[region.id]}</span>
                {region.name}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Region description */}
        {regionInfo && (
          <div className="max-w-3xl mx-auto text-center mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{regionInfo.fullName}</span>
              {" — "}
              {regionInfo.description}
            </p>
          </div>
        )}

        {/* Independent scroll container */}
        <div className="max-h-[500px] overflow-y-auto pr-2 -mr-2">
          <div className="space-y-3 max-w-4xl mx-auto">
            {activeData.length > 0 ? (
              activeData.map((article) => (
                <div
                  key={article.id}
                  className="group bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-brand-300 transition-all p-4 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-colors">
                    <Globe className="h-5 w-5 text-brand-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-brand-600">{article.category}</span>
                      <span>{article.source}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-600 transition-colors shrink-0 mt-1" />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">暂无该区域资讯</p>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>滚动查看更多区域资讯 · 当前 {activeData.length} 条</span>
        </div>
      </div>
    </section>
  );
}
