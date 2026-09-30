'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Megaphone, FileText, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { id: 'campaign', label: 'New Campaign', icon: Megaphone, href: '/campaigns' },
  { id: 'report', label: 'Generate Report', icon: FileText, href: '/reports' },
  { id: 'keyword', label: 'Keyword Research', icon: Search, href: '/keyword-research' },
  { id: 'ai', label: 'Ask AI', icon: Sparkles, href: '/ai-assistant' },
];

export function FloatingActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {open && (
          <>
            {actions.map((a, i) => (
              <motion.a
                key={a.id}
                href={a.href}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card/90 py-2 pl-3 pr-4 text-[13px] font-medium text-foreground shadow-elevated backdrop-blur-xl transition-colors hover:border-primary/40"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-ai-gradient-soft text-primary">
                  <a.icon className="h-3.5 w-3.5" />
                </span>
                {a.label}
              </motion.a>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'grid h-13 w-13 place-items-center rounded-full shadow-glow-electric transition-all',
          open ? 'bg-card text-foreground' : 'bg-ai-gradient text-white'
        )}
        style={{ height: 52, width: 52 }}
        aria-label="Quick actions"
      >
        <motion.div animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
