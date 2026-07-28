'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  MoreHorizontal,
  Crown,
  Pencil,
  Trash2,
  KeyRound,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TEAM_MEMBERS } from '@/services/mock-data';
import { APP_CONFIG } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleMap = {
  Owner: { variant: 'accent' as const, icon: Crown },
  Admin: { variant: 'info' as const, icon: Shield },
  Editor: { variant: 'neutral' as const, icon: Pencil },
  Viewer: { variant: 'neutral' as const, icon: Users },
};

export default function TeamPage() {
  const [tab, setTab] = useState<'members' | 'roles'>('members');

  return (
    <DashboardShell>
      <PageHeader
        title="Team"
        description={`${APP_CONFIG.workspace.seatsUsed} of ${APP_CONFIG.workspace.seats} seats used in ${APP_CONFIG.workspace.name}.`}
        icon={Users}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><KeyRound className="h-3.5 w-3.5" /> Invite by link</Button>
            <Button size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Invite member</Button>
          </>
        }
      />

      {/* Seats usage */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: 'Total seats', v: APP_CONFIG.workspace.seats },
          { l: 'Used', v: APP_CONFIG.workspace.seatsUsed },
          { l: 'Available', v: APP_CONFIG.workspace.seats - APP_CONFIG.workspace.seatsUsed },
          { l: 'Pending invites', v: TEAM_MEMBERS.filter((t) => t.status === 'invited').length },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card surface-highlight p-4">
            <p className="text-[11px] text-muted-foreground">{s.l}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{s.v}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 border-b border-border/60">
        {([['members', 'Members'], ['roles', 'Roles & Permissions']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={cn('relative px-3.5 py-2.5 text-[13px] font-medium transition-colors', tab === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
            {label}
            {tab === id && <motion.div layoutId="team-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {tab === 'members' && (
        <SectionCard title="Members" description={`${TEAM_MEMBERS.length} people in this workspace`} delay={0.05} className="mt-5" noPadding>
          <div className="divide-y divide-border/40">
            {TEAM_MEMBERS.map((m, i) => {
              const rm = roleMap[m.role as keyof typeof roleMap];
              const RoleIcon = rm.icon;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-4">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-ai-gradient text-[12px] font-semibold text-white">{m.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-foreground">{m.name}</p>
                    <p className="flex items-center gap-1 truncate text-[11.5px] text-muted-foreground"><Mail className="h-3 w-3" /> {m.email}</p>
                  </div>
                  <div className="hidden items-center gap-1.5 sm:flex">
                    <StatusBadge variant={rm.variant}><span className="flex items-center gap-1"><RoleIcon className="h-3 w-3" /> {m.role}</span></StatusBadge>
                  </div>
                  <StatusBadge variant={m.status === 'active' ? 'success' : 'warning'} dot={m.status === 'active'}>{m.status === 'active' ? 'Active' : 'Invited'}</StatusBadge>
                  <span className="hidden w-24 text-right text-[11px] text-muted-foreground md:block">{m.lastActive}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Pencil className="mr-2 h-3.5 w-3.5" /> Change role</DropdownMenuItem>
                      <DropdownMenuItem><Mail className="mr-2 h-3.5 w-3.5" /> Resend invite</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {tab === 'roles' && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: 'Owner', desc: 'Full access including billing, deleting workspace', count: 1, perms: ['All permissions', 'Manage billing', 'Delete workspace', 'Transfer ownership'] },
            { role: 'Admin', desc: 'Manage members, automations, integrations', count: 1, perms: ['Manage members', 'Configure automations', 'Manage integrations', 'View audit logs'] },
            { role: 'Editor', desc: 'Create and edit campaigns, reports', count: 2, perms: ['Create campaigns', 'Edit reports', 'Use AI Assistant', 'Approve actions'] },
            { role: 'Viewer', desc: 'Read-only access to dashboards', count: 2, perms: ['View dashboards', 'View reports', 'Export data', 'No edit access'] },
          ].map((r, i) => {
            const rm = roleMap[r.role as keyof typeof roleMap];
            const RoleIcon = rm.icon;
            return (
              <motion.div key={r.role} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover surface-highlight p-5">
                <div className="flex items-center justify-between">
                  <span className={cn('grid h-9 w-9 place-items-center rounded-lg', rm.variant === 'accent' ? 'bg-accent/12 text-accent' : rm.variant === 'info' ? 'bg-primary/12 text-primary' : 'bg-muted text-muted-foreground')}><RoleIcon className="h-4 w-4" /></span>
                  <span className="text-[11px] text-muted-foreground">{r.count} {r.count === 1 ? 'person' : 'people'}</span>
                </div>
                <p className="mt-3 text-[14px] font-semibold text-foreground">{r.role}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">{r.desc}</p>
                <ul className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                  {r.perms.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-primary" /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
