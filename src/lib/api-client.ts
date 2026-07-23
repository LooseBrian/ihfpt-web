/**
 * IHF Platform API Client
 *
 * Centralized HTTP client for communicating with the CodeIgniter 4 backend.
 * Handles JWT token management (access + refresh), automatic token refresh
 * on 401 responses, and provides typed request methods.
 *
 * Architecture: high cohesion, low coupling, extensibility, maintainability.
 * This module is the single source of truth for all backend communication.
 */

// ===== Configuration =====

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ACCESS_TOKEN_KEY = "ihf_access_token";
const REFRESH_TOKEN_KEY = "ihf_refresh_token";
const ADMIN_DATA_KEY = "ihf_admin_data";

// ===== Types =====

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  admin: AdminInfo;
}

export interface AdminInfo {
  id: string;
  email: string;
  name: string;
  department: string;
  avatar?: string;
  last_login_at?: string;
  roles: RoleInfo[];
  role_labels: string[];
  permissions: string[];
}

export interface RoleInfo {
  id: string;
  name: string;
  label: string;
  description?: string;
}

export interface DashboardStats {
  counts: {
    products_pending: number;
    products_approved: number;
    products_total: number;
    suppliers_total: number;
    buyers_total: number;
    inquiries_open: number;
    inquiries_total: number;
    news_published: number;
    banners_active: number;
  };
  recent_logs: Array<{
    id: string;
    admin_name: string;
    action: string;
    target_type: string;
    detail: string;
    created_at: string;
  }>;
  admin_info?: {
    id: string;
    name: string;
    email: string;
  };
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ===== Token Management =====

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
}

export function getStoredAdmin(): AdminInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ADMIN_DATA_KEY);
    return stored ? (JSON.parse(stored) as AdminInfo) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin: AdminInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
}

/** Remove only the admin data entry (leaves tokens intact). */
export function clearStoredAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_DATA_KEY);
}

// ===== Core Request =====

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  /** Skip auth header (for login/refresh endpoints) */
  skipAuth?: boolean;
  /** Mark as a refresh request to avoid infinite loop */
  isRefresh?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    skipAuth = false,
    isRefresh = false,
  } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Build headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Attach JWT
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Execute
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Handle 401 - attempt token refresh
  if (response.status === 401 && !skipAuth && !isRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry original request with new token
      return request<T>(path, { ...options, isRefresh: true });
    }
    // Refresh failed - clear tokens
    clearTokens();
    throw new ApiError("UNAUTHORIZED", "登录已过期，请重新登录", 401);
  }

  // Parse response
  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "PARSE_ERROR",
      "服务器响应格式错误",
      response.status
    );
  }

  // Handle errors
  if (!response.ok || !result.success) {
    const errMsg =
      result.error?.message || result.message || "请求失败";
    const errCode = result.error?.code || "REQUEST_FAILED";
    throw new ApiError(errCode, errMsg, response.status, result.error?.details);
  }

  // For paginated responses (with meta), return { data, meta }
  // For regular responses, return result.data
  if (result.meta && Array.isArray(result.data)) {
    return { data: result.data, meta: result.meta } as unknown as T;
  }

  return (result.data ?? result) as T;
}

// ===== Token Refresh =====

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // Deduplicate concurrent refresh requests
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh();

  return refreshPromise;
}

async function doRefresh(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    // Determine token type by decoding the JWT payload.
    // The JWT contains a "guard" field ("user" or "admin") that reliably
    // identifies the session type — unlike checking localStorage for
    // ADMIN_DATA_KEY, which can be stale from a previous admin login
    // in the same browser.
    let isAdminSession = false;
    const token = getAccessToken();
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          );
          isAdminSession = payload.guard === "admin";
        }
      } catch {
        // ignore decode errors
      }
    }

    const refreshUrl = isAdminSession
      ? `${API_BASE_URL}/api/admin/auth/refresh`
      : `${API_BASE_URL}/api/auth/refresh`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const result = (await response.json()) as ApiResponse<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>;

    if (!result.success || !result.data) return false;

    setTokens(result.data.access_token, result.data.refresh_token);
    return true;
  } catch {
    return false;
  } finally {
    refreshPromise = null;
  }
}

