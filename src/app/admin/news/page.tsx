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
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { checkSensitive } from "@/lib/sensitive-words";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated, useApiQuery, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
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

type NewsStatus = "draft" | "published" | "archived" | "deleted";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  cover_image: string | null;
  category: string; // 'platform', 'policy', 'market', 'industry', 'partner'
  status: NewsStatus;
  author_id: string | null;
  published_at: string | null;
  view_count: number;
  is_deleted: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// ===== Constants =====

const categoryOptions = [
  { value: "platform", label: "平台动态" },
  { value: "policy", label: "政策法规" },
  { value: "market", label: "市场分析" },
  { value: "industry", label: "行业资讯" },
  { value: "partner", label: "合作伙伴" },
];

const categoryLabel: Record<string, string> = {
  platform: "平台动态",
  policy: "政策法规",
  market: "市场分析",
  industry: "行业资讯",
  partner: "合作伙伴",
};

const categoryBadge: Record<string, string> = {
  platform: "bg-brand-100 text-brand-700",
  policy: "bg-trust-100 text-trust-700",
  market: "bg-gold-100 text-gold-700",
  industry: "bg-purple-100 text-purple-700",
  partner: "bg-pink-100 text-pink-700",
};

const statusConfig: Record<NewsStatus, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-slate-100 text-slate-500" },
  published: { label: "已发布", className: "bg-brand-100 text-brand-700" },
  archived: { label: "已归档", className: "bg-red-900 text-red-100" },
  deleted: { label: "已删除", className: "bg-red-900 text-red-100" },
};

const PAGE_SIZE = 10;

// ===== Helpers =====

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

