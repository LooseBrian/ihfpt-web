"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  UserCog,
  Edit,
  Trash2,
  X,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { adminApi } from "@/lib/api-client";
import { useApiPaginated, useApiQuery, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels, roleColors } from "@/lib/admin-auth-context";
import { cn } from "@/lib/utils";

// ===== Types =====

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  department: string | null;
  avatar: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  roles?: Array<{ id: string; name: string; label: string }>;
}

interface Role {
  id: string;
  name: string;
  label: string;
  description: string | null;
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

export default function UsersPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="settings.users">
        <UsersContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function UsersContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mutationTick, setMutationTick] = useState(0);

  // form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formRoleId, setFormRoleId] = useState<string>("");

  // ===== Fetch roles (for form selector & filter) =====
  const { data: rolesData } = useApiQuery(
    () => adminApi.roles() as Promise<Role[]>,
    { deps: [mutationTick] }
  );
  const roles = rolesData ?? [];

  // ===== Fetch admin users (paginated) =====
  const {
    data,
    loading,
    error,
    refetch,
    page,
    total,
    lastPage,
    setPage,
  } = useApiPaginated<AdminUserRow>(
    (p, pp) =>
      adminApi.adminUsers({
        page: p,
        per_page: pp,
        search: debouncedSearch.trim() || undefined,
      }) as Promise<PaginatedResponse<AdminUserRow>>,
    PAGE_SIZE,
    { deps: [debouncedSearch, mutationTick] }
  );

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
    adminApi.createAdminUser(payload)
  );
  const updateMutation = useApiMutation(
    (params: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateAdminUser(params.id, params.data)
  );
  const deleteMutation = useApiMutation((id: string) =>
    adminApi.deleteAdminUser(id)
  );

  const users = data ?? [];

  // ===== Client-side role filter (backend doesn't support role filtering) =====
  const filtered = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((u) => u.roles?.some((r) => r.id === roleFilter));
  }, [users, roleFilter]);

  // ===== Stats =====
  const stats = useMemo(
    () => ({
      total,
      active: users.filter((u) => u.is_active === 1).length,
      disabled: users.filter((u) => u.is_active === 0).length,
    }),
    [users, total]
  );

  // ===== Form helpers =====
  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormDepartment("");
    setFormRoleId("");
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (user: AdminUserRow) => {
    setEditingId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword("");
    setFormDepartment(user.department || "");
    setFormRoleId(user.roles?.[0]?.id || "");
    setDialogOpen(true);
  };

  const refreshAll = async () => {
    await refetch();
    setMutationTick((t) => t + 1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该用户吗？此操作为软删除。")) return;
    setActionLoading(id);
    try {
      await deleteMutation.mutate(id);
      await refreshAll();
      alert("用户已删除");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      alert("请填写用户名");
      return;
    }
    if (!editingId && !formEmail.trim()) {
      alert("请填写邮箱");
      return;
    }
    if (!editingId && !formPassword.trim()) {
      alert("请填写密码");
      return;
    }
    if (!formRoleId) {
      alert("请选择角色");
      return;
    }

    setActionLoading(editingId || "form");
    try {
      if (editingId) {
        const updateData: Record<string, unknown> = {
          name: formName,
          department: formDepartment.trim() || null,
          role_id: formRoleId,
        };
        if (formPassword.trim()) {
          updateData.password = formPassword;
        }
        await updateMutation.mutate({ id: editingId, data: updateData });
      } else {
        await createMutation.mutate({
          email: formEmail,
          password: formPassword,
          name: formName,
          department: formDepartment.trim() || null,
          avatar: null,
          role_id: formRoleId,
        });
      }
      setDialogOpen(false);
      resetForm();
      await refreshAll();
      alert(editingId ? "用户已更新" : "用户已创建");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to get role display info for a user
  const getUserRoleDisplay = (user: AdminUserRow) => {
    const role = user.roles?.[0];
    if (!role) return { label: "未分配", color: "bg-slate-100 text-slate-500" };
    const color = roleColors[role.name] || "bg-slate-100 text-slate-600";
    const label = roleLabels[role.name] || role.label || role.name;
    return { label, color };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="h-5 w-5 text-brand-600" />
            用户管理
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            管理后台用户账号、角色与启用状态
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          <Plus className="h-4 w-4" />
          新增用户
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="用户总数" value={stats.total} color="brand" />
        <StatCard label="启用中" value={stats.active} color="trust" />
        <StatCard label="已禁用" value={stats.disabled} color="gold" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索用户名或邮箱…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v || "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.label || r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="加载用户中..." />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={users.length === 0 ? "暂无用户" : "当前页没有匹配的用户"}
            description={
              users.length === 0
                ? "还没有任何用户记录，点击新增用户创建"
                : "尝试切换角色筛选或翻到其他页码"
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="text-left font-medium px-4 py-3">用户名</th>
                    <th className="text-left font-medium px-4 py-3">邮箱</th>
                    <th className="text-left font-medium px-4 py-3">角色</th>
                    <th className="text-left font-medium px-4 py-3">部门</th>
                    <th className="text-left font-medium px-4 py-3">最后登录</th>
                    <th className="text-left font-medium px-4 py-3">状态</th>
                    <th className="text-right font-medium px-4 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => {
                    const roleDisplay = getUserRoleDisplay(u);
                    const isLoading = actionLoading === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {u.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {u.name}
                              </div>
                              <div className="text-xs text-slate-400">{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-300" />
                            {u.email}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                              roleDisplay.color
                            )}
                          >
                            {roleDisplay.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {u.department || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateTime(u.last_login_at)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={
                              u.is_active === 1
                                ? "bg-brand-100 text-brand-700"
                                : "bg-slate-100 text-slate-500"
                            }
                          >
                            {u.is_active === 1 ? "启用" : "禁用"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(u)}
                              disabled={isLoading}
                              title="编辑"
                              className="text-slate-500 hover:text-brand-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(u.id)}
                              disabled={isLoading}
                              title="删除"
                              className="text-slate-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? "编辑用户" : "新增用户"}
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
                <Label>用户名</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入用户名"
                />
              </div>
              <div className="space-y-1.5">
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@ihf.org"
                  disabled={!!editingId}
                />
                {editingId && (
                  <p className="text-xs text-slate-400">邮箱不可修改</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>
                  密码{editingId ? "（留空则不修改）" : ""}
                </Label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingId ? "输入新密码可重置" : "请输入密码"}
                />
              </div>
              <div className="space-y-1.5">
                <Label>角色</Label>
                <Select
                  value={formRoleId}
                  onValueChange={(v) => setFormRoleId(v || "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.label || r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>部门</Label>
                <Input
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  placeholder="如 运营部"
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
                  editingId ? updateMutation.loading : createMutation.loading
                }
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId
                  ? updateMutation.loading
                    ? "保存中..."
                    : "保存"
                  : createMutation.loading
                    ? "创建中..."
                    : "新增"}
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