// ===== Public API Methods =====

export const api = {
  get<T = unknown>(path: string, params?: Record<string, unknown>) {
    return request<T>(path, { method: "GET", params: params as never });
  },

  post<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, { method: "POST", body });
  },

  patch<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, { method: "PATCH", body });
  },

  put<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, { method: "PUT", body });
  },

  delete<T = unknown>(path: string) {
    return request<T>(path, { method: "DELETE" });
  },

  /** Raw request with full control (used by auth endpoints) */
  raw<T = unknown>(path: string, options: RequestOptions = {}) {
    return request<T>(path, options);
  },
};

// ===== Auth Endpoints =====

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  type: "buyer" | "supplier";
  phone?: string;
  company_name?: string;
  logo?: string | null;
  tier?: string;
  location?: string;
  email_verified?: string;
  phone_verified?: string;
  /** ASIN-like user code: `SR` + 8 chars (supplier) or `BR` + 8 chars (buyer). */
  user_code?: string;
}

export interface UserLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: UserInfo;
}

export const authApi = {
  /** Admin login - returns tokens + admin info */
  adminLogin(email: string, password: string) {
    return request<LoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    });
  },

  /** Get current admin info (requires valid token) */
  adminMe() {
    return request<AdminInfo>("/api/admin/auth/me", { method: "GET" });
  },

  /** Admin logout (invalidates server-side token) */
  adminLogout() {
    return request<null>("/api/admin/auth/logout", { method: "POST" });
  },

  /** Refresh admin access token */
  adminRefresh(refreshToken: string) {
    return request<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>("/api/admin/auth/refresh", {
      method: "POST",
      body: { refresh_token: refreshToken },
      skipAuth: true,
      isRefresh: true,
    });
  },

  /** User (buyer/supplier) login - returns tokens + user info */
  userLogin(email: string, password: string) {
    return request<UserLoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    });
  },

  /** Get current user info */
  userMe() {
    return request<UserInfo>("/api/auth/me", { method: "GET" });
  },

  /** User logout */
  userLogout() {
    return request<null>("/api/auth/logout", { method: "POST" });
  },
};

// ===== Admin API Endpoints =====

