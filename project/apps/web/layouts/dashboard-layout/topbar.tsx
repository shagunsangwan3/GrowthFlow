'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  Command,
  Plus,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { APP_CONFIG, NOTIFICATIONS } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [workspace, setWorkspace] = useState<string>(APP_CONFIG.workspace.name);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      {/* Workspace selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
              {workspace.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden flex-col items-start leading-none sm:flex">
              <span className="text-[13px] font-semibold">{workspace}</span>
              <span className="text-[10px] text-muted-foreground">{APP_CONFIG.workspace.plan}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['Northwind Labs', 'Acme Studio', 'Personal'].map((w) => (
            <DropdownMenuItem
              key={w}
              onClick={() => setWorkspace(w)}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
                  {w.slice(0, 2).toUpperCase()}
                </span>
                {w}
              </span>
              {w === workspace && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-muted-foreground">
            <Plus className="mr-2 h-3.5 w-3.5" /> Create workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Global search / command palette trigger */}
      <button
        onClick={onOpenCommand}
        className="group ml-1 hidden h-9 w-44 items-center gap-2 rounded-lg border border-border bg-card/40 px-2.5 text-[13px] text-muted-foreground transition-all hover:border-primary/40 hover:bg-card/70 lg:flex lg:w-56 xl:w-64"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 truncate text-left">Search…</span>
        <kbd className="flex shrink-0 items-center gap-0.5 rounded border border-border bg-muted/60 px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex flex-1 items-center justify-end gap-1.5 lg:flex-none">
        {/* Mobile search */}
        <button
          onClick={onOpenCommand}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* AI status */}
        <div className="hidden items-center gap-2 rounded-lg border border-primary/20 bg-ai-gradient-soft px-2.5 py-1.5 lg:flex">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-medium text-foreground">AI Online</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
        </div>

        {/* Help */}
        <button className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="hidden h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:grid">
          <Settings className="h-4 w-4" />
        </button>

        {/* Quick create */}
        <button className="ml-1 hidden h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-all hover:bg-primary/90 sm:flex">
          <Plus className="h-4 w-4" />
          Create
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg p-0.5 transition-colors hover:bg-muted/60">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                  AC
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>Alex Chen</span>
              <span className="text-[11px] font-normal text-muted-foreground">alex@northwind.co</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
