'use client';

import { useState, useMemo } from 'react';
import {
  Megaphone,
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  Pause,
  Play,
  Pencil,
  Copy,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { CampaignStatusBadge, AiScoreBadge } from '@/components/shared/status-badge';
import { Sparkline } from '@/components/shared/sparkline';
import { CAMPAIGNS } from '@/services/mock-data';
import { Campaign } from '@/types';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columnHelper = createColumnHelper<Campaign>();

export default function CampaignsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [drawer, setDrawer] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const columns = useMemo<ColumnDef<Campaign, any>[]>(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={() => setExpanded((e) => ({ ...e, [row.id]: !e[row.id] }))}
            className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {expanded[row.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ),
        size: 40,
        enableSorting: false,
      },
      {
        id: 'name',
        header: 'Campaign',
        accessorKey: 'name',
        cell: ({ row, getValue }) => (
          <button onClick={() => setDrawer(row.original)} className="flex items-center gap-2.5 text-left">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ai-gradient-soft text-[10px] font-bold text-primary">
              {getValue().slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground hover:text-primary">{getValue()}</p>
              <p className="text-[11px] text-muted-foreground">{row.original.owner}</p>
            </div>
          </button>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => <CampaignStatusBadge status={getValue()} />,
        size: 120,
      },
      {
        id: 'spend',
        header: 'Spend',
        accessorKey: 'spend',
        cell: ({ getValue }) => <span className="tabular-nums text-foreground">{formatCurrency(getValue(), true)}</span>,
        size: 100,
      },
      {
        id: 'clicks',
        header: 'Clicks',
        accessorKey: 'clicks',
        cell: ({ getValue }) => <span className="tabular-nums text-foreground/80">{formatNumber(getValue())}</span>,
        size: 90,
      },
      {
        id: 'ctr',
        header: 'CTR',
        accessorKey: 'ctr',
        cell: ({ getValue }) => <span className="tabular-nums text-foreground/80">{formatPercent(getValue())}</span>,
        size: 80,
      },
      {
        id: 'conversions',
        header: 'Conv.',
        accessorKey: 'conversions',
        cell: ({ getValue }) => <span className="tabular-nums text-foreground/80">{formatNumber(getValue())}</span>,
        size: 90,
      },
      {
        id: 'cpa',
        header: 'CPA',
        accessorKey: 'cpa',
        cell: ({ getValue }) => <span className="tabular-nums text-foreground/80">{formatCurrency(getValue())}</span>,
        size: 80,
      },
      {
        id: 'roas',
        header: 'ROAS',
        accessorKey: 'roas',
        cell: ({ getValue }) => {
          const v = getValue();
          const tone = v >= 6 ? 'text-success' : v >= 4 ? 'text-foreground' : v > 0 ? 'text-warning' : 'text-muted-foreground';
          return <span className={cn('tabular-nums font-semibold', tone)}>{v > 0 ? `${v}x` : '—'}</span>;
        },
        size: 80,
      },
      {
        id: 'aiScore',
        header: 'AI Score',
        accessorKey: 'aiScore',
        cell: ({ getValue }) => (getValue() > 0 ? <AiScoreBadge score={getValue()} /> : <span className="text-muted-foreground/40">—</span>),
        size: 90,
      },
      {
        id: 'trend',
        header: 'Trend',
        cell: ({ row }) => (
          <div className="w-[100px]">
            {row.original.dailySpend.some((v) => v > 0) ? (
              <Sparkline data={row.original.dailySpend} trend="up" height={28} color="chart-1" />
            ) : (
              <span className="text-muted-foreground/40">—</span>
            )}
          </div>
        ),
        enableSorting: false,
        size: 110,
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => setDrawer(row.original)}><Eye className="mr-2 h-3.5 w-3.5" /> View details</DropdownMenuItem>
              <DropdownMenuItem><Pencil className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
              <DropdownMenuItem><Copy className="mr-2 h-3.5 w-3.5" /> Duplicate</DropdownMenuItem>
              <DropdownMenuItem>{row.original.status === 'paused' ? <><Play className="mr-2 h-3.5 w-3.5" /> Resume</> : <><Pause className="mr-2 h-3.5 w-3.5" /> Pause</>}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        size: 50,
      },
    ],
    [expanded]
  );

  const filteredData = useMemo(
    () => (statusFilter === 'all' ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === statusFilter)),
    [statusFilter]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <DashboardShell>
      <PageHeader
        title="Campaigns"
        description="Manage and monitor all your Google Ads campaigns in one place."
        icon={Megaphone}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New Campaign
            </Button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search campaigns…"
              className="h-9 w-full rounded-lg border border-border bg-card/40 pl-9 pr-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" /> {statusFilter === 'all' ? 'All status' : statusFilter}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {['all', 'active', 'paused', 'draft', 'review', 'ended'].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="capitalize">
                  {s === 'all' ? 'All status' : s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>{table.getFilteredRowModel().rows.length} campaigns</span>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card surface-highlight mt-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border/60">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn('flex items-center gap-1', header.column.getCanSort() && 'cursor-pointer hover:text-foreground')}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, ri) => (
                <>
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: ri * 0.02 }}
                    className="border-b border-border/40 transition-colors hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                  <AnimatePresence>
                    {expanded[row.id] && (
                      <motion.tr
                        key={`${row.id}-exp`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-border/40 bg-background-secondary/40"
                      >
                        <td colSpan={row.getVisibleCells().length} className="px-4 py-4">
                          <ExpandedRow campaign={row.original} />
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-[12px]">
          <span className="text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-7 px-2.5">
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-7 px-2.5">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Details drawer */}
      <AnimatePresence>
        {drawer && <CampaignDrawer campaign={drawer} onClose={() => setDrawer(null)} />}
      </AnimatePresence>
    </DashboardShell>
  );
}

function ExpandedRow({ campaign }: { campaign: Campaign }) {
  const stats = [
    { label: 'Budget', value: formatCurrency(campaign.budget, true) },
    { label: 'Impressions', value: formatNumber(campaign.impressions) },
    { label: 'CPA', value: campaign.cpa > 0 ? formatCurrency(campaign.cpa) : '—' },
    { label: 'ROAS', value: campaign.roas > 0 ? `${campaign.roas}x` : '—' },
    { label: 'Start date', value: campaign.startDate },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-card/30 p-4 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Daily spend (14d)</p>
        <div className="h-16">
          {campaign.dailySpend.some((v) => v > 0) ? (
            <Sparkline data={campaign.dailySpend} trend="up" height={64} color="chart-2" />
          ) : (
            <div className="grid h-full place-items-center text-[11px] text-muted-foreground/50">No spend yet</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 lg:col-span-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border/50 bg-background/40 p-2.5">
            <p className="text-[10.5px] text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignDrawer({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
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
        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-border bg-background-secondary p-6 shadow-elevated"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-ai-gradient-soft text-sm font-bold text-primary">
              {campaign.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight text-foreground">{campaign.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <CampaignStatusBadge status={campaign.status} />
                <span className="text-[11px] text-muted-foreground">{campaign.owner}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="h-4 w-4 rotate-90" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { l: 'Spend', v: formatCurrency(campaign.spend, true) },
            { l: 'Budget', v: formatCurrency(campaign.budget, true) },
            { l: 'Clicks', v: formatNumber(campaign.clicks) },
            { l: 'Impressions', v: formatNumber(campaign.impressions) },
            { l: 'CTR', v: formatPercent(campaign.ctr) },
            { l: 'Conversions', v: formatNumber(campaign.conversions) },
            { l: 'CPA', v: campaign.cpa > 0 ? formatCurrency(campaign.cpa) : '—' },
            { l: 'ROAS', v: campaign.roas > 0 ? `${campaign.roas}x` : '—' },
            { l: 'AI Score', v: campaign.aiScore > 0 ? `${campaign.aiScore}/100` : '—' },
          ].map((s) => (
            <div key={s.l} className="glass-card surface-highlight p-3">
              <p className="text-[11px] text-muted-foreground">{s.l}</p>
              <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-foreground">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 glass-card surface-highlight p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Daily spend trend</p>
          <div className="mt-3 h-32">
            {campaign.dailySpend.some((v) => v > 0) ? (
              <Sparkline data={campaign.dailySpend} trend="up" height={128} color="chart-2" />
            ) : (
              <div className="grid h-full place-items-center text-[12px] text-muted-foreground/50">No spend recorded yet</div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button className="flex-1 gap-1.5"><Pencil className="h-4 w-4" /> Edit campaign</Button>
          <Button variant="outline" className="gap-1.5">{campaign.status === 'paused' ? <><Play className="h-4 w-4" /> Resume</> : <><Pause className="h-4 w-4" /> Pause</>}</Button>
        </div>
      </motion.div>
    </>
  );
}
