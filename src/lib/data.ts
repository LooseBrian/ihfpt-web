export interface TrustBadge {
  id: string;
  title: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  spec: string;
  moq: string;
  priceRange: string;
  supplier: string;
  certType: string;
  image: string;
  category?: string;
  subcategory?: string;
  exportRegions?: string[];
  moqRange?: string;
  supplierQuals?: string[];
  services?: string[];
  origin?: string;
  isHot?: boolean;
  isBestSeller?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  tier: "S" | "A" | "认证";
  categories: string[];
  certs: string[];
  exportVolume: string;
  location: string;
  foundedYear?: number;
  description?: string;
  exportRegions?: string[];
  businessType?: string;
  qualifications?: string[];
  services?: string[];
  annualCapacity?: string;
  exportCountries?: number;
  employeeCount?: string;
  isTangyuanhui?: boolean;
  productImages?: string[];
  isNew?: boolean;
}

export interface Service {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  link: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: "平台动态" | "政策法规" | "市场分析" | "行业资讯" | "合作伙伴";
  source: string;
  sourceType: "official" | "partner";
  region?: "OIC" | "GCC" | "ASEAN" | "MENA" | "global";
  tags?: string[];
  isHot?: boolean;
  isFeatured?: boolean;
  image?: string;
}

export interface NewsRegion {
  id: string;
  name: string;
  fullName: string;
  description: string;
}

export interface TrendDataPoint {
  month: string;
  value: number;
}

export interface TrendAnnotation {
  month: string;
  label: string;
}

export interface ProductTrend {
  id: string;
  productName: string;
  category: string;
  trend: "up" | "down" | "stable";
  changePercent: string;
  demand: string;
  regions: string[];
  dataPoints: TrendDataPoint[];
  annotations: TrendAnnotation[];
}

export const categories: Category[] = [
  { id: "1", name: "清真预制菜", nameEn: "Halal Ready Meals", icon: "UtensilsCrossed", color: "bg-emerald-100 text-emerald-700" },
  { id: "2", name: "速冻调理品", nameEn: "Frozen Foods", icon: "Snowflake", color: "bg-sky-100 text-sky-700" },
  { id: "3", name: "牛羊肉制品", nameEn: "Meat Products", icon: "Beef", color: "bg-rose-100 text-rose-700" },
  { id: "4", name: "米面粮油", nameEn: "Grain & Oil", icon: "Wheat", color: "bg-amber-100 text-amber-700" },
  { id: "5", name: "休闲食品", nameEn: "Snacks", icon: "Cookie", color: "bg-orange-100 text-orange-700" },
  { id: "6", name: "调味品", nameEn: "Seasonings", icon: "Flame", color: "bg-red-100 text-red-700" },
];

export const subcategories: Subcategory[] = [
  // 清真预制菜
  { id: "sc1-1", categoryId: "1", name: "速冻面点", nameEn: "Frozen Pastry", count: 124 },
  { id: "sc1-2", categoryId: "1", name: "即食便当", nameEn: "Ready Meals", count: 86 },
  { id: "sc1-3", categoryId: "1", name: "预制汤品", nameEn: "Pre-made Soup", count: 62 },
  { id: "sc1-4", categoryId: "1", name: "调理肉制品", nameEn: "Prepared Meat", count: 156 },
  // 速冻调理品
  { id: "sc2-1", categoryId: "2", name: "速冻水饺", nameEn: "Frozen Dumplings", count: 210 },
  { id: "sc2-2", categoryId: "2", name: "速冻肉丸", nameEn: "Frozen Meatballs", count: 178 },
  { id: "sc2-3", categoryId: "2", name: "速冻春卷", nameEn: "Frozen Spring Rolls", count: 95 },
  { id: "sc2-4", categoryId: "2", name: "速冻披萨", nameEn: "Frozen Pizza", count: 68 },
  // 牛羊肉制品
  { id: "sc3-1", categoryId: "3", name: "牛肉卷", nameEn: "Beef Rolls", count: 132 },
  { id: "sc3-2", categoryId: "3", name: "羊肉卷", nameEn: "Lamb Rolls", count: 98 },
  { id: "sc3-3", categoryId: "3", name: "牛排", nameEn: "Beef Steak", count: 76 },
  { id: "sc3-4", categoryId: "3", name: "羊排", nameEn: "Lamb Chops", count: 54 },
  // 米面粮油
  { id: "sc4-1", categoryId: "4", name: "大米", nameEn: "Rice", count: 245 },
  { id: "sc4-2", categoryId: "4", name: "面粉", nameEn: "Flour", count: 189 },
  { id: "sc4-3", categoryId: "4", name: "食用油", nameEn: "Cooking Oil", count: 167 },
  { id: "sc4-4", categoryId: "4", name: "杂粮", nameEn: "Grains", count: 112 },
  // 休闲食品
  { id: "sc5-1", categoryId: "5", name: "糕点饼干", nameEn: "Pastry & Biscuits", count: 198 },
  { id: "sc5-2", categoryId: "5", name: "坚果炒货", nameEn: "Nuts", count: 143 },
  { id: "sc5-3", categoryId: "5", name: "糖果巧克力", nameEn: "Candy & Chocolate", count: 87 },
  { id: "sc5-4", categoryId: "5", name: "膨化食品", nameEn: "Puffed Snacks", count: 65 },
  // 调味品
  { id: "sc6-1", categoryId: "6", name: "酱油醋", nameEn: "Soy Sauce & Vinegar", count: 156 },
  { id: "sc6-2", categoryId: "6", name: "调味酱", nameEn: "Sauce", count: 134 },
  { id: "sc6-3", categoryId: "6", name: "香辛料", nameEn: "Spices", count: 98 },
  { id: "sc6-4", categoryId: "6", name: "复合调味料", nameEn: "Compound Seasonings", count: 72 },
];

