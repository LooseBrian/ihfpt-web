"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Newspaper,
  Edit,
  Send,
  Trash2,
  RotateCcw,
  X,
  Calendar,
  Filter,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { checkSensitive } from "@/lib/sensitive-words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ===== Types =====

type NewsCategory =
  | "平台动态"
  | "政策法规"
  | "市场分析"
  | "行业资讯"
  | "合作伙伴";

type NewsStatus = "published" | "draft";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  region: string;
  source: string;
  publishedAt: string;
  status: NewsStatus;
  content: string;
  isDeleted?: boolean; // soft delete flag
}

// ===== Constants =====

const categories: NewsCategory[] = [
  "平台动态",
  "政策法规",
  "市场分析",
  "行业资讯",
  "合作伙伴",
];

const regions = ["全部", "OIC", "GCC", "ASEAN", "MENA"];

const categoryBadge: Record<NewsCategory, string> = {
  平台动态: "bg-brand-100 text-brand-700",
  政策法规: "bg-trust-100 text-trust-700",
  市场分析: "bg-gold-100 text-gold-700",
  行业资讯: "bg-purple-100 text-purple-700",
  合作伙伴: "bg-pink-100 text-pink-700",
};

// ===== Seed data =====

const seedNews: NewsArticle[] = [
  {
    id: "NW-2026-001",
    title: "2026年全球清真食品市场规模预计突破2.3万亿美元",
    excerpt: "据最新行业报告，全球清真食品市场持续高速增长，亚太与中东地区贡献主要增量。",
    category: "市场分析",
    region: "OIC",
    source: "IHF研究院",
    publishedAt: "2026-07-12 09:30",
    status: "published",
    content:
      "根据IHF研究院发布的《2026全球清真食品产业白皮书》，全球清真食品市场规模预计将在2026年突破2.3万亿美元，年复合增长率达7.8%。其中，亚太地区与中东地区贡献了超过60%的市场增量……",
  },
  {
    id: "NW-2026-002",
    title: "马来西亚JAKIM发布清真认证新规，简化出口流程",
    excerpt: "新规进一步优化了清真认证申请与年审流程，缩短出口企业认证周期。",
    category: "政策法规",
    region: "ASEAN",
    source: "JAKIM官方",
    publishedAt: "2026-07-10 14:20",
    status: "published",
    content:
      "马来西亚伊斯兰发展局（JAKIM）近日发布清真认证新规，对出口型企业的认证申请与年审流程进行了优化，认证周期由原来的45个工作日缩短至30个工作日……",
  },
  {
    id: "NW-2026-003",
    title: "IHF平台与迪拜商会签署战略合作备忘录",
    excerpt: "双方将在清真食品贸易、认证互认、展会合作等领域开展深度合作。",
    category: "合作伙伴",
    region: "GCC",
    source: "平台动态",
    publishedAt: "2026-07-08 11:00",
    status: "published",
    content:
      "近日，IHF国际清真食品产业平台与迪拜商会正式签署战略合作备忘录，双方将在清真食品跨境贸易、认证互认、行业展会及供应链金融等领域展开深度合作……",
  },
  {
    id: "NW-2026-004",
    title: "斋月备货季来临：东南亚清真食品采购需求激增",
    excerpt: "平台数据显示，进入斋月备货季，来自印尼、马来西亚的采购询盘环比增长120%。",
    category: "行业资讯",
    region: "ASEAN",
    source: "IHF数据中心",
    publishedAt: "2026-07-06 16:45",
    status: "published",
    content:
      "随着斋月备货季临近，IHF平台数据显示，来自印度尼西亚、马来西亚等东南亚国家的清真食品采购询盘环比增长120%，牛羊肉、预制菜、速冻面点成为热门品类……",
  },
  {
    id: "NW-2026-005",
    title: "中国清真预制菜出海中东，冷链物流成关键",
    excerpt: "预制菜凭借标准化与长保质期优势，正成为中东市场的新增长点。",
    category: "市场分析",
    region: "MENA",
    source: "行业观察",
    publishedAt: "2026-07-04 10:15",
    status: "draft",
    content:
      "近年来，中国清真预制菜凭借标准化生产与较长保质期优势，正加速出海中东市场。然而，跨境冷链物流成本与温控稳定性成为制约增长的关键因素……",
  },
  {
    id: "NW-2026-006",
    title: "平台动态：IHF供应商入驻审核周期缩短至3个工作日",
    excerpt: "通过资质预审与智能风控，平台将供应商入驻审核周期由7天缩短至3个工作日。",
    category: "平台动态",
    region: "全部",
    source: "运营部",
    publishedAt: "2026-07-02 08:50",
    status: "published",
    content:
      "为提升供应商入驻效率，IHF平台通过资质预审与智能风控系统升级，将供应商入驻审核周期由原来的7个工作日缩短至3个工作日，进一步提升平台服务体验……",
  },
  {
    id: "NW-2026-007",
    title: "沙特阿拉伯放开部分食品进口关税，清真肉类迎利好",
    excerpt: "沙特对部分冷冻肉类进口关税进行下调，利好清真肉类出口企业。",
    category: "政策法规",
    region: "GCC",
    source: "海关总署",
    publishedAt: "2026-06-30 13:30",
    status: "published",
    content:
      "沙特阿拉伯近日宣布对部分冷冻肉类进口关税进行下调，其中包括清真牛羊肉、禽肉等品类，这将进一步利好中国清真肉类出口企业开拓海湾市场……",
  },
  {
    id: "NW-2026-008",
    title: "印尼MUI认证互认协议推动中印清真贸易增长",
    excerpt: "中印双方推动清真认证互认，预计将带动双边清真食品贸易额显著提升。",
    category: "行业资讯",
    region: "ASEAN",
    source: "贸易促进会",
    publishedAt: "2026-06-28 15:10",
    status: "draft",
    content:
      "中国与印度尼西亚持续推进清真认证互认协议落地，MUI与中国Halal认证机构互认范围进一步扩大，预计将带动双边清真食品贸易额显著提升……",
  },
];