// ===== Page =====

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
  const [activeTab, setActiveTab] = useState<"list" | "trash">("list");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mutationTick, setMutationTick] = useState(0);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formCategory, setFormCategory] = useState<string>("platform");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published">(
    "published"
  );

  // ===== Fetch news list (paginated, switches by tab) =====
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<NewsItem>(
    (p, pp) =>
      adminApi.news({
        page: p,
        per_page: pp,
        status: activeTab === "trash" ? "archived" : undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search: debouncedSearch.trim() || undefined,
      }) as Promise<PaginatedResponse<NewsItem>>,
    PAGE_SIZE,
    { deps: [activeTab, categoryFilter, debouncedSearch, mutationTick] }
  );

  // ===== Fetch trash count for the badge (skipped while on trash tab) =====
  const { data: trashData, refetch: refetchTrash } = useApiQuery(
    () =>
      adminApi.news({
        page: 1,
        per_page: 1,
        status: "archived",
      }) as Promise<PaginatedResponse<NewsItem>>,
    { deps: [mutationTick], skip: activeTab === "trash" }
  );
  const trashCount =
    activeTab === "trash" ? total : trashData?.meta?.total ?? 0;

  // ===== Debounce search input (400ms) and reset to page 1 =====
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  // ===== Mutations =====
  const createMutation = useApiMutation((payload: Record<string, unknown>) =>
    adminApi.createNews(payload)
  );
  const updateMutation = useApiMutation(
    (params: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateNews(params.id, params.data)
  );
  const deleteMutation = useApiMutation((id: string) =>
    adminApi.deleteNews(id)
  );
  const publishMutation = useApiMutation((id: string) =>
    adminApi.publishNews(id)
  );
  const unpublishMutation = useApiMutation((id: string) =>
    adminApi.unpublishNews(id)
  );

  const news = data ?? [];

  // ===== Stats (approximate from current page + meta.total) =====
  const stats = useMemo(() => {
    const published = news.filter((n) => n.status === "published").length;
    const draft = news.filter((n) => n.status === "draft").length;
    return { total, published, draft };
  }, [news, total]);

  // ===== Form helpers =====
  const resetForm = () => {
    setFormTitle("");
    setFormSummary("");
    setFormCategory("platform");
    setFormCoverImage("");
    setFormContent("");
    setFormStatus("published");
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormSummary(item.summary || "");
    setFormCategory(item.category || "platform");
    setFormCoverImage(item.cover_image || "");
    setFormContent(item.content || "");
    setFormStatus(item.status === "draft" ? "draft" : "published");
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

  const refreshAll = async () => {
    await refetch();
    refetchTrash();
    setMutationTick((t) => t + 1);
  };

  // ===== Action Handlers =====
  const handlePublish = async (id: string) => {
    const item = news.find((n) => n.id === id);
    if (!item) return;
    if (
      !confirmPublishWithSensitiveCheck(`${item.title} ${item.content || ""}`)
    )
      return;
    setActionLoading(id);
    try {
      await publishMutation.mutate(id);
      await refreshAll();
      alert("资讯已发布");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(id);
    try {
      await unpublishMutation.mutate(id);
      await refreshAll();
      alert("已取消发布，资讯已转为草稿");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要将该资讯移入回收站吗？可前往回收站恢复。")) return;
    setActionLoading(id);
    try {
      await deleteMutation.mutate(id);
      await refreshAll();
      alert("已移入回收站");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (id: string) => {
    setActionLoading(id);
    try {
      // Restore by updating status back to draft and clearing the deleted flag
      await updateMutation.mutate({
        id,
        data: { status: "draft", is_deleted: 0 },
      });
      await refreshAll();
      alert("资讯已恢复");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      alert("请填写资讯标题");
      return;
    }
    if (!confirmPublishWithSensitiveCheck(`${formTitle} ${formContent}`)) {
      return;
    }

    const payload: Record<string, unknown> = {
      title: formTitle,
      summary: formSummary,
      content: formContent,
      cover_image: formCoverImage.trim() || null,
      category: formCategory,
      status: formStatus,
    };

    setActionLoading(editingId || "form");
    try {
      if (editingId) {
        await updateMutation.mutate({ id: editingId, data: payload });
      } else {
        await createMutation.mutate(payload);
      }
      setDialogOpen(false);
      resetForm();
      await refreshAll();
      alert(editingId ? "资讯已更新" : "资讯已创建");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const switchTab = (tab: "list" | "trash") => {
    setActiveTab(tab);
    setSearch("");
    setDebouncedSearch("");
    setCategoryFilter("all");
    setPage(1);
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
      {activeTab === "list" && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="资讯总数" value={stats.total} color="brand" />
          <StatCard label="已发布" value={stats.published} color="trust" />
          <StatCard label="草稿箱" value={stats.draft} color="gold" />
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchTab("list")}
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
          onClick={() => switchTab("trash")}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm border transition-colors ${
            activeTab === "trash"
              ? "bg-red-600 border-red-600 text-white"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          回收站
          {trashCount > 0 && (
            <span
              className={`min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-xs ${
                activeTab === "trash"
                  ? "bg-white/25 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {trashCount}
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
            placeholder="搜索标题或摘要…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="加载资讯中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : news.length === 0 ? (
          <EmptyState
            title={activeTab === "trash" ? "回收站为空" : "暂无匹配的资讯"}
            description={
              activeTab === "trash"
                ? "没有已归档的资讯记录"
                : "尝试调整筛选条件或创建新资讯"
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="text-left font-medium px-4 py-3">标题</th>
                    <th className="text-left font-medium px-4 py-3">分类</th>
                    <th className="text-left font-medium px-4 py-3">发布时间</th>
                    <th className="text-left font-medium px-4 py-3">浏览量</th>
                    <th className="text-left font-medium px-4 py-3">状态</th>
                    <th className="text-right font-medium px-4 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {news.map((a) => {
                    const sc = statusConfig[a.status] || statusConfig.draft;
                    const isLoading = actionLoading === a.id;
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 max-w-[320px] truncate">
                            {a.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[320px]">
                            {a.summary || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              categoryBadge[a.category] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {categoryLabel[a.category] || a.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-300" />
                            {formatDateTime(a.published_at || a.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5 text-slate-300" />
                            {a.view_count ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={sc.className}>
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {activeTab === "trash" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRestore(a.id)}
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                  disabled={isLoading}
                                  title="发布"
                                  className="text-slate-500 hover:text-brand-600"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                              {a.status === "published" && (
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleUnpublish(a.id)}
                                  disabled={isLoading}
                                  title="取消发布"
                                  className="text-slate-500 hover:text-gold-600"
                                >
                                  <ArrowDownToLine className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDelete(a.id)}
                                disabled={isLoading}
                                title="移入回收站"
                                className="text-slate-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                共 <span className="font-medium text-slate-700">{total}</span> 条
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[28px] h-7 px-2 rounded-md text-sm transition-colors ${
                      page === p
                        ? "bg-brand-600 text-white font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page >= lastPage}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
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
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="一句话摘要，用于列表展示"
                  className="min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>分类</Label>
                  <Select
                    value={formCategory}
                    onValueChange={(v) => setFormCategory(v || "platform")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>状态</Label>
                  <Select
                    value={formStatus}
                    onValueChange={(v) =>
                      setFormStatus(
                        (v as "draft" | "published") || "published"
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">直接发布</SelectItem>
                      <SelectItem value="draft">存为草稿</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>封面图片地址</Label>
                  <Input
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="https://…（选填）"
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
                disabled={
                  editingId
                    ? updateMutation.loading
                    : createMutation.loading
                }
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId
                  ? updateMutation.loading
                    ? "保存中..."
                    : "保存修改"
                  : createMutation.loading
                    ? "发布中..."
                    : "发布"}
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
