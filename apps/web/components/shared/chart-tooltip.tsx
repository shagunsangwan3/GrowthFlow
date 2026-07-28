'use client';

import { cn } from '@/lib/utils';

type TooltipProps = {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string | number;
  valueFormat?: (v: number) => string;
  labelSuffix?: string;
};

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormat,
  labelSuffix,
}: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-card surface-highlight min-w-[140px] rounded-lg border border-border px-3 py-2 text-xs shadow-elevated">
      {label !== undefined && (
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
          {label}
          {labelSuffix}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-foreground/80">
              {entry.color && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
              )}
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {valueFormat && typeof entry.value === 'number'
                ? valueFormat(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
