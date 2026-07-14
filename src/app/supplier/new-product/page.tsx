"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Send,
  Info,
  CheckCircle2,
  ChevronRight,
  Package,
  Image as ImageIcon,
  FileText,
  Tag,
  DollarSign,
  Globe,
  Truck,
  ShieldCheck,
  ClipboardCheck,
  Box,
  Anchor,
  Plus,
  X,
  Star,
  AlertTriangle,
} from "lucide-react";
import { MediaUpload } from "@/components/product/MediaUpload";
import type { UploadedImage, UploadedVideo } from "@/components/product/MediaUpload";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ===== Static data =====

const categories = [
  { value: "牛羊肉制品", label: "牛羊肉制品", subs: ["羊排", "羊腿", "牛腱", "牛腩", "羊肉卷", "牛肉卷"] },
  { value: "清真预制菜", label: "清真预制菜", subs: ["咖喱类", "红烧类", "汤类", "炒饭类"] },
  { value: "速冻调理品", label: "速冻调理品", subs: ["烤制类", "炸制类", "蒸制类", "卤制类"] },
  { value: "速冻面点", label: "速冻面点", subs: ["饺子", "包子", "烧麦", "馒头", "油条"] },
  { value: "调味料", label: "调味料", subs: ["复合调味料", "单一调味料", "酱料", "香辛料"] },
  { value: "即食食品", label: "即食食品", subs: ["开袋即食", "加热即食", "休闲零食"] },
  { value: "水产品", label: "水产品", subs: ["冷冻鱼类", "冷冻虾类", "贝类"] },
  { value: "粮油副食", label: "粮油副食", subs: ["食用油", "大米", "面粉", "豆制品"] },
];

const certBodies = [
  { value: "JAKIM", label: "JAKIM — 马来西亚伊斯兰发展局" },
  { value: "MUI", label: "MUI — 印度尼西亚乌里玛委员会" },
  { value: "HCA", label: "HCA — 中国_halal认证机构" },
  { value: "ESMA", label: "ESMA — 阿联酋标准化与计量局" },
  { value: "MUIS", label: "MUIS — 新加坡伊斯兰宗教理事会" },
  { value: "KMF", label: "KMF — 韩国穆斯林联合会" },
  { value: "SC", label: "SC — 中国食品生产许可" },
];

const exportRegions = ["东盟", "中东", "中亚", "北非", "南亚", "欧洲", "北美", "日韩", "澳新"];
const serviceOptions = ["支持样品单", "支持拼柜", "可代办清关", "支持OEM/ODM", "源头工厂", "支持贴牌", "可定制规格"];
const paymentTerms = ["T/T (电汇)", "L/C (信用证)", "D/P (付款交单)", "D/A (承兑交单)", "Western Union", "PayPal", "协商"];
const unitTypes = ["kg", "箱", "件", "吨", "盒", "袋", "瓶", "包"];
const storageConditions = ["常温", "冷藏 (0-4°C)", "冷冻 (-18°C以下)", "阴凉干燥", "避光"];
const currencies = ["CNY (¥)", "USD ($)", "EUR (€)", "MYR (RM)", "IDR (Rp)"];

// Custom attribute row type
interface CustomAttr {
  id: string;
  name: string;
  value: string;
}

// Nutrition fact row type
interface NutritionFact {
  id: string;
  name: string;
  value: string;
  unit: string;
}

// Keyword tag type
interface Keyword {
  id: string;
  text: string;
}

