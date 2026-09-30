'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Download,
  Mail,
  Calendar,
  FileSpreadsheet,
  Presentation,
  FileImage,
  MoreHorizontal,
  Layout,
  Sparkles,
  Eye,
  Copy,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { SectionCard } from '@/components/shared/section-card';
import { TrendAreaChart, DonutChart, BarSeriesChart } from '@/components/shared/charts';
import { StatusBadge } from '@/components/shared/status-badge';
import { REPORTS_LIST, REPORT_TEMPLATES, REVENUE_TREND, BUDGET_ALLOCATION, COUNTRY_PERFORMANCE } from '@/services/mock-data';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const formatIcons = { PDF: FileImage, Excel: FileSpreadsheet, PowerPoint: Presentation };

export default function ReportsPage() {
  const [active, setActive] = useState('Executive Summary');
  const [widgets, setWidgets] = useState(['revenue', 'budget', 'countries']);

  return (
    <DashboardShell>
      <PageHeader
        title="Reports"
        description="Build, schedule, and export beautiful reports for your team and stakeholders."
        icon={FileText}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Schedule
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New Report
            </Button>
          </>
        }
      />

      {/* Templates */}
      <div className="mt-6">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Templates</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {REPORT_TEMPLATES.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              onClick={() => setActive(t.name)}
              className={cn(
                'glass-card glass-card-hover surface-highlight group p-4 text-left',
                active === t.name && 'border-primary/40 shadow-glow-sm'
              )}
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ai-gradient-soft text-primary transition-transform group-hover:scale-110">
                <Layout className="h-4 w-4" />
              </span>
              <p className="mt-2.5 text-[13px] font-medium text-foreground">{t.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{t.description}</p>
              <p className="mt-2 text-[10px] text-muted-foreground/70">{t.widgets} widgets</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Builder preview */}
        <div className="lg:col-span-3">
          <SectionCard
            title={active}
            description="Drag-and-drop widgets — interactive preview"
            actions={
              <>
                <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs"><Download className="h-3.5 w-3.5" /> PDF</Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs"><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs"><Presentation className="h-3.5 w-3.5" /> PPT</Button>
              </>
            }
            delay={0.05}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Widget title="Revenue Trend" onRemove={() => setWidgets((w) => w.filter((x) => x !== 'revenue'))}>
                <TrendAreaChart data={REVENUE_TREND} dataKey="value" color="chart-2" height={180} valueFormat={(v) => formatCurrency(v, true)} />
              </Widget>
              <Widget title="Budget Allocation" onRemove={() => setWidgets((w) => w.filter((x) => x !== 'budget'))}>
                <DonutChart data={BUDGET_ALLOCATION} height={180} valueFormat={(v) => formatCurrency(v, true)} />
              </Widget>
              <Widget title="Top Countries" onRemove={() => setWidgets((w) => w.filter((x) => x !== 'countries'))}>
                <BarSeriesChart data={COUNTRY_PERFORMANCE.slice(0, 5).map((c) => ({ label: c.flag, value: c.conversions }))} color="chart-1" height={180} />
              </Widget>
              <Widget title="AI Summary" onRemove={() => {}}>
                <div className="rounded-xl border border-primary/20 bg-ai-gradient-soft p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary"><Sparkles className="h-3 w-3" /> AI Summary</div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-foreground/90">Revenue grew 23.8% driven by Brand Search. ROAS improved to 6.47x, well above the 4.0x benchmark. 12 approvals pending.</p>
                </div>
              </Widget>
            </div>
          </SectionCard>
        </div>

        {/* Saved reports */}
        <SectionCard title="Saved Reports" description="Scheduled & on-demand" delay={0.1}>
          <div className="space-y-2.5">
            {REPORTS_LIST.map((r, i) => {
              const Icon = formatIcons[r.format as keyof typeof formatIcons] ?? FileText;
              return (
                <motion.div key={r.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="group rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-card/70">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{r.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground"><Calendar className="h-2.5 w-2.5" /> {r.schedule}</p>
                    </div>
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10.5px] text-muted-foreground">{r.recipients} recipients · {r.lastSent}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="grid h-6 w-6 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" /> Preview</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="mr-2 h-3.5 w-3.5" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </DashboardShell>
  );
}

function Widget({ title, children, onRemove }: { title: string; children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="group relative rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <button onClick={onRemove} className="grid h-5 w-5 place-items-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {children}
    </div>
  );
}
