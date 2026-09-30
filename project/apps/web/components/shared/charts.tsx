'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Download,
  Maximize2,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { chartColor } from '@/utils/format';
import { cn } from '@/lib/utils';
import { SectionCard } from './section-card';
import { ChartTooltip } from './chart-tooltip';

/* ------------------------------------------------------------------ */
/* Shared tooltip                                                     */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/* Chart container with toolbar                                       */
/* ------------------------------------------------------------------ */

export function ChartFrame({
  title,
  description,
  actions,
  children,
  height = 280,
  className,
  onExport,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  height?: number;
  className?: string;
  onExport?: () => void;
}) {
  const [fs, setFs] = useState(false);
  return (
    <>
      <SectionCard
        title={title}
        description={description}
        className={className}
        actions={
          <>
            {actions}
            {onExport && (
              <button
                onClick={onExport}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Export"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setFs(true)}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Fullscreen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </>
        }
        noPadding
      >
        <div style={{ height }} className="w-full px-2 pb-2 pt-4">
          {children}
        </div>
      </SectionCard>

      {fs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-6 backdrop-blur-xl"
          onClick={() => setFs(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card surface-highlight relative h-[80vh] w-full max-w-6xl overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFs(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-full w-full pt-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Trend area chart                                                   */
/* ------------------------------------------------------------------ */

export function TrendAreaChart({
  data,
  dataKey = 'value',
  compareKey,
  forecastKey,
  bandKey,
  color = 'chart-1',
  height = 280,
  valueFormat,
  labelFormat,
}: {
  data: Record<string, number | string | undefined>[];
  dataKey?: string;
  compareKey?: string;
  forecastKey?: string;
  bandKey?: { lower: string; upper: string };
  color?: string;
  height?: number;
  valueFormat?: (v: number) => string;
  labelFormat?: (v: string) => string;
}) {
  const stroke = chartColor(color);
  const id = `area-${dataKey}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={labelFormat}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v) => (valueFormat ? valueFormat(Number(v)) : String(v))}
        />
        <Tooltip content={<ChartTooltip valueFormat={valueFormat} />} />
        {bandKey && (
          <ReferenceArea
            y1={0}
            y2={0}
            fill="transparent"
          />
        )}
        {bandKey && (
          <Area
            type="monotone"
            dataKey={bandKey.upper}
            stroke="none"
            fill={stroke}
            fillOpacity={0.08}
            isAnimationActive
            animationDuration={800}
          />
        )}
        {bandKey && (
          <Area
            type="monotone"
            dataKey={bandKey.lower}
            stroke="none"
            fill="hsl(var(--background))"
            isAnimationActive
            animationDuration={800}
          />
        )}
        {compareKey && (
          <Area
            type="monotone"
            dataKey={compareKey}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            fill="none"
            isAnimationActive
            animationDuration={800}
            dot={false}
          />
        )}
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2.5}
          fill={`url(#${id})`}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
          dot={false}
          activeDot={{ r: 4, fill: stroke, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
        />
        {forecastKey && (
          <Line
            type="monotone"
            dataKey={forecastKey}
            stroke={stroke}
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Multi-line chart                                                   */
/* ------------------------------------------------------------------ */

export function MultiLineChart({
  data,
  lines,
  height = 280,
  valueFormat,
  labelFormat,
}: {
  data: Record<string, number | string>[];
  lines: { key: string; color: string; name: string }[];
  height?: number;
  valueFormat?: (v: number) => string;
  labelFormat?: (v: string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={labelFormat}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => (valueFormat ? valueFormat(Number(v)) : String(v))}
        />
        <Tooltip content={<ChartTooltip valueFormat={valueFormat} />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          formatter={(v) => <span className="text-muted-foreground">{v}</span>}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={chartColor(l.color)}
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
            animationDuration={800}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Bar chart                                                          */
/* ------------------------------------------------------------------ */

export function BarSeriesChart({
  data,
  dataKey = 'value',
  color = 'chart-1',
  height = 280,
  horizontal = false,
  valueFormat,
  labelKey = 'label',
}: {
  data: Record<string, number | string>[];
  dataKey?: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
  valueFormat?: (v: number) => string;
  labelKey?: string;
}) {
  const fill = chartColor(color);
  const id = `bar-${dataKey}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 12, bottom: 0, left: horizontal ? 8 : -8 }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.95} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.45} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.5}
          horizontal={!horizontal}
          vertical={horizontal}
        />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (valueFormat ? valueFormat(Number(v)) : String(v))}
            />
            <YAxis
              type="category"
              dataKey={labelKey}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={110}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={labelKey}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v) => (valueFormat ? valueFormat(Number(v)) : String(v))}
            />
          </>
        )}
        <Tooltip
          content={<ChartTooltip valueFormat={valueFormat} />}
          cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
        />
        <Bar
          dataKey={dataKey}
          fill={`url(#${id})`}
          radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
          isAnimationActive
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart                                                        */
/* ------------------------------------------------------------------ */

export function DonutChart({
  data,
  height = 260,
  valueFormat,
  innerRadius = 58,
  outerRadius = 92,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  valueFormat?: (v: number) => string;
  innerRadius?: number;
  outerRadius?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          stroke="hsl(var(--background))"
          strokeWidth={2}
          isAnimationActive
          animationDuration={900}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={chartColor(d.color)} />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltip
              valueFormat={valueFormat}
              labelSuffix={` · ${((data[0]?.value ?? 0) / total * 100).toFixed(0)}%`}
            />
          }
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          formatter={(v) => <span className="text-muted-foreground">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Heatmap (manual grid, not recharts)                               */
/* ------------------------------------------------------------------ */

export function Heatmap({
  data,
  rows,
  cols,
  color = 'chart-1',
  height = 220,
}: {
  data: number[][];
  rows: string[];
  cols: string[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.flat());
  const base = chartColor(color);
  return (
    <div style={{ height }} className="w-full overflow-hidden">
      <div className="flex h-full flex-col gap-1.5">
        <div className="flex gap-1.5 pl-[60px] text-[9px] text-muted-foreground">
          {cols.map((c, i) => (
            <div key={i} className="flex-1 text-center">
              {i % 3 === 0 ? c : ''}
            </div>
          ))}
        </div>
        {data.map((row, ri) => (
          <div key={ri} className="flex flex-1 items-center gap-1.5">
            <div className="w-[56px] shrink-0 text-[10px] font-medium text-muted-foreground">
              {rows[ri]}
            </div>
            <div className="flex flex-1 gap-1.5">
              {row.map((v, ci) => {
                const intensity = Math.max(0.12, v / max);
                return (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ri * 0.02 + ci * 0.003, duration: 0.3 }}
                    className="group relative flex-1 rounded-[3px] ring-1 ring-inset ring-black/5 transition-all hover:ring-2 hover:ring-black/20"
                    style={{
                      backgroundColor: `${base}${Math.round(intensity * 255)
                        .toString(16)
                        .padStart(2, '0')}`,
                      minHeight: 14,
                    }}
                    title={`${rows[ri]} ${cols[ci]} — ${v}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress ring (circular gauge)                                     */
/* ------------------------------------------------------------------ */

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = 'chart-1',
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const fill = chartColor(color);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${fill}66)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-semibold tabular-nums text-foreground">{label ?? value}</span>
        {sublabel && (
          <span className="text-[10px] text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
