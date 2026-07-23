/**
 * CMS Block Schema Configuration
 *
 * Defines the editable fields for each CMS content block.
 * The admin CMS page uses this schema to dynamically render form fields.
 * Inspired by Shopify's section schema + Amazon Stores builder.
 *
 * Field types:
 * - text: single-line text input
 * - textarea: multi-line text
 * - number: numeric input
 * - image: image URL input (with preview)
 * - video: video URL input
 * - link: internal/external link input
 * - toggle: boolean switch
 * - list: array of objects (renders sub-fields editor)
 * - tags: array of strings (tag editor)
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "video"
  | "link"
  | "toggle"
  | "list"
  | "tags";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** For list type: sub-field definitions */
  fields?: FieldSchema[];
  /** For list type: max items */
  maxItems?: number;
  /** For list type: add button label */
  addItemLabel?: string;
  /** Help text shown below the field */
  help?: string;
}

export interface BlockSchema {
  blockKey: string;
  title: string;
  description: string;
  page: string;
  icon: string;
  fields: FieldSchema[];
}

// ===== Page Groups =====
export const CMS_PAGES = [
  { id: "home", label: "首页", icon: "home" },
  { id: "global", label: "全局组件", icon: "globe" },
] as const;

// ===== Block Schemas =====
export const CMS_BLOCK_SCHEMAS: BlockSchema[] = [
  // ---- 首页 Hero 区 ----
  {
    blockKey: "home_hero",
    title: "Hero 主视觉区",
    description: "首页顶部全屏视频背景区，包含标题、描述、搜索框和CTA按钮",
    page: "home",
    icon: "image",
    fields: [
      { key: "badge", label: "徽章文字", type: "text", placeholder: "中国食品药品企业质量安全促进会主办" },
      { key: "title", label: "主标题", type: "text", placeholder: "国际清真食品产业平台" },
      { key: "subtitle_en", label: "英文副标题", type: "text", placeholder: "International Halal Food Industrial Platform" },
      { key: "highlight", label: "金色强调文字", type: "text", placeholder: "中国特色产业链出海平台" },
      { key: "description", label: "描述文字", type: "textarea", placeholder: "国家级、全球化..." },
      { key: "background_video", label: "背景视频路径", type: "video", placeholder: "/media/Hero/6月25日.mp4", help: "视频文件路径，建议放在 /public/media/ 目录下" },
      { key: "search_placeholder", label: "搜索框占位符", type: "text", placeholder: "搜索产品名、供应商、认证类型..." },
      { key: "search_button", label: "搜索按钮文字", type: "text" },
      {
        key: "hot_tags",
        label: "热门搜索标签",
        type: "tags",
        help: "点击删除标签，在输入框中输入文字后按回车添加",
      },
      { key: "cta_primary_text", label: "主CTA按钮文字", type: "text" },
      { key: "cta_primary_link", label: "主CTA按钮链接", type: "link" },
      { key: "cta_secondary_text", label: "次CTA按钮文字", type: "text" },
      { key: "cta_secondary_link", label: "次CTA按钮链接", type: "link" },
      {
        key: "stats",
        label: "底部数据点",
        type: "list",
        addItemLabel: "添加数据点",
        maxItems: 6,
        fields: [
          { key: "label", label: "标签", type: "text", placeholder: "覆盖" },
          { key: "value", label: "数值", type: "text", placeholder: "28+" },
          { key: "unit", label: "单位", type: "text", placeholder: "国家" },
        ],
      },
    ],
  },

  // ---- 首页 信任背书区 ----
  {
    blockKey: "home_trust",
    title: "信任背书区",
    description: "合作伙伴Logo和信任徽章展示",
    page: "home",
    icon: "shield",
    fields: [
      {
        key: "badges",
        label: "信任徽章",
        type: "list",
        addItemLabel: "添加徽章",
        maxItems: 8,
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
        ],
      },
      {
        key: "partners",
        label: "合作伙伴",
        type: "list",
        addItemLabel: "添加合作伙伴",
        maxItems: 12,
        fields: [
          { key: "name", label: "名称", type: "text" },
          { key: "short", label: "缩写", type: "text" },
        ],
      },
    ],
  },

  // ---- 首页 核心品类专区 ----
  {
    blockKey: "home_categories",
    title: "核心品类专区",
    description: "首页品类展示卡片",
    page: "home",
    icon: "grid",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      {
        key: "items",
        label: "品类列表",
        type: "list",
        addItemLabel: "添加品类",
        maxItems: 12,
        fields: [
          { key: "name", label: "中文名", type: "text" },
          { key: "name_en", label: "英文名", type: "text" },
        ],
      },
    ],
  },

  // ---- 首页 精选产品推荐 ----
  {
    blockKey: "home_products",
    title: "精选产品推荐",
    description: "产品推荐区块的标题和展示设置",
    page: "home",
    icon: "package",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      { key: "display_count", label: "展示数量", type: "number", help: "首页最多展示的产品数量" },
      { key: "cta_text", label: "CTA按钮文字", type: "text" },
      { key: "cta_link", label: "CTA按钮链接", type: "link" },
    ],
  },

  // ---- 首页 优质供应商推荐 ----
  {
    blockKey: "home_suppliers",
    title: "优质供应商推荐",
    description: "供应商推荐区块的标题和展示设置",
    page: "home",
    icon: "store",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      { key: "display_count", label: "展示数量", type: "number" },
      { key: "cta_text", label: "CTA按钮文字", type: "text" },
      { key: "cta_link", label: "CTA按钮链接", type: "link" },
    ],
  },

  // ---- 首页 一站式服务中心 ----
  {
    blockKey: "home_services",
    title: "一站式服务中心",
    description: "首页服务卡片展示",
    page: "home",
    icon: "briefcase",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      {
        key: "items",
        label: "服务卡片",
        type: "list",
        addItemLabel: "添加服务卡片",
        maxItems: 8,
        fields: [
          { key: "title", label: "中文标题", type: "text" },
          { key: "title_en", label: "英文标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
        ],
      },
    ],
  },

  // ---- 首页 平台数据 ----
  {
    blockKey: "home_stats",
    title: "平台数据",
    description: "首页平台数据展示（带动画计数）",
    page: "home",
    icon: "bar-chart",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      {
        key: "items",
        label: "数据项",
        type: "list",
        addItemLabel: "添加数据项",
        maxItems: 8,
        fields: [
          { key: "label", label: "标签", type: "text", placeholder: "入驻厂商" },
          { key: "value", label: "数值", type: "number", placeholder: "50" },
          { key: "prefix", label: "前缀", type: "text", placeholder: "$" },
          { key: "suffix", label: "后缀", type: "text", placeholder: "+" },
        ],
      },
    ],
  },

  // ---- 首页 标杆产业项目 ----
  {
    blockKey: "home_projects",
    title: "标杆产业项目",
    description: "首页标杆项目展示卡片",
    page: "home",
    icon: "flag",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      { key: "cta_text", label: "CTA按钮文字", type: "text" },
      { key: "cta_link", label: "CTA按钮链接", type: "link" },
      {
        key: "items",
        label: "项目卡片",
        type: "list",
        addItemLabel: "添加项目",
        maxItems: 6,
        fields: [
          { key: "title", label: "标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
          { key: "image", label: "图片路径", type: "image" },
          { key: "tag", label: "标签", type: "text" },
        ],
      },
    ],
  },

  // ---- 首页 行业资讯 ----
  {
    blockKey: "home_news",
    title: "行业资讯",
    description: "首页资讯区块的标题和展示设置",
    page: "home",
    icon: "newspaper",
    fields: [
      { key: "title", label: "区块标题", type: "text" },
      { key: "subtitle", label: "区块副标题", type: "textarea" },
      { key: "display_count", label: "展示数量", type: "number" },
      { key: "cta_text", label: "CTA按钮文字", type: "text" },
      { key: "cta_link", label: "CTA按钮链接", type: "link" },
    ],
  },

  // ---- 首页 行动召唤区 (CTA) ----
  {
    blockKey: "home_cta",
    title: "行动召唤区 (CTA)",
    description: "首页底部行动召唤区，含背景图和双CTA按钮",
    page: "home",
    icon: "megaphone",
    fields: [
      { key: "title", label: "标题", type: "text" },
      { key: "description", label: "描述", type: "textarea" },
      { key: "background_image", label: "背景图片路径", type: "image" },
      { key: "cta_supplier_text", label: "供应商按钮文字", type: "text" },
      { key: "cta_supplier_link", label: "供应商按钮链接", type: "link" },
      { key: "cta_buyer_text", label: "采购商按钮文字", type: "text" },
      { key: "cta_buyer_link", label: "采购商按钮链接", type: "link" },
    ],
  },

  // ---- 全局 顶部信息栏 ----
  {
    blockKey: "global_topbar",
    title: "顶部信息栏 (TopBar)",
    description: "全局顶部信息栏，显示徽章和主办单位",
    page: "global",
    icon: "layout",
    fields: [
      { key: "badge_text", label: "徽章文字", type: "text" },
      { key: "org_text", label: "主办单位", type: "text" },
      {
        key: "languages",
        label: "语言选项",
        type: "tags",
        help: "语言切换下拉菜单选项",
      },
    ],
  },

  // ---- 全局 页脚信息 ----
  {
    blockKey: "global_footer",
    title: "页脚信息 (Footer)",
    description: "全局页脚的联系信息、版权等",
    page: "global",
    icon: "anchor",
    fields: [
      { key: "brand_description", label: "品牌描述", type: "textarea" },
      { key: "address", label: "地址", type: "text" },
      { key: "phone", label: "电话", type: "text" },
      { key: "email", label: "邮箱", type: "text" },
      { key: "organizer", label: "主办单位", type: "text" },
      { key: "operator", label: "运营单位", type: "text" },
      { key: "copyright", label: "版权文字", type: "text" },
    ],
  },
];
