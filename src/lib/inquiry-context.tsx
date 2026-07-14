"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ===== Types =====

export interface ChatMessage {
  id: string;
  inquiryId: string;
  sender: "buyer" | "supplier";
  senderName: string;
  content: string;
  createdAt: string; // ISO string
  read: boolean;
}

export type InquiryStatus = "pending" | "replied" | "closed";

export interface Inquiry {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSpec?: string;
  productPrice?: string;
  supplier: string;
  buyer: string;
  buyerEmail: string;
  subject: string;
  message: string;
  quantity: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface CreateInquiryInput {
  productId: string;
  productName: string;
  productImage: string;
  productSpec?: string;
  productPrice?: string;
  supplier: string;
  buyer: string;
  buyerEmail: string;
  subject: string;
  message: string;
  quantity: string;
}

interface InquiryContextType {
  inquiries: Inquiry[];
  loading: boolean;
  createInquiry: (data: CreateInquiryInput) => string;
  sendMessage: (
    inquiryId: string,
    sender: "buyer" | "supplier",
    senderName: string,
    content: string
  ) => void;
  getInquiry: (id: string) => Inquiry | undefined;
  getBuyerInquiries: (buyerName: string) => Inquiry[];
  getSupplierInquiries: (supplierName: string) => Inquiry[];
  markMessagesRead: (inquiryId: string, role: "buyer" | "supplier") => void;
  closeInquiry: (id: string) => void;
  getUnreadCount: (role: "buyer" | "supplier", name: string) => number;
}

// ===== Seed Data =====

const seedInquiries: Inquiry[] = [
  {
    id: "INQ-2026-0042",
    productId: "h1",
    productName: "清真冷冻羊腿肉（分割）",
    productImage: "/media/product-lamb-skewers.jpg",
    productSpec: "10kg/箱",
    productPrice: "¥85/kg",
    supplier: "惠发食品",
    buyer: "测试采购商",
    buyerEmail: "buyer@ihf.org",
    subject: "清真冷冻羊腿肉（分割）询价",
    message: "您好，我们对清真冷冻羊腿肉（分割）感兴趣，需要500kg，请问价格和交货期？是否支持JAKIM认证？",
    quantity: "500 kg",
    status: "replied",
    createdAt: "2026-07-08T09:30:00.000Z",
    updatedAt: "2026-07-08T14:20:00.000Z",
    messages: [
      {
        id: "msg-seed-001",
        inquiryId: "INQ-2026-0042",
        sender: "buyer",
        senderName: "测试采购商",
        content: "您好，我们对清真冷冻羊腿肉（分割）感兴趣，需要500kg，请问价格和交货期？是否支持JAKIM认证？",
        createdAt: "2026-07-08T09:30:00.000Z",
        read: true,
      },
      {
        id: "msg-seed-002",
        inquiryId: "INQ-2026-0042",
        sender: "supplier",
        senderName: "惠发食品",
        content: "您好！感谢询价。500kg的清真冷冻羊腿肉（分割），报价¥85/kg，交货期7-10个工作日。我们已通过JAKIM认证，可提供证书副本。冷链运输全程温控。",
        createdAt: "2026-07-08T11:15:00.000Z",
        read: true,
      },
      {
        id: "msg-seed-003",
        inquiryId: "INQ-2026-0042",
        sender: "buyer",
        senderName: "测试采购商",
        content: "好的，请问可以提供产品样品吗？我们需要先检测品质。",
        createdAt: "2026-07-08T14:20:00.000Z",
        read: false,
      },
    ],
  },
  {
    id: "INQ-2026-0039",
    productId: "h2",
    productName: "清真预制菜 — 咖喱牛肉",
    productImage: "/media/product-curry-beef.jpg",
    productSpec: "500g/盒",
    productPrice: "¥45/盒",
    supplier: "惠发食品",
    buyer: "测试采购商",
    buyerEmail: "buyer@ihf.org",
    subject: "清真预制菜批量询价",
    message: "您好，我们需要采购2000盒清真咖喱牛肉预制菜，请提供报价和出口至东南亚的物流方案。",
    quantity: "2,000 盒",
    status: "pending",
    createdAt: "2026-07-07T10:00:00.000Z",
    updatedAt: "2026-07-07T10:00:00.000Z",
    messages: [
      {
        id: "msg-seed-004",
        inquiryId: "INQ-2026-0039",
        sender: "buyer",
        senderName: "测试采购商",
        content: "您好，我们需要采购2000盒清真咖喱牛肉预制菜，请提供报价和出口至东南亚的物流方案。",
        createdAt: "2026-07-07T10:00:00.000Z",
        read: false,
      },
    ],
  },
  {
    id: "INQ-2026-0035",
    productId: "h4",
    productName: "清真速冻调理品 — 烤鸡翅",
    productImage: "/media/product-chicken-wings.jpg",
    productSpec: "1kg/袋",
    productPrice: "¥35/kg",
    supplier: "惠发食品",
    buyer: "测试采购商",
    buyerEmail: "buyer@ihf.org",
    subject: "清真烤鸡翅询价",
    message: "请问清真烤鸡翅800kg的价格？含冷链运输到马来西亚吗？",
    quantity: "800 kg",
    status: "replied",
    createdAt: "2026-07-05T08:00:00.000Z",
    updatedAt: "2026-07-05T16:30:00.000Z",
    messages: [
      {
        id: "msg-seed-005",
        inquiryId: "INQ-2026-0035",
        sender: "buyer",
        senderName: "测试采购商",
        content: "请问清真烤鸡翅800kg的价格？含冷链运输到马来西亚吗？",
        createdAt: "2026-07-05T08:00:00.000Z",
        read: true,
      },
      {
        id: "msg-seed-006",
        inquiryId: "INQ-2026-0035",
        sender: "supplier",
        senderName: "惠发食品",
        content: "您好！800kg烤鸡翅报价¥35/kg，含国内冷链运输。出口马来西亚运费另计，约¥3/kg，全程冷链15-20天到达。可协助办理出口报关手续。",
        createdAt: "2026-07-05T16:30:00.000Z",
        read: true,
      },
    ],
  },
];

// ===== Helper Functions =====

function generateInquiryId(): string {
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `INQ-2026-${num}`;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Normalize supplier name for fuzzy matching.
 * Removes common suffixes like 有限公司, 食品, 集团 etc.
 */
function normalizeName(name: string): string {
  return name
    .replace(/有限公司|股份|集团|食品|山东|新疆|宁夏|临沂/g, "")
    .trim();
}

/**
 * Check if inquiry supplier matches the logged-in supplier name.
 */
function supplierMatch(inquirySupplier: string, userName: string): boolean {
  const a = normalizeName(inquirySupplier);
  const b = normalizeName(userName);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

// ===== Context =====

const STORAGE_KEY = "ihf_inquiries";

const InquiryContext = createContext<InquiryContextType | null>(null);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Inquiry[];
        // Merge: keep stored inquiries, but always include seed data that doesn't exist yet
        const storedIds = new Set(parsed.map((i) => i.id));
        const missingSeeds = seedInquiries.filter((s) => !storedIds.has(s.id));
        const merged = [...parsed, ...missingSeeds];
        setInquiries(merged);
        if (missingSeeds.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } else {
        // First load: use seed data
        setInquiries(seedInquiries);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInquiries));
      }
    } catch (e) {
      // Fallback to seed data on error
      setInquiries(seedInquiries);
    }
    setLoading(false);
  }, []);

  // Cross-tab sync: listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as Inquiry[];
        // Ensure seed data is always present
        const parsedIds = new Set(parsed.map((i) => i.id));
        const missingSeeds = seedInquiries.filter((s) => !parsedIds.has(s.id));
        setInquiries(missingSeeds.length > 0 ? [...parsed, ...missingSeeds] : parsed);
      } catch (err) {
        // Ignore parse errors
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist to localStorage whenever inquiries change
  const persist = useCallback((updated: Inquiry[]) => {
    setInquiries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Create a new inquiry
  const createInquiry = useCallback(
    (data: CreateInquiryInput): string => {
      const id = generateInquiryId();
      const now = new Date().toISOString();
      const initialMessage: ChatMessage = {
        id: generateMessageId(),
        inquiryId: id,
        sender: "buyer",
        senderName: data.buyer,
        content: data.message,
        createdAt: now,
        read: false,
      };
      const newInquiry: Inquiry = {
        ...data,
        id,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        messages: [initialMessage],
      };
      persist([...inquiries, newInquiry]);
      return id;
    },
    [inquiries, persist]
  );

  // Send a message in an inquiry
  const sendMessage = useCallback(
    (
      inquiryId: string,
      sender: "buyer" | "supplier",
      senderName: string,
      content: string
    ) => {
      const now = new Date().toISOString();
      const newMessage: ChatMessage = {
        id: generateMessageId(),
        inquiryId,
        sender,
        senderName,
        content,
        createdAt: now,
        read: false,
      };
      const updated = inquiries.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            messages: [...inq.messages, newMessage],
            updatedAt: now,
            // If supplier replies, mark as "replied"; if buyer sends to a replied inquiry, keep "replied"
            status:
              sender === "supplier" && inq.status === "pending"
                ? ("replied" as InquiryStatus)
                : inq.status,
          };
        }
        return inq;
      });
      persist(updated);
    },
    [inquiries, persist]
  );

  // Get a single inquiry by ID
  const getInquiry = useCallback(
    (id: string): Inquiry | undefined => {
      return inquiries.find((i) => i.id === id);
    },
    [inquiries]
  );

  // Get inquiries for a buyer
  const getBuyerInquiries = useCallback(
    (buyerName: string): Inquiry[] => {
      return inquiries.filter(
        (i) =>
          i.buyer === buyerName ||
          i.buyer === "测试采购商" // Always include seed data for demo
      );
    },
    [inquiries]
  );

  // Get inquiries for a supplier
  const getSupplierInquiries = useCallback(
    (supplierName: string): Inquiry[] => {
      return inquiries.filter(
        (i) =>
          supplierMatch(i.supplier, supplierName) ||
          i.supplier === "惠发食品" // Always include 惠发 seed data
      );
    },
    [inquiries]
  );

  // Mark messages as read for a given role
  const markMessagesRead = useCallback(
    (inquiryId: string, role: "buyer" | "supplier") => {
      const updated = inquiries.map((inq) => {
        if (inq.id !== inquiryId) return inq;
        return {
          ...inq,
          messages: inq.messages.map((msg) =>
            msg.sender !== role ? { ...msg, read: true } : msg
          ),
        };
      });
      persist(updated);
    },
    [inquiries, persist]
  );

  // Close an inquiry
  const closeInquiry = useCallback(
    (id: string) => {
      const updated = inquiries.map((inq) =>
        inq.id === id
          ? { ...inq, status: "closed" as InquiryStatus, updatedAt: new Date().toISOString() }
          : inq
      );
      persist(updated);
    },
    [inquiries, persist]
  );

  // Get unread message count for a role
  const getUnreadCount = useCallback(
    (role: "buyer" | "supplier", name: string): number => {
      const roleInquiries =
        role === "buyer"
          ? getBuyerInquiries(name)
          : getSupplierInquiries(name);
      return roleInquiries.reduce((count, inq) => {
        return (
          count +
          inq.messages.filter((msg) => msg.sender !== role && !msg.read).length
        );
      }, 0);
    },
    [getBuyerInquiries, getSupplierInquiries]
  );

  return (
    <InquiryContext.Provider
      value={{
        inquiries,
        loading,
        createInquiry,
        sendMessage,
        getInquiry,
        getBuyerInquiries,
        getSupplierInquiries,
        markMessagesRead,
        closeInquiry,
        getUnreadCount,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) {
    throw new Error("useInquiry must be used within InquiryProvider");
  }
  return ctx;
}
