"use client";

import {
  Store,
  Package,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Bell,
  LayoutDashboard,
} from "lucide-react";

const supplierNavItems = [
  { label: "店铺管理", icon: Store, href: "#store" },
  { label: "产品管理", icon: Package, href: "#products" },
  { label: "询盘管理", icon: MessageSquare, href: "#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "#orders", badge: "三期" },
  { label: "资质档案", icon: ShieldCheck, href: "#qualifications" },
  { label: "消息中心", icon: Bell, href: "#messages", badge: "3" },
];

export function SupplierTopBar() {
  return (
    <div className="bg-brand-900 text-white text-sm">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Left: Brand + nav */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-brand-900 text-xs font-bold px-2 py-0.5 rounded">
              供应商
            </span>
            <span className="hidden md:inline text-brand-200">IHF 供应商中心</span>
          </div>

          {/* Supplier nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {supplierNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-brand-100 hover:text-white hover:bg-brand-800 rounded transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                  {item.badge && (
                    <span className={`px-1 py-0 text-[10px] rounded font-bold ${
                      item.badge === "3"
                        ? "bg-red-500 text-white"
                        : "bg-brand-700 text-brand-200"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick link to workbench */}
        <div className="flex items-center gap-2">
          <a
            href="/supplier"
            className="flex items-center gap-1 text-brand-100 hover:text-white hover:bg-brand-800 h-8 px-2 rounded-md transition-colors cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">工作台</span>
          </a>
        </div>
      </div>

      {/* Mobile nav — horizontal scroll */}
      <div className="lg:hidden border-t border-brand-800 overflow-x-auto">
        <nav className="flex items-center gap-1 px-4 py-1.5 whitespace-nowrap">
          {supplierNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 px-2 py-1 text-xs text-brand-100 hover:text-white hover:bg-brand-800 rounded transition-colors shrink-0"
              >
                <Icon className="h-3 w-3" />
                {item.label}
                {item.badge && item.badge !== "3" && (
                  <span className="px-1 py-0 text-[10px] bg-brand-700 text-brand-200 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
