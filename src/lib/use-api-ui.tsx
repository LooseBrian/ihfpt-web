"use client";

/**
 * UI helper components for data fetching states.
 *
 * This file is separated from use-api.ts to comply with Fast Refresh requirements:
 * React components (with JSX) should not share a file with non-component exports
 * (like hooks), otherwise Fast Refresh performs a full reload instead of hot
 * module replacement.
 */

export function LoadingSpinner({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">加载失败</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "暂无数据",
  description = "还没有任何数据记录",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {action}
      </div>
    </div>
  );
}
