"use client";

import { Heart, ShoppingCart, Trash2, Store, Package, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useFavorites } from "@/lib/favorites-context";
import { useProducts } from "@/lib/product-context";
import { useState } from "react";
import { InquiryDialog } from "@/components/inquiry/InquiryDialog";
import { IMAGE_PLACEHOLDER_DATAURI } from "@/lib/product-images";

export function BuyerFavorites() {
  const { getProductFavorites, getSupplierFavorites, removeFavorite, favorites } = useFavorites();
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState<"products" | "suppliers">("products");
  const [inquiryProduct, setInquiryProduct] = useState<{
    id: string;
    name: string;
    image: string;
    spec?: string;
    priceRange?: string;
    supplier: string;
    certType?: string;
  } | null>(null);

  const productFavorites = getProductFavorites();
  const supplierFavorites = getSupplierFavorites();

  // Get full product details for favorited products
  const favoritedProducts = productFavorites
    .map((fav) => products.find((p) => p.id === fav.id))
    .filter(Boolean);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(id);
  };

  const handleInquiry = (product: typeof favoritedProducts[number], e: React.MouseEvent) => {
    if (!product) return;
    e.preventDefault();
    e.stopPropagation();
    setInquiryProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      spec: product.spec,
      priceRange: product.priceRange,
      supplier: product.supplier,
      certType: product.certType,
    });
  };

  // ===== Empty state =====
  if (productFavorites.length === 0 && supplierFavorites.length === 0) {
    return (
      <section id="favorites" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="我的收藏夹"
            subtitle="收藏的产品与供应商，支持批量询价与产品对比"
            theme="trust"
          />
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-trust-50 flex items-center justify-center">
              <Heart className="h-10 w-10 text-trust-300" />
            </div>
            <h3 className="text-lg font-semibold text-trust-900 mb-2">暂无收藏内容</h3>
            <p className="text-sm text-muted-foreground mb-6">
              在浏览产品时点击右上角爱心按钮即可收藏，方便后续查看和批量询价
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-trust-600 text-white rounded-lg font-medium hover:bg-trust-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              去产品大厅看看
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="favorites" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="我的收藏夹"
          subtitle="收藏的产品与供应商，支持批量询价与产品对比"
          theme="trust"
        />

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "products"
                  ? "border-trust-600 text-trust-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              产品收藏 ({productFavorites.length})
            </button>
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "suppliers"
                  ? "border-trust-600 text-trust-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="h-4 w-4" />
              供应商收藏 ({supplierFavorites.length})
            </button>
          </div>
        </div>

        {/* ===== Product Favorites ===== */}
        {activeTab === "products" && (
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-trust-600" />
              </div>
            ) : favoritedProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-2 text-trust-300" />
                <p>暂无已收藏的产品</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {favoritedProducts.map((product) => {
                    if (!product) return null;
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        {/* Image */}
                        <div className="relative h-36 bg-gradient-to-br from-trust-100 to-trust-200 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI;
                            }}
                          />
                          <button
                            onClick={(e) => handleRemove(product.id, e)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-trust-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{product.supplier}</p>

                          {/* Cert */}
                          {product.certType && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              <span className="px-1.5 py-0.5 text-[10px] bg-trust-50 text-trust-600 rounded font-medium">
                                {product.certType}
                              </span>
                              {product.isHot && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-orange-50 text-orange-600 rounded font-medium">
                                  热门
                                </span>
                              )}
                            </div>
                          )}

                          {/* Price + MOQ */}
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className="text-trust-700 font-semibold">{product.priceRange}</span>
                            <span className="text-muted-foreground">MOQ: {product.moq}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleInquiry(product, e)}
                              className="flex-1 py-1.5 text-xs bg-trust-600 text-white rounded-lg font-medium hover:bg-trust-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              询价
                            </button>
                            <button
                              onClick={(e) => handleRemove(product.id, e)}
                              className="px-2 py-1.5 text-xs border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Batch actions */}
                <div className="mt-6">
                  <div className="flex items-center justify-between bg-trust-50 rounded-xl p-4">
                    <span className="text-sm text-trust-700">
                      已收藏 {productFavorites.length} 个产品，支持批量询价与产品对比
                    </span>
                    <button className="px-4 py-2 text-sm bg-trust-600 text-white rounded-lg font-medium hover:bg-trust-700 transition-colors">
                      批量询价
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== Supplier Favorites ===== */}
        {activeTab === "suppliers" && (
          <div className="max-w-5xl mx-auto">
            {supplierFavorites.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Store className="h-10 w-10 mx-auto mb-2 text-trust-300" />
                <p>暂无已收藏的供应商</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-white rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-trust-100 to-trust-200 flex items-center justify-center">
                          <Store className="h-6 w-6 text-trust-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-trust-900 text-sm line-clamp-1">{fav.name}</h3>
                          <p className="text-xs text-muted-foreground">供应商</p>
                        </div>
                        <button
                          onClick={(e) => handleRemove(fav.id, e)}
                          className="w-8 h-8 rounded-lg border hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/store/${fav.id}`}
                          className="flex-1 py-1.5 text-xs bg-trust-600 text-white rounded-lg font-medium hover:bg-trust-700 transition-colors text-center"
                        >
                          访问店铺
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inquiry Dialog */}
      {inquiryProduct && (
        <InquiryDialog
          open={true}
          onClose={() => setInquiryProduct(null)}
          product={inquiryProduct}
        />
      )}
    </section>
  );
}
