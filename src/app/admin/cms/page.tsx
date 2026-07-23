"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  ComponentType,
  ReactNode,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Save,
  ExternalLink,
  Plus,
  Trash2,
  X,
  LoaderCircle,
  CircleCheckBig,
  CircleAlert,
  FileText,
  Image as ImageIcon,
  Home,
  Globe,
  Shield,
  Package,
  Store,
  Briefcase,
  ChartColumn,
  Flag,
  Newspaper,
  Megaphone,
  LayoutTemplate,
  Anchor,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import {
  CMS_BLOCK_SCHEMAS,
  CMS_PAGES,
  type BlockSchema,
  type FieldSchema,
} from "@/lib/cms-schema";

// ===== Types =====

interface BlockData {
  title: string;
  content: string;
  type: string;
}

type BlocksMap = Record<string, BlockData>;

interface ToastState {
  type: "success" | "error";
  message: string;
}

// ===== Icon Map =====

const blockIconMap: Record<string, ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  shield: Shield,
  grid: LayoutGrid,
  package: Package,
  store: Store,
  briefcase: Briefcase,
  "bar-chart": ChartColumn,
  flag: Flag,
  newspaper: Newspaper,
  megaphone: Megaphone,
  layout: LayoutTemplate,
  anchor: Anchor,
  home: Home,
  globe: Globe,
};

function getBlockIcon(
  iconName: string
): ComponentType<{ className?: string }> {
  return blockIconMap[iconName] || FileText;
}

// ===== Default Value Helpers =====

function getDefaultValue(field: FieldSchema): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "link":
    case "image":
    case "video":
      return "";
    case "number":
      return "";
    case "toggle":
      return false;
    case "tags":
      return [];
    case "list":
      return [];
    default:
      return "";
  }
}

function getDefaultFormData(schema: BlockSchema): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of schema.fields) {
    data[field.key] = getDefaultValue(field);
  }
  return data;
}

function mergeWithDefaults(
  content: Record<string, unknown>,
  schema: BlockSchema
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...content };
  for (const field of schema.fields) {
    if (result[field.key] === undefined || result[field.key] === null) {
      result[field.key] = getDefaultValue(field);
    }
  }
  return result;
}

function parseBlockContent(
  content: string | undefined
): Record<string, unknown> {
  if (!content) return {};
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

function getDefaultListItem(
  fields: FieldSchema[]
): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const f of fields) {
    item[f.key] = getDefaultValue(f);
  }
  return item;
}

// ===== Page Entry =====

export default function CMSPage() {
  return (
    <AdminLayout>
      <AdminGuard requiredPermission="content.publish">
        <CMSContent />
      </AdminGuard>
    </AdminLayout>
  );
}

// ===== Main Content =====

