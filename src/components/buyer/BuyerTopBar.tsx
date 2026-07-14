"use client";

import {
  Bell,
  MessageSquare,
  ClipboardList,
  Truck,
  Heart,
  FileText,
  LayoutDashboard,
} from "lucide-react";

const buyerNavItems = [
  { label: "询盘管理", icon: MessageSquare, href: "#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "#orders", badge: "三期" },
  { label: "物流跟踪", icon: Truck, href: "#logistics", badge: "二期" },
  { label: "收藏夹", icon: Heart, href: "#favorites" },
  { label: "需求发布", icon: FileText, href: "#demands" },
  { label: "消息中心", icon: Bell, href: "#messages", badge: "5" },
];

export function BuyerTopBar() {
  return (
    <div className="bg-trust-900 text-white text-sm">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Left: Brand + nav */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-trust-900 text-xs font-bold px-2 py-0.5 rounded">
              采购商
            </span>
            <span className="hidden md:inline text-trust-200">IHF 采购商中心</span>
          </div>

          {/* Buyer nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {buyerNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-trust-100 hover:text-white hover:bg-trust-800 rounded transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                  {item.badge && (
                    <span className={`px-1 py-0 text-[10px] rounded font-bold ${
                      item.badge === "5"
                        ? "bg-red-500 text-white"
                        : "bg-trust-700 text-trust-200"
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
            href="/buyer"
            className="flex items-center gap-1 text-trust-100 hover:text-white hover:bg-trust-800 h-8 px-2 rounded-md transition-colors cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">工作台</span>
          </a>
        </div>
      </div>

      {/* Mobile nav — horizontal scroll */}
      <div className="lg:hidden border-t border-trust-800 overflow-x-auto">
        <nav className="flex items-center gap-1 px-4 py-1.5 whitespace-nowrap">
          {buyerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 px-2 py-1 text-xs text-trust-100 hover:text-white hover:bg-trust-800 rounded transition-colors shrink-0"
              >
                <Icon className="h-3 w-3" />
                {item.label}
                {item.badge && item.badge !== "5" && (
                  <span className="px-1 py-0 text-[10px] bg-trust-700 text-trust-200 rounded font-bold">
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