// ===== Page =====

const NEWS_STORAGE_KEY = "ihf_news";

export default function NewsPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="content.news">
        <NewsContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function NewsContent() {
  const [articles, setArticles] = useState<NewsArticle[]>(seedNews);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "trash">("list");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState<NewsCategory>("平台动态");
  const [formRegion, setFormRegion] = useState("全部");
  const [formSource, setFormSource] = useState("");
  const [formContent, setFormContent] = useState("");

  // Load from localStorage on mount (fall back to seed data)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as NewsArticle[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure isDeleted flag exists on legacy records
          setArticles(
            parsed.map((a) => ({ ...a, isDeleted: a.isDeleted ?? false }))
          );
          setLoaded(true);
          return;
        }
      }
    } catch {
      // ignore parse errors, fall back to seed
    }
    // No stored data: persist seed as the initial dataset
    try {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(seedNews));
    } catch {
      // ignore storage errors
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage on every change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(articles));
    } catch {
      // ignore storage errors
    }
  }, [articles, loaded]);

  const filtered = useMemo(() => {
    const base = articles.filter((a) =>
      activeTab === "trash" ? a.isDeleted : !a.isDeleted
    );
    return base.filter((a) => {
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.source.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || a.category === categoryFilter;
      const matchRegion =
        regionFilter === "all" || a.region === regionFilter;
      return matchSearch && matchCategory && matchRegion;
    });
  }, [articles, activeTab, search, categoryFilter, regionFilter]);

  const stats = useMemo(
    () => {
      const live = articles.filter((a) => !a.isDeleted);
      return {
        total: live.length,
        published: live.filter((a) => a.status === "published").length,
        draft: live.filter((a) => a.status === "draft").length,
        trash: articles.filter((a) => a.isDeleted).length,
      };
    },
    [articles]
  );

  const resetForm = () => {
    setFormTitle("");
    setFormExcerpt("");
    setFormCategory("平台动态");
    setFormRegion("全部");
    setFormSource("");
    setFormContent("");
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setFormTitle(article.title);
    setFormExcerpt(article.excerpt);
    setFormCategory(article.category);
    setFormRegion(article.region);
    setFormSource(article.source);
    setFormContent(article.content);
    setDialogOpen(true);
  };

  // Sensitive word check before publishing — returns true if safe or user confirms
  const confirmPublishWithSensitiveCheck = (text: string): boolean => {
    const matches = checkSensitive(text);
    if (matches.length === 0) return true;
    const words = matches.map((m) => m.word).join("、");
    return confirm(
      `检测到敏感词：${words}\n发布包含敏感词的内容可能违规，是否仍要发布？`
    );
  };

  const handlePublish = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    if (!confirmPublishWithSensitiveCheck(`${article.title} ${article.content}`))
      return;
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "published" as NewsStatus } : a
      )
    );
    alert("资讯已发布");
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要将该资讯移入回收站吗？可前往回收站恢复。")) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isDeleted: true } : a))
      );
    }
  };

  const handleRestore = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isDeleted: false } : a))
    );
    alert("资讯已恢复");
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      alert("请填写资讯标题");
      return;
    }
    // Sensitive word check before publishing content
    if (!confirmPublishWithSensitiveCheck(`${formTitle} ${formContent}`)) {
      return;
    }
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const publishedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    if (editingId) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: formTitle,
                excerpt: formExcerpt,
                category: formCategory,
                region: formRegion,
                source: formSource,
                content: formContent,
              }
            : a
        )
      );
    } else {
      const newArticle: NewsArticle = {
        id: `NW-2026-${String(articles.length + 1).padStart(3, "0")}`,
        title: formTitle,
        excerpt: formExcerpt,
        category: formCategory,
        region: formRegion,
        source: formSource || "未填写",
        publishedAt,
        status: "published",
        content: formContent,
      };
      setArticles((prev) => [newArticle, ...prev]);
    }
    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-brand-600" />
            资讯管理
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            管理平台资讯内容，包括发布、编辑、上下架等操作
          </p>
        </div>
        {activeTab === "list" && (
          <Button
            onClick={openCreate}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="h-4 w-4" />
            发布资讯
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="资讯总数" value={stats.total} color="brand" />
        <StatCard label="已发布" value={stats.published} color="trust" />
        <StatCard label="草稿箱" value={stats.draft} color="gold" />
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("list");
            setSearch("");
            setCategoryFilter("all");
            setRegionFilter("all");
          }}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
            activeTab === "list"
              ? "bg-brand-600 border-brand-600 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Newspaper className="h-4 w-4" />
          全部资讯
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("trash");
            setSearch("");
            setCategoryFilter("all");
            setRegionFilter("all");
          }}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
            activeTab === "trash"
              ? "bg-red-600 border-red-600 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          回收站
          {stats.trash > 0 && (
            <span
              className={`min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-xs ${
                activeTab === "trash"
                  ? "bg-white/25 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {stats.trash}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题或来源…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v || "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={regionFilter}
            onValueChange={(v) => setRegionFilter(v || "all")}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="地区" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "all" ? "全部地区" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left font-medium px-4 py-3">标题</th>
                <th className="text-left font-medium px-4 py-3">分类</th>
                <th className="text-left font-medium px-4 py-3">地区</th>
                <th className="text-left font-medium px-4 py-3">来源</th>
                <th className="text-left font-medium px-4 py-3">发布时间</th>
                <th className="text-left font-medium px-4 py-3">状态</th>
                <th className="text-right font-medium px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 max-w-[320px] truncate">
                      {a.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[320px]">
                      {a.excerpt}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadge[a.category]}`}
                    >
                      {a.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.region}</td>
                  <td className="px-4 py-3 text-slate-600">{a.source}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      {a.publishedAt}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {a.isDeleted ? (
                      <Badge className="bg-red-900 text-red-100">已删除</Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className={
                          a.status === "published"
                            ? "bg-brand-100 text-brand-700"
                            : "bg-slate-100 text-slate-500"
                        }
                      >
                        {a.status === "published" ? "已发布" : "草稿"}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {activeTab === "trash" ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRestore(a.id)}
                          title="恢复"
                          className="text-slate-500 hover:text-brand-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(a)}
                          title="编辑"
                          className="text-slate-500 hover:text-brand-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {a.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handlePublish(a.id)}
                            title="发布"
                            className="text-slate-500 hover:text-brand-600"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(a.id)}
                          title="移入回收站"
                          className="text-slate-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    {activeTab === "trash"
                      ? "回收站为空"
                      : "暂无匹配的资讯"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? "编辑资讯" : "发布资讯"}
              </h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label>标题</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="请输入资讯标题"
                />
              </div>
              <div className="space-y-1.5">
                <Label>摘要</Label>
                <Textarea
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="一句话摘要，用于列表展示"
                  className="min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>分类</Label>
                  <Select
                    value={formCategory}
                    onValueChange={(v) => setFormCategory((v as NewsCategory) || "平台动态")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>地区</Label>
                  <Select
                    value={formRegion}
                    onValueChange={(v) => setFormRegion(v || "全部")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择地区" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>来源</Label>
                  <Input
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="如 IHF研究院"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>正文内容</Label>
                <Textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="请输入资讯正文…"
                  className="min-h-[160px]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId ? "保存修改" : "发布"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "brand" | "trust" | "gold";
}) {
  const colorMap = {
    brand: "text-brand-700 bg-brand-50",
    trust: "text-trust-700 bg-trust-50",
    gold: "text-gold-700 bg-gold-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 inline-block text-2xl font-bold px-2 rounded ${colorMap[color]}`}>
        {value}
      </div>
    </div>
  );
}
