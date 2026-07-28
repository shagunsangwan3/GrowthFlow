'use client';

import { motion } from 'framer-motion';
import {
  Users2,
  TrendingUp,
  TrendingDown,
  Minus,
  Swords,
  Eye,
  Download,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { MultiLineChart, BarSeriesChart } from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import { COMPETITORS, COMPETITOR_TIMELINE } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const threatMap = {
  high: { variant: 'danger' as const, label: 'High Threat' },
  medium: { variant: 'warning' as const, label: 'Medium Threat' },
  low: { variant: 'success' as const, label: 'Low Threat' },
};

export default function CompetitorAnalysisPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Competitor Analysis"
        description="Track share of voice, keyword overlap, and positioning against your rivals."
        icon={Users2}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Add competitor</Button>
          </>
        }
      />

      {/* AI insight banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6 overflow-hidden rounded-2xl border border-primary/20">
        <div className="absolute inset-0 bg-ai-gradient-soft" />
        <div className="relative flex items-start gap-3 p-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm"><Swords className="h-4 w-4" /></span>
          <div>
            <p className="text-[13px] font-semibold text-foreground">Agilink is gaining share of voice — up 4pts in 12 weeks</p>
            <p className="text-[12px] text-muted-foreground">They raised bids on 8 shared keywords. Consider conquesting ad copy and increasing brand defense budget.</p>
          </div>
        </div>
      </motion.div>

      {/* Share of voice timeline */}
      <div className="mt-4">
        <SectionCard title="Share of Voice Over Time" description="Weekly SOV trend — you vs competitors" delay={0.05}>
          <MultiLineChart
            data={COMPETITOR_TIMELINE}
            lines={[
              { key: 'you', color: 'chart-1', name: 'You' },
              { key: 'agilink', color: 'chart-6', name: 'Agilink' },
              { key: 'marketwave', color: 'chart-2', name: 'MarketWave' },
              { key: 'adforge', color: 'chart-5', name: 'AdForge' },
            ]}
            height={300}
          />
        </SectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Competitor list */}
        <SectionCard title="Competitor Roster" description="Threat level & overlap" delay={0.05} className="lg:col-span-2" noPadding>
          <div className="divide-y divide-border/40">
            {COMPETITORS.map((c, i) => {
              const ChangeIcon = c.change > 0 ? TrendingUp : c.change < 0 ? TrendingDown : Minus;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 px-5 py-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-gradient-soft text-sm font-bold text-primary">{c.name.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-foreground">{c.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{c.keywords} tracked keywords</span>
                      <span>{c.overlap} overlap with you</span>
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] text-muted-foreground">Share of Voice</p>
                    <p className="text-base font-semibold tabular-nums text-foreground">{c.sov}%</p>
                  </div>
                  <div className={cn('flex items-center gap-1 text-[12px] font-medium', c.change > 0 ? 'text-destructive' : c.change < 0 ? 'text-success' : 'text-muted-foreground')}>
                    <ChangeIcon className="h-3.5 w-3.5" /> {Math.abs(c.change)}pts
                  </div>
                  <StatusBadge variant={threatMap[c.threat].variant}>{threatMap[c.threat].label}</StatusBadge>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        {/* SOV distribution */}
        <SectionCard title="SOV Distribution" description="Current market share" delay={0.1}>
          <BarSeriesChart
            data={[...COMPETITORS, { name: 'You', label: 'You', sov: 32, change: 2 } as any].map((c) => ({ label: c.name.slice(0, 4), value: c.sov }))}
            color="chart-1"
            horizontal
            height={280}
            valueFormat={(v) => `${v}%`}
          />
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