export const products: Product[] = [
  // 原有8个产品（已增强字段）
  { id: "p1", name: "清真牛肉丸", nameEn: "Halal Beef Meatballs", spec: "500g/袋", moq: "1000袋", priceRange: "$2.5 - $3.0", supplier: "GreenHalal Foods", certType: "JAKIM", image: "/media/product-beef-meatballs.jpg", category: "牛羊肉制品", subcategory: "速冻肉丸", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持样品单", "支持拼柜"], origin: "宁夏", isHot: true, isBestSeller: true },
  { id: "p2", name: "速冻清真水饺", nameEn: "Frozen Halal Dumplings", spec: "20只/盒", moq: "500盒", priceRange: "$3.0 - $3.8", supplier: "Orient Delight", certType: "HALAL", image: "/media/product-frozen-dumplings.jpg", category: "速冻调理品", subcategory: "速冻水饺", exportRegions: ["东盟", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "AEO认证"], services: ["支持样品单", "可代办清关"], origin: "山东", isHot: true },
  { id: "p3", name: "清真咖喱酱", nameEn: "Halal Curry Sauce", spec: "200g/瓶", moq: "2000瓶", priceRange: "$1.2 - $1.5", supplier: "SpiceRoute Co.", certType: "SFDA", image: "/media/product-curry-sauce.jpg", category: "调味品", subcategory: "调味酱", exportRegions: ["中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案"], services: ["支持拼柜"], origin: "四川" },
  { id: "p4", name: "清真羊肉串", nameEn: "Halal Lamb Skewers", spec: "10串/包", moq: "800包", priceRange: "$4.5 - $5.5", supplier: "Xinjiang Best", certType: "JAKIM", image: "/media/product-lamb-skewers.jpg", category: "牛羊肉制品", subcategory: "羊排", exportRegions: ["东盟", "中东", "北非"], moqRange: "5-10吨", supplierQuals: ["出口食品生产备案", "源头工厂", "AEO认证"], services: ["支持样品单", "支持拼柜", "可代办清关"], origin: "新疆", isHot: true, isBestSeller: true },
  { id: "p5", name: "有机清真大米", nameEn: "Organic Halal Rice", spec: "5kg/袋", moq: "300袋", priceRange: "$8.0 - $10.0", supplier: "GoldenGrain Ltd.", certType: "HALAL", image: "/media/product-organic-rice.jpg", category: "米面粮油", subcategory: "大米", exportRegions: ["全球"], moqRange: ">10吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜", "济南仓可提货"], origin: "黑龙江" },
  { id: "p6", name: "清真即食汤", nameEn: "Halal Instant Soup", spec: "40g/杯", moq: "1500杯", priceRange: "$0.8 - $1.0", supplier: "SoupMaster", certType: "FDA", image: "/media/product-instant-soup.jpg", category: "清真预制菜", subcategory: "预制汤品", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案"], services: ["支持样品单"], origin: "广东" },
  { id: "p7", name: "清真芝麻烧饼", nameEn: "Halal Sesame Bread", spec: "6个/袋", moq: "600袋", priceRange: "$2.0 - $2.5", supplier: "BakeryHalal", certType: "HALAL", image: "/media/product-sesame-bread.jpg", category: "清真预制菜", subcategory: "速冻面点", exportRegions: ["东盟"], moqRange: "<1吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持样品单", "济南仓可提货"], origin: "河南" },
  { id: "p8", name: "清真辣椒酱", nameEn: "Halal Chili Sauce", spec: "350g/瓶", moq: "1200瓶", priceRange: "$1.5 - $2.0", supplier: "ChiliKing", certType: "SFDA", image: "/media/product-chili-sauce.jpg", category: "调味品", subcategory: "调味酱", exportRegions: ["中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案"], services: ["支持拼柜"], origin: "湖南", isHot: true },

  // 新增16个产品
  { id: "p9", name: "惠发清真鱼豆腐", nameEn: "Huifa Halal Fish Tofu", spec: "300g/袋", moq: "2000袋", priceRange: "$1.8 - $2.2", supplier: "Huifa Foods", certType: "JAKIM", image: "/media/product-beef-meatballs.jpg", category: "速冻调理品", subcategory: "速冻肉丸", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂", "AEO认证"], services: ["支持样品单", "支持拼柜", "可代办清关", "济南仓可提货"], origin: "山东", isHot: true, isBestSeller: true },
  { id: "p10", name: "清真冻鸭胸肉", nameEn: "Halal Frozen Duck Breast", spec: "10kg/箱", moq: "100箱", priceRange: "$3.5 - $4.0", supplier: "PoultryPrime", certType: "HALAL", image: "/media/product-lamb-skewers.jpg", category: "牛羊肉制品", subcategory: "牛肉卷", exportRegions: ["中东", "北非"], moqRange: "5-10吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜", "可代办清关"], origin: "河北" },
  { id: "p11", name: "清真手抓饼", nameEn: "Halal Scallion Pancake", spec: "5片/袋", moq: "800袋", priceRange: "$1.5 - $1.8", supplier: "BakeryHalal", certType: "HALAL", image: "/media/product-sesame-bread.jpg", category: "清真预制菜", subcategory: "速冻面点", exportRegions: ["东盟"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持样品单", "济南仓可提货"], origin: "河南", isHot: true },
  { id: "p12", name: "清真牛油火锅底料", nameEn: "Halal Beef Tallow Hotpot Base", spec: "500g/袋", moq: "1500袋", priceRange: "$2.8 - $3.2", supplier: "SpiceRoute Co.", certType: "GSO", image: "/media/product-curry-sauce.jpg", category: "调味品", subcategory: "复合调味料", exportRegions: ["中东", "北非", "全球"], moqRange: "5-10吨", supplierQuals: ["出口食品生产备案", "AEO认证"], services: ["支持拼柜", "可代办清关"], origin: "四川", isBestSeller: true },
  { id: "p13", name: "清真全麦面粉", nameEn: "Halal Whole Wheat Flour", spec: "25kg/袋", moq: "200袋", priceRange: "$12.0 - $14.0", supplier: "GoldenGrain Ltd.", certType: "HALAL", image: "/media/product-organic-rice.jpg", category: "米面粮油", subcategory: "面粉", exportRegions: ["东盟", "中东"], moqRange: ">10吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜", "济南仓可提货"], origin: "山东" },
  { id: "p14", name: "清真芒果干", nameEn: "Halal Dried Mango", spec: "200g/袋", moq: "1000袋", priceRange: "$2.0 - $2.5", supplier: "TropicalSnacks", certType: "JAKIM", image: "/media/product-chili-sauce.jpg", category: "休闲食品", subcategory: "糖果巧克力", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案"], services: ["支持样品单", "支持拼柜"], origin: "广西" },
  { id: "p15", name: "清真速冻春卷", nameEn: "Halal Frozen Spring Rolls", spec: "20只/袋", moq: "600袋", priceRange: "$2.2 - $2.8", supplier: "Orient Delight", certType: "HALAL", image: "/media/product-frozen-dumplings.jpg", category: "速冻调理品", subcategory: "速冻春卷", exportRegions: ["东盟", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "AEO认证"], services: ["支持样品单", "可代办清关"], origin: "山东" },
  { id: "p16", name: "清真芝麻酱", nameEn: "Halal Sesame Paste", spec: "400g/瓶", moq: "1200瓶", priceRange: "$3.0 - $3.5", supplier: "SpiceRoute Co.", certType: "SFDA", image: "/media/product-curry-sauce.jpg", category: "调味品", subcategory: "调味酱", exportRegions: ["中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜"], origin: "河南" },
  { id: "p17", name: "清真牛肉肠", nameEn: "Halal Beef Sausage", spec: "300g/袋", moq: "1000袋", priceRange: "$2.5 - $3.0", supplier: "GreenHalal Foods", certType: "JAKIM", image: "/media/product-beef-meatballs.jpg", category: "牛羊肉制品", subcategory: "调理肉制品", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持样品单", "支持拼柜"], origin: "宁夏", isHot: true },
  { id: "p18", name: "清真花生油", nameEn: "Halal Peanut Oil", spec: "5L/桶", moq: "500桶", priceRange: "$9.0 - $11.0", supplier: "GoldenGrain Ltd.", certType: "HALAL", image: "/media/product-organic-rice.jpg", category: "米面粮油", subcategory: "食用油", exportRegions: ["全球"], moqRange: ">10吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜", "济南仓可提货"], origin: "山东" },
  { id: "p19", name: "清真椰枣", nameEn: "Halal Dates", spec: "500g/盒", moq: "800盒", priceRange: "$4.0 - $5.0", supplier: "TropicalSnacks", certType: "GSO", image: "/media/product-sesame-bread.jpg", category: "休闲食品", subcategory: "糕点饼干", exportRegions: ["中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案"], services: ["支持样品单", "支持拼柜", "可代办清关"], origin: "新疆", isBestSeller: true },
  { id: "p20", name: "清真蒸饺", nameEn: "Halal Steamed Dumplings", spec: "15只/盒", moq: "500盒", priceRange: "$2.8 - $3.5", supplier: "Orient Delight", certType: "HALAL", image: "/media/product-frozen-dumplings.jpg", category: "速冻调理品", subcategory: "速冻水饺", exportRegions: ["东盟"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "AEO认证"], services: ["支持样品单", "济南仓可提货"], origin: "山东" },
  { id: "p21", name: "清真五香粉", nameEn: "Halal Five-Spice Powder", spec: "50g/瓶", moq: "3000瓶", priceRange: "$0.6 - $0.8", supplier: "SpiceRoute Co.", certType: "SFDA", image: "/media/product-chili-sauce.jpg", category: "调味品", subcategory: "香辛料", exportRegions: ["东盟", "中东"], moqRange: "<1吨", supplierQuals: ["出口食品生产备案"], services: ["支持拼柜"], origin: "四川" },
  { id: "p22", name: "清真燕麦片", nameEn: "Halal Oatmeal", spec: "1kg/袋", moq: "400袋", priceRange: "$3.5 - $4.2", supplier: "GoldenGrain Ltd.", certType: "HALAL", image: "/media/product-organic-rice.jpg", category: "米面粮油", subcategory: "杂粮", exportRegions: ["中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂"], services: ["支持拼柜"], origin: "内蒙古" },
  { id: "p23", name: "清真牛肉干", nameEn: "Halal Beef Jerky", spec: "150g/袋", moq: "1200袋", priceRange: "$3.5 - $4.5", supplier: "Xinjiang Best", certType: "JAKIM", image: "/media/product-lamb-skewers.jpg", category: "休闲食品", subcategory: "坚果炒货", exportRegions: ["东盟", "中东"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "源头工厂", "AEO认证"], services: ["支持样品单", "支持拼柜"], origin: "新疆", isHot: true },
  { id: "p24", name: "清真正宗拉面", nameEn: "Halal Authentic Ramen", spec: "120g/袋", moq: "2000袋", priceRange: "$1.0 - $1.3", supplier: "Orient Delight", certType: "HALAL", image: "/media/product-instant-soup.jpg", category: "清真预制菜", subcategory: "即食便当", exportRegions: ["东盟", "中东", "北非"], moqRange: "1-5吨", supplierQuals: ["出口食品生产备案", "AEO认证"], services: ["支持样品单", "支持拼柜", "可代办清关"], origin: "甘肃" },
];

export const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "GreenHalal Foods Co., Ltd.",
    logo: "GH",
    tier: "A",
    categories: ["牛羊肉制品", "速冻调理品"],
    certs: ["JAKIM", "HALAL", "FDA"],
    exportVolume: "$5M+",
    location: "宁夏",
    foundedYear: 2008,
    description: "专注清真牛羊肉深加工20年，拥有完整的出口资质体系，产品远销中东、东南亚十余国。",
    exportRegions: ["中东", "东盟"],
    businessType: "源头生产工厂",
    qualifications: ["出口食品生产备案", "HACCP", "ISO22000"],
    services: ["支持样品单", "支持拼柜", "可代办清关"],
    annualCapacity: "3万吨",
    exportCountries: 12,
    employeeCount: "500+",
    isTangyuanhui: true,
    productImages: ["/media/product-beef-meatballs.jpg", "/media/product-lamb-skewers.jpg"],
  },
  {
    id: "s2",
    name: "Orient Delight Group",
    logo: "OD",
    tier: "S",
    categories: ["清真预制菜", "休闲食品", "速冻调理品"],
    certs: ["JAKIM", "HALAL", "GSO"],
    exportVolume: "$15M+",
    location: "山东",
    foundedYear: 1995,
    description: "国内领先的清真食品出口集团，年出口额超1500万美元，是多家国际连锁商超核心供应商。",
    exportRegions: ["东盟", "中东", "北非"],
    businessType: "品牌运营商",
    qualifications: ["出口食品生产备案", "AEO认证", "HACCP", "ISO22000"],
    services: ["支持样品单", "支持拼柜", "可代办清关", "济南仓备货", "支持OEM"],
    annualCapacity: "8万吨",
    exportCountries: 22,
    employeeCount: "2000+",
    isTangyuanhui: true,
    productImages: ["/media/product-frozen-dumplings.jpg", "/media/product-instant-soup.jpg", "/media/product-sesame-bread.jpg"],
  },
  {
    id: "s3",
    name: "SpiceRoute International",
    logo: "SR",
    tier: "认证",
    categories: ["调味品", "米面粮油"],
    certs: ["SFDA", "HALAL"],
    exportVolume: "$3M+",
    location: "四川",
    foundedYear: 2012,
    description: "专注清真调味品研发与出口，拥有自主知识产权配方，产品符合海湾国家进口标准。",
    exportRegions: ["中东", "北非"],
    businessType: "OEM/ODM代工厂",
    qualifications: ["出口食品生产备案", "SC生产许可"],
    services: ["支持拼柜", "支持OEM"],
    annualCapacity: "1.5万吨",
    exportCountries: 8,
    employeeCount: "200+",
    isTangyuanhui: false,
    productImages: ["/media/product-curry-sauce.jpg", "/media/product-chili-sauce.jpg"],
    isNew: true,
  },
  {
    id: "s4",
    name: "Xinjiang Best Meats",
    logo: "XB",
    tier: "S",
    categories: ["牛羊肉制品"],
    certs: ["JAKIM", "HALAL", "FDA", "IFANCA"],
    exportVolume: "$25M+",
    location: "新疆",
    foundedYear: 2002,
    description: "中国最大的清真牛羊肉出口企业之一，自有牧场+现代化加工厂，全产业链可控。",
    exportRegions: ["东盟", "中东", "北非", "全球"],
    businessType: "源头生产工厂",
    qualifications: ["出口食品生产备案", "AEO认证", "HACCP", "ISO22000", "有机认证"],
    services: ["支持样品单", "支持拼柜", "可代办清关", "济南仓备货"],
    annualCapacity: "12万吨",
    exportCountries: 28,
    employeeCount: "3000+",
    isTangyuanhui: true,
    productImages: ["/media/product-lamb-skewers.jpg", "/media/product-beef-meatballs.jpg"],
  },
  {
    id: "s5",
    name: "Huifa Foods",
    logo: "HF",
    tier: "A",
    categories: ["速冻调理品", "清真预制菜"],
    certs: ["JAKIM", "HALAL", "GSO"],
    exportVolume: "$12M+",
    location: "山东",
    foundedYear: 2005,
    description: "北方最大速冻清真调理品生产基地，惠发品牌在海内外享有盛誉，支持全品类OEM定制。",
    exportRegions: ["东盟", "中东"],
    businessType: "品牌运营商",
    qualifications: ["出口食品生产备案", "AEO认证", "HACCP"],
    services: ["支持样品单", "支持拼柜", "可代办清关", "支持OEM"],
    annualCapacity: "10万吨",
    exportCountries: 15,
    employeeCount: "1500+",
    isTangyuanhui: true,
    productImages: ["/media/product-beef-meatballs.jpg", "/media/product-frozen-dumplings.jpg"],
  },
  {
    id: "s6",
    name: "GoldenGrain Ltd.",
    logo: "GG",
    tier: "A",
    categories: ["米面粮油"],
    certs: ["HALAL", "GSO", "有机认证"],
    exportVolume: "$8M+",
    location: "黑龙江",
    foundedYear: 1998,
    description: "东北最大的有机清真粮油出口企业，拥有非转基因种植基地，产品覆盖全球穆斯林市场。",
    exportRegions: ["全球"],
    businessType: "源头生产工厂",
    qualifications: ["出口食品生产备案", "有机认证", "HACCP", "ISO22000"],
    services: ["支持拼柜", "济南仓备货"],
    annualCapacity: "20万吨",
    exportCountries: 18,
    employeeCount: "800+",
    isTangyuanhui: true,
    productImages: ["/media/product-organic-rice.jpg"],
  },
  {
    id: "s7",
    name: "Ningxia Yisheng Halal",
    logo: "NY",
    tier: "认证",
    categories: ["牛羊肉制品", "休闲食品"],
    certs: ["HALAL", "GSO"],
    exportVolume: "$2M+",
    location: "宁夏",
    foundedYear: 2015,
    description: "新兴清真食品出口企业，专注牛肉干、休闲肉制品，产品深受中东市场欢迎。",
    exportRegions: ["中东", "北非"],
    businessType: "源头生产工厂",
    qualifications: ["出口食品生产备案", "SC生产许可"],
    services: ["支持样品单", "支持拼柜"],
    annualCapacity: "8000吨",
    exportCountries: 6,
    employeeCount: "150+",
    isTangyuanhui: false,
    productImages: ["/media/product-lamb-skewers.jpg"],
    isNew: true,
  },
  {
    id: "s8",
    name: "Hebei PoultryPrime",
    logo: "HP",
    tier: "A",
    categories: ["牛羊肉制品", "速冻调理品"],
    certs: ["JAKIM", "HALAL", "FDA"],
    exportVolume: "$10M+",
    location: "河北",
    foundedYear: 2001,
    description: "华北最大清真禽肉出口基地，集养殖、屠宰、深加工于一体，通过多项国际认证。",
    exportRegions: ["中东", "北非", "东盟"],
    businessType: "源头生产工厂",
    qualifications: ["出口食品生产备案", "AEO认证", "HACCP", "ISO22000"],
    services: ["支持样品单", "支持拼柜", "可代办清关", "支持OEM"],
    annualCapacity: "6万吨",
    exportCountries: 14,
    employeeCount: "1200+",
    isTangyuanhui: true,
    productImages: ["/media/product-lamb-skewers.jpg"],
  },
  {
    id: "s9",
    name: "TropicalSnacks Co.",
    logo: "TS",
    tier: "认证",
    categories: ["休闲食品", "米面粮油"],
    certs: ["HALAL", "JAKIM"],
    exportVolume: "$4M+",
    location: "广西",
    foundedYear: 2010,
    description: "专注热带果蔬休闲食品出口，椰枣、芒果干等产品在东盟市场占有率高。",
    exportRegions: ["东盟", "中东"],
    businessType: "专业贸易商",
    qualifications: ["出口食品生产备案"],
    services: ["支持样品单", "支持拼柜", "可代办清关"],
    annualCapacity: "5000吨",
    exportCountries: 10,
    employeeCount: "300+",
    isTangyuanhui: false,
    productImages: ["/media/product-sesame-bread.jpg", "/media/product-chili-sauce.jpg"],
  },
  {
    id: "s10",
    name: "Gansu Noodle Master",
    logo: "GN",
    tier: "认证",
    categories: ["清真预制菜", "米面粮油"],
    certs: ["HALAL", "GSO"],
    exportVolume: "$1.5M+",
    location: "甘肃",
    foundedYear: 2018,
    description: "传承西北面食工艺，专注清真拉面、面制品出口，支持定制化生产。",
    exportRegions: ["东盟", "中东"],
    businessType: "OEM/ODM代工厂",
    qualifications: ["出口食品生产备案", "SC生产许可"],
    services: ["支持样品单", "支持OEM"],
    annualCapacity: "3000吨",
    exportCountries: 5,
    employeeCount: "100+",
    isTangyuanhui: false,
    productImages: ["/media/product-instant-soup.jpg"],
    isNew: true,
  },
];

