"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ===== Types =====

export interface Quote {
  id: string;
  inquiryId: string;
  inquiryProductName: string;
  inquiryProductImage: string;
  inquiryBuyerName: string;
  supplier: string;
  supplierEmail: string;
  unitPrice: string;      // 报价单价（供应商填写，自由格式，如 "¥85/kg" 或 "$2.5/盒"）
  unit: string;           // 计价单位（kg/箱/盒/袋/瓶/个）
  moq: string;            // 最低起订量
  deliveryDays: string;   // 交货期（天）
  validDays: string;      // 报价有效期（天）
  message: string;        // 报价说明（产品优势、认证、服务等）
  createdAt: string;
}

export interface CreateQuoteInput {
  inquiryId: string;
  inquiryProductName: string;
  inquiryProductImage: string;
  inquiryBuyerName: string;
  supplier: string;
  supplierEmail: string;
  unitPrice: string;
  unit: string;
  moq: string;
  deliveryDays: string;
  validDays: string;
  message: string;
}

interface QuoteContextType {
  quotes: Quote[];
  loading: boolean;
  createQuote: (data: CreateQuoteInput) => string;
  getQuotesByInquiry: (inquiryId: string) => Quote[];
  getQuotesBySupplier: (supplierEmail: string) => Quote[];
  getQuoteCount: (inquiryId: string) => number;
  hasSupplierQuoted: (inquiryId: string, supplierEmail: string) => boolean;
}

// ===== Helper =====

function generateQuoteId(): string {
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `QUO-2026-${num}`;
}

// ===== Context =====

const STORAGE_KEY = "ihf_quotes";

const QuoteContext = createContext<QuoteContextType | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Quote[];
        setQuotes(parsed);
      }
    } catch (e) {
      // Ignore parse errors, start fresh
    }
    setLoading(false);
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as Quote[];
        setQuotes(parsed);
      } catch (err) {
        // Ignore parse errors
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist helper
  const persist = useCallback((updated: Quote[]) => {
    setQuotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Create a new quote
  const createQuote = useCallback(
    (data: CreateQuoteInput): string => {
      const id = generateQuoteId();
      const now = new Date().toISOString();
      const newQuote: Quote = {
        ...data,
        id,
        createdAt: now,
      };
      persist([...quotes, newQuote]);
      return id;
    },
    [quotes, persist]
  );

  // Query helpers
  const getQuotesByInquiry = useCallback(
    (inquiryId: string): Quote[] => {
      return quotes.filter((q) => q.inquiryId === inquiryId);
    },
    [quotes]
  );

  const getQuotesBySupplier = useCallback(
    (supplierEmail: string): Quote[] => {
      return quotes.filter((q) => q.supplierEmail === supplierEmail);
    },
    [quotes]
  );

  const getQuoteCount = useCallback(
    (inquiryId: string): number => {
      return quotes.filter((q) => q.inquiryId === inquiryId).length;
    },
    [quotes]
  );

  const hasSupplierQuoted = useCallback(
    (inquiryId: string, supplierEmail: string): boolean => {
      return quotes.some(
        (q) => q.inquiryId === inquiryId && q.supplierEmail === supplierEmail
      );
    },
    [quotes]
  );

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        loading,
        createQuote,
        getQuotesByInquiry,
        getQuotesBySupplier,
        getQuoteCount,
        hasSupplierQuoted,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return ctx;
}
