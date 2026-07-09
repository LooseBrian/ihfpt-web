"use client";

import { Globe, UserPlus, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
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
            <a href="/login?tab=buyer&mode=signup">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-brand-800 h-8 gap-1"
              >
                <UserPlus className="h-4 w-4" />
                注册
              </Button>
            </a>
          </div>

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