export const services: Service[] = [
  { id: "sv1", title: "合规认证", titleEn: "Compliance", description: "国际 HALAL 认证代办、各国食品准入资质、出口备案一站式办理", icon: "ShieldCheck", link: "#" },
  { id: "sv2", title: "跨境物流", titleEn: "Logistics", description: "冷链双清包税、海外仓配、全程温控追踪，保障清真食品品质", icon: "Truck", link: "#" },
  { id: "sv3", title: "渠道拓展", titleEn: "Channels", description: "海外商超对接、餐饮连锁合作、电商平台入驻，快速打开目标市场", icon: "Globe", link: "#" },
  { id: "sv4", title: "金融配套", titleEn: "Finance", description: "出口信保、跨境结算、信用证、供应链金融，降低贸易风险", icon: "Landmark", link: "#" },
];

export const stats: Stat[] = [
  { id: "st1", label: "入驻厂商", value: 50, suffix: "+" },
  { id: "st2", label: "覆盖国家", value: 28, suffix: "" },
  { id: "st3", label: "年交易额", value: 120, suffix: "M+ USD" },
  { id: "st4", label: "服务案例", value: 320, suffix: "+" },
];

export const projects: Project[] = [
  { id: "pr1", title: "马来西亚双国双园", description: "中马合作的标志性清真产业园区，集生产、加工、认证、物流于一体，辐射东盟十国市场。", image: "/media/project-malaysia-park.jpg" },
  { id: "pr2", title: "临夏清真产业园", description: "中国西北最大的清真食品产业基地，拥有完整的产业链和国家级出口资质，产品远销中东、北非。", image: "/media/project-linxia-park.jpg" },
];

export const news: NewsItem[] = [
  { id: "n1", title: "平台正式上线，首批50家供应商入驻", excerpt: "国际清真食品贸易平台（IHFTP）于今日正式上线运营，首批50家优质供应商完成入驻审核...", date: "2026-06-20", category: "平台动态" },
  { id: "n2", title: "东盟清真食品进口新规解读", excerpt: "马来西亚、印尼等国近期更新了清真食品进口标准，本文为您详细解读最新政策变化及应对策略...", date: "2026-06-18", category: "政策法规" },
  { id: "n3", title: "2026年全球清真食品市场趋势报告", excerpt: "全球清真食品市场规模预计突破2万亿美元，中东和东南亚成为增长最快的两大区域...", date: "2026-06-15", category: "市场分析" },
];

export const navLinks = [
  { label: "首页", labelEn: "Home", href: "/" },
  { label: "产品大厅", labelEn: "Products", href: "/products" },
  { label: "优质供应商", labelEn: "Suppliers", href: "/suppliers" },
  { label: "服务中心", labelEn: "Services", href: "/services" },
  { label: "产业生态", labelEn: "Ecosystem", href: "/ecosystem" },
  { label: "资讯动态", labelEn: "News", href: "/news" },
  { label: "关于我们", labelEn: "About", href: "/about" },
  { label: "联系我们", labelEn: "Contact", href: "/contact" },
];

export const trustBadges = [
  { id: "tb1", title: "国际HALAL认证互认", description: "覆盖JAKIM、SFDA、FDA等主流认证机构" },
  { id: "tb2", title: "海关官方合作", description: "出口备案在线核验，通关效率高" },
  { id: "tb3", title: "多国政府对接", description: "中马、中印尼等政府间合作项目支撑" },
  { id: "tb4", title: "全程合规保障", description: "从生产到出口的全链路合规服务" },
];

// Filter dimensions for Product Lobby
export const filterCertifications = [
  { id: "JAKIM", label: "JAKIM（马来西亚）" },
  { id: "GSO", label: "GSO（海湾）" },
  { id: "IFANCA", label: "IFANCA" },
  { id: "HALAL", label: "国内 HALAL 认证" },
  { id: "SFDA", label: "SFDA" },
  { id: "FDA", label: "FDA" },
];

export const filterExportRegions = [
  { id: "东盟", label: "东盟" },
  { id: "中东", label: "中东" },
  { id: "北非", label: "北非" },
  { id: "全球", label: "全球" },
];

export const filterMoqRanges = [
  { id: "<1吨", label: "< 1 吨" },
  { id: "1-5吨", label: "1 - 5 吨" },
  { id: "5-10吨", label: "5 - 10 吨" },
  { id: ">10吨", label: "> 10 吨" },
];

export const filterSupplierQuals = [
  { id: "出口食品生产备案", label: "出口食品生产备案" },
  { id: "源头工厂", label: "源头工厂" },
  { id: "AEO认证", label: "AEO 认证" },
  { id: "品牌商", label: "品牌商" },
];

export const filterServices = [
  { id: "支持样品单", label: "支持样品单" },
  { id: "支持拼柜", label: "支持拼柜" },
  { id: "可代办清关", label: "可代办清关" },
  { id: "济南仓可提货", label: "济南仓可提货" },
];

export const filterOrigins = [
  { id: "山东", label: "山东" },
  { id: "河北", label: "河北" },
  { id: "河南", label: "河南" },
  { id: "宁夏", label: "宁夏" },
  { id: "新疆", label: "新疆" },
  { id: "四川", label: "四川" },
  { id: "黑龙江", label: "黑龙江" },
  { id: "广东", label: "广东" },
  { id: "湖南", label: "湖南" },
  { id: "广西", label: "广西" },
  { id: "内蒙古", label: "内蒙古" },
  { id: "甘肃", label: "甘肃" },
];

export const filterBusinessTypes = [
  { id: "源头生产工厂", label: "源头生产工厂" },
  { id: "品牌运营商", label: "品牌运营商" },
  { id: "OEM/ODM代工厂", label: "OEM/ODM 代工厂" },
  { id: "专业贸易商", label: "专业贸易商" },
];

export const filterSupplierQualifications = [
  { id: "出口食品生产备案", label: "出口食品生产备案" },
  { id: "AEO认证", label: "AEO 认证" },
  { id: "SC生产许可", label: "SC 生产许可" },
  { id: "HACCP", label: "HACCP" },
  { id: "ISO22000", label: "ISO22000" },
  { id: "有机认证", label: "有机认证" },
];

export const supplierHotSearchTags = [
  "JAKIM 认证工厂",
  "清真冻品源头厂",
  "出口备案企业",
  "山东清真产业带",
  "支持 OEM 代工厂",
  "AEO 认证企业",
  "牛羊肉出口厂",
  "速冻调理品工厂",
];

export interface IndustryBelt {
  id: string;
  name: string;
  region: string;
  advantageCategories: string[];
  supplierCount: number;
  description: string;
  supplierLogos: string[];
}

export const industryBelts: IndustryBelt[] = [
  {
    id: "ib1",
    name: "山东清真调理产业带",
    region: "山东 · 济南/青岛/潍坊",
    advantageCategories: ["速冻调理品", "清真预制菜", "面制品"],
    supplierCount: 320,
    description: "北方最大速冻调理产业集群，配套完善，出口基础设施成熟",
    supplierLogos: ["HF", "OD"],
  },
  {
    id: "ib2",
    name: "河北清真禽肉产业带",
    region: "河北 · 沧州/保定",
    advantageCategories: ["清真禽肉", "速冻肉丸", "调理肉制品"],
    supplierCount: 180,
    description: "华北最大清真禽肉出口基地，年出口量占全国20%以上",
    supplierLogos: ["HP"],
  },
  {
    id: "ib3",
    name: "西北牛羊肉产业带",
    region: "宁夏 · 新疆 · 甘肃",
    advantageCategories: ["牛羊肉制品", "休闲食品"],
    supplierCount: 150,
    description: "天然牧场资源优势，清真牛羊肉品质享誉海内外",
    supplierLogos: ["XB", "GH", "GN"],
  },
  {
    id: "ib4",
    name: "河南面制品产业带",
    region: "河南 · 郑州/新乡",
    advantageCategories: ["速冻面点", "清真预制菜", "调味品"],
    supplierCount: 210,
    description: "全国最大清真面制品生产基地，供应链成本优势明显",
    supplierLogos: ["OD"],
  },
];

export const supplierValueBadges = [
  { id: "svb1", title: "合规严选准入", description: "全量核验清真认证 + 出口备案，源头保障资质真实有效" },
  { id: "svb2", title: "出口能力认证", description: "优先展示具备实际出口经验、熟悉海外合规的成熟工厂" },
  { id: "svb3", title: "全链路服务兜底", description: "报关 / 冷链 / 清关一站式代办，工厂只管生产，交付全程无忧" },
  { id: "svb4", title: "线下实体验真", description: "棠源汇展厅常驻展示，支持现场看样、验厂、面对面洽谈" },
];

export const supplierSortOptions = [
  { value: "default", label: "综合排序" },
  { value: "tier", label: "会员等级优先" },
  { value: "newest", label: "最新入驻" },
  { value: "inquiry", label: "询盘量最高" },
  { value: "export", label: "出口额最高" },
] as const;

