'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Plus } from 'lucide-react';
import { NAV_GROUPS } from '@/config/navigation';
import { APP_CONFIG } from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <Logo showWordmark={false} size={34} />
            </motion.div>
          ) : (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New campaign button */}
      <div className="px-3 pb-2">
        <Button
          className={cn(
            'h-9 w-full justify-start gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90',
            collapsed && 'justify-center px-0'
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="text-[13px] font-medium">New Campaign</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && 'mt-5')}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                      active
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg border border-primary/30 bg-primary/10"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <Icon
                      className={cn(
                        'relative h-[18px] w-[18px] shrink-0 transition-colors',
                        active
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <span className="relative flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          'relative rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                          active
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && (
                      <AnimatePresence>
                        {hovered === item.id && (
                          <motion.div
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-[12px] text-foreground shadow-elevated"
                          >
                            {item.label}
                            {item.badge && (
                              <span className="ml-2 rounded-full bg-primary/20 px-1.5 text-[10px] text-primary">
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* AI status card */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mb-3 overflow-hidden rounded-xl border border-primary/20 bg-ai-gradient-soft p-3"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-medium text-foreground">{APP_CONFIG.ai.model}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">{APP_CONFIG.ai.version}</span>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
            AI operational · {APP_CONFIG.ai.uptime} uptime
          </p>
        </motion.div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground',
            collapsed && 'justify-center px-0'
          )}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
