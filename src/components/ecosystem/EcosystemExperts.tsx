import { Award, Briefcase, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ecosystemExperts } from "@/lib/data";

export function EcosystemExperts() {
  return (
    <section className="py-14 bg-white border-t">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="专家委员会"
          subtitle="汇聚清真食品国际贸易、HALAL 认证、跨境物流、市场拓展等领域资深专家，为平台生态提供智力支撑"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ecosystemExperts.map((expert) => (
            <div
              key={expert.id}
              className="group bg-white rounded-xl border shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Avatar + Name header */}
              <div className="p-5 flex items-center gap-4 border-b">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-white">
                    {expert.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-base truncate">{expert.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-50 text-gold-700 text-xs font-medium rounded-full border border-gold-200">
                      <Award className="h-3 w-3" />
                      {expert.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-brand-700 font-medium mb-2">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  {expert.field}
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{expert.organization}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {expert.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
