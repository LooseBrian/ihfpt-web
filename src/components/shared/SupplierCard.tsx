import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, TrendingUp } from "lucide-react";
import type { Supplier } from "@/lib/data";

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-brand-700 font-bold text-lg">{supplier.logo}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{supplier.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            {supplier.location}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {supplier.categories.map((cat) => (
          <Badge
            key={cat}
            variant="secondary"
            className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {supplier.certs.map((cert) => (
          <Badge
            key={cert}
            variant="outline"
            className="text-xs border-gold-400 text-gold-700"
          >
            {cert}
          </Badge>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-brand-700">
          <TrendingUp className="h-4 w-4" />
          <span className="font-semibold">{supplier.exportVolume}</span>
          <span className="text-muted-foreground text-xs">年出口</span>
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Store className="h-3.5 w-3.5" />
          进入店铺
        </Button>
      </div>
    </div>
  );
}
