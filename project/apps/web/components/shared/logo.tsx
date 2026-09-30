'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showWordmark = true,
  size = 32,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <motion.div
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid place-items-center rounded-xl logo-gradient logo-glow"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.56}
          height={size * 0.56}
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
        >
          {/* GrowthFlow mark: ascending flow nodes */}
          <path
            d="M3 16.5L8.5 11L13 14.5L21 6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="6" r="2.1" fill="currentColor" />
          <circle cx="3" cy="16.5" r="1.6" fill="currentColor" opacity="0.7" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 blur-md transition-opacity duration-500 hover:opacity-100" />
      </motion.div>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            GrowthFlow
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            AI Growth OS
          </span>
        </div>
      )}
    </div>
  );
}
