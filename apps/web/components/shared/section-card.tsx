'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  delay = 0,
  noPadding,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  delay?: number;
  noPadding?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card surface-highlight relative overflow-hidden', className)}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
          <div className="space-y-0.5">
            {title && (
              <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[12.5px] text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5', bodyClassName)}>{children}</div>
    </motion.section>
  );
}
