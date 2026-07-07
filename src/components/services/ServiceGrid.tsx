"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Truck,
  Globe,
  Landmark,
  Clock,
  Coins,
  FileText,
  CheckCircle2,
  ArrowRight,
  Flame,
  Building2,
  ClipboardCheck,
  Ship,
  Warehouse,
  PackageCheck,
  Thermometer,
  Store,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  Wallet,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  serviceCategories,
  serviceItems,
  type ServiceItem,
} from "@/lib/data";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Truck,
  Globe,
  Landmark,
};

const itemIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  FileCheck: FileText,
  Building2,
  ClipboardCheck,
  Truck,
  Ship,
  Warehouse,
  PackageCheck,
  Thermometer,
  Globe,
  Store,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  Landmark,
  ShieldPlus: ShieldCheck,
  Wallet,
  FileText,
  Banknote,
};

function ServiceCardItem({ item }: { item: ServiceItem }) {
  const Icon = itemIconMap[item.icon] || ShieldCheck;

  return (
    <div className="group bg-white rounded-xl border shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Header + Body merged */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-600 transition-colors shrink-0">
            <Icon className="h-5 w-5 text-brand-700 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-semibold text-foreground truncate">{item.name}</h3>
              {item.isHot && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-600 text-xs font-medium rounded-full border border-rose-200 shrink-0">
                  <Flame className="h-2.5 w-2.5" />
                  核心
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{item.nameEn}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-brand-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-muted-foreground text-xs">办理周期</div>
              <div className="text-foreground font-medium text-xs truncate">{item.duration}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-1.5">
            <Coins className="h-3.5 w-3.5 text-gold-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-muted-foreground text-xs">收费标准</div>
              <div className="text-foreground font-medium text-xs truncate">{item.price}</div>
            </div>
          </div>
        </div>

        {/* Materials + Process inline */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {item.materials.length} 项资料
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {item.process.length} 步流程
          </span>
        </div>

        {/* CTA */}
        <Button
          className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white gap-1"
        >
          在线申请
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export function ServiceGrid() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);

  const filteredItems = serviceItems.filter(
    (item) => item.categoryId === activeCategory
  );

  const activeCategoryData = serviceCategories.find(
    (c) => c.id === activeCategory
  );

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="核心服务项目"
          subtitle="四大服务类别，覆盖清真食品出海全链路需求，每项服务均可在线申请、进度实时跟踪"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {serviceCategories.map((cat) => {
            const Icon = categoryIconMap[cat.icon] || ShieldCheck;
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
                  {serviceItems.filter((i) => i.categoryId === cat.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category description */}
        {activeCategoryData && (
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              {activeCategoryData.description}
            </p>
            <p className="text-sm text-brand-600 font-medium">
              {activeCategoryData.highlight}
            </p>
          </div>
        )}

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <ServiceCardItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
