"use client";

import { useState } from "react";
import {
  Landmark,
  Users,
  ShieldCheck,
  Truck,
  Banknote,
  Building2,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ecosystemPartnerCategories } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Users,
  ShieldCheck,
  Truck,
  Banknote,
};

export function EcosystemMatrix() {
  const [activeCategory, setActiveCategory] = useState(ecosystemPartnerCategories[0].id);

  const activeData = ecosystemPartnerCategories.find(
    (c) => c.id === activeCategory
  );

  return (
    <section className="py-14 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="合作生态矩阵"
          subtitle="联合政府机构、行业协会、认证机构、物流服务商、金融机构，构建覆盖清真食品出海全链路的合作生态网络"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ecosystemPartnerCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Building2;
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 shadow-md"
                    : "bg-white text-foreground border-border hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.partners.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category description */}
        {activeData && (
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-sm text-muted-foreground">{activeData.description}</p>
          </div>
        )}

        {/* Partner cards */}
        {activeData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {activeData.partners.map((partner, idx) => {
              const Icon = iconMap[activeData.icon] || Building2;
              const isLast = idx === activeData.partners.length - 1;
              const remainder = activeData.partners.length % 3;
              const centerLast = isLast && remainder === 1;
              return (
                <div
                  key={idx}
                  className={`group bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-brand-300 transition-all p-5 flex items-start gap-4 ${
                    centerLast ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-colors">
                    <Icon className="h-5 w-5 text-brand-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{partner.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
