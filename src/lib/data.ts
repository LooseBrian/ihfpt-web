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

export interface Product {
  id: string;
  name: string;
  spec: string;
  moq: string;
  priceRange: string;
  supplier: string;
  certType: string;
  image: string;
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

export const products: Product[] = [
  { id: "p1", name: "清真牛肉丸", spec: "500g/袋", moq: "1000袋", priceRange: "$2.5 - $3.0", supplier: "GreenHalal Foods", certType: "JAKIM", image: "https://images.unsplash.com/photo-1607623814075-e51df1bd656c?w=400&h=300&fit=crop" },
  { id: "p2", name: "速冻清真水饺", spec: "20只/盒", moq: "500盒", priceRange: "$3.0 - $3.8", supplier: "Orient Delight", certType: "HALAL", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop" },
  { id: "p3", name: "清真咖喱酱", spec: "200g/瓶", moq: "2000瓶", priceRange: "$1.2 - $1.5", supplier: "SpiceRoute Co.", certType: "SFDA", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop" },
  { id: "p4", name: "清真羊肉串", spec: "10串/包", moq: "800包", priceRange: "$4.5 - $5.5", supplier: "Xinjiang Best", certType: "JAKIM", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop" },
  { id: "p5", name: "有机清真大米", spec: "5kg/袋", moq: "300袋", priceRange: "$8.0 - $10.0", supplier: "GoldenGrain Ltd.", certType: "HALAL", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop" },
  { id: "p6", name: "清真即食汤", spec: "40g/杯", moq: "1500杯", priceRange: "$0.8 - $1.0", supplier: "SoupMaster", certType: "FDA", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop" },
  { id: "p7", name: "清真芝麻烧饼", spec: "6个/袋", moq: "600袋", priceRange: "$2.0 - $2.5", supplier: "BakeryHalal", certType: "HALAL", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
  { id: "p8", name: "清真辣椒酱", spec: "350g/瓶", moq: "1200瓶", priceRange: "$1.5 - $2.0", supplier: "ChiliKing", certType: "SFDA", image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=300&fit=crop" },
];

export const suppliers: Supplier[] = [
  { id: "s1", name: "GreenHalal Foods Co., Ltd.", logo: "GH", categories: ["牛羊肉制品", "速冻调理品"], certs: ["JAKIM", "HALAL", "FDA"], exportVolume: "$5M+", location: "宁夏" },
  { id: "s2", name: "Orient Delight Group", logo: "OD", categories: ["清真预制菜", "休闲食品"], certs: ["JAKIM", "HALAL"], exportVolume: "$8M+", location: "山东" },
  { id: "s3", name: "SpiceRoute International", logo: "SR", categories: ["调味品", "米面粮油"], certs: ["SFDA", "HALAL"], exportVolume: "$3M+", location: "四川" },
  { id: "s4", name: "Xinjiang Best Meats", logo: "XB", categories: ["牛羊肉制品"], certs: ["JAKIM", "HALAL", "FDA"], exportVolume: "$12M+", location: "新疆" },
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
  { id: "pr1", title: "马来西亚双国双园", description: "中马合作的标志性清真产业园区，集生产、加工、认证、物流于一体，辐射东盟十国市场。", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop" },
  { id: "pr2", title: "临夏清真产业园", description: "中国西北最大的清真食品产业基地，拥有完整的产业链和国家级出口资质，产品远销中东、北非。", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop" },
];

export const news: NewsItem[] = [
  { id: "n1", title: "平台正式上线，首批50家供应商入驻", excerpt: "国际清真食品贸易平台（IHFTP）于今日正式上线运营，首批50家优质供应商完成入驻审核...", date: "2026-06-20", category: "平台动态" },
  { id: "n2", title: "东盟清真食品进口新规解读", excerpt: "马来西亚、印尼等国近期更新了清真食品进口标准，本文为您详细解读最新政策变化及应对策略...", date: "2026-06-18", category: "政策法规" },
  { id: "n3", title: "2026年全球清真食品市场趋势报告", excerpt: "全球清真食品市场规模预计突破2万亿美元，中东和东南亚成为增长最快的两大区域...", date: "2026-06-15", category: "市场分析" },
];

export const navLinks = [
  { label: "首页", labelEn: "Home", href: "/" },
  { label: "产品大厅", labelEn: "Products", href: "#products" },
  { label: "优质供应商", labelEn: "Suppliers", href: "#suppliers" },
  { label: "服务中心", labelEn: "Services", href: "#services" },
  { label: "产业生态", labelEn: "Ecosystem", href: "#projects" },
  { label: "资讯动态", labelEn: "News", href: "#news" },
  { label: "关于我们", labelEn: "About", href: "#about" },
  { label: "联系我们", labelEn: "Contact", href: "#contact" },
];

export const trustBadges = [
  { id: "tb1", title: "国际HALAL认证互认", description: "覆盖JAKIM、SFDA、FDA等主流认证机构" },
  { id: "tb2", title: "海关官方合作", description: "出口备案在线核验，通关效率高" },
  { id: "tb3", title: "多国政府对接", description: "中马、中印尼等政府间合作项目支撑" },
  { id: "tb4", title: "全程合规保障", description: "从生产到出口的全链路合规服务" },
];
