'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Check,
  Sparkles,
  Megaphone,
  ClipboardCheck,
  Cpu,
  CreditCard,
  Users,
  Settings as SettingsIcon,
  Filter,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { NOTIFICATIONS } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const typeConfig = {
  ai: { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/12' },
  campaign: { icon: Megaphone, color: 'text-success', bg: 'bg-success/12' },
  approval: { icon: ClipboardCheck, color: 'text-accent', bg: 'bg-accent/12' },
  automation: { icon: Cpu, color: 'text-secondary', bg: 'bg-secondary/12' },
  system: { icon: SettingsIcon, color: 'text-muted-foreground', bg: 'bg-muted' },
  billing: { icon: CreditCard, color: 'text-warning', bg: 'bg-warning/12' },
  team: { icon: Users, color: 'text-success', bg: 'bg-success/12' },
};

const groupLabels = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' };

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(NOTIFICATIONS);

  const filtered = filter === 'all' ? items : filter === 'unread' ? items.filter((n) => !n.read) : items.filter((n) => n.type === filter);
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <DashboardShell>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notifications across your workspace.`}
        icon={Bell}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAll}><CheckCheck className="h-3.5 w-3.5" /> Mark all read</Button>
        }
      />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {['all', 'unread', 'ai', 'approval', 'campaign', 'automation', 'billing', 'team'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition-colors',
              filter === f ? 'bg-primary text-primary-foreground' : 'border border-border bg-card/40 text-muted-foreground hover:text-foreground'
            )}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="mt-5 space-y-6">
        {(['today', 'yesterday', 'earlier'] as const).map((group) => {
          const groupItems = filtered.filter((n) => n.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{groupLabels[group]}</p>
              <div className="space-y-2.5">
                {groupItems.map((n, i) => {
                  const cfg = typeConfig[n.type];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'glass-card surface-highlight group flex items-start gap-3 p-4 transition-all',
                        !n.read && 'border-primary/30 bg-primary/5'
                      )}
                    >
                      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', cfg.bg, cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-[13px] leading-snug', n.read ? 'font-medium text-foreground/80' : 'font-semibold text-foreground')}>{n.title}</p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{n.description}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
                          {!n.read && (
                            <button onClick={() => markOne(n.id)} className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                              <Check className="h-3 w-3" /> Mark read
                            </button>
                          )}
                          {(n.type === 'approval' || n.type === 'ai') && (
                            <button className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20">
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
