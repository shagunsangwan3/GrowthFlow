'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Plus,
  Megaphone,
  BarChart3,
  Settings,
  FileText,
  Workflow,
  ClipboardCheck,
  Users,
  CreditCard,
  Bell,
  LayoutDashboard,
  CornerDownLeft,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ALL_NAV_ITEMS } from '@/config/navigation';

const QUICK_ACTIONS = [
  { id: 'qa1', label: 'Create new campaign', icon: Plus, hint: 'Campaign' },
  { id: 'qa2', label: 'Ask AI Assistant', icon: Sparkles, hint: 'AI' },
  { id: 'qa3', label: 'Generate weekly report', icon: FileText, hint: 'Report' },
  { id: 'qa4', label: 'View pending approvals', icon: ClipboardCheck, hint: 'Approval' },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, campaigns, actions, or ask AI…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {QUICK_ACTIONS.map((a) => (
            <CommandItem key={a.id} onSelect={() => go('/')}>
              <a.icon className="h-4 w-4 text-primary" />
              <span>{a.label}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                {a.hint}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {ALL_NAV_ITEMS.map((item) => (
            <CommandItem key={item.id} onSelect={() => go(item.href)}>
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ask AI">
          <CommandItem onSelect={() => go('/ai-assistant')}>
            <Sparkles className="h-4 w-4 text-primary" />
            <span>"Optimize my top campaign"</span>
          </CommandItem>
          <CommandItem onSelect={() => go('/ai-assistant')}>
            <Sparkles className="h-4 w-4 text-primary" />
            <span>"Find wasted spend this week"</span>
          </CommandItem>
          <CommandItem onSelect={() => go('/ai-assistant')}>
            <Sparkles className="h-4 w-4 text-primary" />
            <span>"Forecast next month's revenue"</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
