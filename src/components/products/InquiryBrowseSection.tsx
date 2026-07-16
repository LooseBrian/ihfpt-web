"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  MessageSquare,
  TrendingUp,
  X,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useInquiry } from "@/lib/inquiry-context";
import type { Inquiry } from "@/lib/inquiry-context";

// ===== Seed public inquiries (browseable by all visitors) =====
// Images use local static assets from /public/media/ to ensure image-text match

interface PublicInquiry {
  id: string;
  productName: string;
  productImage: string;
  productSpec: string;
  category: string;
  quantity: string;
  unit: string;
  targetMarket: string;
  buyerName: string;
  buyerCountry: string;
  buyerLevel: string;
  status: "active" | "closing-soon" | "quoted" | "closed";
  quotesCount: number;
  createdAt: string;
  budget?: string;
  certRequired?: string;
  description: string;
}

const seedPublicInquiries: PublicInquiry[] = [
  {
    id: "PUB-INQ-001",
    productName: "清真冷冻羊腿肉（分割）",
    productImage: "/media/product-lamb-skewers.jpg",
    productSpec: "10kg/箱 · 分割肉",
    category: "牛羊肉制品",
    quantity: "500",
    unit: "kg",
    targetMarket: "马来西亚",
    buyerName: "雅加达贸易公司",
    buyerCountry: "印度尼西亚",
    buyerLevel: "Premium Buyer",
    status: "active",
    quotesCount: 3,
    createdAt: "2026-07-14T09:30:00.000Z",
    budget: "¥40,000 - ¥46,000",
    certRequired: "JAKIM",
    description: "需要500kg清真冷冻羊腿肉，要求JAKIM认证，冷链运输至吉隆坡",
  },
  {
    id: "PUB-INQ-002",
    productName: "清真咖喱牛肉酱",
    productImage: "/media/product-curry-sauce.jpg",
    productSpec: "500g/盒",
    category: "清真预制菜",
    quantity: "2000",
    unit: "盒",
    targetMarket: "沙特阿拉伯",
    buyerName: "Al-Safa Trading",
    buyerCountry: "沙特阿拉伯",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 5,
    createdAt: "2026-07-13T14:00:00.000Z",
    budget: "¥90,000 - ¥110,000",
    certRequired: "ESMA",
    description: "采购2000盒清真咖喱牛肉酱，出口至利雅得，需ESMA认证",
  },
  {
    id: "PUB-INQ-003",
    productName: "清真牛肉丸",
    productImage: "/media/product-beef-meatballs.jpg",
    productSpec: "1kg/袋",
    category: "速冻调理品",
    quantity: "800",
    unit: "kg",
    targetMarket: "阿联酋",
    buyerName: "Dubai Food Import",
    buyerCountry: "阿联酋",
    buyerLevel: "Gold Buyer",
    status: "closing-soon",
    quotesCount: 8,
    createdAt: "2026-07-12T08:00:00.000Z",
    budget: "¥25,000 - ¥30,000",
    certRequired: "ESMA",
    description: "800kg清真牛肉丸，需含冷链运输报价，交货期15天内",
  },
  {
    id: "PUB-INQ-004",
    productName: "清真辣椒酱",
    productImage: "/media/product-chili-sauce.jpg",
    productSpec: "500g/瓶",
    category: "调味料",
    quantity: "1000",
    unit: "kg",
    targetMarket: "埃及",
    buyerName: "Cairo Halal Mart",
    buyerCountry: "埃及",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 2,
    createdAt: "2026-07-11T10:30:00.000Z",
    budget: "¥18,000 - ¥25,000",
    certRequired: "MUI",
    description: "1吨清真辣椒酱，出口开罗，需MUI认证，包装500g/瓶",
  },
  {
    id: "PUB-INQ-005",
    productName: "清真速冻饺子 — 牛肉洋葱",
    productImage: "/media/product-frozen-dumplings.jpg",
    productSpec: "30个/袋",
    category: "速冻面点",
    quantity: "5000",
    unit: "袋",
    targetMarket: "新加坡",
    buyerName: "Singapore Halal Hub",
    buyerCountry: "新加坡",
    buyerLevel: "Premium Buyer",
    status: "active",
    quotesCount: 6,
    createdAt: "2026-07-10T16:00:00.000Z",
    budget: "¥125,000 - ¥160,000",
    certRequired: "MUIS",
    description: "5000袋清真牛肉洋葱水饺，出口新加坡，需MUIS认证",
  },
  {
    id: "PUB-INQ-006",
    productName: "清真即食汤",
    productImage: "/media/product-instant-soup.jpg",
    productSpec: "100g/袋",
    category: "即食食品",
    quantity: "10000",
    unit: "袋",
    targetMarket: "卡塔尔",
    buyerName: "Doha Trade Co.",
    buyerCountry: "卡塔尔",
    buyerLevel: "Gold Buyer",
    status: "quoted",
    quotesCount: 12,
    createdAt: "2026-07-09T11:00:00.000Z",
    budget: "¥80,000 - ¥100,000",
    certRequired: "JAKIM",
    description: "1万袋清真即食汤，多哈进口，需JAKIM认证",
  },
  {
    id: "PUB-INQ-007",
    productName: "有机清真大米",
    productImage: "/media/product-organic-rice.jpg",
    productSpec: "2kg/盒",
    category: "粮油副食",
    quantity: "600",
    unit: "kg",
    targetMarket: "科威特",
    buyerName: "Kuwait Seafood",
    buyerCountry: "科威特",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 4,
    createdAt: "2026-07-08T09:00:00.000Z",
    budget: "¥50,000 - ¥72,000",
    certRequired: "JAKIM",
    description: "600kg有机清真大米，出口科威特城，需冷链运输",
  },
  {
    id: "PUB-INQ-008",
    productName: "清真芝麻烧饼",
    productImage: "/media/product-sesame-bread.jpg",
    productSpec: "10个/袋",
    category: "清真预制菜",
    quantity: "2000",
    unit: "袋",
    targetMarket: "巴基斯坦",
    buyerName: "Karachi Foods Ltd",
    buyerCountry: "巴基斯坦",
    buyerLevel: "Gold Buyer",
    status: "closing-soon",
    quotesCount: 7,
    createdAt: "2026-07-07T13:00:00.000Z",
    budget: "¥60,000 - ¥80,000",
    certRequired: "HCA",
    description: "2000袋清真芝麻烧饼，出口卡拉奇",
  },
];

