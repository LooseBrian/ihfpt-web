"use client";

import { useState } from "react";
import Link from "next/link";
import { IMAGE_PLACEHOLDER_DATAURI } from "@/lib/product-images";
import {
  Store,
  Edit,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  LayoutGrid,
  FileText,
  Star,
  Settings,
  Plus,
  Trash2,
  Globe,
  Phone,
  Mail,
  Clock,
  Save,
  Upload,
  Palette,
  Layers,
  MapPin,
  Award,
  Truck,
  ChevronRight,
  Bell,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TabId = "decoration" | "company" | "cases" | "settings";

interface TabConfig {
  id: TabId;
  label: string;
  icon: typeof Store;
}

const tabs: TabConfig[] = [
  { id: "decoration", label: "店铺装修", icon: Palette },
  { id: "company", label: "企业信息", icon: FileText },
  { id: "cases", label: "展示案例", icon: Star },
  { id: "settings", label: "店铺设置", icon: Settings },
];

const storeTemplates = [
  {
    id: "classic",
    name: "经典商务",
    desc: "绿色主色调，适合传统食品企业",
    colors: ["bg-brand-700", "bg-gold-500", "bg-white"],
    selected: true,
  },
  {
    id: "modern",
    name: "现代简约",
    desc: "白底大图，突出产品视觉",
    colors: ["bg-slate-800", "bg-emerald-500", "bg-gray-100"],
    selected: false,
  },
  {
    id: "premium",
    name: "高端旗舰",
    desc: "深色金线，强调品牌质感",
    colors: ["bg-brand-900", "bg-gold-400", "bg-zinc-900"],
    selected: false,
  },
];

const bannerSlots = [
  { id: "banner1", label: "主 Banner（1920×500）", desc: "店铺首页顶部轮播主图", required: true },
  { id: "banner2", label: "副 Banner（960×300）", desc: "活动促销或品类推荐位", required: false },
  { id: "banner3", label: "底部 Banner（1920×200）", desc: "企业资质或品牌故事展示", required: false },
];

const productDisplayRules = [
  { rule: "精选产品", count: 3, desc: "店铺首页顶部展示，手动选择" },
  { rule: "新品上架", count: 4, desc: "按上架时间自动排列" },
  { rule: "热销产品", count: 4, desc: "按询盘量自动排列" },
];

const exportCases = [
  {
    id: "case1",
    title: "印尼雅加达 · 冷冻羊腿肉出口",
    buyer: "PT. Sumber Protein Nusantara",
    volume: "12 吨",
    value: "$102,000",
    date: "2026-06",
    status: "completed",
    image: "https://loremflickr.com/300/160/indonesia,port",
  },
  {
    id: "case2",
    title: "马来西亚吉隆坡 · 预制菜供应",
    buyer: "MyDin Holding Berhad",
    volume: "8,000 箱",
    value: "$45,000",
    date: "2026-05",
    status: "completed",
    image: "https://loremflickr.com/300/160/malaysia,food",
  },
  {
    id: "case3",
    title: "阿联酋迪拜 · 清真调味料出口",
    buyer: "Al Islami Foods FZ-LLC",
    volume: "5 吨",
    value: "$28,000",
    date: "2026-04",
    status: "shipping",
    image: "https://loremflickr.com/300/160/dubai,port",
  },
];

const featuredProducts = [
  { name: "清真冷冻羊腿肉", price: "¥85/kg", image: "https://loremflickr.com/200/120/meat,lamb" },
  { name: "清真预制菜 — 咖喱牛肉", price: "¥45/box", image: "https://loremflickr.com/200/120/curry,beef" },
  { name: "清真复合调味料", price: "¥15/kg", image: "https://loremflickr.com/200/120/spice,seasoning" },
];

const categoryOptions = [
  "牛羊肉制品", "禽肉制品", "速冻调理品", "清真预制菜",
  "复合调味料", "面点烘焙", "休闲零食", "罐头食品",
];

const marketOptions = [
  "印度尼西亚", "马来西亚", "文莱", "新加坡",
  "阿联酋", "沙特阿拉伯", "埃及", "土耳其",
  "哈萨克斯坦", "乌兹别克斯坦", "巴基斯坦", "孟加拉国",
];

export function SupplierStore() {
  const { user } = useAuth();
  const companyName = user?.name || "惠发食品有限公司";
  const shortName = companyName.replace(/有限公司$/, "");

  const [activeTab, setActiveTab] = useState<TabId>("decoration");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["牛羊肉制品", "清真预制菜", "速冻调理品"]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["印度尼西亚", "马来西亚", "阿联酋"]);
  const [companyIntro, setCompanyIntro] = useState(
    `${companyName}成立于2005年，专注于清真食品研发、生产与销售。拥有现代化生产线3条，年产能超5万吨，产品涵盖冷冻肉制品、预制菜、复合调味料等6大品类。已通过HALAL MUI、JAKIM等多项国际清真认证，产品出口至东南亚、中东、中亚等15个国家和地区。`
  );
  const [cases, setCases] = useState(exportCases);
  const [showAddCase, setShowAddCase] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", buyer: "", volume: "", value: "", date: "" });
  const [saveFlash, setSaveFlash] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMarket = (market: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]
    );
  };

  const handleAddCase = () => {
    if (!newCase.title || !newCase.buyer) return;
    setCases((prev) => [
      {
        id: `case${Date.now()}`,
        title: newCase.title,
        buyer: newCase.buyer,
        volume: newCase.volume || "—",
        value: newCase.value || "—",
        date: newCase.date || "2026-07",
        status: "completed",
        image: "https://loremflickr.com/300/160/export,trade",
      },
      ...prev,
    ]);
    setNewCase({ title: "", buyer: "", volume: "", value: "", date: "" });
    setShowAddCase(false);
  };

  const handleDeleteCase = (id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  // Calculate completion
  const completionItems = [
    { done: true, label: "店铺模板" },
    { done: true, label: "Banner 主图" },
    { done: selectedCategories.length > 0, label: "主营品类" },
    { done: selectedMarkets.length > 0, label: "出口市场" },
    { done: companyIntro.length > 50, label: "企业介绍" },
    { done: cases.length >= 3, label: "展示案例 (≥3)" },
  ];
  const completion = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <section id="store" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="店铺管理"
          subtitle="店铺装修系统 — 模板化首页、产品陈列规则、企业介绍自定义、案例上传"
        />

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-6 bg-muted/50 rounded-xl p-1.5 border overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-brand-600 text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Tab Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* ========== Tab 1: 店铺装修 ========== */}
              {activeTab === "decoration" && (
                <div className="space-y-6">
                  {/* Template Selection */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <LayoutGrid className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">店铺首页模板</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {storeTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
                            selectedTemplate === tpl.id
                              ? "border-brand-500 ring-2 ring-brand-200"
                              : "border-border hover:border-brand-300"
                          }`}
                        >
                          {/* Color preview */}
                          <div className="flex h-16">
                            {tpl.colors.map((color, idx) => (
                              <div key={idx} className={`flex-1 ${color}`} />
                            ))}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-foreground">{tpl.name}</span>
                              {selectedTemplate === tpl.id && (
                                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{tpl.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Banner Management */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">Banner 管理</h3>
                    </div>
                    <div className="space-y-3">
                      {bannerSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between bg-muted/30 rounded-xl border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                              <ImageIcon className="h-5 w-5 text-brand-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-foreground">{slot.label}</span>
                                {slot.required && (
                                  <span className="text-[10px] text-red-500 font-bold">*</span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{slot.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-block px-2 py-1 text-[10px] bg-brand-50 text-brand-600 rounded font-medium">
                              已上传
                            </span>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                              <Upload className="h-3 w-3" />
                              <span className="hidden sm:inline">更换</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Display Rules */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">产品陈列规则</h3>
                    </div>
                    <div className="space-y-2">
                      {productDisplayRules.map((rule) => (
                        <div
                          key={rule.rule}
                          className="flex items-center justify-between bg-muted/30 rounded-xl border p-3"
                        >
                          <div>
                            <span className="text-sm font-semibold text-foreground">{rule.rule}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{rule.desc}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">展示数量</span>
                            <select
                              defaultValue={rule.count}
                              className="px-2 py-1 text-xs border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                            >
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="6">6</option>
                              <option value="8">8</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== Tab 2: 企业信息 ========== */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <FileText className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">企业基本信息</h3>
                    </div>
                    <div className="space-y-4">
                      {/* Company name */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">企业全称</label>
                        <Input
                          value={companyName}
                          readOnly
                          className="h-10 bg-muted/30 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">企业名称需与营业执照一致，如需修改请联系平台客服</p>
                      </div>

                      {/* Short name */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">店铺简称</label>
                        <Input
                          defaultValue={shortName}
                          placeholder="用于店铺展示的简称"
                          className="h-10"
                        />
                      </div>

                      {/* Slogan */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">企业 Slogan</label>
                        <Input
                          defaultValue="专注清真食品 · 品质连接世界"
                          placeholder="一句话概括企业优势"
                          className="h-10"
                        />
                      </div>

                      {/* Company intro */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          企业介绍
                          <span className="ml-2 text-xs text-muted-foreground">{companyIntro.length} / 500 字</span>
                        </label>
                        <textarea
                          value={companyIntro}
                          onChange={(e) => setCompanyIntro(e.target.value.slice(0, 500))}
                          rows={5}
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-white text-foreground resize-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                          placeholder="详细介绍企业历史、规模、产能、认证等信息"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category selection */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">主营品类</h3>
                      <span className="text-xs text-muted-foreground ml-auto">已选 {selectedCategories.length} 项</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map((cat) => {
                        const selected = selectedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                              selected
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-muted-foreground border-border hover:border-brand-300 hover:text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Export markets */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">出口市场</h3>
                      <span className="text-xs text-muted-foreground ml-auto">已选 {selectedMarkets.length} 个市场</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {marketOptions.map((market) => {
                        const selected = selectedMarkets.includes(market);
                        return (
                          <button
                            key={market}
                            onClick={() => toggleMarket(market)}
                            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-all ${
                              selected
                                ? "bg-trust-500 text-white border-trust-500"
                                : "bg-white text-muted-foreground border-border hover:border-trust-300 hover:text-foreground"
                            }`}
                          >
                            {selected && <CheckCircle2 className="h-3 w-3" />}
                            {market}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== Tab 3: 展示案例 ========== */}
              {activeTab === "cases" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-brand-600" />
                        <h3 className="font-bold text-brand-900">成功出口案例</h3>
                        <span className="text-xs text-muted-foreground">({cases.length})</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setShowAddCase(!showAddCase)}
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        新增案例
                      </Button>
                    </div>

                    {/* Add case form */}
                    {showAddCase && (
                      <div className="mb-4 bg-muted/30 rounded-xl border p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">案例标题 *</label>
                            <Input
                              value={newCase.title}
                              onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                              placeholder="如：沙特利雅得 · 冷冻鸡肉出口"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">采购商 *</label>
                            <Input
                              value={newCase.buyer}
                              onChange={(e) => setNewCase({ ...newCase, buyer: e.target.value })}
                              placeholder="采购商名称"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">出口量</label>
                            <Input
                              value={newCase.volume}
                              onChange={(e) => setNewCase({ ...newCase, volume: e.target.value })}
                              placeholder="如：10 吨"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">合同金额</label>
                            <Input
                              value={newCase.value}
                              onChange={(e) => setNewCase({ ...newCase, value: e.target.value })}
                              placeholder="如：$50,000"
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddCase(false)}
                          >
                            取消
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleAddCase}
                            className="bg-brand-600 hover:bg-brand-700"
                          >
                            <Save className="h-3.5 w-3.5 mr-1" />
                            保存案例
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Case cards */}
                    <div className="space-y-3">
                      {cases.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 bg-muted/30 rounded-xl border overflow-hidden group hover:shadow-md transition-shadow"
                        >
                          {/* Image */}
                          <div className="w-28 sm:w-36 shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover min-h-[100px]"
                            />
                          </div>
                          {/* Content */}
                          <div className="flex-1 py-3 pr-4 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-sm text-foreground line-clamp-1">{item.title}</h4>
                              <button
                                onClick={() => handleDeleteCase(item.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">采购商：{item.buyer}</p>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="flex items-center gap-1 text-brand-700">
                                <Truck className="h-3 w-3" />
                                {item.volume}
                              </span>
                              <span className="flex items-center gap-1 text-gold-600 font-semibold">
                                {item.value}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {item.date}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                item.status === "completed"
                                  ? "bg-brand-50 text-brand-600"
                                  : "bg-gold-50 text-gold-600"
                              }`}>
                                {item.status === "completed" ? "已完成" : "运输中"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {cases.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">暂无展示案例，点击"新增案例"添加您的出口记录</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========== Tab 4: 店铺设置 ========== */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Settings className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">店铺运营设置</h3>
                    </div>
                    <div className="space-y-4">
                      {/* Store URL */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">店铺专属链接</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">ihf.org/store/</span>
                          <Input
                            defaultValue={shortName.toLowerCase().replace(/\s+/g, "-")}
                            placeholder="店铺 URL"
                            className="h-10 flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      {/* Customer service */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-brand-600" />
                            客服电话
                          </label>
                          <Input
                            defaultValue="+86 0536-1234567"
                            placeholder="企业客服电话"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-brand-600" />
                            客服邮箱
                          </label>
                          <Input
                            defaultValue={`service@${shortName.toLowerCase()}.com`}
                            placeholder="客服邮箱"
                            className="h-10"
                          />
                        </div>
                      </div>

                      {/* Business hours */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-brand-600" />
                          营业时间
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            defaultValue="08:00"
                            className="h-10 w-32"
                          />
                          <span className="text-muted-foreground">—</span>
                          <Input
                            type="time"
                            defaultValue="18:00"
                            className="h-10 w-32"
                          />
                          <span className="text-xs text-muted-foreground ml-2">北京时间（UTC+8）</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-600" />
                          企业地址
                        </label>
                        <Input
                          defaultValue="山东省潍坊市诸城市经济开发区惠发路1号"
                          placeholder="企业完整地址"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notification settings */}
                  <div className="bg-white rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="h-5 w-5 text-brand-600" />
                      <h3 className="font-bold text-brand-900">通知设置</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "新询盘提醒", desc: "收到采购商询价时通知", checked: true },
                        { label: "产品审核结果", desc: "产品上架审核通过/驳回时通知", checked: true },
                        { label: "资质到期预警", desc: "资质证书到期前 60/30/7 天通知", checked: true },
                        { label: "店铺访客统计", desc: "每周汇总店铺访问数据", checked: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2">
                          <div>
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={item.checked}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-brand-500 transition-colors peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Save bar */}
              <div className="flex items-center justify-between bg-muted/30 rounded-xl border p-4">
                <div className="text-sm text-muted-foreground">
                  {saveFlash ? (
                    <span className="flex items-center gap-1.5 text-brand-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      保存成功！
                    </span>
                  ) : (
                    "修改后请及时保存"
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  保存设置
                </Button>
              </div>
            </div>

            {/* Right: Live Preview + Completion */}
            <div className="space-y-4">
              {/* Completion progress */}
              <div className="bg-brand-50 rounded-2xl p-5 border border-brand-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-brand-900">店铺完善度</span>
                  <span className="text-2xl font-bold text-brand-600">{completion}%</span>
                </div>
                <div className="w-full h-2 bg-brand-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {completionItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${item.done ? "text-brand-500" : "text-muted-foreground/40"}`}
                      />
                      <span className={item.done ? "text-brand-700" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store preview */}
              <div className="bg-white rounded-2xl border overflow-hidden">
                {/* Preview header */}
                <div className="bg-gradient-to-r from-brand-800 to-brand-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-brand-200 uppercase tracking-wider">店铺预览</span>
                    <Link href="/supplier/preview" target="_blank" className="flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                      <Eye className="h-3 w-3" />
                      全屏预览
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs truncate">{shortName} · 官方旗舰店</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="px-1 py-0 bg-gold-500/30 text-gold-300 text-[9px] font-bold rounded">
                          {user?.role || "金牌工厂"}
                        </span>
                        <span className="text-[9px] text-brand-100">{featuredProducts.length} 产品</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured products */}
                <div className="p-3">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2">精选产品</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {featuredProducts.map((product) => (
                      <div key={product.name} className="bg-white rounded-lg overflow-hidden border">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-14 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = IMAGE_PLACEHOLDER_DATAURI;
                          }}
                        />
                        <div className="p-1.5">
                          <div className="text-[9px] font-medium text-foreground line-clamp-1">{product.name}</div>
                          <div className="text-[9px] text-brand-700 font-semibold mt-0.5">{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Store stats */}
                <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
                  <div className="flex gap-3 text-[10px]">
                    <div>
                      <span className="text-muted-foreground">访问 </span>
                      <span className="font-bold text-brand-900">1,258</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">粉丝 </span>
                      <span className="font-bold text-brand-900">42</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-2 py-1 text-[10px] bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors">
                    <Edit className="h-2.5 w-2.5" />
                    编辑
                  </button>
                </div>
              </div>

              {/* Quick modules */}
              <div className="bg-white rounded-2xl border p-4">
                <h3 className="text-xs font-bold text-brand-900 mb-3">模块配置状态</h3>
                <div className="space-y-2">
                  {[
                    { icon: LayoutGrid, title: "店铺首页模板", desc: "模板风格与 Banner", status: "已配置" },
                    { icon: ImageIcon, title: "企业宣传图", desc: "工厂实拍与证书", status: "已配置" },
                    { icon: FileText, title: "企业介绍", desc: "简介与主营品类", status: companyIntro.length > 50 ? "已配置" : "待完善" },
                    { icon: Star, title: "出口案例", desc: `${cases.length} 个案例`, status: cases.length >= 3 ? "已配置" : "待完善" },
                    { icon: Globe, title: "出口市场", desc: `${selectedMarkets.length} 个市场`, status: selectedMarkets.length > 0 ? "已配置" : "待完善" },
                  ].map((module) => {
                    const Icon = module.icon;
                    const configured = module.status === "已配置";
                    return (
                      <div
                        key={module.title}
                        className="flex items-start gap-2.5 bg-muted/30 rounded-lg border p-2.5 cursor-pointer hover:border-brand-300 transition-colors"
                        onClick={() => {
                          const tabMap: Record<string, TabId> = {
                            "店铺首页模板": "decoration",
                            "企业宣传图": "decoration",
                            "企业介绍": "company",
                            "出口案例": "cases",
                            "出口市场": "company",
                          };
                          const targetTab = tabMap[module.title];
                          if (targetTab) setActiveTab(targetTab);
                        }}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          configured ? "bg-brand-50" : "bg-gold-50"
                        }`}>
                          <Icon className={`h-3.5 w-3.5 ${configured ? "text-brand-600" : "text-gold-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-foreground">{module.title}</span>
                            {configured && <CheckCircle2 className="h-3 w-3 text-brand-500" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{module.desc}</p>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                          configured ? "bg-brand-50 text-brand-600" : "bg-gold-50 text-gold-600"
                        }`}>
                          {module.status}
                        </span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 mt-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Store data */}
              <div className="bg-brand-900 rounded-2xl p-4 text-white">
                <h3 className="text-xs font-bold text-gold-400 mb-3">店铺数据概览</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gold-400">1,258</div>
                    <div className="text-[10px] text-brand-200">总访问量</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gold-400">42</div>
                    <div className="text-[10px] text-brand-200">关注粉丝</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gold-400">18</div>
                    <div className="text-[10px] text-brand-200">上架产品</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gold-400">36</div>
                    <div className="text-[10px] text-brand-200">收到询盘</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
