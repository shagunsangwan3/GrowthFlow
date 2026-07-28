'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  TrendingUp,
  Plus,
  Download,
  Target,
  Info,
  Lightbulb,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { KEYWORD_IDEAS, KEYWORD_PERFORMANCE } from '@/services/mock-data';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const intentMap = {
  commercial: { variant: 'info' as const, label: 'Commercial' },
  transactional: { variant: 'success' as const, label: 'Transactional' },
  informational: { variant: 'neutral' as const, label: 'Informational' },
};

export default function KeywordResearchPage() {
  const [query, setQuery] = useState('ai marketing platform');

  return (
    <DashboardShell>
      <PageHeader
        title="Keyword Research"
        description="Discover high-intent keywords with AI-powered opportunity scoring."
        icon={Search}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Generate ideas</Button>
          </>
        }
      />

      {/* Search */}
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a seed keyword or URL…"
            className="h-11 w-full rounded-xl border border-border bg-card/40 pl-10 pr-4 text-[14px] outline-none placeholder:text-muted-foreground focus:border-primary/40"
          />
        </div>
        <Button className="h-11 px-6">Research</Button>
      </div>

      {/* AI suggestion banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-4 overflow-hidden rounded-2xl border border-primary/20">
        <div className="absolute inset-0 bg-ai-gradient-soft" />
        <div className="relative flex items-start gap-3 p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm"><Lightbulb className="h-4 w-4" /></span>
          <div>
            <p className="text-[13px] font-semibold text-foreground">AI found 8 keyword opportunities with high commercial intent</p>
            <p className="text-[12px] text-muted-foreground">"roas calculator marketing" and "google ads ai optimizer" show 88-94% opportunity scores with low competition.</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Keyword ideas table */}
        <SectionCard title="Keyword Ideas" description="Ranked by AI opportunity score" delay={0.05} className="lg:col-span-2" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Keyword</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">CPC</th>
                  <th className="px-4 py-3">Intent</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Opportunity</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {KEYWORD_IDEAS.map((k, i) => (
                  <motion.tr key={k.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/40 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-[13px] font-medium text-foreground">{k.keyword}</td>
                    <td className="px-4 py-3 text-[12px] tabular-nums text-foreground/80">{formatNumber(k.volume)}</td>
                    <td className="px-4 py-3 text-[12px] tabular-nums text-foreground/80">{formatCurrency(k.cpc)}</td>
                    <td className="px-4 py-3"><StatusBadge variant={intentMap[k.intent as keyof typeof intentMap].variant}>{intentMap[k.intent as keyof typeof intentMap].label}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <div className={cn('h-full rounded-full', k.difficulty > 60 ? 'bg-destructive' : k.difficulty > 40 ? 'bg-warning' : 'bg-success')} style={{ width: `${k.difficulty}%` }} />
                        </div>
                        <span className="text-[11px] tabular-nums text-muted-foreground">{k.difficulty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold tabular-nums', k.opportunity >= 85 ? 'text-success' : k.opportunity >= 70 ? 'text-primary' : 'text-foreground/80')}>{k.opportunity}</span>
                    </td>
                    <td className="px-4 py-3"><button className="grid h-7 w-7 place-items-center rounded-md text-primary hover:bg-primary/10"><Plus className="h-4 w-4" /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Current keywords performance */}
        <SectionCard title="Your Keywords" description="Live performance" delay={0.1}>
          <div className="space-y-2.5">
            {KEYWORD_PERFORMANCE.slice(0, 6).map((k, i) => (
              <motion.div key={k.keyword} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border/60 bg-card/40 p-3">
                <p className="truncate text-[12.5px] font-medium text-foreground">{k.keyword}</p>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatNumber(k.volume)} vol</span>
                  <span>{k.conversions} conv</span>
                  <span className="font-medium text-success">{k.ctr}% CTR</span>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}
