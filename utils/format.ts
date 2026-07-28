export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000)
      return `$${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000)
      return `${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatRatio(value: number, suffix = 'x'): string {
  return `${value.toFixed(2)}${suffix}`;
}

export function formatValue(
  value: number,
  format: 'currency' | 'percent' | 'number' | 'ratio',
  compact = false
): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, compact);
    case 'percent':
      return formatPercent(value);
    case 'number':
      return formatNumber(value, compact);
    case 'ratio':
      return formatRatio(value);
  }
}

const CHART_COLOR_MAP: Record<string, string> = {
  'chart-1': 'hsl(217 91% 60%)',
  'chart-2': 'hsl(263 70% 64%)',
  'chart-3': 'hsl(189 94% 55%)',
  'chart-4': 'hsl(152 67% 50%)',
  'chart-5': 'hsl(32 95% 56%)',
  'chart-6': 'hsl(330 80% 64%)',
  'chart-7': 'hsl(210 80% 70%)',
  electric: 'hsl(217 91% 60%)',
  cyber: 'hsl(189 94% 55%)',
};

export function chartColor(key: string): string {
  return CHART_COLOR_MAP[key] ?? key;
}
