'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus, Sparkles } from 'lucide-react';
import { Kpi } from '@/types';
import { formatValue } from '@/utils/format';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './animated-number';
import { Sparkline } from './sparkline';

const statusStyles: Record<
  Kpi['status'],
  { ring: string; text: string; bg: string; glow: string }
> = {
  positive: {
    ring: 'ring-success/30',
    text: 'text-success',
    bg: 'bg-success/10',
    glow: 'group-hover:shadow-[0_0_28px_-6px_hsl(152_67%_50%/0.35)]',
  },
  negative: {
    ring: 'ring-destructive/30',
    text: 'text-destructive',
    bg: 'bg-destructive/10',
    glow: 'group-hover:shadow-[0_0_28px_-6px_hsl(0_72%_58%/0.35)]',
  },
  warning: {
    ring: 'ring-warning/30',
    text: 'text-warning',
    bg: 'bg-warning/10',
    glow: 'group-hover:shadow-[0_0_28px_-6px_hsl(32_95%_56%/0.35)]',
  },
  neutral: {
    ring: 'ring-primary/20',
    text: 'text-primary',
    bg: 'bg-primary/10',
    glow: 'group-hover:shadow-[0_0_28px_-6px_hsl(217_91%_60%/0.3)]',
  },
};

export function KpiCard({ kpi, index = 0 }: { kpi: Kpi; index?: number }) {
  const s = statusStyles[kpi.status];
  const TrendIcon =
    kpi.trend === 'up' ? ArrowUpRight : kpi.trend === 'down' ? ArrowDownRight : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group glass-card glass-card-hover surface-highlight relative overflow-hidden p-5',
        s.glow
      )}
    >
      {/* hover sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-x-10 -top-10 h-24 bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
      </div>

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-muted-foreground">{kpi.label}</p>
          <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            <AnimatedNumber
              value={kpi.value}
              format={(v) => formatValue(v, kpi.format, kpi.format === 'currency' || kpi.format === 'number')}
            />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1',
            s.bg,
            s.text,
            s.ring
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {Math.abs(kpi.delta)}%
        </div>
      </div>

      <div className="relative mt-3 -mb-1">
        <Sparkline data={kpi.sparkline} trend={kpi.trend} />
      </div>

      <div className="relative mt-3 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">
          {kpi.compareLabel ?? 'vs last period'}
        </span>
        <span className="font-medium text-foreground/70 tabular-nums">
          {formatValue(
            kpi.compareValue ?? kpi.value,
            kpi.format,
            kpi.format === 'currency' || kpi.format === 'number'
          )}
        </span>
      </div>

      {kpi.insight && (
        <div className="relative mt-3 flex items-start gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <span className="leading-relaxed">{kpi.insight}</span>
        </div>
      )}
    </motion.div>
  );
}