export const adminApi = {
  // Dashboard
  dashboardStats: <T = DashboardStats>() => api.get<T>("/api/admin/dashboard/stats"),

  // Products
  products: (params?: { page?: number; per_page?: number; status?: string; search?: string }) =>
    api.get("/api/admin/products", params as never),
  showProduct: (id: number | string) =>
    api.get(`/api/admin/products/${id}`),
  pendingProducts: () => api.get("/api/admin/products/pending"),
  deletedProducts: () => api.get("/api/admin/products/deleted"),
  approveProduct: (id: number | string) => api.patch(`/api/admin/products/${id}/approve`),
  rejectProduct: (id: number | string, reason: string) =>
    api.patch(`/api/admin/products/${id}/reject`, { reason }),
  unlistProduct: (id: number | string) => api.patch(`/api/admin/products/${id}/unlist`),
  relistProduct: (id: number | string) => api.patch(`/api/admin/products/${id}/relist`),
  restoreProduct: (id: number | string) => api.patch(`/api/admin/products/${id}/restore`),

  // Suppliers
  suppliers: (params?: { page?: number; per_page?: number; search?: string }) =>
    api.get("/api/admin/suppliers", params as never),
  verifySupplier: (id: number | string) => api.patch(`/api/admin/suppliers/${id}/verify`),
  banSupplier: (id: number | string, reason: string, duration: string) =>
    api.patch(`/api/admin/suppliers/${id}/ban`, { reason, duration }),
  unbanSupplier: (id: number | string) => api.patch(`/api/admin/suppliers/${id}/unban`),

  // Buyers
  buyers: (params?: { page?: number; per_page?: number; search?: string }) =>
    api.get("/api/admin/buyers", params as never),
  banBuyer: (id: number | string, reason: string, duration: string) =>
    api.patch(`/api/admin/buyers/${id}/ban`, { reason, duration }),
  unbanBuyer: (id: number | string) => api.patch(`/api/admin/buyers/${id}/unban`),

  // Inquiries
  inquiries: (params?: { page?: number; per_page?: number; status?: string; search?: string }) =>
    api.get("/api/admin/inquiries", params as never),
  closeInquiry: (id: number | string) => api.patch(`/api/admin/inquiries/${id}/close`),

  // News
  news: (params?: { page?: number; per_page?: number; status?: string; category?: string; search?: string }) =>
    api.get("/api/admin/news", params as never),
  showNews: (id: number | string) => api.get(`/api/admin/news/${id}`),
  createNews: (data: Record<string, unknown>) => api.post("/api/admin/news", data),
  updateNews: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/api/admin/news/${id}`, data),
  deleteNews: (id: number | string) => api.delete(`/api/admin/news/${id}`),
  publishNews: (id: number | string) => api.patch(`/api/admin/news/${id}/publish`),
  unpublishNews: (id: number | string) => api.patch(`/api/admin/news/${id}/unpublish`),

  // Banners
  banners: (params?: { page?: number; per_page?: number; position?: string; is_active?: number }) =>
    api.get("/api/admin/banners", params as never),
  showBanner: (id: number | string) => api.get(`/api/admin/banners/${id}`),
  createBanner: (data: Record<string, unknown>) => api.post("/api/admin/banners", data),
  updateBanner: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/api/admin/banners/${id}`, data),
  deleteBanner: (id: number | string) => api.delete(`/api/admin/banners/${id}`),

  // Content Blocks
  contentBlocks: () => api.get("/api/admin/content-blocks"),
  updateContentBlock: (key: string, content: string) =>
    api.put(`/api/admin/content-blocks/${key}`, { content }),

  // Roles & Permissions
  roles: () => api.get("/api/admin/roles"),
  showRole: (id: number | string) => api.get(`/api/admin/roles/${id}`),
  createRole: (data: Record<string, unknown>) => api.post("/api/admin/roles", data),
  updateRole: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/api/admin/roles/${id}`, data),
  deleteRole: (id: number | string) => api.delete(`/api/admin/roles/${id}`),
  syncRolePermissions: (id: number | string, permissionNames: string[]) =>
    api.put(`/api/admin/roles/${id}/permissions`, { permission_names: permissionNames }),
  permissions: () => api.get("/api/admin/permissions"),

  // Admin Users
  adminUsers: (params?: { page?: number; per_page?: number; search?: string; department?: string }) =>
    api.get("/api/admin/admin-users", params as never),
  showAdminUser: (id: number | string) => api.get(`/api/admin/admin-users/${id}`),
  createAdminUser: (data: Record<string, unknown>) => api.post("/api/admin/admin-users", data),
  updateAdminUser: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/api/admin/admin-users/${id}`, data),
  deleteAdminUser: (id: number | string) => api.delete(`/api/admin/admin-users/${id}`),

  // Sensitive Words
  sensitiveWords: (params?: { page?: number; per_page?: number; category?: string; search?: string; is_active?: number }) =>
    api.get("/api/admin/sensitive-words", params as never),
  showSensitiveWord: (id: number | string) => api.get(`/api/admin/sensitive-words/${id}`),
  createSensitiveWord: (data: Record<string, unknown>) => api.post("/api/admin/sensitive-words", data),
  updateSensitiveWord: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/api/admin/sensitive-words/${id}`, data),
  deleteSensitiveWord: (id: number | string) => api.delete(`/api/admin/sensitive-words/${id}`),

  // Logs
  logs: (params?: {
    page?: number;
    per_page?: number;
    admin_id?: number;
    action?: string;
    start_date?: string;
    end_date?: string;
  }) => api.get("/api/admin/logs", params as never),

  // Settings
  systemSettings: () => api.get("/api/admin/settings/system"),
  updateSystemSettings: (settings: Record<string, string>) =>
    api.put("/api/admin/settings/system", { settings }),
};

// ===== User (Public & Supplier) API Endpoints =====

export interface BackendProduct {
  id: string;
  supplier_id: string;
  category_id: string | null;
  name: string;
  sku: string | null;
  /** ASIN-like product SKU code: `PT` + 8 chars (e.g. "PTJJUHG5T7"). */
  sku_code: string | null;
  specifications: string | null;
  description: string | null;
  price: string;
  unit: string;
  min_order_quantity: string;
  status: string;
  reject_reason: string | null;
  halal_cert_type: string | null;
  halal_cert_number: string | null;
  halal_cert_expiry: string | null;
  storage_conditions: string | null;
  shelf_life: string | null;
  origin: string | null;
  view_count: string;
  inquiry_count: string;
  created_at: string;
  updated_at: string;
  // Joined fields (public list/detail)
  supplier_name?: string;
  supplier_company?: string;
  /** Supplier user_code (e.g. "SRXXXXXXXX") — Amazon vendor-code style */
  supplier_code?: string;
  supplier_logo?: string | null;
  supplier_location?: string;
  supplier_tier?: string;
  category_name?: string;
  // Media fields (from product_media table)
  images?: string[];
  videos?: { url: string; thumbnail?: string; duration?: string; title?: string }[];
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: string;
  is_active: string;
}

export interface PaginatedProducts {
  data: BackendProduct[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const userApi = {
  // ===== Public: Categories =====
  getCategories: () => api.get<BackendCategory[]>("/api/categories"),

  // ===== Public: Products =====
  getProducts: (params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    search?: string;
    sort?: "newest" | "price_asc" | "price_desc";
  }) => api.get<PaginatedProducts>("/api/products", params as never),

  getProduct: (id: number | string) =>
    api.get<BackendProduct>(`/api/products/${id}`),

  // ===== Supplier: Own Products =====
  getMyProducts: (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
  }) => api.get<PaginatedProducts>("/api/supplier/products", params as never),

  // ===== Supplier: Create Product =====
  createProduct: (data: {
    name: string;
    sku?: string;
    category_id?: number;
    specifications?: string;
    description?: string;
    price: number;
    unit?: string;
    min_order_quantity?: number;
    status?: "draft" | "pending";
    halal_cert_type: string;
    halal_cert_number: string;
    halal_cert_expiry?: string;
    storage_conditions?: string;
    shelf_life?: string;
    origin?: string;
    images?: string[];
    videos?: { url: string; thumbnail?: string; duration?: string; title?: string }[];
  }) => api.post<BackendProduct>("/api/products", data),

  // ===== Supplier: Update Product =====
  updateProduct: (
    id: number | string,
    data: Record<string, unknown>
  ) => api.put<BackendProduct>(`/api/products/${id}`, data),

  // ===== Supplier: Delete Product (soft-delete → recycle bin, 30-day retention) =====
  deleteProduct: (id: number | string) =>
    api.delete<null>(`/api/products/${id}`),

  // ===== Supplier: Delist Product (approved → offline) =====
  unlistProduct: (id: number | string) =>
    api.patch<BackendProduct>(`/api/products/${id}/unlist`),

  // ===== Supplier: Restore from Recycle Bin (deleted → offline) =====
  restoreProduct: (id: number | string) =>
    api.patch<BackendProduct>(`/api/products/${id}/restore`),
};
