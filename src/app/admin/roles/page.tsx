"use client";

import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  roleLabels,
  roleColors,
  type AdminRole,
  type Permission,
} from "@/lib/admin-auth-context";
import { cn } from "@/lib/utils";

// ===== Permission labels (all 18) =====

const permissionLabels: Record<Permission, string> = {
  "dashboard.view": "数据看板",
  "products.review": "产品审核",
  "products.approve": "产品通过",
  "products.reject": "产品驳回",
  "suppliers.view": "供应商查看",
  "suppliers.verify": "供应商认证",
  "suppliers.suspend": "供应商冻结",
  "buyers.view": "采购商查看",
  "buyers.suspend": "采购商冻结",
  "inquiries.view": "询盘查看",
  "inquiries.close": "询盘关闭",
  "content.news": "资讯管理",
  "content.banner": "Banner管理",
  "content.publish": "内容发布",
  "settings.users": "用户管理",
  "settings.roles": "角色权限",
  "settings.system": "系统设置",
  "settings.logs": "系统日志",
};

const allPermissions: Permission[] = Object.keys(
  permissionLabels
) as Permission[];

// ===== Role meta =====

interface RoleMeta {
  description: string;
  permissions: string[];
  isAll?: boolean;
}

const roleMeta: Record<AdminRole, RoleMeta> = {
  super_admin: {
    description: "拥有系统全部权限，可管理所有模块、用户与系统配置",
    permissions: allPermissions.map((p) => permissionLabels[p]),
    isAll: true,
  },
  operations_manager: {
    description: "负责日常运营管理，审核产品并管理供应商、采购商与询盘",
    permissions: [
      "数据看板",
      "产品审核",
      "供应商管理",
      "采购商管理",
      "询盘管理",
      "内容管理",
    ],
  },
  content_editor: {
    description: "负责资讯与Banner内容编辑与发布，可查看产品审核",
    permissions: ["数据看板", "资讯管理", "Banner管理", "产品审核(查看)"],
  },
  auditor: {
    description: "负责产品审核与资质审核，可查看供应商与询盘信息",
    permissions: ["数据看板", "产品审核", "供应商查看", "询盘查看"],
  },
  viewer: {
    description: "只读查看数据看板与各项业务数据，无任何写操作权限",
    permissions: ["数据看板", "供应商查看", "采购商查看", "询盘查看"],
  },
};

const roleOrder: AdminRole[] = [
  "super_admin",
  "operations_manager",
  "content_editor",
  "auditor",
  "viewer",
];

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
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-600" />
          角色权限
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          查看各角色权限范围，共 {roleOrder.length} 个角色、{allPermissions.length}{" "}
          项权限
        </p>
      </div>

      {/* Permission matrix overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">权限总览（全量）</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allPermissions.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
            >
              <CheckCircle2 className="h-3 w-3 text-brand-500" />
              {permissionLabels[p]}
            </span>
          ))}
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roleOrder.map((role) => {
          const meta = roleMeta[role];
          return (
            <div
              key={role}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      roleColors[role]
                    )}
                  >
                    {role === "super_admin" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {roleLabels[role]}
                      </h3>
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-[11px] font-medium",
                          roleColors[role]
                        )}
                      >
                        {role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{meta.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    权限列表
                  </span>
                  <span className="text-xs text-slate-400">
                    {meta.isAll
                      ? `全部 ${allPermissions.length} 项`
                      : `${meta.permissions.length} 项`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {meta.isAll && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-semibold">
                      <ShieldCheck className="h-3 w-3" />
                      全部权限
                    </span>
                  )}
                  {meta.permissions.map((perm, idx) => (
                    <span
                      key={`${perm}-${idx}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium"
                    >
                      <CheckCircle2 className="h-3 w-3 text-brand-500" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>角色标识：{role}</span>
                <span>
                  {meta.isAll
                    ? "超级权限"
                    : meta.permissions.length <= 4
                    ? "受限权限"
                    : "常规权限"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-sm text-brand-800">
          <p className="font-medium mb-1">权限说明</p>
          <p className="text-brand-700 text-xs leading-relaxed">
            角色权限由系统预置，超级管理员可分配用户角色。各角色仅可访问其权限范围内的功能模块，超出权限的访问将被拦截。如需调整角色权限，请联系超级管理员。
          </p>
        </div>
      </div>
    </div>
  );
}