export type SupplierSortOption = (typeof supplierSortOptions)[number]["value"];

export const supplierPageSize = [20, 40] as const;
export type SupplierPageSize = (typeof supplierPageSize)[number];

export const supplierCategoryTabs = [
  {
    id: "category",
    label: "按主营品类",
    options: categories.map((c) => ({ id: c.id, label: c.name, count: subcategories.filter((s) => s.categoryId === c.id).reduce((sum, s) => sum + s.count, 0) })),
  },
  {
    id: "cert",
    label: "按认证类型",
    options: [
      { id: "JAKIM", label: "JAKIM 认证", count: 45 },
      { id: "GSO", label: "GSO 海湾认证", count: 32 },
      { id: "IFANCA", label: "IFANCA 认证", count: 18 },
      { id: "HALAL", label: "国内 HALAL 认证", count: 120 },
      { id: "出口备案", label: "出口食品生产备案", count: 86 },
    ],
  },
  {
    id: "type",
    label: "按企业类型",
    options: [
      { id: "源头生产工厂", label: "源头生产工厂", count: 68 },
      { id: "品牌运营商", label: "品牌运营商", count: 25 },
      { id: "OEM/ODM代工厂", label: "OEM/ODM 代工厂", count: 42 },
      { id: "专业贸易商", label: "专业贸易商", count: 30 },
    ],
  },
  {
    id: "belt",
    label: "按核心产业带",
    options: [
      { id: "山东", label: "山东清真调理产业带", count: 320 },
      { id: "河北", label: "河北清真禽肉产业带", count: 180 },
      { id: "西北", label: "西北牛羊肉产业带", count: 150 },
      { id: "河南", label: "河南面制品产业带", count: 210 },
    ],
  },
];
export const hotSearchTags = [
  "清真鱼豆腐",
  "清真冻鸭",
  "HALAL 认证",
  "速冻调理品",
  "牛肉丸",
  "咖喱酱",
  "清真预制菜",
  "中东出口",
];

// ==================== 服务中心数据 ====================

export interface ServiceCategoryItem {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  highlight: string;
}

export const serviceCategories: ServiceCategoryItem[] = [
  {
    id: "compliance",
    name: "合规认证",
    nameEn: "Compliance & Certification",
    icon: "ShieldCheck",
    description: "国际 HALAL 认证代办、各国食品准入资质、出口备案一站式办理，源头保障合规准入",
    highlight: "覆盖 JAKIM / GSO / IFANCA / SFDA / FDA 等主流认证机构",
  },
  {
    id: "logistics",
    name: "物流仓储",
    nameEn: "Logistics & Warehousing",
    icon: "Truck",
    description: "冷链双清包税、海外仓配、全程温控追踪，保障清真食品品质与交付时效",
    highlight: "海运 / 空运 / 海外仓全链路，目的地国清关配送",
  },
  {
    id: "channel",
    name: "渠道拓展",
    nameEn: "Channel Expansion",
    icon: "Globe",
    description: "海外商超对接、餐饮连锁合作、电商平台入驻，快速打开目标穆斯林市场",
    highlight: "东盟 / 中东 / 北非 / 中亚四大市场精准渠道资源",
  },
  {
    id: "finance",
    name: "金融配套",
    nameEn: "Financial Services",
    icon: "Landmark",
    description: "出口信保、跨境结算、信用证、供应链金融，降低国际贸易风险",
    highlight: "对接信保公司 / 银行 / 跨境支付机构，全流程资金保障",
  },
];

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  description: string;
  duration: string;
  price: string;
  materials: string[];
  process: string[];
  isHot: boolean;
  icon: string;
  tags: string[];
}

export const serviceItems: ServiceItem[] = [
  // 合规认证类
  {
    id: "sc-c1",
    categoryId: "compliance",
    name: "国际 HALAL 认证代办",
    nameEn: "International HALAL Certification",
    description: "代办 JAKIM（马来西亚）、GSO（海湾）、IFANCA（美国）、MUI（印尼）等国际权威清真认证，全程对接认证机构与清真监督委员会，保障证书真实有效。",
    duration: "30-90 个工作日",
    price: "按认证机构与产品类别报价",
    materials: ["企业营业执照", "产品配方与原料清单", "生产工艺流程图", "厂房清真环境证明", "原料供应商资质"],
    process: ["需求评估", "资料准备", "机构对接", "现场审核", "证书颁发", "归档核验"],
    isHot: true,
    icon: "ShieldCheck",
    tags: ["JAKIM", "GSO", "IFANCA", "MUI"],
  },
  {
    id: "sc-c2",
    categoryId: "compliance",
    name: "各国食品准入资质申请",
    nameEn: "Food Import Qualification",
    description: "办理沙特 SFDA、美国 FDA、欧盟 CE、印尼 BPJPH 等目标市场食品准入注册，确保产品合规进入目的国市场。",
    duration: "45-120 个工作日",
    price: "按目标国与产品类别报价",
    materials: ["企业资质文件", "产品检测报告", "原产地证明", "清真认证证书", "包装标签样稿"],
    process: ["目标国准入评估", "注册方案制定", "资料编制提交", "官方沟通跟进", "注册证书下发"],
    isHot: true,
    icon: "FileCheck",
    tags: ["SFDA", "FDA", "BPJPH", "CE"],
  },
  {
    id: "sc-c3",
    categoryId: "compliance",
    name: "出口食品生产企业备案",
    nameEn: "Export Filing Registration",
    description: "办理海关出口食品生产企业备案，对接海关总署系统，完成电子口岸注册，获取出口资质编号。",
    duration: "15-30 个工作日",
    price: "服务费 3000-8000 元",
    materials: ["营业执照副本", "食品生产许可证", "厂区平面图", "质量管理体系文件", "检验设备清单"],
    process: ["资质初审", "资料编制", "海关系统申报", "现场核查配合", "备案证书获取"],
    isHot: false,
    icon: "Building2",
    tags: ["海关备案", "电子口岸"],
  },
  {
    id: "sc-c4",
    categoryId: "compliance",
    name: "HACCP / ISO22000 体系认证",
    nameEn: "HACCP & ISO22000 Certification",
    description: "辅导企业建立 HACCP 危害分析与关键控制点体系、ISO22000 食品安全管理体系，并通过权威机构认证审核。",
    duration: "60-90 个工作日",
    price: "服务费 15000-35000 元",
    materials: ["企业组织架构", "产品工艺流程", "质量手册草案", "生产现场记录", "人员培训档案"],
    process: ["体系诊断", "文件编制", "全员培训", "体系试运行", "内审管评", "外部认证审核"],
    isHot: false,
    icon: "ClipboardCheck",
    tags: ["HACCP", "ISO22000", "体系认证"],
  },

  // 物流仓储类
  {
    id: "sc-l1",
    categoryId: "logistics",
    name: "冷链双清包税",
    nameEn: "Cold-Chain Dual Clearance",
    description: "提供冷链海运 / 空运双清包税服务，覆盖中国出口报关 + 目的国清关包税派送，全程温控保障清真食品品质。",
    duration: "海运 25-40 天 / 空运 3-7 天",
    price: "按航线与货量报价",
    materials: ["贸易合同", "商业发票", "装箱单", "原产地证", "清真认证副本"],
    process: ["订舱排期", "出口报关", "国际运输", "目的国清关", "冷链派送", "签收确认"],
    isHot: true,
    icon: "Ship",
    tags: ["海运", "空运", "双清包税", "冷链温控"],
  },
  {
    id: "sc-l2",
    categoryId: "logistics",
    name: "海外仓配服务",
    nameEn: "Overseas Warehousing",
    description: "在马来西亚、印尼、阿联酋、沙特等核心市场提供海外仓储与本地配送服务，支持一件代发、库存实时同步。",
    duration: "入库 3-5 个工作日",
    price: "仓储费 + 操作费 + 配送费",
    materials: ["入库清单", "产品合规文件", "库存系统对接", "目的地国清关凭证"],
    process: ["仓库预约", "货物入库", "系统上架", "订单处理", "本地配送", "库存盘点"],
    isHot: true,
    icon: "Warehouse",
    tags: ["马来西亚仓", "阿联酋仓", "印尼仓", "一件代发"],
  },
  {
    id: "sc-l3",
    categoryId: "logistics",
    name: "目的国清关配送",
    nameEn: "Destination Clearance & Delivery",
    description: "提供目的国专业清关服务，熟悉当地食品进口法规与清关流程，对接本地持牌清关行，保障货物快速放行。",
    duration: "3-10 个工作日",
    price: "按货值与目的国报价",
    materials: ["提单 / 空运单", "商业发票", "装箱单", "原产地证", "清真认证", "进口许可证"],
    process: ["单证预审", "到港换单", "海关申报", "查验配合", "税费缴纳", "提货派送"],
    isHot: false,
    icon: "PackageCheck",
    tags: ["清关行", "本地配送", "税费代办"],
  },
  {
    id: "sc-l4",
    categoryId: "logistics",
    name: "全程温控追踪",
    nameEn: "Full-Temperature Tracking",
    description: "为冷链货物配备物联网温湿度记录仪，全程实时监控并预警，到港出具完整温度报告，保障清真食品合规可追溯。",
    duration: "随主运输全程",
    price: "记录仪租赁 + 数据服务",
    materials: ["货物信息", "温控要求", "运输路线"],
    process: ["温控方案制定", "记录仪配置", "装箱启运", "全程监控", "到港报告出具"],
    isHot: false,
    icon: "Thermometer",
    tags: ["IoT 温控", "实时追踪", "温度报告"],
  },

  // 渠道拓展类
  {
    id: "sc-ch1",
    categoryId: "channel",
    name: "海外商超对接",
    nameEn: "Overseas Retail Matching",
    description: "对接马来西亚 Lotus's、印尼 Indomaret、沙特 Lulu、阿联酋 Carrefour 等主流穆斯林市场连锁商超采购体系。",
    duration: "对接周期 1-3 个月",
    price: "服务费 + 交易佣金",
    materials: ["企业资质", "产品资料", "报价单", "样品", "清真认证"],
    process: ["渠道匹配", "资质审核", "样品送审", "采购谈判", "合同签订", "首单交付"],
    isHot: true,
    icon: "Store",
    tags: ["Lotus's", "Indomaret", "Lulu", "Carrefour"],
  },
  {
    id: "sc-ch2",
    categoryId: "channel",
    name: "餐饮连锁供应链合作",
    nameEn: "F&B Chain Supply Cooperation",
    description: "对接中东、东南亚清真餐饮连锁的中央厨房与供应链体系，建立长期稳定的大宗采购合作关系。",
    duration: "对接周期 2-4 个月",
    price: "服务费 + 年度佣金",
    materials: ["产能证明", "质量体系文件", "产品标准", "报价方案", "案例资质"],
    process: ["需求对接", "工厂审核", "样品测试", "标准确认", "合同签订", "稳定供货"],
    isHot: false,
    icon: "UtensilsCrossed",
    tags: ["中央厨房", "大宗采购", "长期合作"],
  },
  {
    id: "sc-ch3",
    categoryId: "channel",
    name: "电商平台入驻",
    nameEn: "E-commerce Platform Onboarding",
    description: "协助入驻 Shopee、Lazada、Amazon Halal、Noon 等目标市场主流电商平台，完成开店、资质审核、商品上架全流程。",
    duration: "入驻周期 2-4 周",
    price: "服务费 5000-15000 元",
    materials: ["企业资质", "品牌授权书", "产品资料", "清真认证", "银行账户"],
    process: ["平台选择", "资质准备", "店铺申请", "审核通过", "商品上架", "运营指导"],
    isHot: false,
    icon: "ShoppingCart",
    tags: ["Shopee", "Lazada", "Noon", "Amazon"],
  },
  {
    id: "sc-ch4",
    categoryId: "channel",
    name: "海外展会代参展",
    nameEn: "Overseas Exhibition Service",
    description: "代理参加马来西亚 MIHAS、迪拜 Gulfood、沙特 Foodex 等国际清真食品展会，提供展位、搭建、翻译、对接一站式服务。",
    duration: "展会前 2-3 个月筹备",
    price: "展位费 + 服务费",
    materials: ["企业资质", "产品样品", "宣传资料", "签证护照"],
    process: ["展会遴选", "展位预订", "物料筹备", "现场布展", "展会对接", "客户跟进"],
    isHot: false,
    icon: "CalendarDays",
    tags: ["MIHAS", "Gulfood", "Foodex"],
  },

  // 金融配套类
  {
    id: "sc-f1",
    categoryId: "finance",
    name: "出口信用保险",
    nameEn: "Export Credit Insurance",
    description: "对接中国信保（Sinosure）出口信用保险，保障应收账款安全，承保买方破产、拖欠、政治风险等，最高赔付比例 90%。",
    duration: "投保审批 5-10 个工作日",
    price: "保费率 0.3%-1.2%",
    materials: ["出口合同", "买方资信", "贸易历史记录", "企业财务报表"],
    process: ["买方资信调查", "额度审批", "保单签订", "发货申报", "理赔保障"],
    isHot: true,
    icon: "ShieldPlus",
    tags: ["中国信保", "应收账款保障", "政治风险"],
  },
  {
    id: "sc-f2",
    categoryId: "finance",
    name: "跨境结算服务",
    nameEn: "Cross-Border Settlement",
    description: "提供多币种跨境结算服务，支持美元 / 人民币 / 林吉特 / 迪拉姆等结算，对接持牌跨境支付机构，T+1 到账。",
    duration: "结算周期 T+1 至 T+3",
    price: "手续费 0.1%-0.5%",
    materials: ["贸易合同", "商业发票", "物流凭证", "企业外汇账户"],
    process: ["订单核验", "外汇申报", "资金汇划", "到账确认", "单证归档"],
    isHot: false,
    icon: "Wallet",
    tags: ["多币种", "T+1 到账", "持牌机构"],
  },
  {
    id: "sc-f3",
    categoryId: "finance",
    name: "信用证审单议付",
    nameEn: "Letter of Credit Advisory",
    description: "提供信用证审单、交单、议付全流程服务，由资深单证专家把控单证质量，降低不符点扣费与拒付风险。",
    duration: "审单 1-3 个工作日",
    price: "议付费 0.125% 起",
    materials: ["信用证正本", "全套运输单据", "商业发票", "装箱单", "保险单"],
    process: ["信用证审核", "单证制备", "交单议付", "银行审单", "收汇结汇"],
    isHot: false,
    icon: "FileText",
    tags: ["LC 审单", "不符点把控", "议付融资"],
  },
  {
    id: "sc-f4",
    categoryId: "finance",
    name: "供应链金融",
    nameEn: "Supply Chain Finance",
    description: "基于贸易订单与应收账款提供融资服务，对接银行与保理公司，缓解供应商资金压力，账期最短 30 天。",
    duration: "审批 7-15 个工作日",
    price: "融资利率 4%-8%",
    materials: ["贸易合同", "订单凭证", "应收账款", "企业财务资料"],
    process: ["融资需求评估", "方案设计", "银行对接", "额度审批", "放款到账", "还款结清"],
    isHot: false,
    icon: "Banknote",
    tags: ["订单融资", "应收账款保理", "账期 30+"],
  },
];

