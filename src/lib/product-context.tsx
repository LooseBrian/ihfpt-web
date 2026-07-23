"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { products as seedProducts, type Product } from "@/lib/data";
import { userApi, type BackendProduct } from "@/lib/api-client";
import { getDefaultProductImage, sanitizeProductImage } from "@/lib/product-images";
// NOTE: generateProductSKU is intentionally NOT imported here.
// Following the Amazon ASIN model, SKU codes are generated ONLY by the
// backend (CodeGenerator::generateProductCode). The frontend must use
// the sku_code returned by the API response, never generate its own.

// ===== Types =====

export type ProductStatus =
  | "draft"        // 草稿
  | "pending"      // 待审核
  | "approved"     // 已通过（已上架）
  | "rejected"     // 已驳回
  | "offline"      // 已下架
  | "deleted";     // 已删除（软删除）

export interface ManagedProduct extends Product {
  // skuCode is inherited from Product; it carries the ASIN-like SKU code
  // (`PT` + 8 chars) used for routing and display.
  status: ProductStatus;
  rejectReason?: string;
  updatedAt: string;
  createdAt: string;
  createdBy: string;
  backendId?: number; // 后端数据库产品 ID（通过 API 创建时返回）
  imageCount?: number;
  videoCount?: number;
  keywords?: string[];
  description?: string;
  brand?: string;
  model?: string;
  origin?: string;
  certBody?: string;
  certNumber?: string;
  subcategory?: string;
  moqRange?: string;
  supplierQuals?: string[];
  services?: string[];
  exportRegions?: string[];
}

interface ProductContextType {
  products: ManagedProduct[];
  loading: boolean;
  // CRUD
  addProduct: (product: Omit<ManagedProduct, "id" | "status" | "createdAt" | "updatedAt" | "createdBy"> & { id?: string }) => string;
  updateProduct: (id: string, updates: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => Promise<boolean>; // soft delete → recycle bin (calls backend)
  restoreProduct: (id: string) => Promise<boolean>; // restore from recycle bin (calls backend)
  getProductById: (id: string) => ManagedProduct | undefined;
  // Admin operations
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;
  takeDownProduct: (id: string) => Promise<boolean>; // 下架 (calls backend)
  relistProduct: (id: string) => Promise<boolean>;   // 重新上架 → 重新提交审核 (calls backend)
  // Queries
  getApprovedProducts: () => ManagedProduct[]; // 前台展示用
  getPendingProducts: () => ManagedProduct[];
  getProductsBySupplier: (supplierName: string) => ManagedProduct[];
  getDeletedProducts: () => ManagedProduct[];
  // Backend sync
  refreshFromBackend: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  addProduct: () => "",
  updateProduct: () => {},
  deleteProduct: async () => false,
  restoreProduct: async () => false,
  getProductById: () => undefined,
  approveProduct: () => {},
  rejectProduct: () => {},
  takeDownProduct: async () => false,
  relistProduct: async () => false,
  getApprovedProducts: () => [],
  getPendingProducts: () => [],
  getProductsBySupplier: () => [],
  getDeletedProducts: () => [],
  refreshFromBackend: async () => {},
});

const STORAGE_KEY = "ihf_products_v6";

// ===== Seed data: convert static products to ManagedProduct =====

// Use a FIXED old timestamp for seed products so they don't appear as "newest"
// in the product hall. Previously this used `new Date().toISOString()` which
// gave seed products the current time on every page load, causing them to
// always rank above backend-created products in "新品优先" sort.
const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z";

function createSeedProducts(): ManagedProduct[] {
  return seedProducts.map((p) => ({
    ...p,
    status: "approved" as ProductStatus,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    createdBy: p.supplier,
  }));
}

