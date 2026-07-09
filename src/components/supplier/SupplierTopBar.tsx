"use client";

import { useState } from "react";
import {
  Globe,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Store,
  Package,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supplierNavItems = [
  { label: "店铺管理", icon: Store, href: "#store" },
  { label: "产品管理", icon: Package, href: "#products" },
  { label: "询盘管理", icon: MessageSquare, href: "#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "#orders", badge: "三期" },
  { label: "资质档案", icon: ShieldCheck, href: "#qualifications" },
  { label: "消息中心", icon: Bell, href: "#messages", badge: "3" },
];

export function SupplierTopBar() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[60] bg-brand-900 text-white text-sm">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Left: Brand + nav */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-brand-900 text-xs font-bold px-2 py-0.5 rounded">
              供应商
            </span>
            <span className="hidden md:inline text-brand-200">IHFTP 供应商中心</span>
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

        {/* Right: Language + Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-brand-100 hover:text-white hover:bg-brand-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">中文</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>中文</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Bahasa Indonesia</DropdownMenuItem>
              <DropdownMenuItem>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications bell */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-brand-800 transition-colors"
          >
            <Bell className="h-4 w-4 text-brand-100" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-brand-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:inline text-brand-100 text-xs">山东惠发食品</span>
              <ChevronDown className="h-3 w-3 text-brand-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2 border-b">
                <div className="font-semibold text-sm text-foreground">山东惠发食品有限公司</div>
                <div className="text-xs text-muted-foreground">huifa@ihftp.org</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded">供应商</span>
                  <span className="px-1.5 py-0.5 bg-gold-50 text-gold-700 text-[10px] font-bold rounded">金牌工厂</span>
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                企业信息管理
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                账号设置
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                店铺装修
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
