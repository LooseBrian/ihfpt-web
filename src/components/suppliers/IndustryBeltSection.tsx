import { MapPin, Factory, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { industryBelts } from "@/lib/data";

export function IndustryBeltSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
            国内核心清真食品产业带
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            源头产能直达，定向对接产业集群
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industryBelts.map((belt) => (
            <div
              key={belt.id}
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {belt.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {belt.region}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-700">
                    {belt.supplierCount}
                  </div>
                  <div className="text-xs text-muted-foreground">家供应商</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{belt.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {belt.advantageCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-brand-50 text-brand-700"
                  >
                    <Factory className="h-3 w-3" />
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {belt.supplierLogos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-700"
                    >
                      {logo}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-brand-700">
                  查看全部企业
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
