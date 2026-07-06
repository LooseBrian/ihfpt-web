"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-icon-navbar.png"
            alt="IHFTP"
            className="h-12 w-auto object-contain"
          />
          <img
            src="/logo-text-navbar.png"
            alt="International Halal Food Trade Platform"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-foreground hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search + Mobile Menu */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
              <Input
                placeholder="搜索产品 / 供应商 / 资质..."
                className="w-48 md:w-64 h-9"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted text-foreground lg:hidden">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索..." className="pl-9" />
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-3 py-2.5 text-sm text-foreground hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="border-t pt-4 flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    采购商登录
                  </Button>
                  <Button className="w-full bg-brand-600 hover:bg-brand-700">
                    供应商入驻
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
