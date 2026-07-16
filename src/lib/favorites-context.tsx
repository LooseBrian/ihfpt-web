"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ===== Types =====

type FavoriteType = "product" | "supplier";

interface FavoriteItem {
  id: string;          // product id or supplier id
  type: FavoriteType;
  name: string;
  image?: string;
  supplier?: string;
  priceRange?: string;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  // Product favorites
  toggleProductFavorite: (product: { id: string; name: string; image?: string; supplier?: string; priceRange?: string }) => void;
  // Supplier favorites
  toggleSupplierFavorite: (supplier: { id: string; name: string; image?: string }) => void;
  // Queries
  isFavorited: (id: string) => boolean;
  getProductFavorites: () => FavoriteItem[];
  getSupplierFavorites: () => FavoriteItem[];
  removeFavorite: (id: string) => void;
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleProductFavorite: () => {},
  toggleSupplierFavorite: () => {},
  isFavorited: () => false,
  getProductFavorites: () => [],
  getSupplierFavorites: () => [],
  removeFavorite: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = "ihf_favorites";

// ===== Provider =====

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: FavoriteItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage
  const persist = useCallback((updated: FavoriteItem[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed: FavoriteItem[] = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ===== Actions =====

  const toggleProductFavorite: FavoritesContextType["toggleProductFavorite"] = useCallback((product) => {
    setFavorites((prev) => {
      const existing = prev.find((f) => f.id === product.id && f.type === "product");
      if (existing) {
        const updated = prev.filter((f) => f.id !== product.id);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      }
      const newItem: FavoriteItem = {
        id: product.id,
        type: "product",
        name: product.name,
        image: product.image,
        supplier: product.supplier,
        priceRange: product.priceRange,
        addedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const toggleSupplierFavorite: FavoritesContextType["toggleSupplierFavorite"] = useCallback((supplier) => {
    setFavorites((prev) => {
      const existing = prev.find((f) => f.id === supplier.id && f.type === "supplier");
      if (existing) {
        const updated = prev.filter((f) => f.id !== supplier.id);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      }
      const newItem: FavoriteItem = {
        id: supplier.id,
        type: "supplier",
        name: supplier.name,
        image: supplier.image,
        addedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const isFavorited: FavoritesContextType["isFavorited"] = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const getProductFavorites: FavoritesContextType["getProductFavorites"] = useCallback(
    () => favorites.filter((f) => f.type === "product"),
    [favorites]
  );

  const getSupplierFavorites: FavoritesContextType["getSupplierFavorites"] = useCallback(
    () => favorites.filter((f) => f.type === "supplier"),
    [favorites]
  );

  const removeFavorite: FavoritesContextType["removeFavorite"] = useCallback((id) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearAll: FavoritesContextType["clearAll"] = useCallback(() => {
    setFavorites([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleProductFavorite,
        toggleSupplierFavorite,
        isFavorited,
        getProductFavorites,
        getSupplierFavorites,
        removeFavorite,
        clearAll,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
