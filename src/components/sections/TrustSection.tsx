import { Award, Landmark, Handshake, FileCheck } from "lucide-react";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { trustBadges } from "@/lib/data";

const partnerLogos = [
  { name: "中国食药促进会", abbr: "CFDA" },
  { name: "中国-东盟专委会", abbr: "CA-ASEAN" },
  { name: "JAKIM", abbr: "JAKIM" },
  { name: "海关总署", abbr: "GACC" },
  { name: "SFDA", abbr: "SFDA" },
  { name: "临夏产业园", abbr: "LX Park" },
];

export function TrustSection() {
  return (
    <section className="py-12 bg-brand-50 border-y">
      <div className="container mx-auto px-4">
        {/* Partner Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-10">
          {partnerLogos.map((logo) => (
            <div
              key={logo.abbr}
              className="flex items-center gap-2 bg-white rounded-lg border px-4 py-2 shadow-sm"
            >
              <div className="w-8 h-8 bg-brand-100 rounded flex items-center justify-center">
                <Award className="h-4 w-4 text-brand-700" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">{logo.abbr}</div>
                <div className="text-[10px] text-muted-foreground hidden sm:block">
                  {logo.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustBadges.map((badge) => (
            <TrustBadge key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
