"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb — auto-generates a path trail from the current URL.
 * Hidden on homepage (`/`) and admin pages (admin has its own layout).
 *
 * High cohesion: all path-to-label mapping lives here.
 * Low coupling: consumes no props; renders below Navbar automatically.
 */

// Path segment → Chinese label mapping
const pathLabelMap: Record<string, string> = {
  products: "产品大厅",
  product: "产品详情",
  suppliers: "优质供应商",
  store: "店铺详情",
  services: "服务中心",
  ecosystem: "产业生态",
  news: "资讯动态",
  about: "关于我们",
  contact: "联系我们",
  search: "搜索结果",
  login: "登录注册",
  account: "账号中心",
  settings: "账号设置",
  buyer: "采购商中心",
  supplier: "供应商中心",
  "new-product": "发布产品",
  preview: "预览",
};

interface Crumb {
  label: string;
  href: string;
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  // Always start with 首页
  const crumbs: Crumb[] = [{ label: "首页", href: "/" }];

  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = pathLabelMap[segment] || segment;
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Hide on homepage and admin portal (admin has its own layout)
  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  const crumbs = buildBreadcrumbs(pathname);

  return (
    <div className="bg-muted/40 border-b border-border/60">
      <div className="container mx-auto px-4">
        <nav aria-label="面包屑导航" className="flex items-center gap-1 h-9 text-sm overflow-x-auto whitespace-nowrap">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <span key={crumb.href} className="flex items-center gap-1 shrink-0">
                {index === 0 && <Home className="h-3.5 w-3.5 text-muted-foreground" />}
                {isLast ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-brand-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