// ===== Provider =====

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage or seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ManagedProduct[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Clean up stale blob: URLs that were saved before the base64 fix.
          // blob: URLs are session-specific and become invalid on page reload,
          // causing "暂无图片" on the product detail page.
          let needsCleanup = false;
          const cleaned = parsed.map((p) => {
            const sanitizedImage = sanitizeProductImage(p.image, {
              name: p.name,
              category: p.category,
            });
            let images = p.images;
            if (images && images.length > 0) {
              const cleanedImages = images.map((url) =>
                sanitizeProductImage(url, { name: p.name, category: p.category })
              );
              if (cleanedImages.some((url, i) => url !== images![i])) {
                images = cleanedImages;
                needsCleanup = true;
              }
            }
            if (sanitizedImage !== p.image) {
              needsCleanup = true;
            }
            // Ensure images array is never empty — fall back to [sanitizedImage]
            if (!images || images.length === 0) {
              images = [sanitizedImage];
              needsCleanup = true;
            }
            // Clean up stale blob: URLs in the videos array.
            // Videos can't be base64-encoded (too large), so blob: URLs for
            // videos are always session-specific. Remove them on reload to
            // avoid broken video players on the product detail page.
            let videos = p.videos;
            if (videos && videos.length > 0) {
              const validVideos = videos.filter(
                (v) => v.url && !v.url.startsWith("blob:")
              );
              if (validVideos.length !== videos.length) {
                videos = validVideos;
                needsCleanup = true;
              }
            }
            return { ...p, image: sanitizedImage, images, videos };
          });

          // Merge: add any seed products that don't exist in localStorage
          const existingIds = new Set(cleaned.map((p) => p.id));
          const newSeeds = createSeedProducts().filter((p) => !existingIds.has(p.id));
          const finalProducts = [...newSeeds, ...cleaned];
          setProducts(finalProducts);

          if (needsCleanup) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProducts));
          }
        } else {
          const seeds = createSeedProducts();
          setProducts(seeds);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
        }
      } else {
        const seeds = createSeedProducts();
        setProducts(seeds);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      }
    } catch {
      const seeds = createSeedProducts();
      setProducts(seeds);
    }
    setLoading(false);
  }, []);

  // Persist to localStorage whenever products change
  const persist = useCallback((updated: ManagedProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed: ManagedProduct[] = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ===== Backend sync: fetch approved products from API =====

  const syncFromBackend = useCallback(async () => {
    try {
      const response = await userApi.getProducts({ per_page: 100 });
      const backendProducts: BackendProduct[] = response.data || [];

      // Also fetch the supplier's own products (all statuses) to sync
      // reject_reason and non-approved statuses. This call requires
      // authentication and will silently fail for unauthenticated users.
      const myProductsById = new Map<number, BackendProduct>();
      try {
        const myRes = await userApi.getMyProducts({ per_page: 100 });
        const myProducts: BackendProduct[] = myRes.data || [];
        for (const bp of myProducts) {
          const id = parseInt(bp.id, 10);
          if (!isNaN(id)) {
            myProductsById.set(id, bp);
          }
        }
      } catch {
        // Not authenticated or error — skip supplier-specific sync
      }

      // Build a set of backend IDs that are currently approved
      const approvedBackendIds = new Set<number>();
      // Also build a lookup map for updating product fields during sync
      const backendById = new Map<number, BackendProduct>();
      for (const bp of backendProducts) {
        if (bp.status === "approved") {
          const id = parseInt(bp.id, 10);
          if (!isNaN(id)) {
            approvedBackendIds.add(id);
            backendById.set(id, bp);
          }
        }
      }

      setProducts((prev) => {
        let changed = false;
        const updated = [...prev];

        // Phase 1: Update existing products with backendId
        for (let i = 0; i < updated.length; i++) {
          const p = updated[i];
          if (!p.backendId) continue;

          if (approvedBackendIds.has(p.backendId)) {
            // Backend confirms this product is approved.
            const bp = backendById.get(p.backendId);

            // Sync product name and other display fields from backend
            // (fixes garbled/updated names that differ between localStorage and DB)
            const nameChanged = bp && bp.name && bp.name !== p.name;
            const specChanged = bp && bp.specifications && bp.specifications !== p.spec;
            const priceChanged = bp && bp.price && `$${bp.price}` !== p.priceRange;
            // Sync the ASIN-like SKU code from the backend `sku_code` field.
            // When present it becomes the canonical routing/display identifier.
            const skuCodeChanged = !!bp?.sku_code && bp.sku_code !== p.skuCode;

            // Also sanitize the image path: fix legacy "/product-*" paths,
            // replace stale blob: URLs, and replace empty images with defaults.
            const sanitizedName = bp?.name || p.name;
            const sanitizedCategory = bp?.category_name || p.category;
            const sanitizedImage = sanitizeProductImage(p.image, {
              name: sanitizedName,
              category: sanitizedCategory,
            });
            const needsImageFix = sanitizedImage !== p.image;

            // Also clean up stale blob: URLs in the images array.
            // (Products created before the base64 fix have blob: URLs that
            // are invalidated on page reload, causing "暂无图片" on the detail page.)
            let sanitizedImages: string[] | undefined;
            if (p.images && p.images.length > 0) {
              const cleaned = p.images.map((url) =>
                sanitizeProductImage(url, { name: sanitizedName, category: sanitizedCategory })
              );
              // Only update if something changed
              if (cleaned.some((url, i) => url !== p.images![i])) {
                sanitizedImages = cleaned;
              }
            }

            // Clean up stale blob: URLs in videos (session-specific, don't persist)
            let sanitizedVideos = p.videos;
            if (p.videos && p.videos.length > 0) {
              const validVideos = p.videos.filter(
                (v) => v.url && !v.url.startsWith("blob:")
              );
              if (validVideos.length !== p.videos.length) {
                sanitizedVideos = validVideos;
              }
            }

            const needsUpdate = p.status !== "approved" || needsImageFix || sanitizedImages ||
              sanitizedVideos !== p.videos || nameChanged || specChanged || priceChanged ||
              skuCodeChanged;

            if (needsUpdate) {
              updated[i] = {
                ...p,
                status: "approved" as ProductStatus,
                rejectReason: undefined,
                ...(nameChanged ? { name: bp!.name } : {}),
                ...(specChanged ? { spec: bp!.specifications || "" } : {}),
                ...(priceChanged ? { priceRange: `$${bp!.price}` } : {}),
                ...(skuCodeChanged ? { skuCode: bp!.sku_code ?? undefined } : {}),
                ...(bp?.supplier_name ? { supplier: bp.supplier_name } : {}),
                ...(needsImageFix ? { image: sanitizedImage } : {}),
                ...(sanitizedImages ? { images: sanitizedImages } : {}),
                ...(!p.images || p.images.length === 0
                  ? { images: [sanitizedImage] }
                  : {}),
                ...(sanitizedVideos !== p.videos ? { videos: sanitizedVideos } : {}),
              };
              changed = true;
            }
          } else {
            // Product was previously synced but is no longer approved.
            // Check the supplier's own products for the actual status
            // (e.g. "rejected" with a reject_reason from admin review).
            const myBp = myProductsById.get(p.backendId);
            if (myBp && myBp.status === "rejected") {
              const reasonChanged = myBp.reject_reason !== p.rejectReason;
              const statusChanged = p.status !== "rejected";
              const skuCodeChanged = !!myBp.sku_code && myBp.sku_code !== p.skuCode;
              if (statusChanged || reasonChanged || skuCodeChanged) {
                updated[i] = {
                  ...p,
                  status: "rejected" as ProductStatus,
                  rejectReason: myBp.reject_reason || undefined,
                  ...(skuCodeChanged ? { skuCode: myBp.sku_code ?? undefined } : {}),
                };
                changed = true;
              }
            } else if (myBp && myBp.status === "pending") {
              // Product is back to pending (e.g. supplier resubmitted after rejection)
              if (p.status !== "pending") {
                updated[i] = {
                  ...p,
                  status: "pending" as ProductStatus,
                  rejectReason: undefined,
                };
                changed = true;
              }
            } else if (p.status === "approved") {
              // Previously approved but no longer in the approved list
              updated[i] = {
                ...p,
                status: "offline" as ProductStatus,
              };
              changed = true;
            }
          }
        }

        // Phase 2: Add new approved products from backend not yet in localStorage
        for (const bp of backendProducts) {
          if (bp.status !== "approved") continue;

          const backendIdNum = parseInt(bp.id, 10);
          if (isNaN(backendIdNum)) continue;

          const existingIdx = updated.findIndex((p) => p.backendId === backendIdNum);
          if (existingIdx >= 0) continue; // Already handled in Phase 1

          const defaultImg = getDefaultProductImage({ name: bp.name, category: bp.category_name });
          // Use the ASIN-like SKU code as the canonical id when the backend
          // provides it, so URLs become `/product?id=PTJJUHG5T7`. Fall back to
          // the legacy `BP-{id}` form when `sku_code` is absent (backward compat).
          const skuCode = bp.sku_code || undefined;
          // Use backend media if available, otherwise fall back to default image
          const backendImages = (bp as BackendProduct).images;
          const backendVideos = (bp as BackendProduct).videos;
          const newProduct: ManagedProduct = {
            id: skuCode || `BP-${bp.id}`,
            skuCode,
            name: bp.name,
            spec: bp.specifications || "",
            moq: `${bp.min_order_quantity || ""} ${bp.unit || ""}`.trim(),
            priceRange: `$${bp.price}`,
            supplier: bp.supplier_company || bp.supplier_name || "",
            supplierCode: bp.supplier_code || undefined,
            certType: bp.halal_cert_type || "",
            image: backendImages && backendImages.length > 0 ? backendImages[0] : defaultImg,
            images: backendImages && backendImages.length > 0 ? backendImages : [defaultImg],
            videos: backendVideos || [],
            category: bp.category_name || "",
            origin: bp.origin || "",
            status: "approved" as ProductStatus,
            backendId: backendIdNum,
            createdAt: bp.created_at,
            updatedAt: bp.updated_at,
            createdBy: bp.supplier_name || "",
          };
          updated.push(newProduct);
          changed = true;
        }

        // Phase 3: Add non-approved products from the supplier's own API
        // (pending, rejected) that aren't yet in localStorage. This ensures
        // the supplier sees ALL their products, including those created via
        // the API and rejected by admin (with reject_reason).
        for (const [id, bp] of myProductsById) {
          if (bp.status === "approved") continue; // Already handled in Phase 2

          const existingIdx = updated.findIndex((p) => p.backendId === id);
          if (existingIdx >= 0) continue; // Already handled in Phase 1

          const defaultImg = getDefaultProductImage({ name: bp.name, category: bp.category_name });
          const skuCode = bp.sku_code || undefined;
          // Use backend media if available, otherwise fall back to default image
          const backendImages = (bp as BackendProduct).images;
          const backendVideos = (bp as BackendProduct).videos;
          const newProduct: ManagedProduct = {
            id: skuCode || `BP-${bp.id}`,
            skuCode,
            name: bp.name,
            spec: bp.specifications || "",
            moq: `${bp.min_order_quantity || ""} ${bp.unit || ""}`.trim(),
            priceRange: `$${bp.price}`,
            supplier: bp.supplier_company || bp.supplier_name || "",
            certType: bp.halal_cert_type || "",
            image: backendImages && backendImages.length > 0 ? backendImages[0] : defaultImg,
            images: backendImages && backendImages.length > 0 ? backendImages : [defaultImg],
            videos: backendVideos || [],
            category: bp.category_name || "",
            origin: bp.origin || "",
            status: (bp.status as ProductStatus) || "pending",
            rejectReason: bp.reject_reason || undefined,
            backendId: id,
            createdAt: bp.created_at,
            updatedAt: bp.updated_at,
            createdBy: bp.supplier_name || "",
          };
          updated.push(newProduct);
          changed = true;
        }

        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
        }

        return changed ? updated : prev;
      });
    } catch {
      // Backend not available — continue with localStorage only
    }
  }, []);

  // Sync on mount (after initial localStorage load)
  useEffect(() => {
    if (!loading) {
      syncFromBackend();
    }
  }, [loading, syncFromBackend]);

  // Sync on window focus (pick up admin approvals when user switches tabs)
  useEffect(() => {
    const handleFocus = () => syncFromBackend();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [syncFromBackend]);

  // ===== CRUD =====

  const addProduct: ProductContextType["addProduct"] = useCallback((product) => {
    const now = new Date().toISOString();
    // Amazon ASIN model: the frontend NEVER generates SKU codes.
    // The backend (CodeGenerator::generateProductCode) is the single source
    // of truth for PT+8 codes. If the product has been synced to the backend,
    // product.skuCode holds the backend-returned code. If not yet synced,
    // skuCode is undefined and a temporary local ID is used until sync.
    const skuCode = product.skuCode || undefined;
    const id = product.id || skuCode || `local-${Date.now()}`;
    const newProduct: ManagedProduct = {
      ...product,
      id,
      ...(skuCode ? { skuCode } : {}),
      status: "pending",
      createdAt: now,
      updatedAt: now,
      createdBy: product.supplier || "未知供应商",
    } as ManagedProduct;

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return id;
  }, []);

  const updateProduct: ProductContextType["updateProduct"] = useCallback((id, updates) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== id) return p;
        const merged: ManagedProduct = {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        // Preserve the existing SKU code unless the caller explicitly supplies
        // a new one. Prevents accidental wipeout via a Partial that omits it.
        if (updates.skuCode === undefined) {
          merged.skuCode = p.skuCode;
        }
        return merged;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteProduct: ProductContextType["deleteProduct"] = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    const backendId = product?.backendId;

    // Call backend API if we have a backendId
    if (backendId) {
      try {
        await userApi.deleteProduct(backendId);
      } catch {
        return false;
      }
    }

    // Update local state on success
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "deleted" as ProductStatus, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  }, [products]);

  const restoreProduct: ProductContextType["restoreProduct"] = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    const backendId = product?.backendId;

    // Call backend API if we have a backendId
    if (backendId) {
      try {
        await userApi.restoreProduct(backendId);
      } catch {
        return false;
      }
    }

    // Update local state on success
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "offline" as ProductStatus, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  }, [products]);

  const getProductById: ProductContextType["getProductById"] = useCallback(
    // Match by the canonical `id` first, then by `skuCode`. This keeps both
    // legacy URLs (`?id=huifa-beef-balls`) and SKU-based URLs
    // (`?id=PTJJUHG5T7`) working after the SKU rollout.
    (id) =>
      products.find((p) => p.id === id || (p.skuCode && p.skuCode === id)),
    [products]
  );

  // ===== Admin operations =====

  const approveProduct: ProductContextType["approveProduct"] = useCallback((id) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "approved" as ProductStatus, rejectReason: undefined, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const rejectProduct: ProductContextType["rejectProduct"] = useCallback((id, reason) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "rejected" as ProductStatus, rejectReason: reason, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const takeDownProduct: ProductContextType["takeDownProduct"] = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    const backendId = product?.backendId;

    // Call backend API if we have a backendId
    if (backendId) {
      try {
        await userApi.unlistProduct(backendId);
      } catch {
        return false;
      }
    }

    // Update local state on success
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "offline" as ProductStatus, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  }, [products]);

  const relistProduct: ProductContextType["relistProduct"] = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    const backendId = product?.backendId;

    // Call backend API to resubmit for review (offline → pending, NOT directly approved)
    if (backendId) {
      try {
        await userApi.updateProduct(backendId, { status: "pending" });
      } catch {
        return false;
      }
    }

    // Update local state on success
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "pending" as ProductStatus, rejectReason: undefined, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  }, [products]);

  // ===== Queries =====

  const getApprovedProducts: ProductContextType["getApprovedProducts"] = useCallback(
    () => products.filter((p) => p.status === "approved"),
    [products]
  );

  const getPendingProducts: ProductContextType["getPendingProducts"] = useCallback(
    () => products.filter((p) => p.status === "pending"),
    [products]
  );

  const getProductsBySupplier: ProductContextType["getProductsBySupplier"] = useCallback(
    (supplierName) => {
      // Normalize: remove common suffixes for fuzzy matching
      const normalize = (s: string) => s.replace(/有限公司|食品|集团|股份有限公司/g, "").trim();
      const normalized = normalize(supplierName);
      return products.filter(
        (p) =>
          p.supplier === supplierName ||
          p.createdBy === supplierName ||
          normalize(p.supplier).includes(normalized) ||
          normalize(p.createdBy).includes(normalized) ||
          normalized.includes(normalize(p.supplier)) ||
          normalized.includes(normalize(p.createdBy))
      );
    },
    [products]
  );

  const getDeletedProducts: ProductContextType["getDeletedProducts"] = useCallback(
    () => products.filter((p) => p.status === "deleted"),
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        getProductById,
        approveProduct,
        rejectProduct,
        takeDownProduct,
        relistProduct,
        getApprovedProducts,
        getPendingProducts,
        getProductsBySupplier,
        getDeletedProducts,
        refreshFromBackend: syncFromBackend,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
