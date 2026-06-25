import { Shield, CheckCircle } from "lucide-react";
import type { TrustBadge as TrustBadgeType } from "@/lib/data";

interface TrustBadgeProps {
  badge: TrustBadgeType;
}

export function TrustBadge({ badge }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
        <Shield className="h-5 w-5 text-brand-700" />
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <CheckCircle className="h-4 w-4 text-brand-600 shrink-0" />
          <h4 className="font-semibold text-foreground text-sm">{badge.title}</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
      </div>
    </div>
  );
}
