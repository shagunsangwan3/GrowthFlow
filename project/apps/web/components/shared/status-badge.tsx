import { cn } from '@/lib/utils';
import {
  CampaignStatus,
  ApprovalStatus,
  RiskLevel,
} from '@/types';

type Variant = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'accent';

const variantStyles: Record<Variant, string> = {
  success: 'bg-success/12 text-success ring-success/25',
  warning: 'bg-warning/12 text-warning ring-warning/25',
  danger: 'bg-destructive/12 text-destructive ring-destructive/25',
  neutral: 'bg-muted/60 text-muted-foreground ring-border',
  info: 'bg-primary/12 text-primary ring-primary/25',
  accent: 'bg-accent/12 text-accent ring-accent/25',
};

export function StatusBadge({
  variant = 'neutral',
  children,
  dot = false,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const map: Record<CampaignStatus, { v: Variant; label: string }> = {
    active: { v: 'success', label: 'Active' },
    paused: { v: 'neutral', label: 'Paused' },
    draft: { v: 'info', label: 'Draft' },
    ended: { v: 'neutral', label: 'Ended' },
    review: { v: 'warning', label: 'In Review' },
  };
  const { v, label } = map[status];
  return (
    <StatusBadge variant={v} dot={status === 'active'}>
      {label}
    </StatusBadge>
  );
}

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, { v: Variant; label: string }> = {
    pending: { v: 'warning', label: 'Pending' },
    'needs-review': { v: 'info', label: 'Needs Review' },
    approved: { v: 'accent', label: 'Approved' },
    executing: { v: 'info', label: 'Executing' },
    completed: { v: 'success', label: 'Completed' },
    failed: { v: 'danger', label: 'Failed' },
  };
  const { v, label } = map[status];
  return <StatusBadge variant={v} dot>{label}</StatusBadge>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { v: Variant; label: string }> = {
    low: { v: 'success', label: 'Low Risk' },
    medium: { v: 'warning', label: 'Medium Risk' },
    high: { v: 'danger', label: 'High Risk' },
  };
  const { v, label } = map[risk];
  return <StatusBadge variant={v}>{label}</StatusBadge>;
}

export function AiScoreBadge({ score }: { score: number }) {
  const variant: Variant = score >= 85 ? 'success' : score >= 70 ? 'info' : score >= 50 ? 'warning' : 'danger';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ring-inset',
        variantStyles[variant]
      )}
    >
      {score}
    </span>
  );
}
