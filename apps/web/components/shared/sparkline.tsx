'use client';

import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { chartColor } from '@/utils/format';
import { Trend } from '@/types';

type Props = {
  data: number[];
  trend?: Trend;
  color?: string;
  height?: number;
};

/** Minimal inline sparkline used inside KPI cards. */
export function Sparkline({ data, trend, color = 'chart-1', height = 40 }: Props) {
  const stroke =
    color === 'chart-1'
      ? trend === 'down'
        ? 'hsl(var(--destructive))'
        : trend === 'up'
          ? 'hsl(var(--success))'
          : 'hsl(var(--muted-foreground))'
      : chartColor(color);

  const chartData = data.map((v, i) => ({ i, v }));
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${id})`}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
