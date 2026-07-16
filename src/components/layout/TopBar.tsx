"use client";

import {
  Globe,
  UserPlus,
  LogIn,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Bell,
  Truck,
  Heart,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

// ===== Nav items for logged-in roles =====

const supplierNavItems = [
  { label: "店铺管理", icon: Store, href: "/supplier#store" },
  { label: "产品管理", icon: Package, href: "/supplier#products" },
  { label: "询盘管理", icon: MessageSquare, href: "/supplier#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "/supplier#orders", badge: "三期" },
  { label: "资质档案", icon: ShieldCheck, href: "/supplier#qualifications" },
  { label: "消息中心", icon: Bell, href: "/supplier#messages", badge: "3" },
];

const buyerNavItems = [
  { label: "询盘管理", icon: MessageSquare, href: "/buyer#inquiries" },
  { label: "订单管理", icon: ClipboardList, href: "/buyer#orders", badge: "三期" },
  { label: "物流跟踪", icon: Truck, href: "/buyer#logistics", badge: "二期" },
  { label: "收藏夹", icon: Heart, href: "/buyer#favorites" },
  { label: "需求发布", icon: FileText, href: "/buyer#demands" },
  { label: "消息中心", icon: Bell, href: "/buyer#messages", badge: "5" },
];

// ===== Color themes =====

const colorThemes = {
  trust: {
    bar: "bg-trust-900",
    hover: "hover:bg-trust-800",
    avatar: "bg-trust-500",
    chevron: "text-trust-200",
    loginBtn: "hover:bg-trust-800",
    navText: "text-trust-100",
    navHover: "hover:bg-trust-800",
    badgeBg: "bg-trust-700 text-trust-200",
  },
  brand: {
    bar: "bg-brand-900",
    hover: "hover:bg-brand-800",
    avatar: "bg-brand-500",
    chevron: "text-brand-200",
    loginBtn: "hover:bg-brand-800",
    navText: "text-brand-100",
    navHover: "hover:bg-brand-800",
    badgeBg: "bg-brand-700 text-brand-200",
  },
};

// ===== Main Component =====

export function TopBar() {
  const { user, isLoggedIn, logout } = useAuth();

  const isBuyer = isLoggedIn && user?.type === "buyer";
  const isSupplier = isLoggedIn && user?.type === "supplier";
  const theme = isBuyer ? "trust" : "brand";
  const c = colorThemes[theme];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Determine which nav items to show
  const navItems = isSupplier ? supplierNavItems : isBuyer ? buyerNavItems : [];
  const roleLabel = isSupplier ? "供应商" : isBuyer ? "采购商" : "";
  const consoleUrl = isSupplier ? "/supplier" : "/buyer";

  // ===== Not logged in: show original "国家级" info bar =====
  if (!isLoggedIn || !user) {
    return (
      <div className={`sticky top-0 z-[60] ${c.bar} text-white text-sm transition-colors`}>
        <div className="container mx-auto px-4 h-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500 text-brand-900 text-xs font-bold px-2 py-0.5 rounded">
              国家级
            </span>
            <span className="hidden sm:inline">
              中国食品药品企业质量安全促进会主办
            </span>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 text-white ${c.hover} h-8 px-2 rounded-md transition-colors cursor-pointer`}>
                <Globe className="h-4 w-4" />
                <span>中文</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>中文</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Bahasa Indonesia</DropdownMenuItem>
                <DropdownMenuItem>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center gap-2">
              <a href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white ${c.loginBtn} h-8 gap-1`}
                >
                  <LogIn className="h-4 w-4" />
                  登录
                </Button>
              </a>
            </div>

            <a href="/login?tab=buyer&mode=signup">
              <Button
                variant="outline"
                size="sm"
                className="border-trust-400/60 bg-trust-500/15 text-trust-100 hover:bg-trust-500/30 hover:border-trust-300 hover:text-white h-8 gap-1 font-medium"
              >
                <UserPlus className="h-4 w-4" />
                采购商注册
              </Button>
            </a>

            <a href="/login?tab=supplier&mode=signup">
              <Button
                size="sm"
                className="bg-gold-500 hover:bg-gold-600 text-brand-900 h-7 text-xs font-bold"
              >
                供应商入驻
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ===== Logged in: show role-based console navigation =====
  return (
    <div className={`sticky top-0 z-[60] ${c.bar} text-white text-sm transition-colors`}>
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        {/* Left: Role badge + nav items */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`bg-gold-500 ${isBuyer ? "text-trust-900" : "text-brand-900"} text-xs font-bold px-2 py-0.5 rounded`}>
              {roleLabel}
            </span>
            <span className={`hidden md:inline ${c.navText}`}>
              IHF {roleLabel}中心
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasNotif = item.badge && (item.badge === "3" || item.badge === "5");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs ${c.navText} hover:text-white ${c.navHover} rounded transition-colors`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                  {item.badge && (
                    <span className={`px-1 py-0 text-[10px] rounded font-bold ${
                      hasNotif
                        ? "bg-red-500 text-white"
                        : c.badgeBg
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right: Language + User menu */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 text-white ${c.hover} h-8 px-2 rounded-md transition-colors cursor-pointer`}>
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

          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-2 text-white ${c.hover} h-8 px-2 rounded-md transition-colors cursor-pointer`}>
              <div className={`w-5 h-5 rounded-full ${c.avatar} flex items-center justify-center`}>
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="hidden sm:inline text-xs">{user.name}</span>
              <ChevronDown className={`h-3 w-3 ${c.chevron}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2 border-b">
                <div className="font-semibold text-sm text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    isSupplier
                      ? "bg-brand-50 text-brand-700"
                      : "bg-trust-50 text-trust-700"
                  }`}>
                    {roleLabel}
                  </span>
                  {user.role && (
                    <span className="px-1.5 py-0.5 bg-gold-50 text-gold-700 text-[10px] font-bold rounded">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer" onClick={() => { window.location.href = consoleUrl; }}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                进入工作台
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => { window.location.href = "/account/settings"; }}>
                <Settings className="h-4 w-4 mr-2" />
                账号设置
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
      <div className="lg:hidden border-t border-white/10 overflow-x-auto">
        <nav className="flex items-center gap-1 px-4 py-1.5 whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-2 py-1 text-xs ${c.navText} hover:text-white ${c.navHover} rounded transition-colors shrink-0`}
              >
                <Icon className="h-3 w-3" />
                {item.label}
                {item.badge && item.badge !== "3" && item.badge !== "5" && (
                  <span className={`px-1 py-0 text-[10px] ${c.badgeBg} rounded font-bold`}>
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
