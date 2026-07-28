'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  Download,
  SlidersHorizontal,
  GitCompare,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import {
  TrendAreaChart,
  MultiLineChart,
  BarSeriesChart,
  DonutChart,
  ChartFrame,
} from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  SPEND_TREND,
  REVENUE_TREND,
  CONVERSION_TREND,
  CTR_TREND,
  ROAS_TREND,
  COUNTRY_PERFORMANCE,
  DEVICE_PERFORMANCE,
  AUDIENCE_PERFORMANCE,
  AUDIENCE_SEGMENTS,
  BUDGET_ALLOCATION,
  FUNNEL_STAGES,
} from '@/services/mock-data';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'audience', label: 'Audience' },
  { id: 'geo', label: 'Geography' },
  { id: 'devices', label: 'Devices' },
  { id: 'funnel', label: 'Funnel' },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState('overview');
  const [compare, setCompare] = useState(false);

  return (
    <DashboardShell>
      <PageHeader
        title="Analytics"
        description="Deep performance insights across every campaign, channel, and audience."
        icon={BarChart3}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Last 30 days
            </Button>
            <Button variant="outline" size="sm" className={cn('gap-1.5', compare && 'border-primary/40 text-primary')} onClick={() => setCompare((v) => !v)}>
              <GitCompare className="h-3.5 w-3.5" /> Compare
            </Button>
            <Button size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 border-b border-border/60">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'relative px-3.5 py-2.5 text-[13px] font-medium transition-colors',
              tab === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="analytics-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* AI insights banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-5 overflow-hidden rounded-2xl border border-primary/20"
      >
        <div className="absolute inset-0 bg-ai-gradient-soft" />
        <div className="relative flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-foreground">AI detected 2 anomalies worth your attention</p>
              <p className="text-[12px] text-muted-foreground">Mobile CTR dropped 0.4pts on Non-Brand Search · CPA spiked 18% on Display. Both flagged for review.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-primary/30 bg-background/40 backdrop-blur">Investigate</Button>
        </div>
      </motion.div>

      {tab === 'overview' && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartFrame title="Spend Trend" description="Daily spend vs comparison period" height={280} onExport={() => {}}>
              <TrendAreaChart data={SPEND_TREND} dataKey="value" compareKey={compare ? 'compare' : undefined} color="chart-5" valueFormat={(v) => formatCurrency(v, true)} />
            </ChartFrame>
            <ChartFrame title="Revenue Trend" description="Daily revenue with forecast" height={280} onExport={() => {}}>
              <TrendAreaChart data={REVENUE_TREND} dataKey="value" compareKey={compare ? 'compare' : undefined} color="chart-2" valueFormat={(v) => formatCurrency(v, true)} />
            </ChartFrame>
            <ChartFrame title="Conversion Trend" description="Daily conversions" height={280} onExport={() => {}}>
              <TrendAreaChart data={CONVERSION_TREND} dataKey="value" compareKey={compare ? 'compare' : undefined} color="chart-4" valueFormat={(v) => formatNumber(v)} />
            </ChartFrame>
            <ChartFrame title="CTR Trend" description="Click-through rate over time" height={280} onExport={() => {}}>
              <TrendAreaChart data={CTR_TREND} dataKey="value" color="chart-3" valueFormat={(v) => formatPercent(v)} />
            </ChartFrame>
          </div>
          <ChartFrame title="ROAS Trend" description="Return on ad spend over time" height={300} onExport={() => {}}>
            <TrendAreaChart data={ROAS_TREND} dataKey="value" color="chart-1" valueFormat={(v) => `${v.toFixed(2)}x`} height={300} />
          </ChartFrame>
        </div>
      )}

      {tab === 'audience' && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartFrame title="Audience Performance" description="Conversions by segment" height={300} onExport={() => {}}>
            <BarSeriesChart data={AUDIENCE_PERFORMANCE.map((a) => ({ label: a.segment, value: a.conversions }))} color="chart-1" horizontal valueFormat={(v) => formatNumber(v)} />
          </ChartFrame>
          <SectionCard title="Segment Breakdown" description="ROAS & match rate per audience" delay={0.05}>
            <div className="space-y-2">
              {AUDIENCE_SEGMENTS.map((a, i) => (
                <motion.div key={a.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatNumber(a.size, true)} size · {a.match}% match</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">ROAS</p>
                    <p className={cn('text-sm font-semibold tabular-nums', a.roas >= 6 ? 'text-success' : 'text-foreground')}>{a.roas}x</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'geo' && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartFrame title="Conversions by Country" description="Top performing geographies" height={340} onExport={() => {}}>
            <BarSeriesChart data={COUNTRY_PERFORMANCE.map((c) => ({ label: c.flag, value: c.conversions }))} color="chart-1" valueFormat={(v) => formatNumber(v)} />
          </ChartFrame>
          <SectionCard title="Country Performance" description="Detailed breakdown by region" delay={0.05}>
            <div className="space-y-2">
              {COUNTRY_PERFORMANCE.map((c, i) => (
                <motion.div key={c.country} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-muted text-[10px] font-bold text-foreground">{c.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">{c.country}</p>
                    <p className="text-[11px] text-muted-foreground">{formatNumber(c.conversions)} conv · {formatCurrency(c.spend, true)} spend</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">ROAS</p>
                    <p className="text-sm font-semibold tabular-nums text-success">{c.roas}x</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'devices' && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartFrame title="Spend by Device" description="Budget distribution across devices" height={280} onExport={() => {}}>
            <DonutChart data={DEVICE_PERFORMANCE.map((d, i) => ({ name: d.device, value: d.spend, color: `chart-${i + 1}` }))} valueFormat={(v) => formatCurrency(v, true)} />
          </ChartFrame>
          <SectionCard title="Device Performance" description="Clicks, conversions & share" delay={0.05}>
            <div className="space-y-2">
              {DEVICE_PERFORMANCE.map((d, i) => (
                <motion.div key={d.device} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-border/60 bg-card/40 p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-foreground">{d.device}</p>
                    <StatusBadge variant="info">{d.share}% share</StatusBadge>
                  </div>
                  <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
                    <span>{formatNumber(d.clicks)} clicks</span>
                    <span>{formatNumber(d.conversions)} conv</span>
                    <span>{formatCurrency(d.spend, true)} spend</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === 'funnel' && (
        <div className="mt-5">
          <SectionCard title="Marketing Funnel" description="From impression to conversion" delay={0.05}>
            <div className="space-y-2">
              {FUNNEL_STAGES.map((s, i) => {
                const width = (s.value / FUNNEL_STAGES[0].value) * 100;
                return (
                  <motion.div key={s.stage} initial={{ opacity: 0, scaleX: 0.8 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.08 }} className="space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-medium text-foreground">{s.stage}</span>
                      <span className="tabular-nums text-muted-foreground">{formatNumber(s.value)}</span>
                    </div>
                    <div className="h-9 overflow-hidden rounded-lg bg-muted/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: i * 0.08 + 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('h-full rounded-lg bg-gradient-to-r from-primary/80 to-primary/40')}
                        style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--${s.color}) / 0.9), hsl(var(--${s.color}) / 0.5))` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
              {[
                { l: 'Overall CVR', v: '0.40%' },
                { l: 'Click CVR', v: '9.02%' },
                { l: 'Visit CVR', v: '10.4%' },
                { l: 'Lead → Conv', v: '50.3%' },
              ].map((m) => (
                <div key={m.l} className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">{m.l}</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{m.v}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </DashboardShell>
  );
}
