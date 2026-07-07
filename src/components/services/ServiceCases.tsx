import { MapPin, TrendingUp, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { serviceCases } from "@/lib/data";

export function ServiceCases() {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="服务案例与成果"
          subtitle="覆盖合规认证、跨境物流、渠道拓展、金融配套的典型出海服务案例，以成果验证服务能力"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {serviceCases.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-brand-50 to-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all p-6 overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-brand-100" />

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-brand-600 text-white text-xs rounded-md font-medium">
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.market}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2 pr-8">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="flex items-start gap-2 p-3 bg-white/80 rounded-lg border border-brand-100">
                <TrendingUp className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">服务成果</div>
                  <p className="text-sm font-medium text-brand-700">{item.result}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                服务客户：<span className="text-foreground font-medium">{item.client}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