// ===== Status config =====

const statusConfig = {
  active: { label: "招标中", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  "closing-soon": { label: "即将截止", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  quoted: { label: "已报价", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  closed: { label: "已关闭", color: "bg-gray-50 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};

const categoryOptions = ["全部品类", "牛羊肉制品", "清真预制菜", "速冻调理品", "速冻面点", "调味料", "即食食品", "粮油副食"];
const marketOptions = ["全部市场", "马来西亚", "沙特阿拉伯", "阿联酋", "新加坡", "卡塔尔", "科威特", "巴基斯坦", "埃及"];
const statusOptions = ["全部状态", "招标中", "即将截止", "已报价"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// ===== Constants for consistent card sizing =====

const CARD_WIDTH = 300; // px - uniform width for all cards
const CARD_IMAGE_HEIGHT = 120; // px - fixed image area
const CARD_TOTAL_HEIGHT = 380; // px - fixed total card height

// ===== Main Component =====

export function InquiryBrowseSection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("全部品类");
  const [filterMarket, setFilterMarket] = useState("全部市场");
  const [filterStatus, setFilterStatus] = useState("全部状态");
  const [showFilters, setShowFilters] = useState(false);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    let result = [...seedPublicInquiries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.productName.toLowerCase().includes(q) ||
          i.buyerName.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "全部品类") {
      result = result.filter((i) => i.category === filterCategory);
    }

    if (filterMarket !== "全部市场") {
      result = result.filter((i) => i.targetMarket === filterMarket);
    }

    if (filterStatus !== "全部状态") {
      const statusKey = filterStatus === "招标中" ? "active" : filterStatus === "即将截止" ? "closing-soon" : filterStatus === "已报价" ? "quoted" : "";
      if (statusKey) {
        result = result.filter((i) => i.status === statusKey);
      }
    }

    // Sort by creation time descending
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [searchQuery, filterCategory, filterMarket, filterStatus]);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (filterCategory !== "全部品类" ? 1 : 0) +
    (filterMarket !== "全部市场" ? 1 : 0) +
    (filterStatus !== "全部状态" ? 1 : 0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = CARD_WIDTH + 16; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleQuote = (inquiry: PublicInquiry) => {
    router.push(`/products?q=${encodeURIComponent(inquiry.productName)}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory("全部品类");
    setFilterMarket("全部市场");
    setFilterStatus("全部状态");
  };

  return (
    <section className="py-8 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              最新采购询盘
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              浏览全球买家实时发布的采购需求，快速对接精准订单
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              共 <span className="font-bold text-brand-600">{filteredInquiries.length}</span> 条询盘
            </span>
            {/* Scroll buttons */}
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-brand-50 hover:border-brand-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border bg-white flex items-center justify-center hover:bg-brand-50 hover:border-brand-300 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索产品名、采购商、需求描述..."
              className="pl-9 h-9"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-brand-50 border-brand-300 text-brand-700"
                : "bg-white border-border text-muted-foreground hover:border-brand-300"
            }`}
          >
            <Filter className="h-4 w-4" />
            筛选
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0 bg-brand-600 text-white text-[10px] rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              重置筛选
            </button>
          )}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">品类</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-8 text-sm border rounded-lg px-2 bg-white"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">目标市场</span>
              <select
                value={filterMarket}
                onChange={(e) => setFilterMarket(e.target.value)}
                className="h-8 text-sm border rounded-lg px-2 bg-white"
              >
                {marketOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">状态</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-8 text-sm border rounded-lg px-2 bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Horizontal scrollable inquiry cards */}
        {filteredInquiries.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}
          >
            {/* Stats summary card - same dimensions as inquiry cards */}
            <div
              className="snap-start shrink-0 bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-4 text-white flex flex-col"
              style={{ width: `${CARD_WIDTH}px`, height: `${CARD_TOTAL_HEIGHT}px` }}
            >
              <div className="flex-1 flex flex-col justify-center">
                <TrendingUp className="h-7 w-7 text-gold-400 mb-2" />
                <h3 className="text-base font-bold mb-1.5 line-clamp-1">实时采购需求</h3>
                <p className="text-xs text-brand-200 line-clamp-2 leading-relaxed">
                  全球采购商正在寻找清真食品供应商，立即报价获取订单
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20">
                <div>
                  <div className="text-xl font-bold text-gold-400">{filteredInquiries.length}</div>
                  <div className="text-[10px] text-brand-200">活跃询盘</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gold-400">
                    {filteredInquiries.reduce((sum, i) => sum + i.quotesCount, 0)}
                  </div>
                  <div className="text-[10px] text-brand-200">已报价数</div>
                </div>
              </div>
            </div>

            {/* Inquiry cards - all identical dimensions */}
            {filteredInquiries.map((inquiry) => {
              const status = statusConfig[inquiry.status];
              return (
                <div
                  key={inquiry.id}
                  className="snap-start shrink-0 bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all group flex flex-col"
                  style={{ width: `${CARD_WIDTH}px`, height: `${CARD_TOTAL_HEIGHT}px` }}
                >
                  {/* Product image - fixed height */}
                  <div className="relative shrink-0 overflow-hidden" style={{ height: `${CARD_IMAGE_HEIGHT}px` }}>
                    <img
                      src={inquiry.productImage}
                      alt={inquiry.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border font-medium ${status.color} bg-white/90`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                      {inquiry.quotesCount} 人报价
                    </div>
                  </div>

                  {/* Card content - flex-1 fills remaining space */}
                  <div className="p-3 flex flex-col flex-1 min-h-0">
                    {/* Product name - single line, truncate */}
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">
                      {inquiry.productName}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{inquiry.productSpec}</p>

                    {/* Tags - fixed single row */}
                    <div className="flex items-center gap-1 mb-2 min-h-[20px]">
                      <Badge variant="secondary" className="text-[10px] py-0 shrink-0">
                        <Package className="h-2.5 w-2.5 mr-0.5" />
                        {inquiry.quantity} {inquiry.unit}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0 shrink-0">
                        <MapPin className="h-2.5 w-2.5 mr-0.5" />
                        {inquiry.targetMarket}
                      </Badge>
                      {inquiry.certRequired && (
                        <Badge className="text-[10px] py-0 bg-brand-50 text-brand-700 shrink-0">
                          {inquiry.certRequired}
                        </Badge>
                      )}
                    </div>

                    {/* Description - exactly 2 lines, fixed height */}
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed" style={{ minHeight: "32px" }}>
                      {inquiry.description}
                    </p>

                    {/* Budget - fixed height row */}
                    <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b" style={{ minHeight: "20px" }}>
                      <span className="text-muted-foreground">采购预算</span>
                      <span className="font-bold text-brand-600">{inquiry.budget || "面议"}</span>
                    </div>

                    {/* Buyer info - fixed height row */}
                    <div className="flex items-center gap-2 mb-2" style={{ minHeight: "28px" }}>
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand-600">
                          {inquiry.buyerName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{inquiry.buyerName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{inquiry.buyerCountry} · {inquiry.buyerLevel}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 shrink-0">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>

                    {/* Action button - pinned to bottom */}
                    <Button
                      onClick={() => handleQuote(inquiry)}
                      className="w-full h-8 text-xs bg-brand-600 hover:bg-brand-700 text-white gap-1 mt-auto"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {inquiry.status === "quoted" ? "继续报价" : "立即报价"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-1">未找到匹配的询盘</h3>
            <p className="text-sm text-muted-foreground mb-4">尝试调整筛选条件或清除筛选</p>
            <Button variant="outline" onClick={resetFilters} className="gap-1">
              <X className="h-4 w-4" />
              清除筛选
            </Button>
          </div>
        )}

        {/* View all link */}
        {filteredInquiries.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/products")}
              className="text-brand-600 hover:text-brand-700 gap-1"
            >
              查看全部采购需求
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
