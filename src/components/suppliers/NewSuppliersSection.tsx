import { Badge } from "@/components/ui/badge";
import { suppliers } from "@/lib/data";

export function NewSuppliersSection() {
  const newSuppliers = suppliers.filter((s) => s.isNew);

  if (newSuppliers.length === 0) return null;

  return (
    <section className="py-10 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">近期新入驻优质供应商</h2>
            <p className="text-sm text-muted-foreground mt-1">近 30 天新入驻的合规企业</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {newSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="min-w-[240px] bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3"
            >
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-brand-700 font-bold text-sm">{supplier.logo}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">{supplier.name}</h3>
                  <Badge className="bg-blue-500 text-white text-[10px] h-4 px-1">
                    新入驻
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {supplier.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.certs.slice(0, 3).map((cert) => (
                    <span
                      key={cert}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-gold-200 text-gold-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
