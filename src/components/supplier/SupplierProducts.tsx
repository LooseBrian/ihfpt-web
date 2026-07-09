import { Plus, Eye, Edit, Trash2, CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const products = [
  {
    id: "SKU-2026-0188",
    name: "清真冷冻羊腿肉（分割）",
    category: "牛羊肉制品",
    price: "¥85 - ¥92 / kg",
    moq: "200 kg",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/meat,lamb",
  },
  {
    id: "SKU-2026-0185",
    name: "清真预制菜 — 咖喱牛肉",
    category: "清真预制菜",
    price: "¥45 - ¥55 / box",
    moq: "500 box",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/curry,beef",
  },
  {
    id: "SKU-2026-0179",
    name: "清真速冻调理品 — 烤鸡翅",
    category: "速冻调理品",
    price: "¥32 - ¥38 / kg",
    moq: "300 kg",
    status: "reviewing",
    statusText: "待审核",
    image: "https://loremflickr.com/120/80/chicken,roasted",
  },
  {
    id: "SKU-2026-0172",
    name: "清真复合调味料 — 孜然粉",
    category: "调味品",
    price: "¥15 - ¥22 / kg",
    moq: "300 kg",
    status: "listed",
    statusText: "已上架",
    image: "https://loremflickr.com/120/80/spice,cumin",
  },
  {
    id: "SKU-2026-0168",
    name: "清真速冻饺子 — 牛肉洋葱",
    category: "速冻调理品",
    price: "¥28 - ¥35 / bag",
    moq: "1,000 bag",
    status: "offline",
    statusText: "已下架",
    image: "https://loremflickr.com/120/80/dumpling,frozen",
  },
];

const statusConfig = {
  listed: { icon: CheckCircle2, color: "text-brand-600 bg-brand-50" },
  reviewing: { icon: Clock, color: "text-gold-600 bg-gold-50" },
  offline: { icon: XCircle, color: "text-muted-foreground bg-muted" },
};

export function SupplierProducts() {
  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="产品管理"
          subtitle="产品 SKU 管理 — 多级分类、属性参数、图片资源、价格库存、上下架审核"
        />

        <div className="max-w-5xl mx-auto">
          {/* New product button */}
          <div className="flex justify-end mb-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg font-medium text-sm hover:bg-brand-700 transition-colors">
              <Plus className="h-4 w-4" />
              发布新产品
            </button>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1">图片</div>
              <div className="col-span-2">产品编号</div>
              <div className="col-span-3">产品名称</div>
              <div className="col-span-2">品类</div>
              <div className="col-span-2">价格 / MOQ</div>
              <div className="col-span-1">状态</div>
              <div className="col-span-1">操作</div>
            </div>

            {/* Table rows */}
            {products.map((product) => {
              const status = statusConfig[product.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-t border-border/40 hover:bg-muted/20 transition-colors items-center"
                >
                  {/* Image */}
                  <div className="md:col-span-1">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                  </div>
                  {/* SKU */}
                  <div className="md:col-span-2">
                    <span className="text-xs font-mono text-brand-600 font-medium">{product.id}</span>
                  </div>
                  {/* Name */}
                  <div className="md:col-span-3">
                    <span className="text-sm text-foreground font-medium">{product.name}</span>
                  </div>
                  {/* Category */}
                  <div className="md:col-span-2">
                    <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-medium">
                      {product.category}
                    </span>
                  </div>
                  {/* Price + MOQ */}
                  <div className="md:col-span-2">
                    <div className="text-sm text-brand-700 font-semibold">{product.price}</div>
                    <div className="text-xs text-muted-foreground">MOQ: {product.moq}</div>
                  </div>
                  {/* Status */}
                  <div className="md:col-span-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {product.statusText}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-brand-600 transition-colors" title="编辑">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-brand-600 transition-colors" title="预览">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors" title="下架">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Product management features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">多级分类</span>
              </div>
              <p className="text-xs text-muted-foreground">6 大品类多级分类管理，灵活配置属性参数</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-gold-600" />
                <span className="text-sm font-bold text-brand-900">多语言内容</span>
              </div>
              <p className="text-xs text-muted-foreground">中 / 英 / 印尼语 / 阿拉伯语多语言产品内容管理</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-bold text-brand-900">上下架审核</span>
              </div>
              <p className="text-xs text-muted-foreground">产品上架需平台审核，保障合规与品质标准</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
