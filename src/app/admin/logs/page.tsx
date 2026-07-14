"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ScrollText,
  Filter,
  Calendar,
  LogIn,
  CheckCircle2,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type LogAction = "登录" | "审核" | "创建" | "修改" | "删除";

interface LogEntry {
  id: string;
  time: string;
  operator: string;
  role: AdminRole;
  action: LogAction;
  content: string;
  ip: string;
}

// ===== Constants =====

const actionTypes: LogAction[] = ["登录", "审核", "创建", "修改", "删除"];

const actionMeta: Record<
  LogAction,
  { badge: string; icon: typeof LogIn }
> = {
  登录: { badge: "bg-trust-100 text-trust-700", icon: LogIn },
  审核: { badge: "bg-gold-100 text-gold-700", icon: CheckCircle2 },
  创建: { badge: "bg-brand-100 text-brand-700", icon: PlusCircle },
  修改: { badge: "bg-purple-100 text-purple-700", icon: Pencil },
  删除: { badge: "bg-red-100 text-red-700", icon: Trash2 },
};

// ===== Seed data =====

const seedLogs: LogEntry[] = [
  {
    id: "LOG-20260714-0001",
    time: "2026-07-14 08:30:12",
    operator: "系统管理员",
    role: "super_admin",
    action: "登录",
    content: "用户登录管理后台",
    ip: "112.45.88.102",
  },
  {
    id: "LOG-20260714-0002",
    time: "2026-07-14 09:02:45",
    operator: "审核员王工",
    role: "auditor",
    action: "审核",
    content: "产品审核通过：清真冷冻羊腿肉（分割）SKU-2026-0382",
    ip: "58.20.115.66",
  },
  {
    id: "LOG-20260714-0003",
    time: "2026-07-14 09:15:30",
    operator: "运营张经理",
    role: "operations_manager",
    action: "审核",
    content: "供应商资质审核通过：宁夏伊品清真食品有限公司",
    ip: "112.45.88.230",
  },
  {
    id: "LOG-20260714-0004",
    time: "2026-07-14 10:05:18",
    operator: "编辑小李",
    role: "content_editor",
    action: "创建",
    content: "资讯发布：2026年全球清真食品市场规模预计突破2.3万亿美元",
    ip: "120.78.44.91",
  },
  {
    id: "LOG-20260714-0005",
    time: "2026-07-14 10:22:09",
    operator: "系统管理员",
    role: "super_admin",
    action: "修改",
    content: "修改系统配置：供应商入驻审核周期由7天调整为3天",
    ip: "112.45.88.102",
  },
  {
    id: "LOG-20260714-0006",
    time: "2026-07-14 11:10:55",
    operator: "运营张经理",
    role: "operations_manager",
    action: "审核",
    content: "产品审核驳回：速冻水饺（猪肉馅）— 含非清真原料，驳回",
    ip: "112.45.88.230",
  },
  {
    id: "LOG-20260714-0007",
    time: "2026-07-14 11:48:33",
    operator: "编辑小李",
    role: "content_editor",
    action: "创建",
    content: "新增Banner：斋月备货专区（首页轮播）",
    ip: "120.78.44.91",
  },
  {
    id: "LOG-20260713-0008",
    time: "2026-07-13 16:20:40",
    operator: "审核员王工",
    role: "auditor",
    action: "审核",
    content: "产品审核通过：清真咖喱预制菜 SKU-2026-0291",
    ip: "58.20.115.66",
  },
  {
    id: "LOG-20260713-0009",
    time: "2026-07-13 17:42:11",
    operator: "系统管理员",
    role: "super_admin",
    action: "删除",
    content: "删除违规产品：非清真标识肉类产品 SKU-2026-0102",
    ip: "112.45.88.102",
  },
  {
    id: "LOG-20260713-0010",
    time: "2026-07-13 15:05:27",
    operator: "刘总监",
    role: "operations_manager",
    action: "修改",
    content: "修改询盘状态：询盘 INQ-2026-0512 关闭",
    ip: "112.45.88.230",
  },
  {
    id: "LOG-20260712-0011",
    time: "2026-07-12 11:08:50",
    operator: "观察员赵老师",
    role: "viewer",
    action: "登录",
    content: "用户登录管理后台（只读）",
    ip: "36.110.50.78",
  },
  {
    id: "LOG-20260712-0012",
    time: "2026-07-12 14:33:19",
    operator: "系统管理员",
    role: "super_admin",
    action: "创建",
    content: "新增用户：周审核（审核部）",
    ip: "112.45.88.102",
  },
];

// ===== Page =====

export default function LogsPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermissions={["settings.system", "settings.logs"]}>
        <LogsContent />
      </AdminGuard>
    </AdminLayout>
  );
}

function LogsContent() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return seedLogs.filter((log) => {
      const matchSearch =
        !search ||
        log.operator.toLowerCase().includes(search.toLowerCase()) ||
        log.content.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.includes(search);
      const matchAction =
        actionFilter === "all" || log.action === actionFilter;
      const logDate = log.time.slice(0, 10);
      const matchFrom = !dateFrom || logDate >= dateFrom;
      const matchTo = !dateTo || logDate <= dateTo;
      return matchSearch && matchAction && matchFrom && matchTo;
    });
  }, [search, actionFilter, dateFrom, dateTo]);

  const stats = useMemo(
    () => ({
      total: seedLogs.length,
      today: seedLogs.filter((l) => l.time.startsWith("2026-07-14")).length,
      login: seedLogs.filter((l) => l.action === "登录").length,
      audit: seedLogs.filter((l) => l.action === "审核").length,
    }),
    []
  );

  const resetFilters = () => {
    setSearch("");
    setActionFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-brand-600" />
          系统日志
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          记录平台所有关键操作，包括登录、审核、创建、修改与删除
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="日志总数" value={stats.total} color="brand" />
        <StatCard label="今日操作" value={stats.today} color="trust" />
        <StatCard label="登录记录" value={stats.login} color="gold" />
        <StatCard label="审核操作" value={stats.audit} color="gold" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索操作人、内容或IP…"
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            value={actionFilter}
            onValueChange={(v) => setActionFilter(v || "all")}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="动作类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {actionTypes.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-36"
            aria-label="开始日期"
          />
          <span className="text-slate-400 text-xs">至</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-36"
            aria-label="结束日期"
          />
        </div>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          重置
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="text-left font-medium px-4 py-3">时间</th>
                <th className="text-left font-medium px-4 py-3">操作人</th>
                <th className="text-left font-medium px-4 py-3">角色</th>
                <th className="text-left font-medium px-4 py-3">动作类型</th>
                <th className="text-left font-medium px-4 py-3">操作内容</th>
                <th className="text-left font-medium px-4 py-3">IP地址</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => {
                const meta = actionMeta[log.action];
                const ActionIcon = meta.icon;
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {log.operator.slice(0, 1)}
                        </div>
                        <span className="font-medium text-slate-900">
                          {log.operator}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                          roleColors[log.role]
                        )}
                      >
                        {roleLabels[log.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          meta.badge
                        )}
                      >
                        <ActionIcon className="h-3 w-3" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[360px]">
                      {log.content}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.ip}
                      </code>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    暂无匹配的日志记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>共 {filtered.length} 条记录</span>
            <span>日志保留期：180天</span>
          </div>
        )}
      </div>
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
