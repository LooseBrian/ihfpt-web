import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 bg-brand-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

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
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-brand-900 font-bold px-8 gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-5 w-5" />
              供应商入驻申请
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 gap-2 w-full sm:w-auto"
            >
              <Search className="h-5 w-5" />
              采购商快速注册
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
