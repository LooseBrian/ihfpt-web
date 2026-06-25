import { Button } from "@/components/ui/button";
import { Search, UserPlus, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-brand-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-800/80 backdrop-blur-sm border border-brand-700 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-sm text-brand-100">
              中国食品药品企业质量安全促进会主办
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            国际清真食品贸易平台
          </h1>
          <p className="text-lg md:text-xl text-brand-200 mb-2">
            International Halal Food Trade Platform
          </p>
          <p className="text-base text-brand-300 mb-8 max-w-xl mx-auto">
            国家级、全球化、垂直型清真食品 B2B 贸易与产业服务平台
            <br className="hidden md:block" />
            链接中国优质清真食品产能与全球穆斯林消费市场
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-8 gap-2"
            >
              <Search className="h-5 w-5" />
              寻找产品
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-brand-400 bg-transparent text-white hover:bg-brand-800 hover:text-white px-8 gap-2"
            >
              <UserPlus className="h-5 w-5" />
              申请入驻
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-300">
            {["覆盖 28+ 国家", "首批 50+ 供应商", "6 大核心品类", "一站式服务"].map(
              (item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