export interface ServiceProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const serviceProcessSteps: ServiceProcessStep[] = [
  {
    id: "sp1",
    step: 1,
    title: "需求提交",
    description: "在线选择服务项目并提交企业基础信息与需求描述",
    icon: "FileInput",
  },
  {
    id: "sp2",
    step: 2,
    title: "方案评估",
    description: "平台服务顾问 1 个工作日内响应，出具定制化服务方案与报价",
    icon: "ClipboardList",
  },
  {
    id: "sp3",
    step: 3,
    title: "资料准备",
    description: "按方案清单准备资质文件，平台协助资料编制与翻译",
    icon: "FolderOpen",
  },
  {
    id: "sp4",
    step: 4,
    title: "服务执行",
    description: "对接认证机构 / 报关行 / 物流商等外部资源，全流程代办执行",
    icon: "Settings",
  },
  {
    id: "sp5",
    step: 5,
    title: "进度跟踪",
    description: "全流程节点实时更新，支持在线查询办理进度与历史记录",
    icon: "Activity",
  },
  {
    id: "sp6",
    step: 6,
    title: "交付归档",
    description: "证书 / 单证 / 报告等成果交付，电子档案统一归档可溯源",
    icon: "PackageCheck",
  },
];

export interface ServiceValueBadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const serviceValueBadges: ServiceValueBadgeItem[] = [
  {
    id: "svb-c1",
    title: "官方背书可信",
    description: "国家级协会主办，对接政府机构与权威认证组织，服务全程可追溯",
    icon: "Award",
  },
  {
    id: "svb-c2",
    title: "全链路一站式",
    description: "从合规认证到物流交付再到资金结算，一站式解决清真食品出海全流程需求",
    icon: "Workflow",
  },
  {
    id: "svb-c3",
    title: "专业团队操盘",
    description: "资深外贸、认证、报关、单证专家 1 对 1 服务，平均行业经验 10 年+",
    icon: "Users",
  },
  {
    id: "svb-c4",
    title: "进度在线可视",
    description: "服务工单全流程节点实时更新，支持在线查询办理进度与历史记录",
    icon: "LineChart",
  },
];

export interface ServiceCase {
  id: string;
  title: string;
  category: string;
  description: string;
  result: string;
  client: string;
  market: string;
}

export const serviceCases: ServiceCase[] = [
  {
    id: "case1",
    title: "山东速冻调理品出口马来西亚",
    category: "合规认证 + 冷链物流",
    description: "为山东某速冻调理品工厂代办 JAKIM 认证与出口备案，并完成首批 40 尺冷链柜双清包税派送至吉隆坡。",
    result: "认证周期缩短 35%，首单 45 天交付到港",
    client: "山东惠发系食品企业",
    market: "马来西亚",
  },
  {
    id: "case2",
    title: "宁夏牛羊肉进入中东商超",
    category: "渠道拓展 + 信用保险",
    description: "协助宁夏牛羊肉出口企业对接沙特 Lulu 连锁商超采购体系，并配套出口信保保障应收账款安全。",
    result: "签订年度框架协议，首年订单 320 万美元",
    client: "宁夏清真肉业集团",
    market: "沙特阿拉伯",
  },
  {
    id: "case3",
    title: "调味品企业海外仓代发",
    category: "海外仓配 + 电商入驻",
    description: "为四川调味品企业在阿联酋设立海外仓，同步入驻 Noon 电商平台，实现本地一件代发。",
    result: "履约时效从 30 天缩短至 3 天，复购率提升 60%",
    client: "川调系出口企业",
    market: "阿联酋",
  },
  {
    id: "case4",
    title: "预制菜全链路出海印尼",
    category: "认证 + 物流 + 金融",
    description: "为河南预制菜企业办理 BPJPH 准入与清真认证，配套冷链海运与信用证议付，完成全链路闭环交付。",
    result: "全流程 90 天落地，累计出口 800 万元",
    client: "中原食品集团",
    market: "印度尼西亚",
  },
];

export interface ServiceFAQItem {
  id: string;
  question: string;
  answer: string;
}

export const serviceFAQs: ServiceFAQItem[] = [
  {
    id: "faq1",
    question: "服务中心的服务对象是谁？",
    answer: "服务中心面向平台入驻供应商及有清真食品出口需求的国内生产企业，提供从合规认证、跨境物流、渠道拓展到金融配套的一站式增值服务。采购商可享受免费的供需对接服务。",
  },
  {
    id: "faq2",
    question: "如何申请服务？流程是怎样的？",
    answer: "在服务中心选择所需服务项目，点击「在线申请」提交企业信息与需求，平台服务顾问将在 1 个工作日内联系并出具方案。确认后即可签订服务协议，进入执行阶段，全程支持在线查询进度。",
  },
  {
    id: "faq3",
    question: "HALAL 认证办理一般需要多久？费用多少？",
    answer: "国际 HALAL 认证办理周期因认证机构与产品类别而异，JAKIM 一般 60-90 个工作日，GSO 约 45-60 个工作日。费用根据产品数量与工艺复杂度报价，平台提供免费需求评估与报价方案。",
  },
  {
    id: "faq4",
    question: "冷链双清包税覆盖哪些国家？",
    answer: "目前覆盖东盟（马来西亚、印尼、泰国）、中东（沙特、阿联酋、卡塔尔）、北非（埃及、摩洛哥）等核心穆斯林市场的海运与空运双清包税服务，支持全程冷链温控追踪。",
  },
  {
    id: "faq5",
    question: "出口信保的赔付比例与投保条件？",
    answer: "通过中国信保投保出口信用保险，最高赔付比例达 90%，承保买方破产、拖欠及政治风险。投保需提供出口合同、买方资信及贸易历史记录，平台协助完成买方资信调查与额度审批。",
  },
  {
    id: "faq6",
    question: "服务进度如何查询？是否支持在线跟踪？",
    answer: "所有服务工单均接入平台进度管理系统，从申请提交到交付归档的每个节点实时更新。供应商可在「我的服务」页面在线查询当前进度、历史记录与电子单证，全程透明可追溯。",
  },
];

export const serviceHotSearchTags = [
  "JAKIM 认证代办",
  "冷链双清包税",
  "出口信保",
  "海外仓代发",
  "Lulu 商超对接",
  "BPJPH 准入",
  "信用证议付",
  "MIHAS 展会",
];

// ==================== 产业生态数据 ====================

export interface EcosystemValueBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ecosystemValueBadges: EcosystemValueBadge[] = [
  {
    id: "evb1",
    title: "国家战略支撑",
    description: "国家级协会主办，对接「一带一路」与 RCEP 政策红利，享有政府间合作通道",
    icon: "Landmark",
  },
  {
    id: "evb2",
    title: "全链条产业闭环",
    description: "覆盖原料、生产、认证、物流、渠道、金融全链路，构建「贸易+服务+生态」完整闭环",
    icon: "Workflow",
  },
  {
    id: "evb3",
    title: "全球资源网络",
    description: "链接中国优质清真食品产能与全球穆斯林消费市场，辐射东盟、中东、北非、中亚",
    icon: "Globe",
  },
  {
    id: "evb4",
    title: "生态协同共赢",
    description: "政府、协会、企业、机构多方协同的开放生态体系，共建共享清真产业价值网络",
    icon: "Network",
  },
];

export interface EcosystemPark {
  id: string;
  name: string;
  nameEn: string;
  type: "domestic" | "overseas";
  location: string;
  description: string;
  highlights: string[];
  stats: { label: string; value: string }[];
}

