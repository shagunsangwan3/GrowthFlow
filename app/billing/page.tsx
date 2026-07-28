'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  Check,
  Zap,
  Users,
  TrendingUp,
  Crown,
  Receipt,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { BILLING } from '@/services/mock-data';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const plans = [
  { name: 'Starter', price: 490, features: ['1 workspace', '3 seats', '1 connected platform', 'Basic AI insights', 'Email support'], current: false },
  { name: 'Growth', price: 1900, features: ['3 workspaces', '10 seats', '2 platforms', 'Advanced AI + automations', 'Priority support', 'Custom reports'], current: false },
  { name: 'Enterprise', price: 4800, features: ['Unlimited workspaces', '24 seats', 'All platforms', 'Full AI suite + agents', 'Dedicated success manager', 'SSO + audit logs', 'SLA 99.9%'], current: true },
];

export default function BillingPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Billing"
        description="Manage your subscription, payment method, and invoices."
        icon={CreditCard}
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Download invoices</Button>}
      />

      {/* Current plan */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Current Plan" description="Your subscription details" delay={0.05}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm"><Crown className="h-5 w-5" /></span>
            <div>
              <p className="text-[16px] font-semibold text-foreground">{BILLING.plan}</p>
              <p className="text-[12px] text-muted-foreground">{formatCurrency(BILLING.price)}/{BILLING.cycle}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2.5 border-t border-border/50 pt-4">
            <Row label="Seats" value={`${BILLING.seatsUsed} / ${BILLING.seats}`} />
            <Row label="Next invoice" value={BILLING.nextInvoice} />
            <Row label="Amount" value={formatCurrency(BILLING.amount)} />
            <Row label="Payment method" value={BILLING.paymentMethod} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">Change plan</Button>
            <Button variant="outline" size="sm" className="flex-1">Update card</Button>
          </div>
        </SectionCard>

        {/* Usage */}
        <SectionCard title="Usage This Cycle" description="Seats & AI usage" delay={0.1}>
          <div className="space-y-4">
            <UsageBar label="Seats" used={BILLING.seatsUsed} total={BILLING.seats} icon={Users} tone="bg-primary" />
            <UsageBar label="AI requests" used={18420} total={50000} icon={Zap} tone="bg-secondary" />
            <UsageBar label="Automations" used={142} total={1000} icon={TrendingUp} tone="bg-accent" />
            <UsageBar label="Reports generated" used={38} total={100} icon={Receipt} tone="bg-success" />
          </div>
          <p className="mt-4 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">Usage resets on {BILLING.nextInvoice}. Upgrade anytime to increase limits.</p>
        </SectionCard>

        {/* Payment */}
        <SectionCard title="Payment Method" description="Card on file" delay={0.15}>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-12 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-secondary/30 text-[10px] font-bold text-foreground">VISA</span>
              <div>
                <p className="text-[13px] font-medium text-foreground">{BILLING.paymentMethod}</p>
                <p className="text-[11px] text-muted-foreground">Expires 08/27</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge variant="success" dot>Active</StatusBadge>
              <span className="text-[11px] text-muted-foreground">Auto-pay enabled</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full">Add payment method</Button>
        </SectionCard>
      </div>

      {/* Plans */}
      <div className="mt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Available Plans</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={cn('glass-card glass-card-hover surface-highlight relative p-5', p.current && 'border-primary/40 shadow-glow-sm')}>
              {p.current && <span className="absolute -top-2.5 left-5 rounded-full bg-ai-gradient px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-glow-sm">Current</span>}
              <p className="text-[14px] font-semibold text-foreground">{p.name}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{formatCurrency(p.price)}<span className="text-[13px] font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-4 space-y-2 border-t border-border/50 pt-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.current ? 'outline' : 'default'} size="sm" className="mt-4 w-full" disabled={p.current}>
                {p.current ? 'Current plan' : `Upgrade to ${p.name}`}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoice history */}
      <SectionCard title="Invoice History" description="Past payments" delay={0.1} className="mt-4" noPadding>
        <div className="divide-y divide-border/40">
          {BILLING.history.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"><Receipt className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground">{formatCurrency(h.amount)} — {BILLING.plan}</p>
                <p className="text-[11px] text-muted-foreground">{h.date}</p>
              </div>
              <StatusBadge variant="success" dot>{h.status}</StatusBadge>
              <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Download className="h-3.5 w-3.5" /></button>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </DashboardShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function UsageBar({ label, used, total, icon: Icon, tone }: { label: string; used: number; total: number; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</span>
        <span className="font-medium tabular-nums text-foreground">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={cn('h-full rounded-full', tone)} />
      </div>
    </div>
  );
}
