'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  Zap,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Filter,
  LayoutGrid,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import {
  ApprovalStatusBadge,
  RiskBadge,
  StatusBadge,
} from '@/components/shared/status-badge';
import { APPROVALS } from '@/services/mock-data';
import { ApprovalCard, ApprovalStatus } from '@/types';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const COLUMNS: { id: ApprovalStatus; label: string; accent: string; dot: string }[] = [
  { id: 'pending', label: 'Pending', accent: 'border-t-warning', dot: 'bg-warning' },
  { id: 'needs-review', label: 'Needs Review', accent: 'border-t-primary', dot: 'bg-primary' },
  { id: 'approved', label: 'Approved', accent: 'border-t-accent', dot: 'bg-accent' },
  { id: 'executing', label: 'Executing', accent: 'border-t-secondary', dot: 'bg-secondary' },
  { id: 'completed', label: 'Completed', accent: 'border-t-success', dot: 'bg-success' },
  { id: 'failed', label: 'Failed', accent: 'border-t-destructive', dot: 'bg-destructive' },
];

export default function ApprovalCenterPage() {
  const [cards, setCards] = useState<ApprovalCard[]>(APPROVALS);
  const [selected, setSelected] = useState<ApprovalCard | null>(null);

  const moveCard = (id: string, status: ApprovalStatus) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const counts = (status: ApprovalStatus) => cards.filter((c) => c.status === status).length;

  return (
    <DashboardShell>
      <PageHeader
        title="Approval Center"
        description="Review and act on AI-generated recommendations before they execute."
        icon={ClipboardCheck}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Approve all low-risk
            </Button>
          </>
        }
      />

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {COLUMNS.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card surface-highlight p-4"
          >
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', col.dot)} />
              <span className="text-[11px] text-muted-foreground">{col.label}</span>
            </div>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{counts(col.id)}</p>
          </motion.div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col, ci) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={cards.filter((c) => c.status === col.id)}
            index={ci}
            onMove={moveCard}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer card={selected} onClose={() => setSelected(null)} onMove={(s) => { moveCard(selected.id, s); setSelected(null); }} />
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

function KanbanColumn({
  column,
  cards,
  index,
  onMove,
  onSelect,
}: {
  column: (typeof COLUMNS)[number];
  cards: ApprovalCard[];
  index: number;
  onMove: (id: string, status: ApprovalStatus) => void;
  onSelect: (c: ApprovalCard) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex w-[290px] shrink-0 flex-col"
    >
      <div className={cn('glass-card surface-highlight flex flex-col overflow-hidden border-t-2', column.accent)}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', column.dot)} />
            <span className="text-[13px] font-semibold text-foreground">{column.label}</span>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{cards.length}</span>
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={cards}
          onReorder={() => {}}
          className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto p-3"
        >
          {cards.length === 0 && (
            <div className="grid h-24 place-items-center rounded-xl border border-dashed border-border/50 text-[11px] text-muted-foreground/60">
              No items
            </div>
          )}
          {cards.map((card) => (
            <Reorder.Item
              key={card.id}
              value={card}
              onDragEnd={() => {}}
              className="group cursor-grab active:cursor-grabbing"
            >
              <ApprovalCardView card={card} onClick={() => onSelect(card)} onMove={onMove} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </motion.div>
  );
}

function ApprovalCardView({
  card,
  onClick,
  onMove,
}: {
  card: ApprovalCard;
  onClick: () => void;
  onMove: (id: string, status: ApprovalStatus) => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="glass-card surface-highlight rounded-xl border-border/80 p-3.5 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-primary/12 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-primary">
          {card.category}
        </span>
        <RiskBadge risk={card.risk} />
      </div>

      <button onClick={onClick} className="mt-2 block w-full text-left">
        <p className="text-[13px] font-medium leading-snug text-foreground">{card.title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{card.recommendation}</p>
      </button>

      {/* impact metrics */}
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {card.expectedImpact > 0 && (
          <div className="rounded-lg bg-success/10 px-2 py-1.5">
            <p className="flex items-center gap-1 text-[9.5px] text-muted-foreground"><TrendingUp className="h-2.5 w-2.5" /> Revenue gain</p>
            <p className="text-[12px] font-semibold tabular-nums text-success">+{formatCurrency(card.expectedImpact, true)}/wk</p>
          </div>
        )}
        {card.expectedSaving > 0 && (
          <div className="rounded-lg bg-accent/10 px-2 py-1.5">
            <p className="flex items-center gap-1 text-[9.5px] text-muted-foreground"><PiggyBank className="h-2.5 w-2.5" /> Cost saving</p>
            <p className="text-[12px] font-semibold tabular-nums text-accent">+{formatCurrency(card.expectedSaving, true)}/wk</p>
          </div>
        )}
      </div>

      {/* meta */}
      <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-[10.5px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> {card.confidence}% confidence
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {card.executionTime}
        </span>
      </div>

      {/* actions */}
      {(card.status === 'pending' || card.status === 'needs-review') && (
        <div className="mt-2.5 flex gap-1.5">
          <button
            onClick={() => onMove(card.id, 'approved')}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-success/15 py-1.5 text-[11px] font-medium text-success transition-colors hover:bg-success/25"
          >
            <Check className="h-3 w-3" /> Approve
          </button>
          <button
            onClick={() => onMove(card.id, 'failed')}
            className="flex items-center justify-center gap-1 rounded-lg bg-destructive/15 px-2.5 py-1.5 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/25"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function DetailDrawer({
  card,
  onClose,
  onMove,
}: {
  card: ApprovalCard;
  onClose: () => void;
  onMove: (s: ApprovalStatus) => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border bg-background-secondary p-6 shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">{card.category}</span>
              <ApprovalStatusBadge status={card.status} />
            </div>
            <h2 className="text-lg font-semibold leading-tight text-foreground">{card.title}</h2>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="glass-card surface-highlight p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recommendation</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/90">{card.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Confidence" value={`${card.confidence}%`} icon={Sparkles} tone="primary" />
            <Metric label="Risk" value={card.risk === 'low' ? 'Low' : card.risk === 'medium' ? 'Medium' : 'High'} icon={AlertTriangle} tone={card.risk === 'low' ? 'success' : card.risk === 'medium' ? 'warning' : 'danger'} />
            <Metric label="Revenue gain" value={`+${formatCurrency(card.expectedImpact, true)}/wk`} icon={TrendingUp} tone="success" />
            <Metric label="Cost saving" value={`+${formatCurrency(card.expectedSaving, true)}/wk`} icon={PiggyBank} tone="accent" />
            <Metric label="Execution time" value={card.executionTime} icon={Clock} tone="neutral" />
            <Metric label="Campaign" value={card.campaign} icon={ClipboardCheck} tone="neutral" />
          </div>

          <div className="glass-card surface-highlight p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Requested by</p>
            <p className="mt-1.5 flex items-center gap-2 text-[13px] text-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ai-gradient text-[10px] font-semibold text-white">
                {card.requestedBy === 'GrowthFlow AI' ? 'AI' : card.requestedBy.slice(0, 2).toUpperCase()}
              </span>
              {card.requestedBy}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => onMove('approved')} className="flex-1 gap-1.5 bg-success text-success-foreground hover:bg-success/90">
              <Check className="h-4 w-4" /> Approve
            </Button>
            <Button onClick={() => onMove('executing')} variant="outline" className="flex-1 gap-1.5">
              <Clock className="h-4 w-4" /> Schedule
            </Button>
            <Button onClick={() => onMove('failed')} variant="outline" className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Metric({ label, value, icon: Icon, tone }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; tone: 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral' }) {
  const toneMap = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-destructive bg-destructive/10',
    accent: 'text-accent bg-accent/10',
    neutral: 'text-muted-foreground bg-muted',
  };
  return (
    <div className="glass-card surface-highlight p-3.5">
      <span className={cn('grid h-7 w-7 place-items-center rounded-lg', toneMap[tone])}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-[13.5px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
