'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Paperclip,
  Pin,
  MessageSquare,
  Bookmark,
  Plus,
  Search,
  TrendingUp,
  PenLine,
  LineChart,
  Users,
  UserPlus,
  Calendar,
  TrendingDown,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  CornerDownLeft,
  Mic,
  PanelRightClose,
  PanelRightOpen,
  History,
} from 'lucide-react';
import { DashboardShell } from '@/layouts/dashboard-layout/dashboard-shell';
import {
  CONVERSATIONS,
  SAVED_PROMPTS,
  CHAT_MESSAGES,
  QUICK_COMMANDS,
  AI_INSIGHTS,
  APPROVAL_QUEUE,
  PLATFORMS,
} from '@/services/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';

const promptIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Search,
  PenLine,
  LineChart,
  Users,
  UserPlus,
};

const commandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  TrendingDown,
  Plus,
  FileSearch: Search,
};

const insightTone = {
  positive: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/12' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/12' },
  neutral: { icon: Info, color: 'text-primary', bg: 'bg-primary/12' },
};

type Message = (typeof CHAT_MESSAGES)[number];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [activeConv, setActiveConv] = useState('cv1');
  const [showRight, setShowRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setStreaming(true);

    // Simulated streaming assistant response
    const reply =
      "I'm analyzing your account now. Based on the last 30 days, I found **3 actionable opportunities**:\n\n1. **Brand Search** has 12% impression share lost to budget — scale +22% for +$18.4k/wk.\n2. **Display** is wasting $4.8k/wk — pause 14 keywords and reallocate to Search.\n3. **Retargeting** CTR dropped 0.4pts — refresh creative with 3 new variants.\n\nShall I prepare these as approval requests?";
    const aId = `a-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: aId, role: 'assistant', content: '', time: userMsg.time },
    ]);

    let i = 0;
    const step = 3;
    const timer = setInterval(() => {
      i += step;
      setMessages((m) =>
        m.map((msg) =>
          msg.id === aId ? { ...msg, content: reply.slice(0, i) } : msg
        )
      );
      if (i >= reply.length) {
        clearInterval(timer);
        setStreaming(false);
      }
    }, 18);
  };

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-7rem)] flex-col gap-4 lg:flex-row">
        {/* Left panel — conversation history */}
        <aside className="hidden w-64 shrink-0 flex-col gap-3 lg:flex">
          <div className="glass-card surface-highlight flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[13px] font-semibold">AI Assistant</span>
              </div>
              <Button size="icon" className="h-7 w-7 rounded-md" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative px-3 py-2">
              <Search className="absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search chats…"
                className="h-8 w-full rounded-md border border-border bg-card/40 pl-7 pr-3 text-[12px] outline-none placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
          </div>

          <div className="glass-card surface-highlight no-scrollbar flex-1 overflow-y-auto">
            <div className="border-b border-border/60 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            </div>
            {CONVERSATIONS.filter((c) => c.pinned).map((c) => (
              <ConvButton key={c.id} conv={c} active={activeConv === c.id} onClick={() => setActiveConv(c.id)} />
            ))}
            <div className="border-b border-l-2 border-border/60 border-l-primary/40 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <History className="h-3 w-3" /> Recent
              </span>
            </div>
            {CONVERSATIONS.filter((c) => !c.pinned).map((c) => (
              <ConvButton key={c.id} conv={c} active={activeConv === c.id} onClick={() => setActiveConv(c.id)} />
            ))}
          </div>

          {/* Saved prompts */}
          <div className="glass-card surface-highlight overflow-hidden">
            <div className="border-b border-border/60 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Bookmark className="h-3 w-3" /> Saved Prompts
              </span>
            </div>
            <div className="p-2">
              {SAVED_PROMPTS.map((p) => {
                const Icon = promptIcons[p.icon] ?? Sparkles;
                return (
                  <button
                    key={p.id}
                    onClick={() => send(p.label)}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="flex-1 truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center — chat */}
        <section className="glass-card surface-highlight flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-ai-gradient text-white shadow-glow-sm">
                <Sparkles className="h-4 w-4" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold">Optimize Brand Search ROAS</p>
                <p className="text-[11px] text-muted-foreground">GrowthFlow AI v4.2 · Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> New chat
              </Button>
              <button
                onClick={() => setShowRight((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {showRight ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-5 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} streaming={streaming && m.id === messages[messages.length - 1]?.id && m.role === 'assistant'} />
              ))}
            </div>
          </div>

          {/* Quick commands */}
          <div className="border-t border-border/60 px-5 pt-3">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
              {QUICK_COMMANDS.map((q) => {
                const Icon = commandIcons[q.icon] ?? Sparkles;
                return (
                  <button
                    key={q.id}
                    onClick={() => send(q.label)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <Icon className="h-3 w-3 text-primary" />
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="px-5 pb-5">
            <div className="glass-card surface-highlight flex items-end gap-2 p-2.5 focus-within:border-primary/40">
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask GrowthFlow AI anything about your campaigns…"
                className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-[13.5px] outline-none placeholder:text-muted-foreground"
              />
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                <Mic className="h-4 w-4" />
              </button>
              <Button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                size="icon"
                className="h-9 w-9 shrink-0 rounded-lg bg-ai-gradient shadow-glow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1 text-[10.5px] text-muted-foreground/70">
              <CornerDownLeft className="h-3 w-3" /> Enter to send · Shift+Enter for new line · AI may make mistakes
            </p>
          </div>
        </section>

        {/* Right panel — context */}
        <AnimatePresence>
          {showRight && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 overflow-hidden xl:block"
            >
              <div className="no-scrollbar h-full space-y-3 overflow-y-auto pr-1">
                {/* Campaign context */}
                <div className="glass-card surface-highlight overflow-hidden">
                  <div className="border-b border-border/60 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Campaign Context
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                      <p className="text-[12.5px] font-medium">Brand Search — Core</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <ContextStat label="ROAS" value="9.4x" tone="positive" />
                        <ContextStat label="Spend" value="$38.2k" />
                        <ContextStat label="CTR" value="5.9%" tone="positive" />
                        <ContextStat label="Conv." value="2,280" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected accounts */}
                <div className="glass-card surface-highlight overflow-hidden">
                  <div className="border-b border-border/60 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Connected Accounts
                    </span>
                  </div>
                  <div className="p-2">
                    {PLATFORMS.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
                        <span className={cn('grid h-7 w-7 place-items-center rounded-md text-[10px] font-bold', `bg-${p.color}/12`)} style={{ color: `hsl(var(--${p.color}))` }}>
                          {p.name.slice(0, 2)}
                        </span>
                        <span className="flex-1 text-[12px] text-foreground">{p.name}</span>
                        <StatusBadge variant={p.status === 'connected' ? 'success' : 'neutral'}>
                          {p.status === 'connected' ? 'Connected' : 'Soon'}
                        </StatusBadge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent insights */}
                <div className="glass-card surface-highlight overflow-hidden">
                  <div className="border-b border-border/60 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Recent Insights
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    {AI_INSIGHTS.map((ins) => {
                      const cfg = insightTone[ins.tone];
                      const Icon = cfg.icon;
                      return (
                        <div key={ins.id} className="flex gap-2.5 rounded-lg border border-border/60 bg-card/40 p-2.5">
                          <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md', cfg.bg, cfg.color)}>
                            <Icon className="h-3 w-3" />
                          </span>
                          <div>
                            <p className="text-[11.5px] font-medium leading-tight text-foreground">{ins.title}</p>
                            <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">{ins.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Approval queue */}
                <div className="glass-card surface-highlight overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Approval Queue
                    </span>
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">3</span>
                  </div>
                  <div className="space-y-2 p-3">
                    {APPROVAL_QUEUE.map((q) => (
                      <div key={q.id} className="rounded-lg border border-border/60 bg-card/40 p-2.5">
                        <p className="text-[12px] font-medium leading-tight text-foreground">{q.title}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[10.5px]">
                          <span className="font-medium text-success">{q.impact}</span>
                          <span className="text-muted-foreground">{q.confidence}% · {q.risk} risk</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge base */}
                <div className="glass-card surface-highlight overflow-hidden">
                  <div className="border-b border-border/60 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Knowledge Base
                    </span>
                  </div>
                  <div className="p-2">
                    {['Campaign Playbook', 'ROAS Benchmarks', 'Creative Best Practices', 'Negative Keyword Guide'].map((kb) => (
                      <button key={kb} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
                        <Bookmark className="h-3.5 w-3.5 text-primary" />
                        <span className="flex-1 truncate">{kb}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}

function ConvButton({ conv, active, onClick }: { conv: (typeof CONVERSATIONS)[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-0.5 border-b border-border/40 px-4 py-2.5 text-left transition-colors',
        active ? 'bg-primary/10' : 'hover:bg-muted/40'
      )}
    >
      <div className="flex items-center gap-1.5">
        <MessageSquare className={cn('h-3 w-3 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn('flex-1 truncate text-[12px] font-medium', active ? 'text-foreground' : 'text-foreground/80')}>{conv.title}</span>
        {conv.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </div>
      <p className="truncate pl-4 text-[10.5px] text-muted-foreground">{conv.preview}</p>
      <span className="pl-4 text-[10px] text-muted-foreground/60">{conv.time} ago</span>
    </button>
  );
}

function ContextStat({ label, value, tone }: { label: string; value: string; tone?: 'positive' }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className={cn('font-semibold tabular-nums', tone === 'positive' ? 'text-success' : 'text-foreground')}>{value}</p>
    </div>
  );
}

function MessageBubble({ message, streaming }: { message: Message; streaming: boolean }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      <div className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-semibold', isUser ? 'bg-muted text-foreground' : 'bg-ai-gradient text-white')}>
        {isUser ? 'AC' : <Sparkles className="h-4 w-4" />}
      </div>
      <div className={cn('max-w-[85%] space-y-2', isUser && 'items-end')}>
        <div className={cn('rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed', isUser ? 'bg-primary/15 text-foreground' : 'glass-card surface-highlight text-foreground')}>
          <MarkdownLite text={message.content} streaming={streaming} />
        </div>
        <div className={cn('flex items-center gap-2 text-[10px] text-muted-foreground/60', isUser && 'justify-end')}>
          <span>{message.time}</span>
          {!isUser && message.content && <span>· GrowthFlow AI</span>}
        </div>
        {!isUser && message.actions && message.content && (
          <div className="flex flex-wrap gap-2">
            {message.actions.map((a) => (
              <button
                key={a.label}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition-all',
                  a.type === 'approve'
                    ? 'bg-success/15 text-success hover:bg-success/25'
                    : a.type === 'apply'
                      ? 'bg-primary/15 text-primary hover:bg-primary/25'
                      : 'border border-border bg-card/40 text-foreground hover:border-primary/40'
                )}
              >
                {a.type === 'approve' && <CheckCircle2 className="h-3 w-3" />}
                {a.type === 'apply' && <Zap className="h-3 w-3" />}
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** Lightweight markdown: bold, tables, lists, headings. */
function MarkdownLite({ text, streaming }: { text: string; streaming?: boolean }) {
  if (!text) {
    return (
      <div className="flex items-center gap-1 py-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    );
  }

  const blocks = text.split('\n\n');
  return (
    <div className="space-y-2">
      {blocks.map((block, bi) => {
        // Table
        if (block.includes('|') && block.split('\n').some((l) => l.trim().startsWith('|'))) {
          const rows = block.split('\n').filter((l) => l.trim().startsWith('|'));
          const cells = rows.map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));
          if (cells.length >= 2) {
            const header = cells[0];
            const body = cells.slice(2);
            return (
              <div key={bi} className="overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      {header.map((h, hi) => (
                        <th key={hi} className="px-3 py-1.5 text-left font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, ri) => (
                      <tr key={ri} className="border-b border-border/40 last:border-0">
                        {row.map((c, ci) => (
                          <td key={ci} className={cn('px-3 py-1.5', ci === 0 ? 'font-medium text-foreground' : 'text-foreground/80')}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
        // List
        if (block.split('\n').every((l) => l.trim().startsWith('- ') || /^\d+\.\s/.test(l.trim()))) {
          const items = block.split('\n').map((l) => l.replace(/^[-\d.]+\s/, ''));
          return (
            <ol key={bi} className="ml-1 space-y-1.5">
              {items.map((it, ii) => (
                <li key={ii} className="flex gap-2 text-foreground/90">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">{ii + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: inlineBold(it) }} />
                </li>
              ))}
            </ol>
          );
        }
        // Heading
        if (block.startsWith('# ')) {
          return <p key={bi} className="text-[15px] font-semibold" dangerouslySetInnerHTML={{ __html: inlineBold(block.slice(2)) }} />;
        }
        // Paragraph
        return <p key={bi} className="leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: inlineBold(block) }} />;
      })}
      {streaming && <span className="typing-caret" />}
    </div>
  );
}

function inlineBold(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
}
