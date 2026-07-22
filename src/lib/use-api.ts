"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ApiError } from "./api-client";

// ===== Types =====

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions {
  /** Skip initial fetch (call refetch manually) */
  skip?: boolean;
  /** Dependencies to refetch on change */
  deps?: unknown[];
}

// ===== useApiQuery =====

/**
 * Generic data fetching hook with loading/error states.
 *
 * @param fetcher Async function that returns data
 * @param options Configuration options
 * @returns { data, loading, error, refetch }
 *
 * @example
 * const { data, loading, error } = useApiQuery(() => adminApi.dashboardStats());
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { skip = false, deps = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(true);

  // Update fetcher ref without triggering re-render
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "数据加载失败";
        setError(message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!skip) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);

  return { data, loading, error, refetch: execute };
}

// ===== useApiMutation =====

interface UseMutationState<T, P = unknown> {
  mutate: (params: P) => Promise<T>;
  loading: boolean;
  error: string | null;
  data: T | null;
  reset: () => void;
}

/**
 * Generic mutation hook for create/update/delete operations.
 *
 * @param mutator Async function that performs the mutation
 * @returns { mutate, loading, error, data, reset }
 *
 * @example
 * const { mutate: approveProduct, loading } = useApiMutation((id) => adminApi.approveProduct(id));
 */
export function useApiMutation<T, P = unknown>(
  mutator: (params: P) => Promise<T>
): UseMutationState<T, P> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const mutatorRef = useRef(mutator);

  mutatorRef.current = mutator;

  const mutate = useCallback(async (params: P): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutatorRef.current(params);
      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "操作失败";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, data, reset };
}

// ===== useApiPaginated =====

interface PaginatedState<T> extends UseApiState<T[]> {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
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

/**
 * Paginated data fetching hook.
 *
 * @param fetcher Function that takes (page, perPage) and returns paginated data
 * @param initialPerPage Items per page (default 10)
 * @param options Additional options
 *
 * @example
 * const { data, page, total, setPage, loading } = useApiPaginated(
 *   (page, perPage) => adminApi.products({ page, per_page: perPage })
 * );
 */
export function useApiPaginated<T>(
  fetcher: (page: number, perPage: number) => Promise<PaginatedResponse<T>>,
  initialPerPage: number = 10,
  options: UseApiOptions = {}
): PaginatedState<T> {
  const { skip = false, deps = [] } = options;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(true);

  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current(page, perPage);
      if (mountedRef.current) {
        setData(result.data);
        setTotal(result.meta?.total ?? 0);
        setLastPage(result.meta?.last_page ?? 1);
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "数据加载失败";
        setError(message);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  useEffect(() => {
    mountedRef.current = true;
    if (!skip) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, skip, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    page,
    perPage,
    total,
    lastPage,
    setPage,
    setPerPage,
  };
}

// ===== Export PaginatedResponse type for consumers =====

export type { PaginatedResponse };