export default function NewProductPage() {
  const router = useRouter();

  // ===== Form state =====
  // Section 1: Basic Info
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [origin, setOrigin] = useState("");
  const [barcode, setBarcode] = useState("");
  const [description, setDescription] = useState("");

  // Section 2: Product Attributes
  const [spec, setSpec] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [netWeightUnit, setNetWeightUnit] = useState("kg");
  const [shelfLife, setShelfLife] = useState("");
  const [storageCondition, setStorageCondition] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [customAttrs, setCustomAttrs] = useState<CustomAttr[]>([]);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>([]);

  // Section 3: Media
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [videos, setVideos] = useState<UploadedVideo[]>([]);

  // Section 4: Trade & Logistics
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currency, setCurrency] = useState("CNY (¥)");
  const [priceUnit, setPriceUnit] = useState("kg");
  const [moq, setMoq] = useState("");
  const [moqUnit, setMoqUnit] = useState("箱");
  const [supplyAbility, setSupplyAbility] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [port, setPort] = useState("");
  const [packagingDesc, setPackagingDesc] = useState("");
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Section 5: Halal Certification
  const [certBody, setCertBody] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [certValidFrom, setCertValidFrom] = useState("");
  const [certValidTo, setCertValidTo] = useState("");
  const [certScanned, setCertScanned] = useState(false);

  // Submit
  const [submitting, setSubmitting] = useState(false);

  // ===== Derived values =====
  const selectedCategory = categories.find((c) => c.value === category);
  const priceRange = priceMin && priceMax ? `${priceMin} - ${priceMax}` : priceMin || "";

  // ===== Handlers =====
  const addKeyword = () => {
    const text = keywordInput.trim();
    if (text && keywords.length < 20 && !keywords.some((k) => k.text === text)) {
      setKeywords([...keywords, { id: `kw-${Date.now()}`, text }]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  const addCustomAttr = () => {
    setCustomAttrs([...customAttrs, { id: `attr-${Date.now()}`, name: "", value: "" }]);
  };

  const updateCustomAttr = (id: string, field: "name" | "value", val: string) => {
    setCustomAttrs(customAttrs.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  };

  const removeCustomAttr = (id: string) => {
    setCustomAttrs(customAttrs.filter((a) => a.id !== id));
  };

  const addNutritionFact = () => {
    setNutritionFacts([...nutritionFacts, { id: `nut-${Date.now()}`, name: "", value: "", unit: "g" }]);
  };

  const updateNutritionFact = (id: string, field: "name" | "value" | "unit", val: string) => {
    setNutritionFacts(nutritionFacts.map((n) => (n.id === id ? { ...n, [field]: val } : n)));
  };

  const removeNutritionFact = (id: string) => {
    setNutritionFacts(nutritionFacts.filter((n) => n.id !== id));
  };

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSubmit = (action: "draft" | "submit") => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);

      // Build product item for localStorage
      const newProduct = {
        id: `SKU-2026-${String(Date.now()).slice(-4)}`,
        name: name || "未命名产品",
        category: category || "未分类",
        price: priceRange ? `${currency.split(" ")[0]} ${priceRange} / ${priceUnit}` : "面议",
        moq: moq ? `${moq} ${moqUnit}` : "面议",
        status: action === "submit" ? "pending" : "draft",
        statusText: action === "submit" ? "审核中" : "草稿",
        image: images[0]?.url || "https://loremflickr.com/120/80/food,halal",
        imageCount: images.length,
        videoCount: videos.length,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage so SupplierProducts can pick it up
      try {
        const stored = localStorage.getItem("ihf_new_products");
        const existing: typeof newProduct[] = stored ? JSON.parse(stored) : [];
        existing.unshift(newProduct);
        localStorage.setItem("ihf_new_products", JSON.stringify(existing));
      } catch {
        // ignore storage errors
      }

      if (action === "submit") {
        alert("产品已提交审核！平台将在 3-5 个工作日内完成审核，审核通过后将在产品大厅展示。");
      } else {
        alert("产品已保存为草稿，可随时在「产品管理」中继续编辑。");
      }
      router.push("/supplier#products");
    }, 800);
  };

  // ===== Validation =====
  const requiredFields = {
    name: !!name,
    category: !!category,
    spec: !!spec,
    moq: !!moq,
    priceMin: !!priceMin,
    certBody: !!certBody,
    certNumber: !!certNumber,
    images: images.length > 0,
  };
  const filledCount = Object.values(requiredFields).filter(Boolean).length;
  const totalRequired = Object.keys(requiredFields).length;
  const qualityScore = Math.round((filledCount / totalRequired) * 100);
  const canSubmit = filledCount === totalRequired;

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => router.push("/supplier")} className="hover:text-brand-600">
              供应商工作台
            </button>
            <ChevronRight className="h-4 w-4" />
            <button onClick={() => router.push("/supplier#products")} className="hover:text-brand-600">
              产品管理
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-600 font-medium">发布新产品</span>
          </div>

          {/* Page header with quality score */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
                <Package className="h-6 w-6 text-brand-600" />
                发布新产品
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                填写完整信息可提高搜索排名与询盘转化率，提交后平台 3-5 个工作日完成审核
              </p>
            </div>
            {/* Quality score badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              qualityScore >= 80 ? "bg-brand-50 border-brand-200" : "bg-gold-50 border-gold-200"
            }`}>
              <Star className={`h-5 w-5 ${qualityScore >= 80 ? "text-brand-600" : "text-gold-600"}`} fill="currentColor" />
              <div>
                <div className="text-xs text-muted-foreground">信息完整度</div>
                <div className={`text-lg font-bold ${qualityScore >= 80 ? "text-brand-700" : "text-gold-700"}`}>
                  {qualityScore}%
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                ({filledCount}/{totalRequired})
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* ===== Section 1: Basic Info ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <FileText className="h-5 w-5 text-brand-600" />
                  基本信息
                </CardTitle>
                <CardDescription>产品名称、品类、关键词等核心信息（参考阿里巴巴命名规范）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      产品名称（中文） <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="修饰词 + 核心品名 + 认证/用途，如：清真冷冻羊腿肉（分割）"
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">命名格式：修饰词 + 核心品名 + 认证/用途</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">产品名称（英文）</Label>
                    <Input
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="如：Halal Frozen Lamb Leg (Cut)"
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    产品关键词 <span className="text-muted-foreground font-normal">（最多20个，前3个最重要）</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                      placeholder="输入关键词后按回车，如：清真羊肉、冷冻肉类、Halal Lamb..."
                      className="h-10"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addKeyword} className="h-10 shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((kw, idx) => (
                        <span
                          key={kw.id}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            idx < 3
                              ? "bg-brand-100 text-brand-700 border border-brand-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {idx < 3 && <Star className="h-3 w-3 text-brand-500" fill="currentColor" />}
                          {kw.text}
                          <button onClick={() => removeKeyword(kw.id)} className="ml-0.5 hover:text-red-500">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      产品品类 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={(v) => { setCategory(v || ""); setSubcategory(""); }}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="请选择品类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">细分品类</Label>
                    <Select value={subcategory} onValueChange={(v) => setSubcategory(v || "")} disabled={!selectedCategory}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={selectedCategory ? "请选择细分类目" : "请先选择品类"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.subs.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">品牌</Label>
                    <Input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="如：惠发"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">型号</Label>
                    <Input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="如：HF-LM-001"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">条形码</Label>
                    <Input
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="如：6901234567890"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">产地</Label>
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="如：山东潍坊"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">产品规格 <span className="text-red-500">*</span></Label>
                    <Input
                      value={spec}
                      onChange={(e) => setSpec(e.target.value)}
                      placeholder="如：10kg/箱，真空包装"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">产品详细描述</Label>
                  <Textarea
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="详细描述产品特点、原料、加工工艺、包装方式、应用场景等。内容越详细，搜索排名越高，询盘转化率越好。"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">建议包含：产品卖点、加工工艺、包装方式、应用场景、与其他产品的差异化优势</p>
                </div>

                {/* Custom attributes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">自定义属性</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCustomAttr} className="h-7 text-xs gap-1">
                      <Plus className="h-3 w-3" />
                      添加属性
                    </Button>
                  </div>
                  {customAttrs.map((attr) => (
                    <div key={attr.id} className="flex gap-2 items-center">
                      <Input
                        value={attr.name}
                        onChange={(e) => updateCustomAttr(attr.id, "name", e.target.value)}
                        placeholder="属性名，如：饲养方式"
                        className="h-9 flex-1"
                      />
                      <Input
                        value={attr.value}
                        onChange={(e) => updateCustomAttr(attr.id, "value", e.target.value)}
                        placeholder="属性值，如：草饲"
                        className="h-9 flex-1"
                      />
                      <button onClick={() => removeCustomAttr(attr.id)} className="p-1 text-muted-foreground hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ===== Section 2: Food & Safety Attributes ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <ClipboardCheck className="h-5 w-5 text-brand-600" />
                  食品属性与安全信息
                </CardTitle>
                <CardDescription>保质期、储存条件、配料表、营养成分（参考 Daganghalal 清真食品标准）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">净重</Label>
                    <div className="flex gap-2">
                      <Input
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                        placeholder="如：500"
                        className="h-10"
                      />
                      <Select value={netWeightUnit} onValueChange={(v) => setNetWeightUnit(v || "kg")}>
                        <SelectTrigger className="h-10 w-24 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["g", "kg", "ml", "L"].map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">保质期</Label>
                    <Input
                      value={shelfLife}
                      onChange={(e) => setShelfLife(e.target.value)}
                      placeholder="如：12个月 / 24个月"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">储存条件</Label>
                    <Select value={storageCondition} onValueChange={(v) => setStorageCondition(v || "")}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="请选择储存条件" />
                      </SelectTrigger>
                      <SelectContent>
                        {storageConditions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">配料表</Label>
                    <Textarea
                      value={ingredients}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value)}
                      placeholder="如：羊肉、食盐、香辛料、抗氧化剂..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-gold-600" />
                      过敏原提示
                    </Label>
                    <Textarea
                      value={allergens}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAllergens(e.target.value)}
                      placeholder="如：含有麸质、大豆制品；生产线同时加工含蛋制品"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Nutrition facts table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">营养成分表（每100g）</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addNutritionFact} className="h-7 text-xs gap-1">
                      <Plus className="h-3 w-3" />
                      添加成分
                    </Button>
                  </div>
                  {nutritionFacts.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 gap-2 bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                        <div className="col-span-5">营养成分</div>
                        <div className="col-span-4">含量</div>
                        <div className="col-span-2">单位</div>
                        <div className="col-span-1"></div>
                      </div>
                      {nutritionFacts.map((nut) => (
                        <div key={nut.id} className="grid grid-cols-12 gap-2 px-3 py-2 border-t items-center">
                          <Input
                            value={nut.name}
                            onChange={(e) => updateNutritionFact(nut.id, "name", e.target.value)}
                            placeholder="如：蛋白质"
                            className="col-span-5 h-8 text-sm"
                          />
                          <Input
                            value={nut.value}
                            onChange={(e) => updateNutritionFact(nut.id, "value", e.target.value)}
                            placeholder="如：20.5"
                            className="col-span-4 h-8 text-sm"
                          />
                          <Select value={nut.unit} onValueChange={(v) => updateNutritionFact(nut.id, "unit", v || "g")}>
                            <SelectTrigger className="col-span-2 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["g", "mg", "μg", "kcal", "kJ", "%"].map((u) => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <button onClick={() => removeNutritionFact(nut.id)} className="col-span-1 p-1 text-muted-foreground hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ===== Section 3: Media Upload ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <ImageIcon className="h-5 w-5 text-brand-600" />
                  图片与视频
                </CardTitle>
                <CardDescription>
                  最多上传 8 张产品图片（主图白底）和 3 个产品视频（参考淘宝/亚马逊标准）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaUpload
                  images={images}
                  videos={videos}
                  onImagesChange={setImages}
                  onVideosChange={setVideos}
                />
              </CardContent>
            </Card>

            {/* ===== Section 4: Trade & Logistics ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <DollarSign className="h-5 w-5 text-brand-600" />
                  贸易与物流信息
                </CardTitle>
                <CardDescription>价格、起订量、交货期、付款方式、发货港口（参考阿里巴巴交易信息）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      最低价 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="如：85"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">最高价</Label>
                    <Input
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="如：92"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">币种</Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v || "CNY (¥)")}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">计价单位</Label>
                    <Select value={priceUnit} onValueChange={(v) => setPriceUnit(v || "kg")}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitTypes.map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      起订量 <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        placeholder="如：100"
                        className="h-10"
                      />
                      <Select value={moqUnit} onValueChange={(v) => setMoqUnit(v || "箱")}>
                        <SelectTrigger className="h-10 w-24 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {unitTypes.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">供货能力</Label>
                    <Input
                      value={supplyAbility}
                      onChange={(e) => setSupplyAbility(e.target.value)}
                      placeholder="如：50吨/月"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">交货期</Label>
                    <Input
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      placeholder="如：15天"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Anchor className="h-4 w-4 text-muted-foreground" />
                      发货港口
                    </Label>
                    <Input
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="如：青岛港 / 上海港"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      包装描述
                    </Label>
                    <Input
                      value={packagingDesc}
                      onChange={(e) => setPackagingDesc(e.target.value)}
                      placeholder="如：真空袋装，20kg/箱，40尺柜可装1200箱"
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Payment terms */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">付款方式（可多选）</Label>
                  <div className="flex flex-wrap gap-2">
                    {paymentTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => toggleArray(selectedPaymentTerms, term, setSelectedPaymentTerms)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          selectedPaymentTerms.includes(term)
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-white text-muted-foreground border-border hover:border-brand-300 hover:text-brand-600"
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export regions */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    出口目标市场
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {exportRegions.map((region) => (
                      <button
                        key={region}
                        onClick={() => toggleArray(selectedRegions, region, setSelectedRegions)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          selectedRegions.includes(region)
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-white text-muted-foreground border-border hover:border-brand-300 hover:text-brand-600"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    增值服务
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((service) => (
                      <button
                        key={service}
                        onClick={() => toggleArray(selectedServices, service, setSelectedServices)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          selectedServices.includes(service)
                            ? "bg-brand-50 text-brand-700 border-brand-300"
                            : "bg-white text-muted-foreground border-border hover:border-brand-300 hover:text-brand-600"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ===== Section 5: Halal Certification ===== */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-900">
                  <ShieldCheck className="h-5 w-5 text-brand-600" />
                  HALAL 认证信息
                </CardTitle>
                <CardDescription>认证机构、证书编号、有效期（参考 Daganghalal 清真认证展示标准）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      认证机构 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={certBody} onValueChange={(v) => setCertBody(v || "")}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="请选择认证机构" />
                      </SelectTrigger>
                      <SelectContent>
                        {certBodies.map((cert) => (
                          <SelectItem key={cert.value} value={cert.value}>
                            {cert.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      证书编号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      placeholder="如：JAKIM-2024-HAL-001234"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">证书生效日期</Label>
                    <Input
                      type="date"
                      value={certValidFrom}
                      onChange={(e) => setCertValidFrom(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">证书到期日期</Label>
                    <Input
                      type="date"
                      value={certValidTo}
                      onChange={(e) => setCertValidTo(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Certificate upload placeholder */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">HALAL 证书扫描件</Label>
                  <button
                    onClick={() => setCertScanned(!certScanned)}
                    className={`w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-2 text-sm transition-colors ${
                      certScanned
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-border text-muted-foreground hover:border-brand-300 hover:bg-muted/30"
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    {certScanned ? "已上传证书扫描件 (JAKIM_证书.pdf)" : "点击上传 HALAL 证书扫描件（PDF/JPG/PNG，≤5MB）"}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* ===== Submit bar ===== */}
            <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 -mx-4 px-4 rounded-t-xl z-50">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {canSubmit ? (
                    <span className="flex items-center gap-1.5 text-brand-600">
                      <CheckCircle2 className="h-4 w-4" />
                      信息已填写完整（{qualityScore}%），可以提交
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Info className="h-4 w-4" />
                      信息完整度 {qualityScore}%，请填写标 <span className="text-red-500">*</span> 的必填项
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    返回
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit("draft")}
                    disabled={submitting || !name}
                    className="gap-1"
                  >
                    <Save className="h-4 w-4" />
                    存草稿
                  </Button>
                  <Button
                    onClick={() => handleSubmit("submit")}
                    disabled={submitting || !canSubmit}
                    className="bg-brand-600 hover:bg-brand-700 gap-1"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "提交中..." : "提交审核"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
