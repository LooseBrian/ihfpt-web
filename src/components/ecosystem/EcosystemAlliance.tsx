import {
  Wheat,
  Factory,
  Package,
  Truck,
  Store,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { ecosystemAllianceTiers } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wheat,
  Factory,
  Package,
  Truck,
  Store,
};

export function EcosystemAlliance() {
  return (
    <section className="py-14 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="产业联盟"
          subtitle="清真食品产业链上下游合作企业矩阵，从原料供应到渠道零售，全链路协同共赢"
        />

        {/* Chain visualization */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {ecosystemAllianceTiers.map((tier, idx) => {
              const Icon = iconMap[tier.icon] || Factory;
              return (
                <div key={tier.id} className="relative">
                  {/* Step number badge */}
                  <div className="hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gold-500 text-white text-xs font-bold rounded-full items-center justify-center z-10">
                    {idx + 1}
                  </div>

                  <div className="group bg-white rounded-xl border shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 p-5 h-full flex flex-col">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors">
                      <Icon className="h-6 w-6 text-brand-600 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="font-semibold text-foreground text-sm mb-0.5">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{tier.nameEn}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {tier.description}
                    </p>

                    {/* Member chips */}
                    <div className="mt-auto space-y-1.5">
                      {tier.members.map((member) => (
                        <div
                          key={member}
                          className="flex items-center gap-1.5 text-xs text-foreground bg-muted/40 rounded-md px-2.5 py-1.5"
                        >
                          <ChevronRight className="h-3 w-3 text-brand-500 shrink-0" />
                          <span className="truncate">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
            申请加入产业联盟
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
