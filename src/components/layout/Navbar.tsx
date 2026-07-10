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
    <header className="sticky top-10 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo — Icon + CSS Divider + Text (pure vector, transparent bg) */}
        <a
          href="/"
          className={`flex items-center gap-2 shrink-0 ${
            searchOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <img
            src="/logo-icon.svg"
            alt="IHF"
            className="h-[72px] w-auto"
          />
          <span className="h-14 w-1 bg-gold-500 rounded-full shrink-0" />
          <img
            src="/logo-text.svg"
            alt="International Halal Food Industrial Platform"
            className="h-16 w-auto"
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
        <div
          className={`flex items-center gap-2 ${
            searchOpen ? "flex-1 md:flex-none" : ""
          }`}
        >
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 flex-1 md:flex-none">
              <Input
                placeholder="搜索产品 / 供应商 / 资质..."
                className="flex-1 md:w-64 h-9"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
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

          {/* Mobile menu — hidden when search is open */}
          <Sheet>
            <SheetTrigger
              className={`items-center justify-center h-9 w-9 rounded-lg hover:bg-muted text-foreground lg:hidden ${
                searchOpen ? "hidden" : "flex"
              }`}
            >
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
                  <a href="/login?tab=buyer&mode=login" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      采购商登录
                    </Button>
                  </a>
                  <a href="/login?tab=supplier&mode=signup" className="w-full">
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      供应商入驻
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
