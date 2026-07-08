import { TrendingUp, TrendingDown, Minus, Package } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  productTrends,
  type ProductTrend,
  type TrendDataPoint,
  type TrendAnnotation,
} from "@/lib/data";

const trendConfig: Record<
  ProductTrend["trend"],
  { icon: typeof TrendingUp; color: string; bg: string; label: string; stroke: string; fill: string }
> = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "需求上升",
    stroke: "#059669",
    fill: "url(#grad-emerald)",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "需求下降",
    stroke: "#dc2626",
    fill: "url(#grad-red)",
  },
  stable: {
    icon: Minus,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "需求平稳",
    stroke: "#d97706",
    fill: "url(#grad-amber)",
  },
};

/* ---- SVG sparkline chart with key-node annotations ---- */

const CHART_W = 300;
const CHART_H = 120;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 18;
const PAD_B = 28;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

function buildAreaPath(points: { x: number; y: number }[], baseY: number) {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  const linePath = buildPath(points);
  return `${linePath} L ${last.x.toFixed(1)} ${baseY.toFixed(1)} L ${first.x.toFixed(1)} ${baseY.toFixed(1)} Z`;
}

function TrendChart({
  dataPoints,
  annotations,
  trend,
}: {
  dataPoints: TrendDataPoint[];
  annotations: TrendAnnotation[];
  trend: ProductTrend["trend"];
}) {
  if (dataPoints.length === 0) return null;

  const values = dataPoints.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;
  const stepX = PLOT_W / (dataPoints.length - 1);

  const pts = dataPoints.map((d, i) => ({
    x: PAD_L + i * stepX,
    y: PAD_T + PLOT_H - ((d.value - minVal) / valRange) * PLOT_H,
    rawVal: d.value,
    month: d.month,
  }));

  const baseY = PAD_T + PLOT_H;
  const linePath = buildPath(pts);
  const areaPath = buildAreaPath(pts, baseY);
  const config = trendConfig[trend];

  // Map annotation month -> point
  const annotationPoints = annotations
    .map((ann) => {
      const idx = dataPoints.findIndex((d) => d.month === ann.month);
      if (idx === -1) return null;
      return { ...pts[idx], label: ann.label, idx };
    })
    .filter(Boolean) as (typeof pts[0] & { label: string; idx: number })[];

  // Gradient id per trend direction
  const gradId = `grad-${trend}`;

  return (
    <div className="mt-3">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="走势图"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={config.stroke} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Subtle horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD_L}
            y1={PAD_T + PLOT_H * f}
            x2={PAD_L + PLOT_W}
            y2={PAD_T + PLOT_H * f}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border"
            strokeDasharray="2 3"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={config.fill} opacity="0.6" />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke={config.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point dots */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={annotationPoints.some((a) => a.idx === i) ? 4 : 2.5}
            fill="#fff"
            stroke={config.stroke}
            strokeWidth="1.5"
          />
        ))}

        {/* Annotation markers + labels */}
        {annotationPoints.map((ap, i) => {
          const aboveLine = ap.y > PAD_T + PLOT_H * 0.4;
          const labelY = aboveLine ? ap.y - 12 : ap.y + 18;
          const connectorY1 = aboveLine ? ap.y - 5 : ap.y + 5;
          const connectorY2 = aboveLine ? labelY + 4 : labelY - 8;
          return (
            <g key={i}>
              {/* Vertical dashed connector */}
              <line
                x1={ap.x}
                y1={connectorY1}
                x2={ap.x}
                y2={connectorY2}
                stroke={config.stroke}
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Key node ring */}
              <circle
                cx={ap.x}
                cy={ap.y}
                r="5.5"
                fill="none"
                stroke={config.stroke}
                strokeWidth="1.5"
                opacity="0.5"
              />
              {/* Value label */}
              <text
                x={ap.x}
                y={aboveLine ? ap.y - 7 : ap.y + 14}
                textAnchor="middle"
                className="fill-foreground"
                style={{ fontSize: "8px", fontWeight: 700 }}
              >
                {ap.rawVal}
              </text>
              {/* Annotation label — wrapped with background rect */}
              <rect
                x={ap.x - 42}
                y={labelY - 7}
                width="84"
                height="11"
                rx="2"
                fill={config.stroke}
                opacity="0.92"
              />
              <text
                x={ap.x}
                y={labelY + 1}
                textAnchor="middle"
                fill="#fff"
                style={{ fontSize: "7px", fontWeight: 600 }}
              >
                {ap.label.length > 12 ? ap.label.slice(0, 11) + "…" : ap.label}
              </text>
            </g>
          );
        })}

        {/* Month labels on x-axis */}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={baseY + 14}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "8px" }}
          >
            {p.month}
          </text>
        ))}
      </svg>

      {/* Annotation legend */}
      {annotationPoints.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 px-1">
          {annotationPoints.map((ap, i) => (
            <div
              key={i}
              className="flex items-center gap-1 text-[10px] text-muted-foreground"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: config.stroke }}
              />
              <span className="font-medium text-foreground/70">{ap.month}</span>
              <span>{ap.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductTrends() {
  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="热门供应产品架构走势"
          subtitle="基于平台询盘与出口数据，实时反映各大品类需求变化趋势"
        />

        {/* Independent scroll container */}
        <div className="max-h-[560px] overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {productTrends.map((trend) => {
              const config = trendConfig[trend.trend];
              const Icon = config.icon;
              return (
                <div
                  key={trend.id}
                  className="group bg-white rounded-xl border shadow-sm hover:shadow-md hover:border-brand-300 transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-colors">
                        <Package className="h-5 w-5 text-brand-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-snug">
                          {trend.productName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {trend.category}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${config.bg} ${config.color} text-xs font-semibold shrink-0`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {trend.changePercent}
                    </div>
                  </div>

                  {/* SVG sparkline trend chart */}
                  <TrendChart
                    dataPoints={trend.dataPoints}
                    annotations={trend.annotations}
                    trend={trend.trend}
                  />

                  <div className="space-y-2 pt-3 border-t mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">需求状况</span>
                      <span className="font-medium text-foreground">{trend.demand}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">主要市场</span>
                      <div className="flex gap-1">
                        {trend.regions.map((region) => (
                          <span
                            key={region}
                            className="px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded font-medium"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>滚动查看更多品类趋势 · 共 {productTrends.length} 个品类</span>
        </div>
      </div>
    </section>
  );
}
