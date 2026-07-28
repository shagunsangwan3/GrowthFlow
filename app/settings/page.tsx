'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Building2,
  Users,
  Lock,
  KeyRound,
  Blocks,
  Cpu,
  Bell,
  Palette,
  ShieldAlert,
  Sparkles,
  Save,
  Copy,
  Plus,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { AUDIT_LOGS, APP_CONFIG } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TABS = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'team', label: 'Team & Permissions', icon: Users },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'api', label: 'API Keys', icon: KeyRound },
  { id: 'integrations', label: 'Integrations', icon: Blocks },
  { id: 'automation', label: 'Automation Policies', icon: Cpu },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Preferences', icon: Sparkles },
  { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('organization');

  return (
    <DashboardShell>
      <PageHeader
        title="Settings"
        description="Configure your workspace, security, AI behavior, and preferences."
        icon={Settings}
        actions={<Button size="sm" className="gap-1.5"><Save className="h-3.5 w-3.5" /> Save changes</Button>}
      />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        {/* Tab nav */}
        <aside className="no-scrollbar lg:w-60 lg:shrink-0">
          <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {tab === 'organization' && <OrganizationTab />}
              {tab === 'team' && <PlaceholderTab title="Team & Permissions" desc="Manage roles, access levels, and permissions across your workspace." />}
              {tab === 'security' && <SecurityTab />}
              {tab === 'api' && <ApiTab />}
              {tab === 'integrations' && <PlaceholderTab title="Integrations" desc="Manage connected accounts and data sync settings." />}
              {tab === 'automation' && <AutomationTab />}
              {tab === 'notifications' && <NotificationsTab />}
              {tab === 'appearance' && <AppearanceTab />}
              {tab === 'ai' && <AiTab />}
              {tab === 'audit' && <AuditTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}

function OrganizationTab() {
  return (
    <SectionCard title="Organization" description="Workspace identity and details" delay={0.05}>
      <div className="space-y-4">
        <Field label="Organization name" defaultValue={APP_CONFIG.workspace.name} />
        <Field label="Workspace URL" defaultValue="northwind-co.growthflow.app" />
        <Field label="Billing email" defaultValue="billing@northwind.co" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Timezone" defaultValue="America/Los_Angeles" />
          <Field label="Currency" defaultValue="USD ($)" />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3.5">
          <div>
            <p className="text-[13px] font-medium text-foreground">Allow AI to make optimizations automatically</p>
            <p className="text-[11.5px] text-muted-foreground">Low-risk actions execute without approval</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </SectionCard>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Authentication" description="Protect your account" delay={0.05}>
        <div className="space-y-3">
          {[
            { l: 'Two-factor authentication', d: 'Require 2FA for all team members', on: true },
            { l: 'Single sign-on (SSO)', d: 'SAML 2.0 with your identity provider', on: true },
            { l: 'Session timeout', d: 'Auto-logout after 30 minutes inactive', on: false },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3.5">
              <div><p className="text-[13px] font-medium text-foreground">{s.l}</p><p className="text-[11.5px] text-muted-foreground">{s.d}</p></div>
              <Switch defaultChecked={s.on} />
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="IP Allowlist" description="Restrict access to specific IPs" delay={0.1}>
        <div className="space-y-2">
          {['72.14.201.10 — Office HQ', '204.11.50.22 — VPN'].map((ip) => (
            <div key={ip} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-[12.5px]">
              <span className="font-mono text-foreground">{ip}</span>
              <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Add IP</Button>
        </div>
      </SectionCard>
    </div>
  );
}

function ApiTab() {
  const keys = [
    { name: 'Production', key: 'gf_live_••••••••4f2a', created: 'Mar 2, 2025', lastUsed: '2 min ago' },
    { name: 'Staging', key: 'gf_test_••••••••91bc', created: 'Feb 14, 2025', lastUsed: '1 day ago' },
  ];
  return (
    <SectionCard title="API Keys" description="Programmatic access to GrowthFlow" delay={0.05} actions={<Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs"><Plus className="h-3.5 w-3.5" /> New key</Button>}>
      <div className="space-y-2.5">
        {keys.map((k) => (
          <div key={k.name} className="rounded-xl border border-border/60 bg-card/40 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-foreground">{k.name}</p>
                <p className="mt-0.5 font-mono text-[11.5px] text-muted-foreground">{k.key}</p>
              </div>
              <div className="flex gap-1">
                <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-2 flex gap-4 text-[10.5px] text-muted-foreground">
              <span>Created {k.created}</span><span>Last used {k.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AutomationTab() {
  return (
    <SectionCard title="Automation Policies" description="Guardrails for AI automations" delay={0.05}>
      <div className="space-y-3">
        {[
          { l: 'Max auto budget increase', d: 'Cap automatic budget raises', val: '15%' },
          { l: 'Auto-pause threshold', d: 'Pause campaigns below this ROAS', val: '2.0x for 3 days' },
          { l: 'Confidence threshold', d: 'Min AI confidence to auto-execute', val: '85%' },
          { l: 'Spend alert threshold', d: 'Alert when budget utilization hits', val: '90%' },
        ].map((p) => (
          <div key={p.l} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3.5">
            <div><p className="text-[13px] font-medium text-foreground">{p.l}</p><p className="text-[11.5px] text-muted-foreground">{p.d}</p></div>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-[12px] font-semibold text-foreground">{p.val}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function NotificationsTab() {
  return (
    <SectionCard title="Notification Preferences" description="Choose what you hear about" delay={0.05}>
      <div className="space-y-3">
        {[
          { l: 'AI recommendations', d: 'When AI suggests an action', on: true },
          { l: 'Approval requests', d: 'When an action needs your sign-off', on: true },
          { l: 'Budget alerts', d: 'Spend pacing and budget exhaustion', on: true },
          { l: 'Anomaly detection', d: 'Unusual performance changes', on: true },
          { l: 'Weekly digest', d: 'Summary every Monday morning', on: true },
          { l: 'Team activity', d: 'Members joining or changes', on: false },
        ].map((n) => (
          <div key={n.l} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3.5">
            <div><p className="text-[13px] font-medium text-foreground">{n.l}</p><p className="text-[11.5px] text-muted-foreground">{n.d}</p></div>
            <Switch defaultChecked={n.on} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AppearanceTab() {
  return (
    <SectionCard title="Appearance" description="Customize the look and feel" delay={0.05}>
      <div className="space-y-4">
        <div>
          <Label className="text-[12px] text-muted-foreground">Theme</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[{ l: 'Dark', a: true }, { l: 'Midnight', a: false }, { l: 'System', a: false }].map((t) => (
              <button key={t.l} className={cn('rounded-xl border p-3 text-[12.5px] font-medium transition-colors', t.a ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card/40 text-muted-foreground hover:text-foreground')}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[12px] text-muted-foreground">Density</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[{ l: 'Comfortable', a: true }, { l: 'Compact', a: false }].map((d) => (
              <button key={d.l} className={cn('rounded-xl border p-3 text-[12.5px] font-medium transition-colors', d.a ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card/40 text-muted-foreground hover:text-foreground')}>{d.l}</button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function AiTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="AI Preferences" description="Tune how GrowthFlow AI behaves" delay={0.05}>
        <div className="space-y-3">
          {[
            { l: 'Conservative mode', d: 'AI only suggests, never auto-executes', on: false },
            { l: 'Aggressive optimization', d: 'AI makes bold changes to maximize ROAS', on: true },
            { l: 'Learn from approvals', d: 'AI adapts based on what you approve/reject', on: true },
            { l: 'Multi-campaign reasoning', d: 'AI considers cross-campaign impact', on: true },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3.5">
              <div><p className="text-[13px] font-medium text-foreground">{s.l}</p><p className="text-[11.5px] text-muted-foreground">{s.d}</p></div>
              <Switch defaultChecked={s.on} />
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="AI Model" description="Underlying model configuration" delay={0.1}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-card/40 p-3.5"><p className="text-[11px] text-muted-foreground">Model</p><p className="mt-0.5 text-[14px] font-semibold text-foreground">{APP_CONFIG.ai.model} {APP_CONFIG.ai.version}</p></div>
          <div className="rounded-xl border border-border/60 bg-card/40 p-3.5"><p className="text-[11px] text-muted-foreground">Uptime (30d)</p><p className="mt-0.5 text-[14px] font-semibold text-success">{APP_CONFIG.ai.uptime}</p></div>
        </div>
      </SectionCard>
    </div>
  );
}

function AuditTab() {
  return (
    <SectionCard title="Audit Logs" description="Track every action in your workspace" delay={0.05} noPadding>
      <div className="divide-y divide-border/40">
        {AUDIT_LOGS.map((log, i) => (
          <motion.div key={log.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-[10px] font-bold text-muted-foreground">{log.actor === 'GrowthFlow AI' ? 'AI' : log.actor.slice(0, 2).toUpperCase()}</span>
            <div className="min-w-0 flex-1"><p className="text-[12.5px] font-medium text-foreground">{log.action}</p><p className="text-[11px] text-muted-foreground">{log.actor} · {log.ip}</p></div>
            <span className="shrink-0 text-[11px] text-muted-foreground/70">{log.time}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

function PlaceholderTab({ title, desc }: { title: string; desc: string }) {
  return (
    <SectionCard title={title} description={desc} delay={0.05}>
      <div className="grid h-48 place-items-center rounded-xl border border-dashed border-border/50 text-center">
        <div><Settings className="mx-auto h-8 w-8 text-muted-foreground/40" /><p className="mt-2 text-[13px] text-muted-foreground">Configuration options for {title.toLowerCase()} appear here.</p></div>
      </div>
    </SectionCard>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="h-9 bg-card/40 text-[13px]" />
    </div>
  );
}
