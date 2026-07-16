"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Package, Store, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { searchAll, hotSearchTags } from "@/lib/search";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchAll> | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Switch hover colors based on logged-in role
  const isBuyer = isLoggedIn && user?.type === "buyer";
  const linkHover = isBuyer
    ? "hover:text-trust-600 hover:bg-trust-50"
    : "hover:text-brand-600 hover:bg-brand-50";

  // Click outside to close suggestions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) {
      setSuggestions(null);
      return;
    }
    const timer = setTimeout(() => {
      setSuggestions(searchAll(searchQuery));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSuggestionClick = (href: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    router.push(href);
  };

  const totalSuggestions = suggestions
    ? suggestions.products.length + suggestions.suppliers.length + suggestions.news.length
    : 0;

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
              className={`px-3 py-2 text-sm text-foreground ${linkHover} rounded-md transition-colors`}
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
            <div ref={searchRef} className="relative flex items-center gap-2 animate-in fade-in slide-in-from-right-2 flex-1 md:flex-none">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="搜索产品 / 供应商 / 资质..."
                  className="flex-1 md:w-64 h-9 pr-8"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setSuggestions(null); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Suggestions dropdown */}
                {showSuggestions && totalSuggestions > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 md:w-96 bg-white rounded-lg border shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {suggestions!.products.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-semibold text-muted-foreground px-2 py-1 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          产品 ({suggestions!.products.length})
                        </div>
                        {suggestions!.products.slice(0, 3).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSuggestionClick(p.href)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded text-sm text-left"
                          >
                            {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{p.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{p.subtitle}</div>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                    {suggestions!.suppliers.length > 0 && (
                      <div className="p-2 border-t">
                        <div className="text-xs font-semibold text-muted-foreground px-2 py-1 flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          供应商 ({suggestions!.suppliers.length})
                        </div>
                        {suggestions!.suppliers.slice(0, 2).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSuggestionClick(s.href)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded text-sm text-left"
                          >
                            <Store className="h-4 w-4 text-trust-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{s.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{s.subtitle}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* View all results */}
                    <button
                      type="submit"
                      onClick={handleSearch}
                      className="w-full px-3 py-2 text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 border-t flex items-center justify-center gap-1"
                    >
                      查看全部 {totalSuggestions} 条结果
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Empty state — show hot tags */}
                {showSuggestions && !searchQuery && (
                  <div className="absolute top-full mt-1 left-0 right-0 md:w-96 bg-white rounded-lg border shadow-xl p-3 z-50">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">热门搜索</div>
                    <div className="flex flex-wrap gap-1.5">
                      {hotSearchTags.slice(0, 6).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => { setSearchQuery(tag); handleSearch({ preventDefault: () => {} } as React.FormEvent); }}
                          className="px-2 py-1 text-xs bg-muted/50 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); setSuggestions(null); }}
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
                      className={`px-3 py-2.5 text-sm text-foreground ${linkHover} rounded-md transition-colors`}
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
                    <Button className={`w-full ${isBuyer ? "bg-trust-600 hover:bg-trust-700" : "bg-brand-600 hover:bg-brand-700"}`}>
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
