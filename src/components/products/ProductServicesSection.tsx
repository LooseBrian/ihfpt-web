import { ShieldCheck, Filter, Send, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: ShieldCheck,
    title: "严选合规产能",
    description: "全量核验清真认证与出口资质，产品源头可溯可查",
  },
  {
    icon: Filter,
    title: "多维智能筛选",
    description: "7 维度精准筛选，快速定位目标产品与供应商",
  },
  {
    icon: Send,
    title: "一键询盘对接",
    description: "在线发布采购需求，平台撮合专业团队 1 对 1 服务",
  },
  {
    icon: Truck,
    title: "全链路出海服务",
    description: "报关、冷链、清关一站式代办，交付全程无忧",
  },
];

export function ProductServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
            发现优质清真食品，高效对接合规产能
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从筛选到询盘，全链路赋能采购商高效寻源
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
            发布采购询盘
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
