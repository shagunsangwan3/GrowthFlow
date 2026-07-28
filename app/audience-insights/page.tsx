'use client';

import { motion } from 'framer-motion';
import {
  UserSearch,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  UserPlus,
  Download,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { BarSeriesChart, DonutChart } from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import { AUDIENCE_SEGMENTS, AUDIENCE_PERFORMANCE } from '@/services/mock-data';
import { formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AudienceInsightsPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Audience Insights"
        description="Understand who converts, who to target next, and where to expand."
        icon={UserSearch}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Create audience</Button>
          </>
        }
      />

      {/* AI recommendation banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6 overflow-hidden rounded-2xl border border-primary/20">
        <div className="absolute inset-0 bg-ai-gradient-soft" />
        <div className="relative flex items-start gap-3 p-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm"><Sparkles className="h-4 w-4" /></span>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-foreground">Lookalike 1% is your biggest growth opportunity</p>
            <p className="text-[12px] text-muted-foreground">This segment grew 22% this month with 5.2x ROAS. Expanding to Lookalike 2-3% could unlock +$6.4k/wk revenue.</p>
          </div>
          <Button size="sm" variant="outline" className="border-primary/30 bg-background/40 backdrop-blur">Expand audience</Button>
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Conversions by Segment" description="Which audiences drive results" delay={0.05}>
          <BarSeriesChart data={AUDIENCE_PERFORMANCE.map((a) => ({ label: a.segment, value: a.conversions }))} color="chart-1" horizontal height={300} valueFormat={(v) => formatNumber(v)} />
        </SectionCard>

        <SectionCard title="ROAS by Segment" description="Efficiency across audiences" delay={0.1}>
          <DonutChart data={AUDIENCE_PERFORMANCE.map((a, i) => ({ name: a.segment, value: Math.round(a.roas * 100), color: `chart-${(i % 7) + 1}` }))} height={300} valueFormat={(v) => `${(v / 100).toFixed(1)}x`} />
        </SectionCard>
      </div>

      {/* Segment cards */}
      <div className="mt-4">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Audience Segments</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE_SEGMENTS.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover surface-highlight p-4">
              <div className="flex items-start justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-ai-gradient-soft text-primary"><Users className="h-4 w-4" /></span>
                <StatusBadge variant={s.growth > 15 ? 'success' : s.growth > 5 ? 'info' : 'neutral'} dot>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +{s.growth}%</span>
                </StatusBadge>
              </div>
              <p className="mt-3 text-[13.5px] font-medium text-foreground">{s.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{formatNumber(s.size, true)} size · {s.match}% match</p>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Conversions</p>
                  <p className="text-[14px] font-semibold tabular-nums text-foreground">{formatNumber(s.conversions)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">ROAS</p>
                  <p className={cn('text-[14px] font-semibold tabular-nums', s.roas >= 6 ? 'text-success' : 'text-foreground')}>{s.roas}x</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
