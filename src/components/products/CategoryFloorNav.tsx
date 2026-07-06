"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Flame, TrendingUp } from "lucide-react";
import { categories, subcategories } from "@/lib/data";
import * as Icons from "lucide-react";

export function CategoryFloorNav() {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const activeSubs = subcategories.filter((s) => s.categoryId === activeTab);
  const activeCategory = categories.find((c) => c.id === activeTab);

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">品类导航</h2>
          <p className="text-sm text-muted-foreground mt-1">按品类快速筛选，精准定位目标产品</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon] || Icons.Circle;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white text-foreground border-border hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Subcategory grid */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-foreground">{activeCategory?.name}</span>
            <span className="text-xs text-muted-foreground">共 {activeSubs.reduce((sum, s) => sum + s.count, 0)} 款产品</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {activeSubs.map((sub) => (
              <a
                key={sub.id}
                href="#"
                className="group flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-brand-300 hover:bg-brand-50 transition-all text-center"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-brand-700">
                  {sub.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{sub.count} 款</span>
                  {sub.count > 150 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                      <Flame className="h-3 w-3" />
                      热门
                    </span>
                  )}
                  {sub.count > 100 && sub.count <= 200 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-gold-50 text-gold-600 font-medium">
                      <TrendingUp className="h-3 w-3" />
                      出口热销
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
