"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { products as seedProducts, type Product } from "@/lib/data";

// ===== Types =====

export type ProductStatus =
  | "draft"        // 草稿
  | "pending"      // 待审核
  | "approved"     // 已通过（已上架）
  | "rejected"     // 已驳回
  | "offline"      // 已下架
  | "deleted";     // 已删除（软删除）

export interface ManagedProduct extends Product {
  status: ProductStatus;
  rejectReason?: string;
  updatedAt: string;
  createdAt: string;
  createdBy: string;
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
  deleteProduct: (id: string) => void; // soft delete
  restoreProduct: (id: string) => void; // restore from soft delete
  getProductById: (id: string) => ManagedProduct | undefined;
  // Admin operations
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;
  takeDownProduct: (id: string) => void; // 下架
  relistProduct: (id: string) => void;  // 重新上架
  // Queries
  getApprovedProducts: () => ManagedProduct[]; // 前台展示用
  getPendingProducts: () => ManagedProduct[];
  getProductsBySupplier: (supplierName: string) => ManagedProduct[];
  getDeletedProducts: () => ManagedProduct[];
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  addProduct: () => "",
  updateProduct: () => {},
  deleteProduct: () => {},
  restoreProduct: () => {},
  getProductById: () => undefined,
  approveProduct: () => {},
  rejectProduct: () => {},
  takeDownProduct: () => {},
  relistProduct: () => {},
  getApprovedProducts: () => [],
  getPendingProducts: () => [],
  getProductsBySupplier: () => [],
  getDeletedProducts: () => [],
});

const STORAGE_KEY = "ihf_products_v2";

// ===== Seed data: convert static products to ManagedProduct =====

function createSeedProducts(): ManagedProduct[] {
  const now = new Date().toISOString();
  return seedProducts.map((p) => ({
    ...p,
    status: "approved" as ProductStatus,
    createdAt: now,
    updatedAt: now,
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
          // Merge: add any seed products that don't exist in localStorage
          // (handles case where data.ts was updated with new seed products)
          const existingIds = new Set(parsed.map((p) => p.id));
          const newSeeds = createSeedProducts().filter((p) => !existingIds.has(p.id));
          setProducts([...newSeeds, ...parsed]);
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

  // ===== CRUD =====

  const addProduct: ProductContextType["addProduct"] = useCallback((product) => {
    const now = new Date().toISOString();
    const id = product.id || `SKU-${Date.now()}`;
    const newProduct: ManagedProduct = {
      ...product,
      id,
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
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteProduct: ProductContextType["deleteProduct"] = useCallback((id) => {
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
  }, []);

  const restoreProduct: ProductContextType["restoreProduct"] = useCallback((id) => {
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
  }, []);

  const getProductById: ProductContextType["getProductById"] = useCallback(
    (id) => products.find((p) => p.id === id),
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

  const takeDownProduct: ProductContextType["takeDownProduct"] = useCallback((id) => {
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
  }, []);

  const relistProduct: ProductContextType["relistProduct"] = useCallback((id) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, status: "approved" as ProductStatus, updatedAt: new Date().toISOString() }
          : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
