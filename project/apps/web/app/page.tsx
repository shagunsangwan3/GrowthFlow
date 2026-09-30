'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Activity,
  CheckCircle2,
  Cpu,
  ClipboardCheck,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { KpiCard } from '@/components/shared/kpi-card';
import { SectionCard } from '@/components/shared/section-card';
import {
  TrendAreaChart,
  DonutChart,
  ProgressRing,
  BarSeriesChart,
  Heatmap,
  ChartFrame,
} from '@/components/shared/charts';
import {
  StatusBadge,
  RiskBadge,
  AiScoreBadge,
  CampaignStatusBadge,
} from '@/components/shared/status-badge';
import {
  KPIS,
  REVENUE_TREND,
  SPEND_TREND,
  BUDGET_ALLOCATION,
  FORECAST,
  RISK_FACTORS,
  AI_RECOMMENDATIONS,
  AUTOMATION_STATUS,
  ACTIVITIES,
  CAMPAIGNS,
  HOURLY_HEATMAP,
} from '@/services/mock-data';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const activityIcon = {
  ai: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/12' },
  campaign: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/12' },
  approval: { icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/12' },
  automation: { icon: Cpu, color: 'text-secondary', bg: 'bg-secondary/12' },
  system: { icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted' },
  team: { icon: ShieldCheck, color: 'text-success', bg: 'bg-success/12' },
};

const riskLevelMap = {
  low: { variant: 'success' as const, icon: CheckCircle2 },
  medium: { variant: 'warning' as const, icon: AlertTriangle },
  high: { variant: 'danger' as const, icon: AlertTriangle },
};

export default function DashboardPage() {
  const topCampaigns = [...CAMPAIGNS]
    .filter((c) => c.status === 'active')
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 4);
  const lowCampaigns = [...CAMPAIGNS]
    .filter((c) => c.spend > 0)
    .sort((a, b) => a.roas - b.roas)
    .slice(0, 3);

  return (
    <DashboardShell>
      <PageHeader
        title="Welcome back, Alex"
        description="Here's your growth overview for Northwind Labs — Tuesday, July 26."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Last 30 days
            </Button>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI
            </Button>
          </>
        }
      />

      {/* Hero AI summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-6 overflow-hidden rounded-2xl border border-primary/20"
      >
        <div className="absolute inset-0 bg-ai-gradient-soft" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/40 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" /> Today's AI Summary
            </div>
            <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
              Your accounts grew{' '}
              <span className="text-gradient-ai">23.8% this month</span>, driven by
              Brand Search and Retargeting. 12 AI actions are awaiting your approval.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              GrowthFlow AI made 142 optimizations overnight — pausing 14 wasteful
              keywords, scaling 2 winning campaigns, and flagging a budget risk. Revenue
              is pacing 18% above target with 6 days remaining.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button size="sm" className="gap-1.5">
                <ClipboardCheck className="h-3.5 w-3.5" /> Review 12 approvals
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 border-primary/30 bg-background/40 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Open AI Assistant
              </Button>
            </div>
          </div>

          {/* Health scores */}
          <div className="flex shrink-0 gap-3">
            <HealthGauge label="Business Health" value={87} color="chart-1" sublabel="Excellent" />
            <HealthGauge label="Optimization" value={92} color="chart-3" sublabel="Optimized" />
            <HealthGauge label="Campaign Health" value={76} color="chart-4" sublabel="Good" />
          </div>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.slice(0, 8).map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Main charts row */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartFrame
          title="Revenue Trend"
          description="Daily revenue vs last month, with 7-day forecast"
          className="xl:col-span-2"
          height={300}
          onExport={() => {}}
          actions={<StatusBadge variant="success" dot>+23.8%</StatusBadge>}
        >
          <TrendAreaChart
            data={REVENUE_TREND}
            dataKey="value"
            compareKey="compare"
            forecastKey="forecast"
            bandKey={{ lower: 'lower', upper: 'upper' }}
            color="chart-2"
            valueFormat={(v) => formatCurrency(v, true)}
          />
        </ChartFrame>

        <ChartFrame
          title="Budget Allocation"
          description="Spend by campaign type this month"
          height={300}
          onExport={() => {}}
        >
          <DonutChart
            data={BUDGET_ALLOCATION}
            valueFormat={(v) => formatCurrency(v, true)}
          />
        </ChartFrame>
      </div>

      {/* Second row: forecast + risk */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartFrame
          title="Revenue Forecast"
          description="12-month prediction with confidence band"
          className="lg:col-span-2"
          height={280}
          onExport={() => {}}
          actions={
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-4 rounded-sm bg-secondary/40" /> Confidence
            </div>
          }
        >
          <TrendAreaChart
            data={FORECAST}
            dataKey="forecast"
            forecastKey="actual"
            bandKey={{ lower: 'lower', upper: 'upper' }}
            color="chart-1"
            valueFormat={(v) => formatCurrency(v, true)}
          />
        </ChartFrame>

        <SectionCard title="Risk Analysis" description="Active risks detected by AI" delay={0.05}>
          <div className="space-y-3">
            {RISK_FACTORS.map((r, i) => {
              const rm = riskLevelMap[r.level];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3"
                >
                  <span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', rm.variant === 'danger' ? 'bg-destructive/12 text-destructive' : rm.variant === 'warning' ? 'bg-warning/12 text-warning' : 'bg-success/12 text-success')}>
                    <rm.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">{r.label}</p>
                      <RiskBadge risk={r.level} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">{r.detail}</p>
                    <p className="text-[11px] text-muted-foreground/70">Impact: {r.impact}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Third row: AI recommendations + approval queue */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="AI Recommendations"
          description="Top opportunities ranked by impact"
          delay={0.05}
          actions={<Button variant="ghost" size="sm" className="gap-1 text-xs">View all <ChevronRight className="h-3 w-3" /></Button>}
        >
          <div className="space-y-2.5">
            {AI_RECOMMENDATIONS.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3.5 transition-all hover:border-primary/30 hover:bg-card/70"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-gradient-soft text-primary">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13.5px] font-medium text-foreground">{rec.title}</p>
                    <StatusBadge variant="neutral">{rec.category}</StatusBadge>
                  </div>
                  <p className="text-[12px] font-medium text-success">{rec.impact}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> {rec.confidence}% confidence
                  </div>
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px] opacity-80 group-hover:opacity-100">
                    Approve
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        {/* Spend trend + automation status */}
        <div className="space-y-4">
          <ChartFrame
            title="Spend Trend"
            description="Daily spend vs last month"
            height={220}
            onExport={() => {}}
          >
            <TrendAreaChart
              data={SPEND_TREND}
              dataKey="value"
              compareKey="compare"
              color="chart-5"
              height={220}
              valueFormat={(v) => formatCurrency(v, true)}
            />
          </ChartFrame>

          <SectionCard title="Automation Status" description="AI automations running today" delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {AUTOMATION_STATUS.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="rounded-xl border border-border/60 bg-card/40 p-3"
                >
                  <p className="text-[11px] text-muted-foreground">{a.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                    {a.format === 'percent' ? formatPercent(a.value) : a.total ? `${a.value}/${a.total}` : formatNumber(a.value)}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Top + low performing campaigns */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Top Performing Campaigns"
          description="Highest ROAS this period"
          delay={0.05}
          actions={<Button variant="ghost" size="sm" className="gap-1 text-xs">All campaigns <ChevronRight className="h-3 w-3" /></Button>}
        >
          <div className="space-y-2">
            {topCampaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-card/70"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-success/12 text-sm font-semibold text-success">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatCurrency(c.spend, true)} spend · {formatNumber(c.conversions)} conv.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">ROAS</p>
                    <p className="text-sm font-semibold tabular-nums text-success">{c.roas}x</p>
                  </div>
                  <AiScoreBadge score={c.aiScore} />
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Low Performing Campaigns"
          description="Needs attention — flagged by AI"
          delay={0.1}
        >
          <div className="space-y-2">
            {lowCampaigns.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-card/70"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/12 text-sm font-semibold text-destructive">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatCurrency(c.spend, true)} spend · CTR {c.ctr}%</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">ROAS</p>
                    <p className="text-sm font-semibold tabular-nums text-destructive">{c.roas}x</p>
                  </div>
                  <AiScoreBadge score={c.aiScore} />
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Heatmap + activity */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartFrame
          title="Hourly Performance Heatmap"
          description="Conversion intensity by day & hour"
          className="lg:col-span-2"
          height={260}
          onExport={() => {}}
        >
          <Heatmap
            data={HOURLY_HEATMAP}
            rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            cols={Array.from({ length: 24 }, (_, i) => `${i}h`)}
            color="chart-1"
            height={240}
          />
        </ChartFrame>

        <SectionCard title="Recent Activity" description="Latest events across your workspace" delay={0.05}>
          <div className="no-scrollbar max-h-[300px] space-y-3 overflow-y-auto pr-1">
            {ACTIVITIES.map((a, i) => {
              const cfg = activityIcon[a.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', cfg.bg, cfg.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {i < ACTIVITIES.length - 1 && <span className="mt-1 w-px flex-1 bg-border/60" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5 pb-1">
                    <p className="text-[12.5px] font-medium leading-snug text-foreground">{a.title}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{a.description}</p>
                    <p className="text-[10px] text-muted-foreground/60">{a.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Quick actions footer */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'New Campaign', icon: TrendingUp, hint: 'Launch in minutes' },
          { label: 'Ask AI Assistant', icon: Sparkles, hint: 'Get instant insights' },
          { label: 'Generate Report', icon: ArrowUpRight, hint: 'Export & share' },
          { label: 'Audit Landing Page', icon: ShieldCheck, hint: 'AI-powered review' },
        ].map((q, i) => (
          <motion.button
            key={q.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            whileHover={{ y: -2 }}
            className="group glass-card glass-card-hover flex items-center gap-3 p-4 text-left"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-gradient-soft text-primary transition-transform group-hover:scale-110">
              <q.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-medium text-foreground">{q.label}</p>
              <p className="text-[11px] text-muted-foreground">{q.hint}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </DashboardShell>
  );
}

function HealthGauge({ label, value, color, sublabel }: { label: string; value: number; color: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur">
      <ProgressRing value={value} size={88} stroke={8} color={color} label={`${value}`} sublabel="/100" />
      <div className="text-center">
        <p className="text-[11px] font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  );
}
