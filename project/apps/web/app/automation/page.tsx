'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Zap,
  Clock,
  Cpu,
  Activity,
  Settings2,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { AUTOMATION_RULES, AUTOMATION_LOGS, AUTOMATION_STATUS } from '@/services/mock-data';
import { formatNumber, formatPercent } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const statusMap = {
  active: { variant: 'success' as const, icon: CheckCircle2, label: 'Active' },
  paused: { variant: 'neutral' as const, icon: Pause, label: 'Paused' },
  error: { variant: 'danger' as const, icon: AlertCircle, label: 'Error' },
};

export default function AutomationPage() {
  const [rules, setRules] = useState(AUTOMATION_RULES);
  const [tab, setTab] = useState<'rules' | 'logs'>('rules');

  const toggle = (id: string) => {
    setRules((r) =>
      r.map((rule) =>
        rule.id === id
          ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
          : rule
      )
    );
  };

  return (
    <DashboardShell>
      <PageHeader
        title="Automation Center"
        description="AI automation rules that optimize your campaigns 24/7 — with guardrails you control."
        icon={Workflow}
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Workflow
          </Button>
        }
      />

      {/* Status cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {AUTOMATION_STATUS.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover surface-highlight p-4">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ai-gradient-soft text-primary">
                {i === 0 ? <Cpu className="h-4 w-4" /> : i === 1 ? <Zap className="h-4 w-4" /> : i === 2 ? <Activity className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </span>
              <StatusBadge variant={i === 0 ? 'success' : 'neutral'} dot={i === 0}>{a.total ? `${a.value}/${a.total}` : 'Live'}</StatusBadge>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">{a.label}</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">
              {a.format === 'percent' ? formatPercent(a.value) : a.total ? `${a.value}/${a.total}` : formatNumber(a.value)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 border-b border-border/60">
        {([['rules', 'Automation Rules'], ['logs', 'Execution Logs']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn('relative px-3.5 py-2.5 text-[13px] font-medium transition-colors', tab === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
            {label}
            {tab === id && <motion.div layoutId="auto-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {tab === 'rules' && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rules.map((rule, i) => {
            const sm = statusMap[rule.status];
            const Icon = sm.icon;
            return (
              <motion.div key={rule.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover surface-highlight p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', rule.status === 'active' ? 'bg-success/12 text-success' : rule.status === 'error' ? 'bg-destructive/12 text-destructive' : 'bg-muted text-muted-foreground')}>
                      <Workflow className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{rule.name}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <Switch checked={rule.status === 'active'} onCheckedChange={() => toggle(rule.id)} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Trigger</p>
                    <p className="mt-0.5 text-[12px] font-medium text-foreground">{rule.trigger}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Action</p>
                    <p className="mt-0.5 text-[12px] font-medium text-foreground">{rule.action}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {rule.executions} runs</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> {formatPercent(rule.successRate)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rule.lastRun}</span>
                  </div>
                  <StatusBadge variant={sm.variant} dot={rule.status === 'active'}><span className="flex items-center gap-1"><Icon className="h-3 w-3" /> {sm.label}</span></StatusBadge>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === 'logs' && (
        <SectionCard title="Execution History" description="Recent automation runs and outcomes" delay={0.05} className="mt-5" noPadding>
          <div className="divide-y divide-border/40">
            {AUTOMATION_LOGS.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-3 px-5 py-3.5">
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', log.status === 'success' ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive')}>
                  {log.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{log.rule}</p>
                  <p className="text-[11.5px] text-muted-foreground">{log.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground/70">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      )}
    </DashboardShell>
  );
}
