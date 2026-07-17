// Public inquiry shared data module
// High cohesion: all inquiry-related types, seed data, and filter dimensions in one place

export interface PublicInquiry {
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

// ===== Filter dimension definitions (条件筛选) =====

export const filterDimensions = {
  category: {
    label: "品类",
    options: ["牛羊肉制品", "清真预制菜", "速冻调理品", "速冻面点", "调味料", "即食食品", "水产品", "粮油副食"],
  },
  targetMarket: {
    label: "目标市场",
    options: ["马来西亚", "沙特阿拉伯", "阿联酋", "新加坡", "卡塔尔", "科威特", "巴基斯坦", "埃及", "巴林", "阿曼"],
  },
  certRequired: {
    label: "认证要求",
    options: ["JAKIM", "ESMA", "MUI", "MUIS", "HCA", "GSO", "HALAL"],
  },
  buyerLevel: {
    label: "买家等级",
    options: ["Premium Buyer", "Gold Buyer", "Verified Buyer"],
  },
  status: {
    label: "询盘状态",
    options: [
      { value: "active", label: "招标中" },
      { value: "closing-soon", label: "即将截止" },
      { value: "quoted", label: "已报价" },
      { value: "closed", label: "已关闭" },
    ],
  },
} as const;

export const statusConfig: Record<
  PublicInquiry["status"],
  { label: string; color: string; dot: string }
> = {
  active: { label: "招标中", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  "closing-soon": { label: "即将截止", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  quoted: { label: "已报价", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  closed: { label: "已关闭", color: "bg-gray-50 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 0) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// ===== Seed data (20 inquiries for infinite scroll) =====

export const seedPublicInquiries: PublicInquiry[] = [
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
    createdAt: "2026-07-16T09:30:00.000Z",
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
    createdAt: "2026-07-15T14:00:00.000Z",
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
    createdAt: "2026-07-14T08:00:00.000Z",
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
    createdAt: "2026-07-13T10:30:00.000Z",
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
    createdAt: "2026-07-12T16:00:00.000Z",
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
    createdAt: "2026-07-11T11:00:00.000Z",
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
    createdAt: "2026-07-10T09:00:00.000Z",
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
    createdAt: "2026-07-09T13:00:00.000Z",
    budget: "¥60,000 - ¥80,000",
    certRequired: "HCA",
    description: "2000袋清真芝麻烧饼，出口卡拉奇",
  },
  {
    id: "PUB-INQ-009",
    productName: "清真冷冻羊排",
    productImage: "/media/product-lamb-skewers.jpg",
    productSpec: "5kg/箱",
    category: "牛羊肉制品",
    quantity: "300",
    unit: "kg",
    targetMarket: "巴林",
    buyerName: "Manama Foods LLC",
    buyerCountry: "巴林",
    buyerLevel: "Gold Buyer",
    status: "active",
    quotesCount: 3,
    createdAt: "2026-07-08T07:00:00.000Z",
    budget: "¥30,000 - ¥35,000",
    certRequired: "GSO",
    description: "300kg清真冷冻羊排，出口麦纳麦，需GSO认证，真空包装",
  },
  {
    id: "PUB-INQ-010",
    productName: "清真速冻春卷",
    productImage: "/media/product-sesame-bread.jpg",
    productSpec: "20只/袋",
    category: "速冻面点",
    quantity: "3000",
    unit: "袋",
    targetMarket: "阿曼",
    buyerName: "Muscat Import Co.",
    buyerCountry: "阿曼",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 2,
    createdAt: "2026-07-07T10:00:00.000Z",
    budget: "¥40,000 - ¥55,000",
    certRequired: "HALAL",
    description: "3000袋清真速冻春卷，出口马斯喀特，需HALAL认证",
  },
  {
    id: "PUB-INQ-011",
    productName: "清真牛肉肠",
    productImage: "/media/product-beef-meatballs.jpg",
    productSpec: "300g/袋",
    category: "速冻调理品",
    quantity: "1500",
    unit: "kg",
    targetMarket: "马来西亚",
    buyerName: "Penang Trading Sdn Bhd",
    buyerCountry: "马来西亚",
    buyerLevel: "Premium Buyer",
    status: "active",
    quotesCount: 5,
    createdAt: "2026-07-06T08:30:00.000Z",
    budget: "¥35,000 - ¥45,000",
    certRequired: "JAKIM",
    description: "1500kg清真牛肉肠，出口槟城，需JAKIM认证，常温运输",
  },
  {
    id: "PUB-INQ-012",
    productName: "清真咖喱鸡肉酱",
    productImage: "/media/product-curry-sauce.jpg",
    productSpec: "400g/盒",
    category: "清真预制菜",
    quantity: "1800",
    unit: "盒",
    targetMarket: "沙特阿拉伯",
    buyerName: "Jeddah Supply Co.",
    buyerCountry: "沙特阿拉伯",
    buyerLevel: "Gold Buyer",
    status: "closing-soon",
    quotesCount: 9,
    createdAt: "2026-07-05T14:30:00.000Z",
    budget: "¥70,000 - ¥90,000",
    certRequired: "ESMA",
    description: "1800盒清真咖喱鸡肉酱，出口吉达，需ESMA认证，常温保质12个月",
  },
  {
    id: "PUB-INQ-013",
    productName: "清真速冻包子",
    productImage: "/media/product-frozen-dumplings.jpg",
    productSpec: "15个/袋",
    category: "速冻面点",
    quantity: "4000",
    unit: "袋",
    targetMarket: "阿联酋",
    buyerName: "Abu Dhabi Mart",
    buyerCountry: "阿联酋",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 4,
    createdAt: "2026-07-04T09:00:00.000Z",
    budget: "¥80,000 - ¥100,000",
    certRequired: "ESMA",
    description: "4000袋清真速冻牛肉包子，出口阿布扎比，需ESMA认证",
  },
  {
    id: "PUB-INQ-014",
    productName: "清真调味孜然粉",
    productImage: "/media/product-chili-sauce.jpg",
    productSpec: "1kg/袋",
    category: "调味料",
    quantity: "800",
    unit: "kg",
    targetMarket: "埃及",
    buyerName: "Alexandria Foods",
    buyerCountry: "埃及",
    buyerLevel: "Gold Buyer",
    status: "quoted",
    quotesCount: 10,
    createdAt: "2026-07-03T11:00:00.000Z",
    budget: "¥12,000 - ¥18,000",
    certRequired: "MUI",
    description: "800kg清真调味孜然粉，出口亚历山大，需MUI认证",
  },
  {
    id: "PUB-INQ-015",
    productName: "清真即食粥",
    productImage: "/media/product-instant-soup.jpg",
    productSpec: "200g/袋",
    category: "即食食品",
    quantity: "6000",
    unit: "袋",
    targetMarket: "卡塔尔",
    buyerName: "Al-Rayyan Trading",
    buyerCountry: "卡塔尔",
    buyerLevel: "Premium Buyer",
    status: "active",
    quotesCount: 3,
    createdAt: "2026-07-02T08:00:00.000Z",
    budget: "¥50,000 - ¥65,000",
    certRequired: "JAKIM",
    description: "6000袋清真即食皮蛋瘦肉粥，出口多哈，需JAKIM认证",
  },
  {
    id: "PUB-INQ-016",
    productName: "清真有机面粉",
    productImage: "/media/product-organic-rice.jpg",
    productSpec: "25kg/袋",
    category: "粮油副食",
    quantity: "500",
    unit: "袋",
    targetMarket: "巴基斯坦",
    buyerName: "Lahore Grain Co.",
    buyerCountry: "巴基斯坦",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 2,
    createdAt: "2026-07-01T10:00:00.000Z",
    budget: "¥45,000 - ¥60,000",
    certRequired: "HCA",
    description: "500袋25kg清真有机面粉，出口拉合尔，需HCA认证",
  },
  {
    id: "PUB-INQ-017",
    productName: "清真冷冻羊腿",
    productImage: "/media/product-lamb-skewers.jpg",
    productSpec: "8kg/箱",
    category: "牛羊肉制品",
    quantity: "400",
    unit: "kg",
    targetMarket: "科威特",
    buyerName: "Kuwait City Mart",
    buyerCountry: "科威特",
    buyerLevel: "Gold Buyer",
    status: "closing-soon",
    quotesCount: 6,
    createdAt: "2026-06-30T09:30:00.000Z",
    budget: "¥35,000 - ¥42,000",
    certRequired: "GSO",
    description: "400kg清真冷冻羊腿，出口科威特城，需GSO认证，-18°C冷链",
  },
  {
    id: "PUB-INQ-018",
    productName: "清真牛肉干",
    productImage: "/media/product-beef-meatballs.jpg",
    productSpec: "100g/袋",
    category: "即食食品",
    quantity: "8000",
    unit: "袋",
    targetMarket: "新加坡",
    buyerName: "Orchard Foods SG",
    buyerCountry: "新加坡",
    buyerLevel: "Premium Buyer",
    status: "active",
    quotesCount: 7,
    createdAt: "2026-06-29T14:00:00.000Z",
    budget: "¥90,000 - ¥120,000",
    certRequired: "MUIS",
    description: "8000袋清真牛肉干休闲零食，出口新加坡，需MUIS认证",
  },
  {
    id: "PUB-INQ-019",
    productName: "清真芝麻酱",
    productImage: "/media/product-chili-sauce.jpg",
    productSpec: "500g/瓶",
    category: "调味料",
    quantity: "1200",
    unit: "kg",
    targetMarket: "巴林",
    buyerName: "Bahrain Food Hub",
    buyerCountry: "巴林",
    buyerLevel: "Verified Buyer",
    status: "active",
    quotesCount: 3,
    createdAt: "2026-06-28T11:30:00.000Z",
    budget: "¥20,000 - ¥28,000",
    certRequired: "GSO",
    description: "1200kg清真芝麻酱，出口麦纳麦，需GSO认证，玻璃瓶装",
  },
  {
    id: "PUB-INQ-020",
    productName: "清真速冻葱油饼",
    productImage: "/media/product-sesame-bread.jpg",
    productSpec: "10片/袋",
    category: "速冻面点",
    quantity: "2500",
    unit: "袋",
    targetMarket: "阿曼",
    buyerName: "Salalah Trading",
    buyerCountry: "阿曼",
    buyerLevel: "Gold Buyer",
    status: "quoted",
    quotesCount: 8,
    createdAt: "2026-06-27T08:00:00.000Z",
    budget: "¥45,000 - ¥60,000",
    certRequired: "HALAL",
    description: "2500袋清真速冻葱油饼，出口塞拉莱，需HALAL认证",
  },
];

// ===== Filter state type =====

export interface InquiryFilters {
  searchQuery: string;
  category: string;
  targetMarket: string;
  certRequired: string;
  buyerLevel: string;
  status: string;
}

export const emptyFilters: InquiryFilters = {
  searchQuery: "",
  category: "",
  targetMarket: "",
  certRequired: "",
  buyerLevel: "",
  status: "",
};

// ===== Filter logic =====

export function filterInquiries(
  inquiries: PublicInquiry[],
  filters: InquiryFilters
): PublicInquiry[] {
  let result = [...inquiries];

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (i) =>
        i.productName.toLowerCase().includes(q) ||
        i.buyerName.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }

  if (filters.category) result = result.filter((i) => i.category === filters.category);
  if (filters.targetMarket) result = result.filter((i) => i.targetMarket === filters.targetMarket);
  if (filters.certRequired) result = result.filter((i) => i.certRequired === filters.certRequired);
  if (filters.buyerLevel) result = result.filter((i) => i.buyerLevel === filters.buyerLevel);
  if (filters.status) result = result.filter((i) => i.status === filters.status);

  // Sort by creation time descending
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return result;
}

export function countActiveFilters(filters: InquiryFilters): number {
  let count = 0;
  if (filters.searchQuery) count++;
  if (filters.category) count++;
  if (filters.targetMarket) count++;
  if (filters.certRequired) count++;
  if (filters.buyerLevel) count++;
  if (filters.status) count++;
  return count;
}
