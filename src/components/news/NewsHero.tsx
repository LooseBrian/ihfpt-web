import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsHotSearchTags } from "@/lib/data";

export function NewsHero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-400 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            资讯动态
          </h1>
          <p className="text-brand-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            平台动态 · 政策法规 · 市场分析 · 区域资讯实时同步
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="搜索资讯、政策、市场动态..."
                className="pl-10 h-12 bg-white text-foreground border-0 shadow-lg rounded-lg text-base"
              />
            </div>
            <Button className="h-12 px-6 bg-gold-500 hover:bg-gold-600 text-white font-semibold shadow-lg rounded-lg">
              <Bell className="h-4 w-4 mr-2" />
              资讯订阅
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-brand-200">热门搜索：</span>
            {newsHotSearchTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-brand-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
