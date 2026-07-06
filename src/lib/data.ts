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
  categories: string[];
  certs: string[];
  exportVolume: string;
  location: string;
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
  { id: "s1", name: "GreenHalal Foods Co., Ltd.", logo: "GH", categories: ["牛羊肉制品", "速冻调理品"], certs: ["JAKIM", "HALAL", "FDA"], exportVolume: "$5M+", location: "宁夏" },
  { id: "s2", name: "Orient Delight Group", logo: "OD", categories: ["清真预制菜", "休闲食品"], certs: ["JAKIM", "HALAL"], exportVolume: "$8M+", location: "山东" },
  { id: "s3", name: "SpiceRoute International", logo: "SR", categories: ["调味品", "米面粮油"], certs: ["SFDA", "HALAL"], exportVolume: "$3M+", location: "四川" },
  { id: "s4", name: "Xinjiang Best Meats", logo: "XB", categories: ["牛羊肉制品"], certs: ["JAKIM", "HALAL", "FDA"], exportVolume: "$12M+", location: "新疆" },
  { id: "s5", name: "Huifa Foods", logo: "HF", categories: ["速冻调理品", "清真预制菜"], certs: ["JAKIM", "HALAL", "GSO"], exportVolume: "$15M+", location: "山东" },
  { id: "s6", name: "GoldenGrain Ltd.", logo: "GG", categories: ["米面粮油"], certs: ["HALAL", "GSO"], exportVolume: "$6M+", location: "黑龙江" },
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