export const ecosystemParks: EcosystemPark[] = [
  {
    id: "ep1",
    name: "马来西亚双国双园",
    nameEn: "Malaysia Twin Industrial Parks",
    type: "overseas",
    location: "马来西亚 · 关丹/马中关丹产业园",
    description: "中马两国政府共建的标志性合作项目，集清真食品生产、加工、认证、冷链物流于一体，享有税收优惠与贸易便利化政策，直接辐射东盟十国 6 亿穆斯林消费市场。",
    highlights: ["中马政府间合作", "税收优惠政策", "东盟市场辐射", "清真认证互认"],
    stats: [
      { label: "入驻企业", value: "60+" },
      { label: "规划面积", value: "12 km²" },
      { label: "年产值", value: "50亿+" },
      { label: "辐射市场", value: "东盟10国" },
    ],
  },
  {
    id: "ep2",
    name: "临夏清真产业园",
    nameEn: "Linxia Halal Industrial Park",
    type: "domestic",
    location: "中国 · 甘肃临夏回族自治州",
    description: "中国西北最大的清真食品产业基地，依托临夏回族自治州深厚的穆斯林文化底蕴，拥有完整的清真食品产业链和国家级出口资质，产品远销中东、北非。",
    highlights: ["国家级出口资质", "完整产业链", "文化底蕴深厚", "西北枢纽节点"],
    stats: [
      { label: "入驻企业", value: "120+" },
      { label: "占地面积", value: "8 km²" },
      { label: "年产值", value: "35亿+" },
      { label: "出口国家", value: "18国" },
    ],
  },
  {
    id: "ep3",
    name: "宁夏清真产业园",
    nameEn: "Ningxia Halal Industrial Park",
    type: "domestic",
    location: "中国 · 宁夏银川综合保税区",
    description: "中国清真产业集聚区与内陆开放型经济试验区核心，面向阿拉伯国家和伊斯兰世界开展经贸合作，建有清真食品认证中心与国际经贸合作通道。",
    highlights: ["内陆开放试验区", "阿拉伯市场对接", "认证中心驻点", "保税加工"],
    stats: [
      { label: "入驻企业", value: "85+" },
      { label: "占地面积", value: "5 km²" },
      { label: "年产值", value: "22亿+" },
      { label: "出口国家", value: "15国" },
    ],
  },
  {
    id: "ep4",
    name: "印尼Morowali产业园区",
    nameEn: "Indonesia Morowali Industrial Park",
    type: "overseas",
    location: "印度尼西亚 · 中苏拉威西Morowali",
    description: "中印尼产业合作的重要节点园区，依托印尼丰富农业资源与本地加工能力，聚焦清真食品原料供应与初加工，享有印尼工业园区税收减免政策。",
    highlights: ["中印尼合作", "原料产地直供", "本地加工", "税收减免"],
    stats: [
      { label: "入驻企业", value: "40+" },
      { label: "规划面积", value: "10 km²" },
      { label: "年产值", value: "28亿+" },
      { label: "辐射市场", value: "印尼2.7亿人口" },
    ],
  },
];

export interface EcosystemPartnerCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  partners: { name: string; role: string }[];
}

export const ecosystemPartnerCategories: EcosystemPartnerCategory[] = [
  {
    id: "gov",
    name: "政府机构",
    nameEn: "Government Agencies",
    icon: "Landmark",
    description: "对接中国及目标市场国政府监管部门，打通政策通道与贸易便利化",
    partners: [
      { name: "中国食品药品企业质量安全促进会", role: "主办单位" },
      { name: "中国-东盟特色产业链出海平台专委会", role: "运营单位" },
      { name: "海关总署", role: "出口备案核验" },
      { name: "国家市场监督管理总局", role: "食品安全监管" },
      { name: "商务部对外贸易司", role: "贸易政策对接" },
      { name: "马来西亚贸工部(MITI)", role: "中马合作通道" },
      { name: "印尼海洋与投资统筹部", role: "中印尼合作" },
    ],
  },
  {
    id: "assoc",
    name: "行业协会",
    nameEn: "Industry Associations",
    icon: "Users",
    description: "联合国内外清真食品行业协会，构建行业自律与标准互通体系",
    partners: [
      { name: "中国伊斯兰协会", role: "国内清真标准" },
      { name: "马来西亚清真产业推广机构(HDC)", role: "马来西亚对接" },
      { name: "印尼清真认证机构(BPJPH)", role: "印尼认证" },
      { name: "中国食品工业协会", role: "食品行业标准" },
      { name: "山东省清真食品行业协会", role: "产业带支撑" },
      { name: "宁夏清真食品国际贸易商会", role: "宁夏产业带" },
    ],
  },
  {
    id: "cert",
    name: "认证机构",
    nameEn: "Certification Bodies",
    icon: "ShieldCheck",
    description: "覆盖全球主流 HALAL 认证机构，保障证书权威性与国际互认",
    partners: [
      { name: "JAKIM（马来西亚）", role: "东南亚权威认证" },
      { name: "BPJPH / MUI（印尼）", role: "印尼官方认证" },
      { name: "GSO（海湾标准化组织）", role: "海湾六国认证" },
      { name: "IFANCA（美国）", role: "北美认证" },
      { name: "SFDA（沙特食药监）", role: "沙特准入" },
      { name: "中国伊斯兰协会认证", role: "国内认证" },
    ],
  },
  {
    id: "logistics",
    name: "物流服务商",
    nameEn: "Logistics Partners",
    icon: "Truck",
    description: "整合跨境海运、空运、冷链、海外仓资源，保障清真食品交付时效与品质",
    partners: [
      { name: "中远海运集团", role: "海运干线" },
      { name: "顺丰国际", role: "跨境快递" },
      { name: "菜鸟国际", role: "海外仓配" },
      { name: "中外运冷链", role: "冷链温控" },
      { name: "DHL Global Forwarding", role: "国际空运" },
      { name: "嘉里物流(Kerry Logistics)", role: "东南亚配送" },
    ],
  },
  {
    id: "finance",
    name: "金融机构",
    nameEn: "Financial Institutions",
    icon: "Banknote",
    description: "对接信保、银行、跨境支付机构，提供全流程资金保障与风险管控",
    partners: [
      { name: "中国出口信用保险公司", role: "出口信保" },
      { name: "中国进出口银行", role: "贸易融资" },
      { name: "中国银行(跨境金融)", role: "跨境结算" },
      { name: "工商银行(国际部)", role: "信用证业务" },
      { name: "连连支付(国际)", role: "跨境支付" },
      { name: "PingPong金融", role: "外贸收款" },
    ],
  },
];

export interface EcosystemExpert {
  id: string;
  name: string;
  title: string;
  field: string;
  organization: string;
  bio: string;
}

export const ecosystemExperts: EcosystemExpert[] = [
  {
    id: "ex1",
    name: "李明远",
    title: "主任委员",
    field: "清真食品国际贸易",
    organization: "中国食品药品企业质量安全促进会",
    bio: "从事清真食品国际贸易 30 余年，主导中马、中印尼多项政府间清真产业合作项目，深度参与 RCEP 框架下清真食品贸易规则制定。",
  },
  {
    id: "ex2",
    name: "Ahmad bin Ibrahim",
    title: "特聘顾问",
    field: "HALAL 认证体系",
    organization: "马来西亚清真产业推广机构(HDC)",
    bio: "前 JAKIM 高级审核官，国际清真认证领域权威专家，主持制定多项东南亚清真认证标准，拥有 25 年清真认证实务经验。",
  },
  {
    id: "ex3",
    name: "王建华",
    title: "副主任委员",
    field: "跨境供应链与冷链物流",
    organization: "中外运冷链物流有限公司",
    bio: "跨境冷链物流专家，主导建设多条中国至东南亚/中东冷链直通航线，在清真食品冷链运输与温控管理领域有丰富实战经验。",
  },
  {
    id: "ex4",
    name: "Fatimah binti Hassan",
    title: "特聘顾问",
    field: "中东市场拓展",
    organization: "沙特 Lulu 集团采购体系",
    bio: "中东零售市场资深顾问，长期对接沙特、阿联酋连锁商超采购体系，熟悉海湾国家食品准入与渠道拓展策略。",
  },
  {
    id: "ex5",
    name: "张志强",
    title: "委员",
    field: "出口金融与信保",
    organization: "中国出口信用保险公司",
    bio: "贸易金融专家，从事出口信保业务 20 年，擅长清真食品出口企业风险评估、信用额度审批与应收账款保障方案设计。",
  },
  {
    id: "ex6",
    name: "Rahmat Hidayat",
    title: "特聘顾问",
    field: "印尼市场准入",
    organization: "印尼海洋与投资统筹部",
    bio: "印尼食品准入与投资政策专家，深度参与中印尼产业园区合作，熟悉 BPJPH 认证流程与印尼清真食品进口监管体系。",
  },
];

export interface EcosystemAllianceTier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  members: string[];
  icon: string;
}

export const ecosystemAllianceTiers: EcosystemAllianceTier[] = [
  {
    id: "at1",
    name: "原料供应端",
    nameEn: "Raw Material Supply",
    description: "覆盖牛羊肉、禽肉、粮油、调味料等核心原料的源头供应基地",
    members: ["西北牧场联盟", "山东调理原料基地", "宁夏粮油集团", "进口香料供应链"],
    icon: "Wheat",
  },
  {
    id: "at2",
    name: "生产加工端",
    nameEn: "Manufacturing & Processing",
    description: "具备 HALAL 认证与出口备案资质的生产加工企业矩阵",
    members: ["惠发食品", "双汇清真", "安井清真", "中原食品集团"],
    icon: "Factory",
  },
  {
    id: "at3",
    name: "包装与印刷",
    nameEn: "Packaging & Printing",
    description: "清真合规包装材料与阿拉伯语/英语包装印刷服务商",
    members: ["华源包装", "阿拉伯语印刷中心", "清真合规包材供应商"],
    icon: "Package",
  },
  {
    id: "at4",
    name: "冷链物流端",
    nameEn: "Cold Chain Logistics",
    description: "跨境冷链运输、海外仓储、目的地清关配送一体化物流网络",
    members: ["中远海运冷链", "嘉里物流东南亚", "菜鸟海外仓", "DHL空运"],
    icon: "Truck",
  },
  {
    id: "at5",
    name: "渠道零售端",
    nameEn: "Retail & Distribution",
    description: "海外连锁商超、餐饮渠道、电商平台多终端零售网络",
    members: ["Lulu连锁商超", "Noon电商", "Carrefour中东", "印尼Alfamart"],
    icon: "Store",
  },
];

export interface EcosystemFAQItem {
  id: string;
  question: string;
  answer: string;
}

export const ecosystemFAQs: EcosystemFAQItem[] = [
  {
    id: "efaq1",
    question: "产业生态板块面向哪些用户？",
    answer: "产业生态面向全角色用户开放。采购商可了解标杆园区与合作生态资源；供应商可对接产业联盟上下游伙伴；政府与协会机构可了解平台生态布局并寻求合作；投资者与行业研究者可获取清真产业生态全景信息。",
  },
  {
    id: "efaq2",
    question: "如何入驻标杆产业园区？",
    answer: "平台关联的马来西亚双国双园、临夏清真产业园、宁夏清真产业园等园区均设有入驻通道。供应商可在产业生态页面提交入驻意向，平台将对接园区管委会，协助评估企业资质、协调政策优惠、办理入驻手续。",
  },
  {
    id: "efaq3",
    question: "合作生态矩阵中的机构如何接入？",
    answer: "平台已与政府机构、行业协会、认证机构、物流服务商、金融机构建立了合作通道。供应商通过平台服务中心即可在线发起对接需求，平台将根据具体需求匹配对应合作机构，全程协助沟通协调。",
  },
  {
    id: "efaq4",
    question: "专家委员会提供哪些服务？",
    answer: "专家委员会为平台提供战略咨询、政策解读、认证指导、市场分析等智力支持。供应商可通过平台预约专家一对一咨询，涵盖市场准入策略、认证方案优化、渠道拓展规划、供应链设计等专业领域。",
  },
  {
    id: "efaq5",
    question: "产业联盟的加入条件是什么？",
    answer: "产业联盟面向清真食品产业链上下游企业开放，加入条件包括：合法注册企业、具备清真食品相关业务资质、认同平台生态合作理念。生产加工端企业需具备 HALAL 认证或出口备案资质。申请经平台审核通过后即可加入联盟。",
  },
  {
    id: "efaq6",
    question: "平台如何保障生态合作的落地执行？",
    answer: "平台建立标准化的生态合作流程：需求对接 → 资质核验 → 方案匹配 → 协议签订 → 执行跟踪 → 效果评估。全程在线可视，关键节点有平台顾问跟进，保障合作项目落地执行与持续优化。",
  },
];