function CMSContent() {
  const [blocks, setBlocks] = useState<BlocksMap>({});
  const [selectedBlockKey, setSelectedBlockKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // ===== Load all blocks on mount =====
  useEffect(() => {
    let cancelled = false;
    const loadBlocks = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await api.get<BlocksMap>(
          "/api/admin/content-blocks"
        );
        if (cancelled) return;
        const safeData = data && typeof data === "object" ? data : {};
        setBlocks(safeData);
        // Auto-select the first block
        const firstSchema = CMS_BLOCK_SCHEMAS[0];
        if (firstSchema) {
          const content = parseBlockContent(
            safeData[firstSchema.blockKey]?.content
          );
          setSelectedBlockKey(firstSchema.blockKey);
          setFormData(mergeWithDefaults(content, firstSchema));
        }
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "加载区块数据失败"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadBlocks();
    return () => {
      cancelled = true;
    };
  }, []);

  // ===== Toast auto-dismiss =====
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ===== Derived: selected schema =====
  const selectedSchema = useMemo(
    () =>
      CMS_BLOCK_SCHEMAS.find((s) => s.blockKey === selectedBlockKey) ?? null,
    [selectedBlockKey]
  );

  // ===== Derived: blocks grouped by page =====
  const groupedBlocks = useMemo(
    () =>
      CMS_PAGES.map((page) => ({
        ...page,
        schemas: CMS_BLOCK_SCHEMAS.filter((s) => s.page === page.id),
      })),
    []
  );

  // ===== Select a block (with unsaved-changes guard) =====
  const handleSelectBlock = (key: string) => {
    if (key === selectedBlockKey) return;
    if (dirty) {
      if (
        !window.confirm(
          "当前区块有未保存的修改，是否放弃修改并切换到新区块？"
        )
      ) {
        return;
      }
    }
    const schema = CMS_BLOCK_SCHEMAS.find((s) => s.blockKey === key);
    if (!schema) return;
    const content = parseBlockContent(blocks[key]?.content);
    setSelectedBlockKey(key);
    setFormData(mergeWithDefaults(content, schema));
    setDirty(false);
  };

  // ===== Update a top-level field =====
  const handleFieldChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  // ===== Save current block =====
  const handleSave = async () => {
    if (!selectedBlockKey || !selectedSchema) return;
    setSaving(true);
    try {
      await api.put(`/api/admin/content-blocks/${selectedBlockKey}`, {
        content: JSON.stringify(formData),
      });
      // Update local blocks state so the data stays in sync
      setBlocks((prev) => ({
        ...prev,
        [selectedBlockKey]: {
          title: selectedSchema.title,
          content: JSON.stringify(formData),
          type: prev[selectedBlockKey]?.type || "json",
        },
      }));
      setDirty(false);
      setToast({ type: "success", message: "区块内容已保存" });
    } catch (err) {
      setToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "保存失败，请重试",
      });
    } finally {
      setSaving(false);
    }
  };

  // ===== Loading state =====
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" />
        <span className="ml-2 text-sm text-slate-500">
          加载区块数据中...
        </span>
      </div>
    );
  }

  // ===== Error state =====
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CircleAlert className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-sm text-slate-600 mb-4">{loadError}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          重新加载
        </Button>
      </div>
    );
  }

  const SelectedIcon = selectedSchema
    ? getBlockIcon(selectedSchema.icon)
    : FileText;

  return (
    <div className="space-y-4">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-opacity ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CircleCheckBig className="h-4 w-4 shrink-0" />
          ) : (
            <CircleAlert className="h-4 w-4 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-600" />
          CMS内容管理
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          管理前台页面区块内容，修改后保存即可生效
        </p>
      </div>

      {/* Editing Header Bar */}
      {selectedSchema && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <SelectedIcon className="h-4 w-4 text-brand-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-800 truncate">
                  {selectedSchema.title}
                </h2>
                {dirty && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-600 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    未保存
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {selectedSchema.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              预览前台
            </a>
            <Button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              {saving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        {/* Left: Block List (grouped by page) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-20">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">
              区块列表
            </h3>
          </div>
          <div className="overflow-y-auto p-2 space-y-3 max-h-[60vh] lg:max-h-[calc(100vh-220px)]">
            {groupedBlocks.map((group) => {
              const PageIcon = getBlockIcon(group.icon);
              return (
                <div key={group.id}>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <PageIcon className="h-3.5 w-3.5" />
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.schemas.map((schema) => {
                      const isSelected =
                        schema.blockKey === selectedBlockKey;
                      const Icon = getBlockIcon(schema.icon);
                      return (
                        <button
                          key={schema.blockKey}
                          type="button"
                          onClick={() =>
                            handleSelectBlock(schema.blockKey)
                          }
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors border ${
                            isSelected
                              ? "bg-brand-50 border-brand-200"
                              : "border-transparent hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon
                              className={`h-4 w-4 mt-0.5 shrink-0 ${
                                isSelected
                                  ? "text-brand-600"
                                  : "text-slate-400"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-sm font-medium truncate ${
                                  isSelected
                                    ? "text-brand-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {schema.title}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                                {schema.description}
                              </div>
                            </div>
                            {isSelected && (
                              <ChevronRight className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Form Editor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {selectedSchema ? (
            <div className="p-5 sm:p-6">
              <div className="mb-5 pb-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-800">
                  编辑：{selectedSchema.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedSchema.description}
                </p>
              </div>
              <div className="space-y-5">
                {selectedSchema.fields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={formData[field.key]}
                    onChange={(value) =>
                      handleFieldChange(field.key, value)
                    }
                  />
                ))}
              </div>
              {/* Bottom save bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {dirty ? "有未保存的修改" : "所有修改已保存"}
                </span>
                <Button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      保存修改
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-400">
                请从左侧选择一个区块开始编辑
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Field Wrapper =====

function FieldWrapper({
  field,
  children,
}: {
  field: FieldSchema;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {field.label}
      </label>
      {children}
      {field.help && (
        <p className="mt-1 text-xs text-slate-400">{field.help}</p>
      )}
    </div>
  );
}

// ===== Field Renderer (dispatches by field type) =====

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  // ----- text / link -----
  if (field.type === "text" || field.type === "link") {
    return (
      <FieldWrapper field={field}>
        <Input
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      </FieldWrapper>
    );
  }

  // ----- textarea -----
  if (field.type === "textarea") {
    return (
      <FieldWrapper field={field}>
        <Textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="min-h-[80px]"
        />
      </FieldWrapper>
    );
  }

  // ----- number -----
  if (field.type === "number") {
    const strVal =
      value === undefined || value === null || value === ""
        ? ""
        : String(value);
    return (
      <FieldWrapper field={field}>
        <Input
          type="number"
          value={strVal}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={field.placeholder}
        />
      </FieldWrapper>
    );
  }

  // ----- image (input + preview) -----
  if (field.type === "image") {
    const url = String(value ?? "");
    return (
      <FieldWrapper field={field}>
        <Input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "输入图片路径或URL"}
        />
        {url && (
          <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-2">
            <img
              src={url}
              alt="预览"
              className="max-h-40 mx-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </FieldWrapper>
    );
  }

  // ----- video (input + preview) -----
  if (field.type === "video") {
    const url = String(value ?? "");
    return (
      <FieldWrapper field={field}>
        <Input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "输入视频路径或URL"}
        />
        {url && (
          <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-2">
            <video
              src={url}
              controls
              className="max-h-40 mx-auto"
            >
              您的浏览器不支持视频预览
            </video>
          </div>
        )}
      </FieldWrapper>
    );
  }

  // ----- toggle (boolean switch) -----
  if (field.type === "toggle") {
    const checked = Boolean(value);
    return (
      <FieldWrapper field={field}>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              checked ? "bg-brand-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                checked ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-slate-600">
            {checked ? "已开启" : "已关闭"}
          </span>
        </label>
      </FieldWrapper>
    );
  }

  // ----- tags (tag editor) -----
  if (field.type === "tags") {
    return (
      <FieldWrapper field={field}>
        <TagEditor
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      </FieldWrapper>
    );
  }

  // ----- list (nested sub-form list) -----
  if (field.type === "list") {
    return (
      <FieldWrapper field={field}>
        <ListEditor
          field={field}
          value={
            Array.isArray(value)
              ? (value as Record<string, unknown>[])
              : []
          }
          onChange={onChange}
        />
      </FieldWrapper>
    );
  }

  // Fallback for unknown types
  return null;
}

// ===== Tag Editor =====

function TagEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 min-h-[36px] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 transition-colors">
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-medium border border-brand-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="hover:text-brand-900 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          value.length === 0 ? "输入标签后按回车添加" : ""
        }
        className="flex-1 min-w-[100px] bg-transparent text-sm outline-none h-6"
      />
    </div>
  );
}

// ===== List Editor (nested sub-form list) =====

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
}) {
  const subFields = field.fields || [];
  const maxItems = field.maxItems;

  const handleAdd = () => {
    if (maxItems && value.length >= maxItems) return;
    onChange([...value, getDefaultListItem(subFields)]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    subKey: string,
    subValue: unknown
  ) => {
    const newArray = value.map((item, i) =>
      i === index ? { ...item, [subKey]: subValue } : item
    );
    onChange(newArray);
  };

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              #{index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleRemove(index)}
              className="text-slate-400 hover:text-red-500"
              title="删除此项"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {subFields.map((subField) => (
              <FieldRenderer
                key={subField.key}
                field={subField}
                value={item[subField.key]}
                onChange={(subValue) =>
                  handleItemChange(index, subField.key, subValue)
                }
              />
            ))}
          </div>
        </div>
      ))}

      {(!maxItems || value.length < maxItems) && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {field.addItemLabel || "添加项目"}
        </button>
      )}

      {maxItems && value.length >= maxItems && (
        <p className="text-xs text-slate-400 text-center">
          已达到最大数量限制（{maxItems} 项）
        </p>
      )}
    </div>
  );
}
