"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  KeyRound,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { adminApi } from "@/lib/api-client";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { LoadingSpinner, ErrorDisplay, EmptyState } from "@/lib/use-api-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { roleLabels, roleColors } from "@/lib/admin-auth-context";
import { cn } from "@/lib/utils";

// ===== Types =====

interface RolePermission {
  id: string;
  name: string;
  label: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  label: string;
  description: string | null;
  permissions: RolePermission[];
}

interface Permission {
  id: string;
  name: string;
  label: string;
  module: string;
  description: string | null;
}

// ===== Page =====

export default function RolesPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="settings.roles">
        <RolesContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function RolesContent() {
  const [mutationTick, setMutationTick] = useState(0);

  // Dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [permDialogRoleId, setPermDialogRoleId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Permission selection state (permission names)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // ===== Fetch roles =====
  const {
    data: roles,
    loading,
    error,
    refetch,
  } = useApiQuery<Role[]>(() => adminApi.roles() as Promise<Role[]>, {
    deps: [mutationTick],
  });

  // ===== Fetch all permissions =====
  const { data: permissions } = useApiQuery<Permission[]>(
    () => adminApi.permissions() as Promise<Permission[]>,
    { deps: [mutationTick] }
  );

  // ===== Mutations =====
  const createMutation = useApiMutation((payload: Record<string, unknown>) =>
    adminApi.createRole(payload)
  );
  const updateMutation = useApiMutation(
    (params: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateRole(params.id, params.data)
  );
  const deleteMutation = useApiMutation((id: string) =>
    adminApi.deleteRole(id)
  );
  const syncPermsMutation = useApiMutation(
    (params: { id: string; perms: string[] }) =>
      adminApi.syncRolePermissions(params.id, params.perms)
  );

  const roleList = roles ?? [];
  const allPermissions = permissions ?? [];

  // Group permissions by module for the assignment dialog
  const permissionsByModule = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    for (const p of allPermissions) {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p);
    }
    return groups;
  }, [allPermissions]);

  const refreshAll = async () => {
    await refetch();
    setMutationTick((t) => t + 1);
  };

  // ===== Form helpers =====
  const resetForm = () => {
    setFormName("");
    setFormLabel("");
    setFormDescription("");
    setEditingRoleId(null);
  };

  const openCreate = () => {
    resetForm();
    setRoleDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRoleId(role.id);
    setFormName(role.name);
    setFormLabel(role.label);
    setFormDescription(role.description || "");
    setRoleDialogOpen(true);
  };

  const openPermDialog = (role: Role) => {
    setPermDialogRoleId(role.id);
    setSelectedPerms(role.permissions.map((p) => p.name));
    setPermDialogOpen(true);
  };

  // ===== Handlers =====
  const handleSubmit = async () => {
    if (!formName.trim()) {
      alert("请填写角色标识");
      return;
    }
    if (!formLabel.trim()) {
      alert("请填写角色名称");
      return;
    }
    setActionLoading(editingRoleId || "form");
    try {
      const payload: Record<string, unknown> = {
        name: formName,
        label: formLabel,
        description: formDescription.trim() || null,
      };
      if (editingRoleId) {
        await updateMutation.mutate({ id: editingRoleId, data: payload });
      } else {
        await createMutation.mutate(payload);
      }
      setRoleDialogOpen(false);
      resetForm();
      await refreshAll();
      alert(editingRoleId ? "角色已更新" : "角色已创建");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该角色吗？已分配该角色的用户将受影响。")) return;
    setActionLoading(id);
    try {
      await deleteMutation.mutate(id);
      await refreshAll();
      alert("角色已删除");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePerm = (permName: string) => {
    setSelectedPerms((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    );
  };

  const handleToggleModule = (modulePerms: Permission[]) => {
    const moduleNames = modulePerms.map((p) => p.name);
    const allSelected = moduleNames.every((n) => selectedPerms.includes(n));
    if (allSelected) {
      // Remove all module permissions
      setSelectedPerms((prev) => prev.filter((n) => !moduleNames.includes(n)));
    } else {
      // Add all module permissions
      setSelectedPerms((prev) => [
        ...prev,
        ...moduleNames.filter((n) => !prev.includes(n)),
      ]);
    }
  };

  const handleSavePerms = async () => {
    if (!permDialogRoleId) return;
    setActionLoading("perms");
    try {
      await syncPermsMutation.mutate({
        id: permDialogRoleId,
        perms: selectedPerms,
      });
      setPermDialogOpen(false);
      setPermDialogRoleId(null);
      await refreshAll();
      alert("权限已更新");
    } catch (err) {
      alert("操作失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setActionLoading(null);
    }
  };

  // Get role display info with fallback
  const getRoleDisplay = (role: Role) => {
    const color = roleColors[role.name] || "bg-slate-100 text-slate-600";
    const label = roleLabels[role.name] || role.label || role.name;
    return { color, label };
  };

  // The role currently being edited for permissions
  const permDialogRole = roleList.find((r) => r.id === permDialogRoleId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            角色权限
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            管理角色与权限分配，共 {roleList.length} 个角色、
            {allPermissions.length} 项权限
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          <Plus className="h-4 w-4" />
          新增角色
        </Button>
      </div>

      {/* Permission overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">
            权限总览（全量）
          </h2>
        </div>
        {allPermissions.length === 0 ? (
          <p className="text-sm text-slate-400">暂无权限数据</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allPermissions.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
              >
                <CheckCircle2 className="h-3 w-3 text-brand-500" />
                {p.label || p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Role cards */}
      {loading ? (
        <LoadingSpinner text="加载角色中..." />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={refetch} />
      ) : roleList.length === 0 ? (
        <EmptyState
          title="暂无角色"
          description="还没有任何角色记录，点击新增角色创建"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roleList.map((role) => {
            const display = getRoleDisplay(role);
            const isLoading = actionLoading === role.id;
            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        display.color
                      )}
                    >
                      {role.name === "super_admin" ? (
                        <ShieldCheck className="h-5 w-5" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {display.label}
                        </h3>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-[11px] font-medium",
                            display.color
                          )}
                        >
                          {role.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {role.description || "暂无描述"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">
                      权限列表
                    </span>
                    <span className="text-xs text-slate-400">
                      {role.permissions.length} 项
                    </span>
                  </div>
                  {role.permissions.length === 0 ? (
                    <p className="text-xs text-slate-400">暂未分配权限</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium"
                        >
                          <CheckCircle2 className="h-3 w-3 text-brand-500" />
                          {perm.label || perm.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    角色标识：{role.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openPermDialog(role)}
                      disabled={isLoading}
                      title="分配权限"
                      className="text-slate-500 hover:text-brand-600"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(role)}
                      disabled={isLoading}
                      title="编辑"
                      className="text-slate-500 hover:text-brand-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(role.id)}
                      disabled={isLoading}
                      title="删除"
                      className="text-slate-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-sm text-brand-800">
          <p className="font-medium mb-1">权限说明</p>
          <p className="text-brand-700 text-xs leading-relaxed">
            角色权限可动态分配，超级管理员可创建角色并分配权限。各角色仅可访问其权限范围内的功能模块，超出权限的访问将被拦截。
          </p>
        </div>
      </div>

      {/* Create/Edit Role Dialog */}
      {roleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setRoleDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {editingRoleId ? "编辑角色" : "新增角色"}
              </h2>
              <button
                onClick={() => setRoleDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label>角色标识</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="如 operations_manager"
                  disabled={!!editingRoleId}
                />
                {editingRoleId && (
                  <p className="text-xs text-slate-400">角色标识不可修改</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>角色名称</Label>
                <Input
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="如 运营主管"
                />
              </div>
              <div className="space-y-1.5">
                <Label>描述</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="角色职责描述"
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  editingRoleId
                    ? updateMutation.loading
                    : createMutation.loading
                }
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                {editingRoleId
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

      {/* Permission Assignment Dialog */}
      {permDialogOpen && permDialogRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPermDialogOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                分配权限 - {permDialogRole.label || permDialogRole.name}
              </h2>
              <button
                onClick={() => setPermDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {Object.keys(permissionsByModule).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  暂无可分配的权限
                </p>
              ) : (
                Object.entries(permissionsByModule).map(([module, perms]) => {
                  const moduleNames = perms.map((p) => p.name);
                  const allSelected = moduleNames.every((n) =>
                    selectedPerms.includes(n)
                  );
                  const someSelected =
                    moduleNames.some((n) => selectedPerms.includes(n)) &&
                    !allSelected;
                  return (
                    <div key={module}>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected;
                          }}
                          onChange={() => handleToggleModule(perms)}
                          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {module}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({perms.filter((p) => selectedPerms.includes(p.name)).length}/
                          {perms.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                        {perms.map((p) => {
                          const checked = selectedPerms.includes(p.name);
                          return (
                            <label
                              key={p.id}
                              className={cn(
                                "flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors",
                                checked
                                  ? "border-brand-300 bg-brand-50"
                                  : "border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleTogglePerm(p.name)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  {p.label || p.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {p.name}
                                </div>
                                {p.description && (
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {p.description}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <span className="text-xs text-slate-400">
                已选 {selectedPerms.length} 项权限
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPermDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSavePerms}
                  disabled={syncPermsMutation.loading}
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {syncPermsMutation.loading ? "保存中..." : "保存权限"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