export const ecosystemHotSearchTags = [
  "双国双园",
  "HALAL 认证",
  "中马合作",
  "产业联盟",
  "专家智库",
  "海外仓",
  "出口信保",
  "Lulu 渠道",
];

// ==================== 资讯动态数据 ====================

export const newsHotSearchTags = [
  "HALAL 认证",
  "东盟市场",
  "中马合作",
  "政策解读",
  "市场趋势",
  "OIC 组织",
  "Lulu 渠道",
  "出口信保",
];

export const newsRegions: NewsRegion[] = [
  {
    id: "OIC",
    name: "OIC",
    fullName: "Organisation of Islamic Cooperation",
    description: "伊斯兰合作组织覆盖 57 个成员国，是全球清真食品市场的核心政策制定与标准协调机构",
  },
  {
    id: "GCC",
    name: "GCC",
    fullName: "Gulf Cooperation Council",
    description: "海湾合作委员会六国，中东最大清真食品进口市场，年进口额超 600 亿美元",
  },
  {
    id: "ASEAN",
    name: "ASEAN",
    fullName: "Association of Southeast Asian Nations",
    description: "东南亚国家联盟，全球穆斯林人口最多的区域，印尼、马来西亚为主要清真食品进口国",
  },
  {
    id: "MENA",
    name: "MENA",
    fullName: "Middle East and North Africa",
    description: "中东北非地区，清真食品消费传统悠久，沙特、阿联酋、埃及为核心市场",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "na1",
    title: "IHFTP 平台正式上线，首批 50 家供应商完成入驻",
    excerpt: "国际清真食品贸易平台（IHFTP）于今日正式上线运营，首批 50 家优质供应商已完成入驻审核，涵盖清真预制菜、速冻调理品、牛羊肉制品等六大品类。平台将为供应商提供从认证到物流的全链路出海服务。",
    date: "2026-07-01",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    isFeatured: true,
    isHot: true,
    tags: ["平台上线", "供应商入驻"],
    image: "https://loremflickr.com/600/400/business,technology,launch",
  },
  {
    id: "na2",
    title: "马来西亚 JAKIM 认证新规实施，出口企业需提前布局",
    excerpt: "马来西亚伊斯兰发展署（JAKIM）发布 2026 年新版清真认证标准，对肉类制品、乳制品的原料溯源提出更高要求。建议出口企业提前 3-6 个月启动认证更新流程。",
    date: "2026-06-28",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "ASEAN",
    isHot: true,
    tags: ["JAKIM", "认证新规", "马来西亚"],
    image: "https://loremflickr.com/600/400/malaysia,mosque,islamic",
  },
  {
    id: "na3",
    title: "2026 上半年全球清真食品市场趋势报告",
    excerpt: "全球清真食品市场规模预计突破 2.2 万亿美元，中东和东南亚成为增长最快的两大区域。预制菜、调味品、休闲食品三个品类增速领先，中国出口份额持续提升。",
    date: "2026-06-25",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    isFeatured: true,
    tags: ["市场报告", "趋势分析"],
    image: "https://loremflickr.com/600/400/stock,market,finance",
  },
  {
    id: "na4",
    title: "沙特 SFDA 发布食品进口电子化通关新流程",
    excerpt: "沙特食品药品管理局（SFDA）宣布自 2026 年 7 月起全面实施食品进口电子化通关，所有清真食品进口需通过 FASAH 系统提交电子申报。平台已完成系统对接。",
    date: "2026-06-22",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "GCC",
    tags: ["SFDA", "沙特", "通关"],
    image: "https://loremflickr.com/600/400/saudi,port,shipping",
  },
  {
    id: "na5",
    title: "OIC 标准化委员会发布清真食品统一标识指南",
    excerpt: "伊斯兰合作组织（OIC）标准化委员会发布了 SMIC（Standards and Measures in Islamic Commerce）清真食品统一标识指南，旨在推动 57 个成员国之间的认证互认进程。",
    date: "2026-06-20",
    category: "行业资讯",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "OIC",
    tags: ["OIC", "标准互认"],
    image: "https://loremflickr.com/600/400/islamic,certificate,document",
  },
  {
    id: "na6",
    title: "Lulu 集团与 IHFTP 达成战略合作，开放 200+ 商超渠道",
    excerpt: "中东最大零售集团 Lulu 与 IHFTP 签署战略合作协议，向平台供应商开放 200+ 海外商超渠道资源，首批 20 家供应商产品已进入 Lulu 采购体系。",
    date: "2026-06-18",
    category: "合作伙伴",
    source: "Lulu 集团",
    sourceType: "partner",
    isFeatured: true,
    tags: ["Lulu", "渠道合作"],
    image: "https://loremflickr.com/600/400/supermarket,grocery,dubai",
  },
  {
    id: "na7",
    title: "印尼 BPJPH 认证流程优化，审批周期缩短 40%",
    excerpt: "印尼宗教部清真产品保证局（BPJPH）宣布认证流程数字化升级，审批周期从 60 天缩短至 36 天。平台已为 12 家供应商通过快速通道完成认证。",
    date: "2026-06-15",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "ASEAN",
    tags: ["BPJPH", "印尼", "认证提速"],
    image: "https://loremflickr.com/600/400/indonesia,islamic,document",
  },
  {
    id: "na8",
    title: "阿联酋发布 2030 食品安全战略，清真食品为重点领域",
    excerpt: "阿联酋气候变化与环境部发布 2030 国家食品安全战略，清真食品供应链本土化与多元化为核心目标，为中国出口企业带来新机遇。",
    date: "2026-06-12",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "MENA",
    tags: ["阿联酋", "食品安全"],
    image: "https://loremflickr.com/600/400/dubai,food,safety",
  },
  {
    id: "na9",
    title: "中国-东盟自贸区 3.0 版谈判完成，清真食品关税进一步降低",
    excerpt: "中国与东盟十国完成自贸区 3.0 版谈判，清真食品类目平均关税从 5% 降至 2.5%，预计带动中国对东盟清真食品出口增长 30% 以上。",
    date: "2026-06-10",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "ASEAN",
    isHot: true,
    tags: ["自贸区", "关税"],
    image: "https://loremflickr.com/600/400/cargo,ship,trade",
  },
  {
    id: "na10",
    title: "山东速冻调理品产业集群出口马来西亚首批交割",
    excerpt: "平台入驻企业惠发食品首批 40 尺冷链柜速冻调理品抵达吉隆坡港，完成双清包税交割。这是山东清真调理产业带通过平台完成的首单出口闭环。",
    date: "2026-06-08",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "ASEAN",
    tags: ["山东", "出口交割"],
    image: "https://loremflickr.com/600/400/frozen,food,warehouse",
  },
  {
    id: "na11",
    title: "海湾六国统一 Halal 标识计划推进，GSO 发布技术规范",
    excerpt: "海湾标准化组织（GSO）发布 GSO 技术规范草案，推动 GCC 六国统一 Halal 标识。预计 2027 年正式实施，届时单一认证可覆盖全部海湾市场。",
    date: "2026-06-05",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "GCC",
    tags: ["GSO", "统一标识"],
    image: "https://loremflickr.com/600/400/gulf,arabia,standard",
  },
  {
    id: "na12",
    title: "中马双国双园项目进展：首批企业入驻马来西亚园区",
    excerpt: "中马双国双园项目马来西亚园区完成首批 8 家企业入驻签约，涵盖清真食品加工、冷链仓储、认证服务等领域。园区预计 2026 年底全面投入运营。",
    date: "2026-06-03",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "ASEAN",
    isFeatured: true,
    tags: ["双国双园", "马来西亚"],
    image: "https://loremflickr.com/600/400/industrial,park,factory",
  },
  {
    id: "na13",
    title: "OIC 商工会呼吁加快成员国间清真食品贸易便利化",
    excerpt: "伊斯兰合作组织商工会在第 16 届会议上通过决议，呼吁 57 个成员国加快清真认证互认进程，降低成员国间清真食品贸易关税与非关税壁垒。",
    date: "2026-05-30",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "OIC",
    tags: ["OIC", "贸易便利化"],
    image: "https://loremflickr.com/600/400/islamic,conference,meeting",
  },
  {
    id: "na14",
    title: "出口信保新模式上线，平台供应商可享 90% 赔付比例",
    excerpt: "平台联合中国信保推出定制化出口信用保险方案，平台入驻供应商可享受最高 90% 赔付比例，保费较市场价低 20%，大幅降低出口贸易风险。",
    date: "2026-05-28",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    isHot: true,
    tags: ["出口信保", "风险保障"],
    image: "https://loremflickr.com/600/400/insurance,finance,contract",
  },
  {
    id: "na15",
    title: "MENA 地区清真食品电商渗透率突破 15%",
    excerpt: "中东北非地区清真食品线上销售占比首次突破 15%，Noon、Amazon.ae 等电商平台清真食品品类年增速超 50%，为中国出口企业带来 D2C 新渠道。",
    date: "2026-05-25",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "MENA",
    tags: ["电商", "D2C"],
    image: "https://loremflickr.com/600/400/ecommerce,laptop,shopping",
  },
  {
    id: "na16",
    title: "平台联合检验检疫局举办清真食品出口合规培训",
    excerpt: "IHFTP 联合山东出入境检验检疫局举办清真食品出口合规专题培训，围绕出口备案、卫生注册、标签合规等核心环节，为 60 余家企业提供实操指导。",
    date: "2026-05-22",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    tags: ["合规培训", "出口备案"],
    image: "https://loremflickr.com/600/400/training,seminar,conference",
  },
  {
    id: "na17",
    title: "沙特 Vision 2030 食品安全投资计划公布，清真食品进口扩容",
    excerpt: "沙特政府公布 Vision 2030 食品安全专项投资计划，投入 35 亿美元建设清真食品进口基础设施，包括港口冷链、仓储配送和检验检测体系。",
    date: "2026-05-20",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "GCC",
    tags: ["沙特", "Vision 2030"],
    image: "https://loremflickr.com/600/400/saudi,arabia,investment",
  },
  {
    id: "na18",
    title: "埃及清真食品进口新规：需提供原产地清真认证双认证",
    excerpt: "埃及进出口商品检验总局发布新规，所有清真食品进口须提供原产地国清真认证机构出具的认证文件，并经埃及驻华使馆双认证。",
    date: "2026-05-18",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "MENA",
    tags: ["埃及", "双认证"],
    image: "https://loremflickr.com/600/400/egypt,port,import",
  },
  {
    id: "na19",
    title: "平台上线「在线验厂」功能，海外采购商可远程审核供应商",
    excerpt: "IHFTP 上线在线验厂功能，海外采购商可通过平台 VR 全景 + 实时视频方式远程审核供应商工厂的清真生产环境、卫生条件与认证资质，降低差旅成本。",
    date: "2026-05-15",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    isHot: true,
    tags: ["在线验厂", "VR"],
    image: "https://loremflickr.com/600/400/factory,inspection,screen",
  },
  {
    id: "na20",
    title: "巴基斯坦放开清真肉类进口关税，中国牛肉出口迎窗口期",
    excerpt: "巴基斯坦国家食品安全部宣布临时下调清真牛肉进口关税至 5%，为期 6 个月。中国出口企业可借此窗口期开拓巴基斯坦 2.3 亿穆斯林消费市场。",
    date: "2026-05-12",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "MENA",
    tags: ["巴基斯坦", "关税", "牛肉"],
    image: "https://loremflickr.com/600/400/pakistan,beef,meat",
  },
  {
    id: "na21",
    title: "OIC 第 49 届外长会议通过清真贸易促进决议",
    excerpt: "OIC 第 49 届外长会议在伊斯兰堡召开，会议通过了《清真贸易便利化合作框架》，决定设立清真食品贸易数字平台试点，推动成员国间信息共享。",
    date: "2026-05-10",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "OIC",
    tags: ["OIC", "外长会议"],
    image: "https://loremflickr.com/600/400/diplomacy,conference,islamic",
  },
  {
    id: "na22",
    title: "Noon 电商平台开放清真食品品类专属入口",
    excerpt: "中东电商巨头 Noon 宣布开放清真食品品类专属频道入口，提供认证核验、清关代办、冷链配送一体化服务，中国供应商可一键入驻开店。",
    date: "2026-05-08",
    category: "合作伙伴",
    source: "Noon 平台",
    sourceType: "partner",
    region: "GCC",
    tags: ["Noon", "电商入驻"],
    image: "https://loremflickr.com/600/400/ecommerce,phone,shopping",
  },
  {
    id: "na23",
    title: "清真食品全球供应链数字化峰会将在迪拜举办",
    excerpt: "第九届清真食品全球供应链数字化峰会定于 2026 年 10 月在迪拜举办，议题涵盖区块链溯源、冷链 IoT 监控、清真认证电子互认等前沿领域。",
    date: "2026-05-05",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "MENA",
    tags: ["峰会", "数字化"],
    image: "https://loremflickr.com/600/400/dubai,skyscraper,conference",
  },
  {
    id: "na24",
    title: "惠发食品通过平台完成首笔 Lulu 商超直供订单",
    excerpt: "平台入驻企业惠发食品首批速冻清真鱼豆腐产品正式进入 Lulu 迪拜旗舰店销售，通过平台直供模式缩短供应链层级 3 层，终端售价降低 15%。",
    date: "2026-05-02",
    category: "合作伙伴",
    source: "惠发食品",
    sourceType: "partner",
    region: "GCC",
    tags: ["惠发", "Lulu", "直供"],
    image: "https://loremflickr.com/600/400/supermarket,shelf,food",
  },
  {
    id: "na25",
    title: "马来西亚伊斯兰银行推出清真食品出口专项贷款",
    excerpt: "马来西亚伊斯兰银行（Bank Islam）推出面向中国清真食品出口企业的专项贷款产品，最高额度 500 万令吉，利率较常规贸易融资低 1.5%。",
    date: "2026-04-28",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "ASEAN",
    tags: ["伊斯兰银行", "贷款"],
    image: "https://loremflickr.com/600/400/bank,finance,building",
  },
  {
    id: "na26",
    title: "GCC 标准化组织发布清真食品包装材料技术指南",
    excerpt: "GSO 发布 GSO 2055-1:2026 清真食品包装材料技术指南，明确了可接触清真食品的包装材料清单及禁用物质要求，出口企业需注意包装合规。",
    date: "2026-04-25",
    category: "政策法规",
    source: "IHFTP 官方",
    sourceType: "official",
    region: "GCC",
    tags: ["GSO", "包装材料"],
    image: "https://loremflickr.com/600/400/packaging,box,food",
  },
  {
    id: "na27",
    title: "平台上线「认证进度看板」功能，全流程节点在线可视",
    excerpt: "IHFTP 上线认证进度看板功能，供应商可实时查看 HALAL 认证办理进度，包括资料提交、审核、现场检查、发证等各环节状态与预计完成时间。",
    date: "2026-04-22",
    category: "平台动态",
    source: "IHFTP 官方",
    sourceType: "official",
    tags: ["认证看板", "功能上线"],
    image: "https://loremflickr.com/600/400/dashboard,monitor,technology",
  },
  {
    id: "na28",
    title: "印尼 MUI 与中国伊协签署认证互认合作备忘录",
    excerpt: "印尼伊斯兰学者理事会（MUI）与中国伊斯兰教协会签署清真认证互认合作备忘录，双方认证的清真食品在对方市场可免重复认证，预计降低企业成本 40%。",
    date: "2026-04-20",
    category: "行业资讯",
    source: "IHFTP 研究院",
    sourceType: "official",
    region: "ASEAN",
    isHot: true,
    tags: ["MUI", "中国伊协", "互认"],
    image: "https://loremflickr.com/600/400/handshake,china,indonesia",
  },
  {
    id: "na29",
    title: "中远海运开通青岛-迪拜清真食品冷链专线",
    excerpt: "中远海运开通青岛港至迪拜杰贝阿里港清真食品冷链专线，全程温控 -18°C，航行周期 18 天，为平台供应商提供专属舱位与优惠运价。",
    date: "2026-04-18",
    category: "合作伙伴",
    source: "中远海运",
    sourceType: "partner",
    region: "GCC",
    tags: ["中远海运", "冷链专线"],
    image: "https://loremflickr.com/600/400/container,ship,cargo",
  },
  {
    id: "na30",
    title: "2026 Q1 中国清真食品出口数据：同比增长 27.3%",
    excerpt: "据海关总署数据，2026 年第一季度中国清真食品出口额达 18.7 亿美元，同比增长 27.3%。东盟、中东两大市场贡献增量超 70%，预制菜与调味品增速领跑。",
    date: "2026-04-15",
    category: "市场分析",
    source: "IHFTP 研究院",
    sourceType: "official",
    isFeatured: true,
    tags: ["出口数据", "Q1 报告"],
    image: "https://loremflickr.com/600/400/data,chart,export",
  },
];

