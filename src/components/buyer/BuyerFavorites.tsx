import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const favorites = [
  {
    name: "清真冷冻羊腿肉",
    supplier: "山东惠发食品有限公司",
    price: "¥85 - ¥92 / kg",
    moq: "200 kg",
    certs: ["HALAL", "JAKIM"],
    image: "https://loremflickr.com/300/200/meat,lamb",
  },
  {
    name: "清真预制菜 — 咖喱牛肉",
    supplier: "临沂清真食品有限公司",
    price: "¥45 - ¥55 / box",
    moq: "500 box",
    certs: ["HALAL", "MUI"],
    image: "https://loremflickr.com/300/200/curry,beef",
  },
  {
    name: "清真速冻饺子",
    supplier: "新疆天山食品集团",
    price: "¥28 - ¥35 / bag",
    moq: "1,000 bag",
    certs: ["HALAL", "出口备案"],
    image: "https://loremflickr.com/300/200/dumpling,frozen",
  },
  {
    name: "清真复合调味料",
    supplier: "宁夏塞上香食品",
    price: "¥15 - ¥22 / kg",
    moq: "300 kg",
    certs: ["HALAL", "SC"],
    image: "https://loremflickr.com/300/200/spice,seasoning",
  },
];

export function BuyerFavorites() {
  return (
    <section id="favorites" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="我的收藏夹"
          subtitle="收藏的产品与供应商，支持批量询价与产品对比"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {favorites.map((product) => (
            <div
              key={product.name}
              className="bg-muted/30 rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-36 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-brand-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.supplier}</p>

                {/* Certs */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.certs.map((cert) => (
                    <span
                      key={cert}
                      className="px-1.5 py-0.5 text-[10px] bg-brand-50 text-brand-600 rounded font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Price + MOQ */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-brand-700 font-semibold">{product.price}</span>
                  <span className="text-muted-foreground">MOQ: {product.moq}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 text-xs bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    询价
                  </button>
                  <button className="px-2 py-1.5 text-xs border rounded-lg hover:bg-muted transition-colors">
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Batch actions */}
        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex items-center justify-between bg-brand-50 rounded-xl p-4">
            <span className="text-sm text-brand-700">
              已收藏 {favorites.length} 个产品，支持批量询价与产品对比
            </span>
            <button className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
              批量询价
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
