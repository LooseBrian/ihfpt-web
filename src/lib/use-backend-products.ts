"use client";

import { useState, useEffect, useCallback } from "react";
import { userApi, type BackendProduct } from "@/lib/api-client";
import type { ManagedProduct } from "@/lib/product-context";
import type { ProductVideo } from "@/lib/data";
import { getDefaultProductImage } from "@/lib/product-images";

/**
 * Map a backend product to the frontend ManagedProduct shape.
 * Used by ProductsSection and products page to display API data.
 */
export function mapBackendProduct(bp: BackendProduct): ManagedProduct & {
  supplierCompany?: string;
  supplierLocation?: string;
  supplierTier?: string;
  categoryName?: string;
} {
  // Build price range string: "CURRENCY PRICE / UNIT" or "面议"
  const priceVal = parseFloat(bp.price || "0");
  const priceRange = priceVal > 0
    ? `¥${priceVal.toFixed(2)} / ${bp.unit || "件"}`
    : "面议";

  // Build MOQ string: "QTY UNIT" or "面议"
  const moqVal = parseInt(bp.min_order_quantity || "0");
  const moq = moqVal > 0
    ? `${moqVal} ${bp.unit || "件"}`
    : "面议";

  const defaultImg = getDefaultProductImage({ name: bp.name, category: bp.category_name });

  // Prefer the ASIN-like SKU code as the canonical id so URLs become
  // `/product?id=PTJJUHG5T7`; fall back to the legacy `backend-{id}` form
  // when the backend has not yet returned a `sku_code`.
  const skuCode = bp.sku_code || undefined;

  return {
    id: skuCode || `backend-${bp.id}`,
    skuCode,
    name: bp.name,
    nameEn: "",
    spec: bp.specifications || "",
    moq,
    priceRange,
    supplier: bp.supplier_name || bp.supplier_company || "未知供应商",
    certType: bp.halal_cert_type || "",
    image: defaultImg,
    images: [defaultImg],
    videos: [] as ProductVideo[],
    category: bp.category_name || "",
    subcategory: "",
    origin: bp.origin || "",
    description: bp.description || "",
    certBody: bp.halal_cert_type || "",
    certNumber: bp.halal_cert_number || "",
    status: "approved",
    updatedAt: bp.updated_at || "",
    createdAt: bp.created_at || "",
    createdBy: bp.supplier_name || "",
    imageCount: 0,
    videoCount: 0,
    keywords: [],
    // Extra backend-specific fields
    supplierCompany: bp.supplier_company,
    supplierLocation: bp.supplier_location,
    supplierTier: bp.supplier_tier,
    categoryName: bp.category_name,
  };
}

/**
 * Hook: fetch approved products from the backend API.
 * Merges with optionally provided local products.
 */
export function useBackendProducts(options?: {
  category_id?: number;
  search?: string;
  per_page?: number;
}) {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userApi.getProducts({
        per_page: options?.per_page ?? 60,
        category_id: options?.category_id,
        search: options?.search,
        sort: "newest",
      });
      setProducts(result?.data ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch products";
      setError(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options?.category_id, options?.search, options?.per_page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
