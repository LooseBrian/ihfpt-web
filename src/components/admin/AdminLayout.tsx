"use client";

import { useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  PackageCheck,
  Store,
  Users,
  MessageSquare,
  Newspaper,
  Image as ImageIcon,
  FileEdit,
  UserCog,
  ShieldCheck,
  ScrollText,
  Bell,
  Globe,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import {
  useAdminAuth,
  type Permission,
  roleLabels,
  roleColors,
} from "@/lib/admin-auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ===== Navigation Structure =====

interface NavItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  permission: Permission;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const dashboardItem: NavItem = {
  label: "数据看板",
  icon: LayoutDashboard,
  href: "/admin",
  permission: "dashboard.view",
};

const navSections: NavSection[] = [
  {
    title: "运营管理",
    items: [
      { label: "产品审核", icon: PackageCheck, href: "/admin/products", permission: "products.review" },
      { label: "供应商管理", icon: Store, href: "/admin/suppliers", permission: "suppliers.view" },
      { label: "采购商管理", icon: Users, href: "/admin/buyers", permission: "buyers.view" },
      { label: "询盘管理", icon: MessageSquare, href: "/admin/inquiries", permission: "inquiries.view" },
    ],
  },
  {
    title: "内容管理",
    items: [
      { label: "CMS内容管理", icon: FileEdit, href: "/admin/cms", permission: "content.publish" },
      { label: "资讯管理", icon: Newspaper, href: "/admin/news", permission: "content.news" },
      { label: "Banner管理", icon: ImageIcon, href: "/admin/banners", permission: "content.banner" },
    ],
  },
  {
    title: "系统设置",
    items: [
      { label: "用户管理", icon: UserCog, href: "/admin/users", permission: "settings.users" },
      { label: "角色权限", icon: ShieldCheck, href: "/admin/roles", permission: "settings.roles" },
      { label: "系统日志", icon: ScrollText, href: "/admin/logs", permission: "settings.logs" },
    ],
  },
];

// Flatten all items for title lookup
const allNavItems: NavItem[] = [
  dashboardItem,
  ...navSections.flatMap((s) => s.items),
];

const pageTitleMap: Record<string, string> = Object.fromEntries(
  allNavItems.map((item) => [item.href, item.label])
);

function getPageTitle(pathname: string): string {
  if (pageTitleMap[pathname]) return pageTitleMap[pathname];
  for (const key of Object.keys(pageTitleMap)) {
    if (key !== "/admin" && pathname.startsWith(key + "/")) return pageTitleMap[key];
  }
  return "管理后台";
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

// ===== Sidebar Link =====

function SidebarLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-brand-600 text-white border-l-4 border-brand-400 pl-2"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

// ===== Sidebar Content =====

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { hasPermission } = useAdminAuth();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {/* Dashboard single item */}
      {hasPermission(dashboardItem.permission) && (
        <SidebarLink item={dashboardItem} pathname={pathname} onClick={onNavigate} />
      )}

      {/* Sectioned items */}
      {navSections.map((section) => {
        const visibleItems = section.items.filter((item) =>
          hasPermission(item.permission)
        );
        if (visibleItems.length === 0) return null;
        return (
          <div key={section.title} className="pt-3">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {visibleItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={onNavigate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// ===== Sidebar Brand =====

function SidebarBrand() {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800 shrink-0"
    >
      <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
        <Shield className="h-5 w-5 text-white" />
      </div>
      <div className="leading-tight">
        <div className="text-white font-bold text-sm">IHF</div>
        <div className="text-slate-400 text-[11px]">运营管理后台</div>
      </div>
    </Link>
  );
}

// ===== User Dropdown =====

function UserMenu() {
  const { user, logout } = useAdminAuth();
  if (!user) return null;

  const primaryRole = user.roles?.[0] || "viewer";
  const roleLabel = user.roleLabels?.[0] || roleLabels[primaryRole] || primaryRole;
  const roleColor = roleColors[primaryRole] || roleColors.viewer;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  const initials = user.name.slice(0, 1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer outline-none">
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-medium text-slate-700">{user.name}</span>
          <span className="text-[11px] text-slate-400">{roleLabel}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1 py-1">
              <span className="font-semibold text-sm text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
              <span className="flex items-center gap-2 pt-1">
                <span
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold rounded",
                    roleColor
                  )}
                >
                  {roleLabel}
                </span>
                <span className="text-[11px] text-muted-foreground">{user.department}</span>
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            window.location.href = "/admin";
          }}
        >
          <LayoutDashboard className="h-4 w-4" />
          数据看板
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <Home className="h-4 w-4" />
          返回前台
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===== Notification Bell =====

function NotificationBell() {
  return (
    <button
      type="button"
      className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
      aria-label="通知"
    >
      <Bell className="h-[18px] w-[18px]" />
      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
        3
      </span>
    </button>
  );
}

// ===== Language Selector =====

function LanguageSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 h-9 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500 hover:text-slate-700 outline-none">
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline text-sm">中文</span>
        <ChevronDown className="h-3.5 w-3.5 hidden sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">中文</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">English</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Bahasa Indonesia</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">العربية</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===== Main Layout =====

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar (fixed, dark) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex-col z-40">
        <SidebarBrand />
        <SidebarContent pathname={pathname} />
        <div className="shrink-0 border-t border-slate-800 px-5 py-3">
          <p className="text-[11px] text-slate-500">IHF Admin v1.0</p>
          <p className="text-[10px] text-slate-600 mt-0.5">© 2026 International Halal Food</p>
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet, dark) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 max-w-[85vw] bg-slate-900 text-white p-0">
          <div className="flex items-center justify-between pr-12">
            <SidebarBrand />
          </div>
          <SheetClose
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-3 text-slate-400 hover:text-white hover:bg-slate-800"
                size="icon-sm"
              />
            }
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </SheetClose>
          <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile toggle + Title + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden text-slate-600"
              onClick={() => setMobileOpen(true)}
              aria-label="打开菜单"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base font-semibold text-slate-800 truncate">{pageTitle}</h1>
              <span className="hidden sm:inline text-slate-300">/</span>
              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <Link href="/admin" className="hover:text-slate-600 transition-colors">
                  管理后台
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-medium">{pageTitle}</span>
              </nav>
            </div>
          </div>

          {/* Right: Notifications + Language + User */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationBell />
            <LanguageSelector />
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
            <UserMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
