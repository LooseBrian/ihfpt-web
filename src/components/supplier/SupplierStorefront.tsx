"use client";

import { useState } from "react";
import { IMAGE_PLACEHOLDER_DATAURI } from "@/lib/product-images";
import {
  Store,
  Factory,
  Award,
  Globe,
  Users,
  Building2,
  Truck,
  Star,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InquiryDialog } from "@/components/inquiry/InquiryDialog";

interface StorefrontData {
  companyName: string;
  shortName: string;
  slogan: string;
  description: string;
  role: string;
  verified: boolean;
  categories: string[];
  markets: string[];
  products: StorefrontProduct[];
  cases: StorefrontCase[];
  qualifications: StorefrontQualification[];
  stats: {
    products: number;
    inquiries: number;
    visits: number;
    followers: number;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  isPreview?: boolean;
}

interface StorefrontProduct {
  id: string;
  name: string;
  spec: string;
  price: string;
  image: string;
  category: string;
  isHot?: boolean;
}

interface StorefrontCase {
  id: string;
  title: string;
  buyer: string;
  volume: string;
  value: string;
  date: string;
  status: string;
  image: string;
}

interface StorefrontQualification {
  name: string;
  certId: string;
  status: string;
  validUntil: string;
}

const defaultData: StorefrontData = {
  companyName: "惠发食品有限公司",
  shortName: "惠发食品",
  slogan: "专注清真食品 · 品质连接世界",
  description:
    "惠发食品有限公司成立于2005年，专注于清真食品研发、生产与销售。拥有现代化生产线3条，年产能超5万吨，产品涵盖冷冻肉制品、预制菜、复合调味料等6大品类。已通过HALAL MUI、JAKIM等多项国际清真认证，产品出口至东南亚、中东、中亚等15个国家和地区。",
  role: "金牌工厂",
  verified: true,
  categories: ["牛羊肉制品", "清真预制菜", "速冻调理品"],
  markets: ["印度尼西亚", "马来西亚", "阿联酋"],
  products: [
    { id: "p1", name: "清真冷冻羊腿肉（分割）", spec: "10kg/箱", price: "¥85/kg", image: "https://loremflickr.com/240/180/meat,lamb", category: "牛羊肉制品", isHot: true },
    { id: "p2", name: "清真预制菜 — 咖喱牛肉", spec: "500g/盒", price: "¥45/盒", image: "https://loremflickr.com/240/180/curry,beef", category: "清真预制菜" },
    { id: "p3", name: "清真复合调味料 — 孜然粉", spec: "1kg/袋", price: "¥15/kg", image: "https://loremflickr.com/240/180/spice,seasoning", category: "调味品" },
    { id: "p4", name: "清真速冻调理品 — 烤鸡翅", spec: "2kg/袋", price: "¥35/kg", image: "https://loremflickr.com/240/180/chicken,roasted", category: "速冻调理品", isHot: true },
    { id: "p5", name: "清真速冻饺子 — 牛肉洋葱", spec: "1kg/袋", price: "¥28/kg", image: "https://loremflickr.com/240/180/dumpling,beef", category: "速冻调理品" },
    { id: "p6", name: "清真牛肉丸 — 手工打制", spec: "500g/袋", price: "¥38/kg", image: "https://loremflickr.com/240/180/meatball,beef", category: "牛羊肉制品" },
  ],
  cases: [
    { id: "c1", title: "印尼雅加达 · 冷冻羊腿肉出口", buyer: "PT. Sumber Protein Nusantara", volume: "12 吨", value: "$102,000", date: "2026-06", status: "completed", image: "https://loremflickr.com/400/200/indonesia,port" },
    { id: "c2", title: "马来西亚吉隆坡 · 预制菜供应", buyer: "MyDin Holding Berhad", volume: "8,000 箱", value: "$45,000", date: "2026-05", status: "completed", image: "https://loremflickr.com/400/200/malaysia,food" },
    { id: "c3", title: "阿联酋迪拜 · 清真调味料出口", buyer: "Al Islami Foods FZ-LLC", volume: "5 吨", value: "$28,000", date: "2026-04", status: "shipping", image: "https://loremflickr.com/400/200/dubai,port" },
  ],
  qualifications: [
    { name: "营业执照", certId: "91370700MA3XXK", status: "有效", validUntil: "2030-12-31" },
    { name: "SC 认证（食品生产许可）", certId: "SC10637078200", status: "有效", validUntil: "2028-06-30" },
    { name: "HALAL 证书（JAKIM）", certId: "JAKIM-HAL-2024-0815", status: "有效", validUntil: "2027-08-14" },
    { name: "出口食品备案", certId: "CN-GA-3700-2021", status: "有效", validUntil: "2029-03-15" },
    { name: "MUI HALAL 认证", certId: "MUI-HAL-2025-0321", status: "有效", validUntil: "2026-07-20" },
  ],
  stats: { products: 18, inquiries: 36, visits: 1258, followers: 42 },
  contact: {
    phone: "+86 0536-1234567",
    email: "service@huifa.com",
    address: "山东省潍坊市诸城市经济开发区惠发路1号",
    hours: "08:00 - 18:00 (北京时间)",
  },
};

export function SupplierStorefront({
  data = defaultData,
  isPreview = false,
}: {
  data?: StorefrontData;
  isPreview?: boolean;
}) {
  const [activeSection, setActiveSection] = useState("products");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  // Merge isPreview from prop or data
  const previewMode = isPreview || data.isPreview || false;

  const inquiryProduct = {
    id: "store-inquiry",
    name: "惠发食品店铺询盘",
    image: "/media/product-lamb-skewers.jpg",
    spec: "多品类",
    priceRange: "请咨询",
    supplier: "惠发食品",
    certType: "JAKIM",
  };

  const navItems = [
    { id: "products", label: "全部产品", count: data.products.length },
    { id: "about", label: "企业介绍" },
    { id: "cases", label: "出口案例", count: data.cases.length },
    { id: "qualifications", label: "资质证书", count: data.qualifications.length },
    { id: "contact", label: "联系我们" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ===== Preview Banner ===== */}
      {previewMode && (
        <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">预览模式</span>
            <span className="text-amber-100">— 这是采购商将看到的店铺展示效果</span>
          </div>
          <Link href="/supplier#store">
            <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors text-xs">
              <ArrowLeft className="h-3 w-3" />
              返回编辑
            </button>
          </Link>
        </div>
      )}

      {/* ===== Store Banner ===== */}
      <div className="relative h-64 md:h-72 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-800 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 rounded-full bg-brand-400 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-8">
          <div className="flex items-end gap-4 w-full">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0">
              <Factory className="h-10 w-10 md:h-12 md:w-12 text-brand-700" />
            </div>

            {/* Company info */}
            <div className="flex-1 text-white pb-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl md:text-3xl font-bold">{data.shortName}</h1>
                <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-bold rounded">
                  {data.role}
                </span>
                {data.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/15 text-brand-50 text-xs font-medium rounded">
                    <ShieldCheck className="h-3 w-3" />
                    已认证
                  </span>
                )}
              </div>
              <p className="text-brand-100 text-sm md:text-base">{data.slogan}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-brand-200">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {data.contact.address.split("省")[0]}省
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {data.markets.length} 个出口市场
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  成立 2005 年
                </span>
              </div>
            </div>

            {/* CTA */}
            {!previewMode && (
              <div className="hidden md:flex flex-col gap-2 shrink-0">
                <Button className="bg-gold-500 hover:bg-gold-600 text-white" onClick={() => setInquiryOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  发送询盘
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  关注店铺
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Stats Bar ===== */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Store className="h-4 w-4 text-brand-500" />
                <span className="text-muted-foreground">产品</span>
                <span className="font-bold text-foreground">{data.stats.products}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-trust-500" />
                <span className="text-muted-foreground">询盘</span>
                <span className="font-bold text-foreground">{data.stats.inquiries}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-gold-500" />
                <span className="text-muted-foreground">访问</span>
                <span className="font-bold text-foreground">{data.stats.visits.toLocaleString()}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-400" />
                <span className="text-muted-foreground">粉丝</span>
                <span className="font-bold text-foreground">{data.stats.followers}</span>
              </div>
            </div>

            {!previewMode && (
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 md:hidden" onClick={() => setInquiryOpen(true)}>
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  询盘
                </Button>
                <Button size="sm" variant="outline" className="hidden md:flex">
                  关注店铺
                </Button>
              </div>
            )}
          </div>

          {/* Section nav */}
          <div className="flex items-center gap-1 pb-2 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {item.count !== undefined && (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1 rounded">{item.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Company card */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-600" />
                企业信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">企业全称</div>
                    <div className="font-medium text-foreground">{data.companyName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">企业类型</div>
                    <div className="font-medium text-foreground">品牌运营商</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">年产能</div>
                    <div className="font-medium text-foreground">5万吨</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">员工规模</div>
                    <div className="font-medium text-foreground">1,500+ 人</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">出口国家</div>
                    <div className="font-medium text-foreground">15 个</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-600" />
                主营品类
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 text-xs bg-brand-50 text-brand-700 rounded-lg font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Export markets */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-trust-600" />
                出口市场
              </h3>
              <div className="space-y-2">
                {data.markets.map((market) => (
                  <div key={market} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-trust-500" />
                    <span className="text-foreground">{market}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-600" />
                联系方式
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{data.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground truncate">{data.contact.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-foreground">{data.contact.hours}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-foreground text-xs leading-relaxed">{data.contact.address}</span>
                </div>
              </div>

              {!previewMode && (
                <Button className="w-full mt-4 bg-brand-600 hover:bg-brand-700" size="sm" onClick={() => setInquiryOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  发送询盘
                </Button>
              )}
            </div>
          </aside>

          {/* Right content */}
          <div className="lg:col-span-3 space-y-8">
            {/* ===== Products Section ===== */}
            <section id="section-products" className="bg-white rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Store className="h-5 w-5 text-brand-600" />
                  全部产品
                  <span className="text-sm text-muted-foreground font-normal">({data.products.length})</span>
                </h2>
                {!previewMode && (
                  <button className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                    查看全部
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border overflow-hidden group hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI;
                        }}
                      />
                      {product.isHot && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                          HOT
                        </span>
                      )}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/90 text-brand-700 text-[10px] font-medium rounded">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1.5 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{product.spec}</span>
                        <span className="text-sm font-bold text-brand-700">{product.price}</span>
                      </div>
                      {!previewMode && (
                        <button className="w-full mt-2.5 py-1.5 text-xs bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg font-medium transition-colors" onClick={() => setInquiryOpen(true)}>
                          发送询盘
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== About Section ===== */}
            <section id="section-about" className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand-600" />
                企业介绍
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {[
                  { icon: Factory, label: "成立年份", value: "2005 年" },
                  { icon: TrendingUp, label: "年产能", value: "5,000 吨" },
                  { icon: Globe, label: "出口国家", value: "12 个" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-muted/30 rounded-xl p-4 text-center">
                      <Icon className="h-6 w-6 text-brand-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-foreground">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
            </section>

            {/* ===== Cases Section ===== */}
            <section id="section-cases" className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-brand-600" />
                成功出口案例
                <span className="text-sm text-muted-foreground font-normal">({data.cases.length})</span>
              </h2>
              <div className="space-y-4">
                {data.cases.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-muted/30 rounded-xl border overflow-hidden">
                    <div className="w-32 sm:w-40 shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover min-h-[120px]" />
                    </div>
                    <div className="flex-1 py-3 pr-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded shrink-0 ${
                          item.status === "completed" ? "bg-brand-50 text-brand-600" : "bg-gold-50 text-gold-600"
                        }`}>
                          {item.status === "completed" ? "已完成" : "运输中"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">采购商：{item.buyer}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="flex items-center gap-1 text-brand-700 font-medium">
                          <Truck className="h-3 w-3" />
                          {item.volume}
                        </span>
                        <span className="text-gold-600 font-bold">{item.value}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== Qualifications Section ===== */}
            <section id="section-qualifications" className="bg-white rounded-2xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-600" />
                资质证书
                <span className="text-sm text-muted-foreground font-normal">({data.qualifications.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.qualifications.map((qual) => (
                  <div key={qual.certId} className="flex items-center gap-3 bg-muted/30 rounded-xl border p-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{qual.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">证书编号：{qual.certId}</div>
                      <div className="text-xs text-muted-foreground">有效期至：{qual.validUntil}</div>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-600 text-[10px] font-medium rounded shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      {qual.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== Contact Section ===== */}
            <section id="section-contact" className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold-400" />
                联系我们
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-medium text-gold-100">客服电话</span>
                  </div>
                  <div className="text-white">{data.contact.phone}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-medium text-gold-100">电子邮箱</span>
                  </div>
                  <div className="text-white truncate">{data.contact.email}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-medium text-gold-100">营业时间</span>
                  </div>
                  <div className="text-white text-sm">{data.contact.hours}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gold-400" />
                    <span className="text-sm font-medium text-gold-100">企业地址</span>
                  </div>
                  <div className="text-white text-sm">{data.contact.address}</div>
                </div>
              </div>

              {!previewMode && (
                <div className="flex gap-3 mt-5">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-white flex-1" onClick={() => setInquiryOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    立即发送询盘
                  </Button>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    关注店铺
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <InquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        product={inquiryProduct}
      />
    </div>
  );
}
