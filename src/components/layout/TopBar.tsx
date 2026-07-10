"use client";

import { Globe, UserPlus, LogIn, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

export function TopBar() {
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 z-[60] bg-brand-900 text-white text-sm">
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
            <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:bg-brand-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
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

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-white hover:bg-brand-800 h-8 px-2 rounded-md transition-colors cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline text-xs">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-brand-200" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 border-b">
                  <div className="font-semibold text-sm text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      user.type === "supplier"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-trust-50 text-trust-700"
                    }`}>
                      {user.type === "supplier" ? "供应商" : "采购商"}
                    </span>
                    {user.role && (
                      <span className="px-1.5 py-0.5 bg-gold-50 text-gold-700 text-[10px] font-bold rounded">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuItem className="cursor-pointer" onClick={() => { window.location.href = user.type === "supplier" ? "/supplier" : "/buyer"; }}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  进入控制台
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <a href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-brand-800 h-8 gap-1"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
