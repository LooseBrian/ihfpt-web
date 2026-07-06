import { Users, ShieldCheck, Truck, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Users,
    title: "精准获客",
    description: "对接全球精准采购商，专业团队 1 对 1 撮合",
  },
  {
    icon: ShieldCheck,
    title: "合规赋能",
    description: "清真认证、出口资质、海外合规全流程代办",
  },
  {
    icon: Truck,
    title: "交付兜底",
    description: "报关、冷链、海外仓、清关一站式供应链服务",
  },
  {
    icon: Award,
    title: "品牌曝光",
    description: "线上首页推荐 + 线下展厅常驻，双线品牌背书",
  },
];

export function SupplierServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
            入驻平台，一站式开拓全球清真市场
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从获客到交付，全链路赋能供应商出海
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="bg-muted/30 rounded-xl p-6 text-center hover:bg-muted/50 transition-all"
            >
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svc.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{svc.title}</h3>
              <p className="text-sm text-muted-foreground">{svc.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-700 gap-2">
            立即申请入驻
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
