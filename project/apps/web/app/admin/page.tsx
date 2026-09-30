'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Server,
  Activity,
  Cpu,
  HardDrive,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Database,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { TrendAreaChart, BarSeriesChart } from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import { REVENUE_TREND, AUDIT_LOGS, TEAM_MEMBERS } from '@/services/mock-data';
import { formatCurrency, formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';

const systemHealth = [
  { label: 'API', status: 'operational', uptime: '99.99%', latency: '42ms' },
  { label: 'AI Engine', status: 'operational', uptime: '99.98%', latency: '180ms' },
  { label: 'Data Pipeline', status: 'operational', uptime: '99.95%', latency: '12ms' },
  { label: 'Google Ads Sync', status: 'operational', uptime: '99.92%', latency: '320ms' },
  { label: 'Notifications', status: 'degraded', uptime: '98.80%', latency: '880ms' },
  { label: 'Report Builder', status: 'operational', uptime: '99.97%', latency: '64ms' },
];

const resourceUsage = [
  { label: 'CPU', used: 42, total: 100, icon: Cpu, tone: 'bg-primary' },
  { label: 'Memory', used: 68, total: 100, icon: HardDrive, tone: 'bg-secondary' },
  { label: 'Storage', used: 34, total: 100, icon: Database, tone: 'bg-accent' },
  { label: 'AI requests', used: 78, total: 100, icon: Zap, tone: 'bg-success' },
];

export default function AdminPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Admin Console"
        description="System health, infrastructure, and platform-wide administration."
        icon={Shield}
      />

      {/* System status banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6 overflow-hidden rounded-2xl border border-border/60">
        <div className="grid gap-4 p-5 sm:grid-cols-4">
          {([
            { l: 'Total workspaces', v: 142, icon: Globe },
            { l: 'Active users (24h)', v: 1240, icon: Users },
            { l: 'AI requests today', v: 18420, icon: Zap },
            { l: 'Avg response', v: 180, suffix: 'ms', icon: Activity },
          ] as { l: string; v: number; suffix?: string; icon: React.ComponentType<{ className?: string }> }[]).map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ai-gradient-soft text-primary"><s.icon className="h-4 w-4" /></span>
              <div><p className="text-[11px] text-muted-foreground">{s.l}</p><p className="text-xl font-semibold tabular-nums text-foreground">{formatNumber(s.v)}{s.suffix ?? ''}</p></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System health */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Service Status" description="Real-time platform health" delay={0.05} className="lg:col-span-2" noPadding>
          <div className="divide-y divide-border/40">
            {systemHealth.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-3.5">
                <span className={cn('relative flex h-2.5 w-2.5', s.status === 'operational' ? 'text-success' : 'text-warning')}>
                  <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', s.status === 'operational' ? 'bg-success' : 'bg-warning')} />
                  <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', s.status === 'operational' ? 'bg-success' : 'bg-warning')} />
                </span>
                <div className="min-w-0 flex-1"><p className="text-[13px] font-medium text-foreground">{s.label}</p></div>
                <span className="text-[11px] tabular-nums text-muted-foreground">{s.latency}</span>
                <span className="hidden w-20 text-right text-[11px] tabular-nums text-muted-foreground sm:block">{s.uptime}</span>
                <StatusBadge variant={s.status === 'operational' ? 'success' : 'warning'} dot>{s.status === 'operational' ? 'Operational' : 'Degraded'}</StatusBadge>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Resource Usage" description="Infrastructure metrics" delay={0.1}>
          <div className="space-y-4">
            {resourceUsage.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><r.icon className="h-3.5 w-3.5" /> {r.label}</span>
                  <span className="font-medium tabular-nums text-foreground">{r.used}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.used}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={cn('h-full rounded-full', r.tone)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Usage chart + audit */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Platform Revenue (30d)" description="Aggregate revenue across all workspaces" delay={0.05} className="lg:col-span-2">
          <TrendAreaChart data={REVENUE_TREND} dataKey="value" color="chart-2" height={260} valueFormat={(v) => formatCurrency(v, true)} />
        </SectionCard>

        <SectionCard title="Recent Admin Actions" description="Audit trail" delay={0.1} noPadding>
          <div className="no-scrollbar max-h-[260px] divide-y divide-border/40 overflow-y-auto">
            {AUDIT_LOGS.slice(0, 6).map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="px-4 py-3">
                <p className="text-[12px] font-medium leading-tight text-foreground">{log.action}</p>
                <p className="mt-0.5 text-[10.5px] text-muted-foreground">{log.actor} · {log.time}</p>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Workspaces table */}
      <SectionCard title="Top Workspaces" description="By revenue contribution" delay={0.05} className="mt-4" noPadding>
        <div className="divide-y divide-border/40">
          {[
            { name: 'Northwind Labs', users: 19, revenue: 184200, plan: 'Enterprise' },
            { name: 'Acme Studio', users: 12, revenue: 98400, plan: 'Growth' },
            { name: 'Vertex Digital', users: 8, revenue: 64200, plan: 'Growth' },
            { name: 'BrightPath Co', users: 5, revenue: 24800, plan: 'Starter' },
          ].map((w, i) => (
            <motion.div key={w.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 px-5 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ai-gradient-soft text-[10px] font-bold text-primary">{w.name.slice(0, 2).toUpperCase()}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-foreground">{w.name}</p><p className="text-[11px] text-muted-foreground">{w.users} users · {w.plan}</p></div>
              <span className="text-[13px] font-semibold tabular-nums text-foreground">{formatCurrency(w.revenue, true)}</span>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </DashboardShell>
  );
}
