import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/media/cta-banner-bg.png')`,
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-brand-900/60" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            加入国际清真食品贸易平台
          </h2>
          <p className="text-brand-100 mb-8">
            无论您是寻求优质清真食品的海外采购商，还是希望拓展国际市场的中国供应商，
            <br className="hidden md:block" />
            IHFTP 都将是您最值得信赖的合作伙伴
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login?tab=supplier&mode=signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-8 gap-2 w-full sm:w-auto"
              >
                <UserPlus className="h-5 w-5" />
                供应商入驻申请
              </Button>
            </a>
            <a href="/login?tab=buyer&mode=signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white px-8 gap-2 w-full sm:w-auto"
              >
                <Search className="h-5 w-5" />
                采购商快速注册
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
