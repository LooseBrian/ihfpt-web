import { MapPin, Globe, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { ecosystemParks } from "@/lib/data";

export function EcosystemParks() {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="标杆产业园区"
          subtitle="国内外标志性清真产业园区，集生产、加工、认证、物流于一体，构建清真食品产业全球化布局"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ecosystemParks.map((park) => {
            const isOverseas = park.type === "overseas";
            return (
              <div
                key={park.id}
                className="group bg-white rounded-xl border shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Header band */}
                <div className="relative bg-gradient-to-br from-brand-800 to-brand-700 p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                        {isOverseas ? (
                          <Globe className="h-5 w-5 text-gold-400" />
                        ) : (
                          <Building2 className="h-5 w-5 text-gold-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{park.name}</h3>
                        <p className="text-xs text-brand-200">{park.nameEn}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white/15 rounded-full text-xs font-medium shrink-0">
                      {isOverseas ? "海外园区" : "国内园区"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-brand-100 mt-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {park.location}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {park.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {park.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-100"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {park.stats.map((stat) => (
                      <div key={stat.label} className="text-center bg-muted/40 rounded-lg py-2.5">
                        <div className="text-lg font-bold text-brand-700">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Button className="mt-auto w-full bg-brand-600 hover:bg-brand-700 text-white gap-1">
                    了解园区详情
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
