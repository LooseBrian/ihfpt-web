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
  { label: "服务中心", labelEn: "Services", href: "#services" },
  { label: "产业生态", labelEn: "Ecosystem", href: "#projects" },
  { label: "资讯动态", labelEn: "News", href: "#news" },
  { label: "关于我们", labelEn: "About", href: "/about" },
  { label: "联系我们", labelEn: "Contact", href: "#contact" },
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
