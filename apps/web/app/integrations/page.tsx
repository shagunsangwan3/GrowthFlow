'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Blocks,
  Plus,
  Check,
  Settings2,
  Plug,
  Sparkles,
  Cable,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { INTEGRATIONS_LIST } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Advertising', 'Analytics', 'CRM', 'Communication'];

export default function IntegrationsPage() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? INTEGRATIONS_LIST : INTEGRATIONS_LIST.filter((i) => i.category === cat);

  return (
    <DashboardShell>
      <PageHeader
        title="Integrations"
        description="Connect your marketing stack. Google Ads is live — more platforms coming soon."
        icon={Blocks}
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Request integration</Button>}
      />

      {/* Category tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors',
              cat === c ? 'bg-primary text-primary-foreground' : 'border border-border bg-card/40 text-muted-foreground hover:text-foreground'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Integration grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((int, i) => (
          <motion.div
            key={int.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card glass-card-hover surface-highlight p-5"
          >
            <div className="flex items-start justify-between">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: `hsl(var(--${int.color}) / 0.15)`, color: `hsl(var(--${int.color}))` }}
              >
                {int.name.slice(0, 2).toUpperCase()}
              </span>
              <StatusBadge variant={int.status === 'connected' ? 'success' : 'neutral'} dot={int.status === 'connected'}>
                {int.status === 'connected' ? 'Connected' : 'Available'}
              </StatusBadge>
            </div>
            <p className="mt-3 text-[14px] font-semibold text-foreground">{int.name}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{int.description}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Plug className="h-3 w-3" /> {int.accounts} {int.accounts === 1 ? 'account' : 'accounts'}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5">{int.category}</span>
            </div>
            <div className="mt-4 flex gap-2 border-t border-border/50 pt-3">
              {int.status === 'connected' ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8 text-xs"><Settings2 className="h-3.5 w-3.5" /> Configure</Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-success"><Check className="h-3.5 w-3.5" /> Active</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 h-8 text-xs"><Cable className="h-3.5 w-3.5" /> Connect</Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming soon roadmap */}
      <div className="mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl border border-primary/20">
          <div className="absolute inset-0 bg-ai-gradient-soft" />
          <div className="relative flex items-start gap-3 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm"><Sparkles className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">More platforms on the roadmap</p>
              <p className="text-[12px] text-muted-foreground">Meta Ads, LinkedIn Ads, TikTok Ads, SEO, Email, Analytics, CRM, and AI Agents are planned for 2025-2026. Vote on what you need next.</p>
            </div>
            <Button size="sm" variant="outline" className="border-primary/30 bg-background/40 backdrop-blur">Roadmap</Button>
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
