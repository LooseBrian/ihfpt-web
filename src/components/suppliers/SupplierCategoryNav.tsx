"use client";

import { useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { supplierCategoryTabs } from "@/lib/data";

interface SupplierCategoryNavProps {
  /** Called when a category card is clicked with (tabId, optionId) */
  onSelect?: (tabId: string, optionId: string) => void;
}

export function SupplierCategoryNav({ onSelect }: SupplierCategoryNavProps) {
  const [activeTab, setActiveTab] = useState(supplierCategoryTabs[0].id);
  const activeTabData = supplierCategoryTabs.find((t) => t.id === activeTab);

  const handleCardClick = (optionId: string) => {
    if (onSelect) {
      onSelect(activeTab, optionId);
    }
  };

  return (
    <section id="category-nav" className="py-10 bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">供应商分类导航</h2>
          <p className="text-sm text-muted-foreground mt-1">多维度快速定位目标企业 · 点击卡片快速筛选供应商</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {supplierCategoryTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white text-foreground border-border hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-foreground">{activeTabData?.label}</span>
            <span className="text-xs text-muted-foreground">
              共 {activeTabData?.options.reduce((sum, o) => sum + o.count, 0)} 家企业
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {activeTabData?.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleCardClick(opt.id)}
                className="group flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-brand-300 hover:bg-brand-50 transition-all text-center cursor-pointer"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-brand-700">
                  {opt.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{opt.count} 家</span>
                  {opt.count > 200 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                      <Flame className="h-3 w-3" />
                      热门
                    </span>
                  )}
                  {opt.count > 100 && opt.count <= 200 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-gold-50 text-gold-600 font-medium">
                      <TrendingUp className="h-3 w-3" />
                      出口优选
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
