'use client';

import { motion } from 'framer-motion';
import {
  FileSearch,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { ProgressRing } from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import { LANDING_AUDITS } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const statusMap = {
  excellent: { variant: 'success' as const, label: 'Excellent', color: 'chart-4' },
  good: { variant: 'info' as const, label: 'Good', color: 'chart-1' },
  fair: { variant: 'warning' as const, label: 'Fair', color: 'chart-5' },
  'needs-work': { variant: 'danger' as const, label: 'Needs Work', color: 'chart-6' },
};

const commonIssues = [
  { issue: 'Above-the-fold CTA missing', severity: 'high', pages: 2 },
  { issue: 'Images not optimized (LCP > 2.5s)', severity: 'medium', pages: 3 },
  { issue: 'Mobile layout shift detected', severity: 'medium', pages: 1 },
  { issue: 'Form fields too many (5+)', severity: 'low', pages: 2 },
  { issue: 'Missing trust signals', severity: 'low', pages: 4 },
];

export default function LandingAuditPage() {
  const avgScore = Math.round(LANDING_AUDITS.reduce((s, a) => s + a.score, 0) / LANDING_AUDITS.length);

  return (
    <DashboardShell>
      <PageHeader
        title="Landing Page Audit"
        description="AI-powered analysis of your landing pages for conversion, speed, and UX."
        icon={FileSearch}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Re-audit all</Button>
            <Button size="sm" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Audit new page</Button>
          </>
        }
      />

      {/* Overview */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Average Score" description="Across all audited pages" delay={0.05} className="flex items-center justify-center">
          <ProgressRing value={avgScore} size={140} stroke={12} color="chart-1" label={`${avgScore}`} sublabel="out of 100" />
        </SectionCard>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {[
            { label: 'Pages Audited', value: LANDING_AUDITS.length, icon: FileSearch, tone: 'bg-primary/12 text-primary' },
            { label: 'Excellent Pages', value: LANDING_AUDITS.filter((a) => a.status === 'excellent').length, icon: CheckCircle2, tone: 'bg-success/12 text-success' },
            { label: 'Issues Found', value: LANDING_AUDITS.reduce((s, a) => s + a.issues, 0), icon: AlertTriangle, tone: 'bg-warning/12 text-warning' },
            { label: 'Avg Load Time', value: `${(LANDING_AUDITS.reduce((s, a) => s + a.loadTime, 0) / LANDING_AUDITS.length).toFixed(1)}s`, icon: Clock, tone: 'bg-accent/12 text-accent' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover surface-highlight p-4">
              <span className={cn('grid h-9 w-9 place-items-center rounded-lg', s.tone)}><s.icon className="h-4 w-4" /></span>
              <p className="mt-3 text-[11px] text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audited pages */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Audited Pages" description="Detailed scores per landing page" delay={0.05} noPadding>
            <div className="divide-y divide-border/40">
              {LANDING_AUDITS.map((a, i) => {
                const sm = statusMap[a.status];
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 px-5 py-4">
                    <ProgressRing value={a.score} size={56} stroke={6} color={sm.color} label={`${a.score}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-foreground">{a.url}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.loadTime}s load</span>
                        <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {a.issues} issues</span>
                        <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {a.conversions}% CVR</span>
                      </div>
                    </div>
                    <StatusBadge variant={sm.variant} dot>{sm.label}</StatusBadge>
                  </motion.div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Common Issues" description="AI-detected patterns" delay={0.1}>
          <div className="space-y-2.5">
            {commonIssues.map((c, i) => (
              <motion.div key={c.issue} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/40 p-3">
                <span className={cn('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg', c.severity === 'high' ? 'bg-destructive/12 text-destructive' : c.severity === 'medium' ? 'bg-warning/12 text-warning' : 'bg-muted text-muted-foreground')}>
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1">
                  <p className="text-[12.5px] font-medium leading-tight text-foreground">{c.issue}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{c.pages} {c.pages === 1 ? 'page' : 'pages'} affected · {c.severity} severity</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
