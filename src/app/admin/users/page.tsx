"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  UserCog,
  Edit,
  Power,
  X,
  Mail,
  Filter,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
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
import {
  roleLabels,
  roleColors,
  type AdminRole,
} from "@/lib/admin-auth-context";
import { cn } from "@/lib/utils";

// ===== Types =====

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  lastLogin: string;
  status: "active" | "disabled";
}

// ===== Constants =====

const roleOptions: AdminRole[] = [
  "super_admin",
  "operations_manager",
  "content_editor",
  "auditor",
  "viewer",
];

// ===== Seed data =====

const seedUsers: AdminUserRow[] = [
  {
    id: "ADM-001",
    name: "系统管理员",
    email: "admin@ihf.org",
    role: "super_admin",
    department: "技术部",
    lastLogin: "2026-07-14 08:30",
    status: "active",
  },
  {
    id: "ADM-002",
    name: "运营张经理",
    email: "ops@ihf.org",
    role: "operations_manager",
    department: "运营部",
    lastLogin: "2026-07-14 09:15",
    status: "active",
  },
  {
    id: "ADM-003",
    name: "编辑小李",
    email: "editor@ihf.org",
    role: "content_editor",
    department: "内容部",
    lastLogin: "2026-07-13 17:42",
    status: "active",
  },
  {
    id: "ADM-004",
    name: "审核员王工",
    email: "audit@ihf.org",
    role: "auditor",
    department: "审核部",
    lastLogin: "2026-07-13 16:20",
    status: "active",
  },
  {
    id: "ADM-005",
    name: "观察员赵老师",
    email: "viewer@ihf.org",
    role: "viewer",
    department: "监督部",
    lastLogin: "2026-07-12 11:08",
    status: "active",
  },
  {
    id: "ADM-006",
    name: "刘总监",
    email: "liu@ihf.org",
    role: "operations_manager",
    department: "运营部",
    lastLogin: "2026-07-14 10:05",
    status: "active",
  },
  {
    id: "ADM-007",
    name: "陈编辑",
    email: "chen@ihf.org",
    role: "content_editor",
    department: "内容部",
    lastLogin: "2026-07-10 14:30",
    status: "disabled",
  },
  {
    id: "ADM-008",
    name: "周审核",
    email: "zhou@ihf.org",
    role: "auditor",
    department: "审核部",
    lastLogin: "2026-07-11 09:50",
    status: "active",
  },
];

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
  const [users, setUsers] = useState<AdminUserRow[]>(seedUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<AdminRole>("viewer");
  const [formDepartment, setFormDepartment] = useState("");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      disabled: users.filter((u) => u.status === "disabled").length,
    }),
    [users]
  );

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("viewer");
    setFormDepartment("");
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
    setFormRole(user.role);
    setFormDepartment(user.department);
    setDialogOpen(true);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "disabled" : "active" }
          : u
      )
    );
  };

  const handleSubmit = () => {
    if (!formName.trim()) {
      alert("请填写用户名");
      return;
    }
    if (!formEmail.trim()) {
      alert("请填写邮箱");
      return;
    }
    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? {
                ...u,
                name: formName,
                email: formEmail,
                role: formRole,
                department: formDepartment,
              }
            : u
        )
      );
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const newUser: AdminUserRow = {
        id: `ADM-${String(users.length + 1).padStart(3, "0")}`,
        name: formName,
        email: formEmail,
        role: formRole,
        department: formDepartment || "未分配",
        lastLogin: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          now.getDate()
        )} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
        status: "active",
      };
      setUsers((prev) => [...prev, newUser]);
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
            onValueChange={(v) => setRoleFilter(v || "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {roleOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {roleLabels[r]}
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
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{u.name}</div>
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
                        roleColors[u.role]
                      )}
                    >
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.department}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {u.lastLogin}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        u.status === "active"
                          ? "bg-brand-100 text-brand-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {u.status === "active" ? "启用" : "禁用"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(u)}
                        title="编辑"
                        className="text-slate-500 hover:text-brand-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleStatus(u.id)}
                        title={u.status === "active" ? "禁用" : "启用"}
                        className={
                          u.status === "active"
                            ? "text-slate-500 hover:text-gold-600"
                            : "text-slate-500 hover:text-brand-600"
                        }
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    暂无匹配的用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                />
              </div>
              <div className="space-y-1.5">
                <Label>角色</Label>
                <Select
                  value={formRole}
                  onValueChange={(v) => setFormRole((v as AdminRole) || "viewer")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabels[r]}
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
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingId ? "保存" : "新增"}
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