export const regionalNewsData: Record<string, NewsArticle[]> = {
  OIC: newsArticles.filter((a) => a.region === "OIC"),
  GCC: newsArticles.filter((a) => a.region === "GCC"),
  ASEAN: newsArticles.filter((a) => a.region === "ASEAN"),
  MENA: newsArticles.filter((a) => a.region === "MENA"),
};

export const productTrends: ProductTrend[] = [
  {
    id: "pt1",
    productName: "清真预制菜",
    category: "即食便当 / 调理肉制品",
    trend: "up",
    changePercent: "+24.5%",
    demand: "东盟、中东需求旺盛",
    regions: ["东盟", "中东"],
    dataPoints: [
      { month: "1月", value: 62 },
      { month: "2月", value: 68 },
      { month: "3月", value: 71 },
      { month: "4月", value: 75 },
      { month: "5月", value: 82 },
      { month: "6月", value: 88 },
    ],
    annotations: [
      { month: "3月", label: "东盟自贸区 3.0 签署" },
      { month: "5月", label: "斋月备货高峰" },
    ],
  },
  {
    id: "pt2",
    productName: "速冻调理品",
    category: "速冻水饺 / 春卷 / 肉丸",
    trend: "up",
    changePercent: "+18.3%",
    demand: "马来西亚、印尼进口量持续增长",
    regions: ["东盟"],
    dataPoints: [
      { month: "1月", value: 55 },
      { month: "2月", value: 58 },
      { month: "3月", value: 61 },
      { month: "4月", value: 60 },
      { month: "5月", value: 65 },
      { month: "6月", value: 67 },
    ],
    annotations: [
      { month: "4月", label: "山东首单交割" },
      { month: "6月", label: "JAKIM 新规落地" },
    ],
  },
  {
    id: "pt3",
    productName: "牛羊肉制品",
    category: "牛肉卷 / 羊排 / 肉干",
    trend: "stable",
    changePercent: "+2.1%",
    demand: "中东市场稳定采购，价格平稳",
    regions: ["中东", "北非"],
    dataPoints: [
      { month: "1月", value: 78 },
      { month: "2月", value: 76 },
      { month: "3月", value: 79 },
      { month: "4月", value: 77 },
      { month: "5月", value: 80 },
      { month: "6月", value: 79 },
    ],
    annotations: [
      { month: "5月", label: "巴基斯坦关税下调" },
    ],
  },
  {
    id: "pt4",
    productName: "清真调味品",
    category: "咖喱酱 / 辣椒酱 / 火锅底料",
    trend: "up",
    changePercent: "+31.2%",
    demand: "中东北非餐饮渠道需求爆发",
    regions: ["中东", "北非"],
    dataPoints: [
      { month: "1月", value: 40 },
      { month: "2月", value: 45 },
      { month: "3月", value: 48 },
      { month: "4月", value: 55 },
      { month: "5月", value: 62 },
      { month: "6月", value: 70 },
    ],
    annotations: [
      { month: "4月", label: "MENA 电商突破" },
      { month: "6月", label: "沙特 SFDA 通关提速" },
    ],
  },
  {
    id: "pt5",
    productName: "休闲食品",
    category: "椰枣 / 芒果干 / 坚果",
    trend: "up",
    changePercent: "+15.7%",
    demand: "东盟零售渠道扩展迅速",
    regions: ["东盟"],
    dataPoints: [
      { month: "1月", value: 58 },
      { month: "2月", value: 60 },
      { month: "3月", value: 63 },
      { month: "4月", value: 65 },
      { month: "5月", value: 68 },
      { month: "6月", value: 70 },
    ],
    annotations: [
      { month: "5月", label: "Noon 渠道开放" },
    ],
  },
  {
    id: "pt6",
    productName: "米面粮油",
    category: "大米 / 面粉 / 食用油",
    trend: "down",
    changePercent: "-3.8%",
    demand: "国际粮价波动，采购观望情绪浓",
    regions: ["中东", "东盟"],
    dataPoints: [
      { month: "1月", value: 82 },
      { month: "2月", value: 80 },
      { month: "3月", value: 78 },
      { month: "4月", value: 79 },
      { month: "5月", value: 76 },
      { month: "6月", value: 75 },
    ],
    annotations: [
      { month: "3月", label: "国际粮价上涨" },
      { month: "5月", label: "采购观望加重" },
    ],
  },
  {
    id: "pt7",
    productName: "清真冻品",
    category: "冻鸭胸 / 冻鸡肉",
    trend: "up",
    changePercent: "+12.4%",
    demand: "中东斋月备货需求强劲",
    regions: ["中东"],
    dataPoints: [
      { month: "1月", value: 60 },
      { month: "2月", value: 63 },
      { month: "3月", value: 72 },
      { month: "4月", value: 68 },
      { month: "5月", value: 65 },
      { month: "6月", value: 68 },
    ],
    annotations: [
      { month: "3月", label: "斋月集中备货" },
      { month: "4月", label: "节后回落" },
    ],
  },
  {
    id: "pt8",
    productName: "清真烘焙",
    category: "手抓饼 / 面包 / 糕点",
    trend: "stable",
    changePercent: "+1.5%",
    demand: "东南亚华人穆斯林社区稳定消费",
    regions: ["东盟"],
    dataPoints: [
      { month: "1月", value: 50 },
      { month: "2月", value: 51 },
      { month: "3月", value: 50 },
      { month: "4月", value: 52 },
      { month: "5月", value: 51 },
      { month: "6月", value: 51 },
    ],
    annotations: [
      { month: "4月", label: "华人节庆需求" },
    ],
  },
];
