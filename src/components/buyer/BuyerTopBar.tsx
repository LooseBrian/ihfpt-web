"use client";

import { useState } from "react";
import {
  Globe,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  MessageSquare,
  ClipboardList,
  Truck,
  Heart,
  FileText,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

const buyerNavItems = [
  { label: "询盘管理", icon: MessageSquare, href: "#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "#orders", badge: "三期" },
  { label: "物流跟踪", icon: Truck, href: "#logistics", badge: "二期" },
  { label: "收藏夹", icon: Heart, href: "#favorites" },
  { label: "需求发布", icon: FileText, href: "#demands" },
  { label: "消息中心", icon: Bell, href: "#messages", badge: "5" },
];

export function BuyerTopBar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login?tab=buyer&mode=login";
  };

  const displayName = user?.name || "采购商用户";
  const displayEmail = user?.email || "buyer@ihf.org";
  const displayRole = user?.role || "已认证";

  return (
    <div className="sticky top-0 z-[60] bg-trust-900 text-white text-sm">
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

        {/* Right: Language + Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-trust-100 hover:text-white hover:bg-trust-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
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
            className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-trust-800 transition-colors"
          >
            <Bell className="h-4 w-4 text-trust-100" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              5
            </span>
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-trust-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-trust-500 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:inline text-trust-100 text-xs">{displayName}</span>
              <ChevronDown className="h-3 w-3 text-trust-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2 border-b">
                <div className="font-semibold text-sm text-foreground">{displayName}</div>
                <div className="text-xs text-muted-foreground">{displayEmail}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-trust-50 text-trust-700 text-[10px] font-bold rounded">采购商</span>
                  <span className="px-1.5 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded">{displayRole}</span>
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
                <Package className="h-4 w-4 mr-2" />
                资质档案库
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
