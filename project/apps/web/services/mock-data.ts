import {
  APP_CONFIG,
  PLATFORMS,
} from '@/config/app.config';
import {
  Kpi,
  Campaign,
  ApprovalCard,
  Activity,
  Conversation,
  ChatMessage,
  AutomationRule,
  Notification,
  SeriesPoint,
} from '@/types';

export { APP_CONFIG, PLATFORMS };

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function seededSeries(seed: number, n: number, min: number, max: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const v = min + (s / 233280) * (max - min);
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* KPIs                                                               */
/* ------------------------------------------------------------------ */

export const KPIS: Kpi[] = [
  {
    id: 'spend',
    label: 'Monthly Spend',
    value: 284500,
    format: 'currency',
    trend: 'up',
    delta: 12.4,
    status: 'neutral',
    sparkline: seededSeries(11, 14, 18000, 26000),
    insight: 'On pace to use 94% of monthly budget.',
    compareLabel: 'vs last month',
    compareValue: 253100,
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 1842000,
    format: 'currency',
    trend: 'up',
    delta: 23.8,
    status: 'positive',
    sparkline: seededSeries(21, 14, 110000, 165000),
    insight: 'Best performing month this quarter.',
    compareLabel: 'vs last month',
    compareValue: 1487000,
  },
  {
    id: 'roas',
    label: 'ROAS',
    value: 6.47,
    format: 'ratio',
    trend: 'up',
    delta: 8.2,
    status: 'positive',
    sparkline: seededSeries(31, 14, 5.4, 6.6),
    insight: 'Above industry benchmark of 4.0x.',
    compareLabel: 'vs last month',
    compareValue: 5.98,
  },
  {
    id: 'ctr',
    label: 'CTR',
    value: 4.82,
    format: 'percent',
    trend: 'up',
    delta: 1.3,
    status: 'positive',
    sparkline: seededSeries(41, 14, 3.9, 4.9),
    insight: 'Search CTR up 1.3pts from creative refresh.',
    compareLabel: 'vs last month',
    compareValue: 4.49,
  },
  {
    id: 'cpa',
    label: 'CPA',
    value: 38.2,
    format: 'currency',
    trend: 'down',
    delta: -14.6,
    status: 'positive',
    sparkline: seededSeries(51, 14, 36, 52),
    insight: 'Lowest CPA in 6 months.',
    compareLabel: 'vs last month',
    compareValue: 44.8,
  },
  {
    id: 'conversions',
    label: 'Conversions',
    value: 7440,
    format: 'number',
    trend: 'up',
    delta: 18.1,
    status: 'positive',
    sparkline: seededSeries(61, 14, 380, 620),
    insight: 'Driven by brand + retargeting.',
    compareLabel: 'vs last month',
    compareValue: 6305,
  },
  {
    id: 'profit',
    label: 'Profit',
    value: 1557500,
    format: 'currency',
    trend: 'up',
    delta: 27.3,
    status: 'positive',
    sparkline: seededSeries(71, 14, 88000, 142000),
    insight: 'Profit margin improved to 84.5%.',
    compareLabel: 'vs last month',
    compareValue: 1223000,
  },
  {
    id: 'budget',
    label: 'Budget Remaining',
    value: 65500,
    format: 'currency',
    trend: 'down',
    delta: -6.0,
    status: 'warning',
    sparkline: seededSeries(81, 14, 60000, 95000),
    insight: 'Reserve budget before month end.',
    compareLabel: 'of $350k',
    compareValue: 350000,
  },
];

/* ------------------------------------------------------------------ */
/* Time series                                                        */
/* ------------------------------------------------------------------ */

export const SPEND_TREND: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 7000 + Math.sin(i / 3) * 1200 + i * 90;
  return {
    label: `Day ${i + 1}`,
    value: Math.round(base + (i > 24 ? 600 : 0)),
    compare: Math.round(base - 800),
  };
});

export const REVENUE_TREND: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 42000 + Math.sin(i / 4) * 5000 + i * 480;
  return {
    label: `Day ${i + 1}`,
    value: Math.round(base),
    compare: Math.round(base - 7000),
    forecast: i > 22 ? Math.round(base + 2400 + i * 60) : undefined,
    lower: i > 22 ? Math.round(base + 800) : undefined,
    upper: i > 22 ? Math.round(base + 4200) : undefined,
  };
});

export const CONVERSION_TREND: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 180 + Math.sin(i / 2.5) * 40 + i * 6;
  return { label: `Day ${i + 1}`, value: Math.round(base), compare: Math.round(base - 30) };
});

export const CTR_TREND: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 4.2 + Math.sin(i / 3.2) * 0.4 + i * 0.03;
  return { label: `Day ${i + 1}`, value: Number(base.toFixed(2)) };
});

export const ROAS_TREND: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 5.8 + Math.sin(i / 4) * 0.5 + i * 0.04;
  return { label: `Day ${i + 1}`, value: Number(base.toFixed(2)) };
});

export const HOURLY_HEATMAP: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const peak = hour >= 9 && hour <= 21;
    const weekend = day === 0 || day === 6;
    const base = peak ? 60 : 18;
    const variance = Math.sin((hour / 24) * Math.PI * 2 + day) * 22;
    const v = base + variance + (weekend ? -12 : 8) + (hour % 5 === 0 ? 6 : 0);
    return Math.max(4, Math.min(100, Math.round(v)));
  })
);

export const BUDGET_ALLOCATION = [
  { name: 'Search', value: 142000, color: 'chart-1' },
  { name: 'Display', value: 38000, color: 'chart-2' },
  { name: 'Video', value: 52000, color: 'chart-3' },
  { name: 'Shopping', value: 41500, color: 'chart-4' },
  { name: 'Performance Max', value: 11000, color: 'chart-5' },
];

export const COUNTRY_PERFORMANCE = [
  { country: 'United States', flag: 'US', conversions: 3120, spend: 128400, roas: 6.9 },
  { country: 'United Kingdom', flag: 'GB', conversions: 1180, spend: 41200, roas: 6.1 },
  { country: 'Germany', flag: 'DE', conversions: 880, spend: 32600, roas: 5.4 },
  { country: 'Canada', flag: 'CA', conversions: 760, spend: 24800, roas: 7.2 },
  { country: 'Australia', flag: 'AU', conversions: 540, spend: 18900, roas: 6.8 },
  { country: 'France', flag: 'FR', conversions: 420, spend: 16200, roas: 5.1 },
  { country: 'Netherlands', flag: 'NL', conversions: 310, spend: 11400, roas: 6.0 },
  { country: 'Sweden', flag: 'SE', conversions: 230, spend: 8000, roas: 5.8 },
];

export const DEVICE_PERFORMANCE = [
  { device: 'Mobile', clicks: 48200, conversions: 4120, spend: 128400, share: 58 },
  { device: 'Desktop', clicks: 24800, conversions: 2380, spend: 98200, share: 31 },
  { device: 'Tablet', clicks: 9400, conversions: 940, spend: 21900, share: 11 },
];

export const AUDIENCE_PERFORMANCE = [
  { segment: 'Brand Search', size: 184000, conversions: 2280, roas: 9.4 },
  { segment: 'Non-Brand Search', size: 412000, conversions: 1640, roas: 4.8 },
  { segment: 'Retargeting', size: 92000, conversions: 1480, roas: 8.1 },
  { segment: 'Lookalike 1%', size: 320000, conversions: 920, roas: 5.2 },
  { segment: 'In-Market', size: 540000, conversions: 720, roas: 4.1 },
  { segment: 'Similar Audiences', size: 280000, conversions: 400, roas: 3.9 },
];

export const KEYWORD_PERFORMANCE = [
  { keyword: 'ai marketing platform', volume: 14800, cpc: 4.2, ctr: 6.8, conversions: 320, difficulty: 62 },
  { keyword: 'growth marketing software', volume: 9200, cpc: 5.1, ctr: 5.4, conversions: 210, difficulty: 71 },
  { keyword: 'google ads automation', volume: 6400, cpc: 3.8, ctr: 7.2, conversions: 280, difficulty: 48 },
  { keyword: 'marketing automation tools', volume: 22100, cpc: 6.4, ctr: 4.1, conversions: 180, difficulty: 78 },
  { keyword: 'roas optimization', volume: 4100, cpc: 3.2, ctr: 8.1, conversions: 240, difficulty: 39 },
  { keyword: 'campaign optimization ai', volume: 3200, cpc: 4.6, ctr: 7.6, conversions: 160, difficulty: 44 },
  { keyword: 'ad spend tracker', volume: 5800, cpc: 2.9, ctr: 5.9, conversions: 140, difficulty: 36 },
  { keyword: 'ppc management platform', volume: 7600, cpc: 5.8, ctr: 4.8, conversions: 120, difficulty: 67 },
];

export const FUNNEL_STAGES = [
  { stage: 'Impressions', value: 1840000, color: 'chart-1' },
  { stage: 'Clicks', value: 82400, color: 'chart-2' },
  { stage: 'Visits', value: 71800, color: 'chart-3' },
  { stage: 'Leads', value: 14800, color: 'chart-4' },
  { stage: 'Conversions', value: 7440, color: 'chart-5' },
];

/* ------------------------------------------------------------------ */
/* Campaigns                                                          */
/* ------------------------------------------------------------------ */

export const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Brand Search — Core', platform: 'google-ads', status: 'active', budget: 45000, spend: 38200, clicks: 18400, impressions: 312000, ctr: 5.9, conversions: 2280, cpa: 16.8, roas: 9.4, aiScore: 94, owner: 'Alex Chen', dailySpend: seededSeries(1, 14, 2400, 3100), startDate: '2025-01-04' },
  { id: 'c2', name: 'Non-Brand Search — SaaS', platform: 'google-ads', status: 'active', budget: 78000, spend: 64100, clicks: 22400, impressions: 540000, ctr: 4.1, conversions: 1640, cpa: 39.1, roas: 4.8, aiScore: 78, owner: 'Priya Shah', dailySpend: seededSeries(2, 14, 3800, 5200), startDate: '2025-01-04' },
  { id: 'c3', name: 'Performance Max — Growth', platform: 'google-ads', status: 'active', budget: 52000, spend: 47300, clicks: 12800, impressions: 980000, ctr: 1.3, conversions: 920, cpa: 51.4, roas: 5.2, aiScore: 71, owner: 'Marcus Webb', dailySpend: seededSeries(3, 14, 3000, 3900), startDate: '2025-02-10' },
  { id: 'c4', name: 'Retargeting — All Visitors', platform: 'google-ads', status: 'active', budget: 24000, spend: 19800, clicks: 9400, impressions: 420000, ctr: 2.2, conversions: 1480, cpa: 13.4, roas: 8.1, aiScore: 88, owner: 'Priya Shah', dailySpend: seededSeries(4, 14, 1200, 1700), startDate: '2025-01-18' },
  { id: 'c5', name: 'Display — Awareness', platform: 'google-ads', status: 'paused', budget: 18000, spend: 11200, clicks: 4200, impressions: 1240000, ctr: 0.34, conversions: 180, cpa: 62.2, roas: 2.1, aiScore: 42, owner: 'Marcus Webb', dailySpend: seededSeries(5, 14, 600, 1000), startDate: '2025-02-22' },
  { id: 'c6', name: 'Shopping — Product Feed', platform: 'google-ads', status: 'active', budget: 34000, spend: 28400, clicks: 14800, impressions: 380000, ctr: 3.9, conversions: 1120, cpa: 25.4, roas: 6.4, aiScore: 81, owner: 'Alex Chen', dailySpend: seededSeries(6, 14, 1800, 2400), startDate: '2025-01-11' },
  { id: 'c7', name: 'Video — YouTube Pre-roll', platform: 'google-ads', status: 'review', budget: 22000, spend: 14800, clicks: 3600, impressions: 1840000, ctr: 0.2, conversions: 240, cpa: 61.7, roas: 3.4, aiScore: 58, owner: 'Sara Lin', dailySpend: seededSeries(7, 14, 900, 1300), startDate: '2025-03-02' },
  { id: 'c8', name: 'Competitor Conquesting', platform: 'google-ads', status: 'active', budget: 16000, spend: 13900, clicks: 6800, impressions: 148000, ctr: 4.6, conversions: 480, cpa: 28.9, roas: 5.6, aiScore: 76, owner: 'Alex Chen', dailySpend: seededSeries(8, 14, 800, 1200), startDate: '2025-02-15' },
  { id: 'c9', name: 'DSA — Dynamic Search', platform: 'google-ads', status: 'draft', budget: 12000, spend: 0, clicks: 0, impressions: 0, ctr: 0, conversions: 0, cpa: 0, roas: 0, aiScore: 0, owner: 'Priya Shah', dailySpend: seededSeries(9, 14, 0, 0), startDate: '2025-04-01' },
  { id: 'c10', name: 'Lookalike — 1% Expand', platform: 'google-ads', status: 'active', budget: 28000, spend: 22400, clicks: 8200, impressions: 620000, ctr: 1.3, conversions: 720, cpa: 31.1, roas: 5.2, aiScore: 73, owner: 'Marcus Webb', dailySpend: seededSeries(10, 14, 1400, 1900), startDate: '2025-02-28' },
  { id: 'c11', name: 'Holiday Push — Q4', platform: 'google-ads', status: 'ended', budget: 60000, spend: 58200, clicks: 21000, impressions: 880000, ctr: 2.4, conversions: 1840, cpa: 31.6, roas: 6.8, aiScore: 85, owner: 'Sara Lin', dailySpend: seededSeries(11, 14, 3600, 4400), startDate: '2024-11-15' },
  { id: 'c12', name: 'Geo — West Coast Test', platform: 'google-ads', status: 'paused', budget: 9000, spend: 6400, clicks: 2800, impressions: 76000, ctr: 3.7, conversions: 220, cpa: 29.1, roas: 4.4, aiScore: 64, owner: 'Alex Chen', dailySpend: seededSeries(12, 14, 400, 600), startDate: '2025-03-10' },
];

/* ------------------------------------------------------------------ */
/* Approval Center                                                    */
/* ------------------------------------------------------------------ */

export const APPROVALS: ApprovalCard[] = [
  { id: 'a1', title: 'Increase budget on Brand Search', recommendation: 'Raise daily budget by 22% on Brand Search — Core. ROAS at 9.4x with headroom to scale.', confidence: 96, expectedImpact: 18400, expectedSaving: 0, risk: 'low', executionTime: '2 min', campaign: 'Brand Search — Core', status: 'pending', category: 'Budget', requestedBy: 'GrowthFlow AI' },
  { id: 'a2', title: 'Pause 14 underperforming keywords', recommendation: '14 keywords on Non-Brand Search have CPA > $90 and CTR < 1.2%. Pausing frees $4,800/wk.', confidence: 91, expectedImpact: 0, expectedSaving: 4800, risk: 'low', executionTime: '1 min', campaign: 'Non-Brand Search — SaaS', status: 'pending', category: 'Keywords', requestedBy: 'GrowthFlow AI' },
  { id: 'a3', title: 'Launch 4 new responsive search ads', recommendation: 'AI generated 4 RSA variants predicted to lift CTR by 0.8pts based on creative analysis.', confidence: 84, expectedImpact: 9200, expectedSaving: 0, risk: 'medium', executionTime: '5 min', campaign: 'Non-Brand Search — SaaS', status: 'needs-review', category: 'Creative', requestedBy: 'GrowthFlow AI' },
  { id: 'a4', title: 'Shift $12k from Display to Search', recommendation: 'Display ROAS at 2.1x vs Search at 4.8x. Reallocate to capture demand.', confidence: 88, expectedImpact: 28800, expectedSaving: 0, risk: 'medium', executionTime: '3 min', campaign: 'Display — Awareness', status: 'needs-review', category: 'Budget', requestedBy: 'GrowthFlow AI' },
  { id: 'a5', title: 'Add 38 negative keywords', recommendation: '38 search terms wasting $1,200/wk on irrelevant queries. Add as exact negatives.', confidence: 97, expectedImpact: 0, expectedSaving: 1200, risk: 'low', executionTime: '1 min', campaign: 'Performance Max — Growth', status: 'approved', category: 'Keywords', requestedBy: 'GrowthFlow AI' },
  { id: 'a6', title: 'Adjust bidding strategy to tROAS', recommendation: 'Retargeting campaign is stable. Switch to target ROAS 8.0x for better efficiency.', confidence: 79, expectedImpact: 6400, expectedSaving: 0, risk: 'medium', executionTime: '4 min', campaign: 'Retargeting — All Visitors', status: 'executing', category: 'Bidding', requestedBy: 'Priya Shah' },
  { id: 'a7', title: 'Refresh creative on Video campaign', recommendation: 'CTR dropped 0.3pts over 14 days. Generate 3 new video hooks and swap.', confidence: 72, expectedImpact: 4200, expectedSaving: 0, risk: 'medium', executionTime: '12 min', campaign: 'Video — YouTube Pre-roll', status: 'executing', category: 'Creative', requestedBy: 'GrowthFlow AI' },
  { id: 'a8', title: 'Increase geo bid modifiers West Coast', recommendation: 'CA + WA + OR converting 22% above average. +15% bid modifier recommended.', confidence: 86, expectedImpact: 7600, expectedSaving: 0, risk: 'low', executionTime: '2 min', campaign: 'Geo — West Coast Test', status: 'completed', category: 'Bidding', requestedBy: 'GrowthFlow AI' },
  { id: 'a9', title: 'Add audience exclusions', recommendation: 'Exclude past converters (30d) from prospecting to reduce wasted spend.', confidence: 93, expectedImpact: 0, expectedSaving: 2100, risk: 'low', executionTime: '1 min', campaign: 'Lookalike — 1% Expand', status: 'completed', category: 'Audience', requestedBy: 'GrowthFlow AI' },
  { id: 'a10', title: 'Reduce Shopping bids on low-margin SKUs', recommendation: '12 SKUs have < 8% margin. Reduce bids 30% to protect profitability.', confidence: 81, expectedImpact: 0, expectedSaving: 3400, risk: 'medium', executionTime: '3 min', campaign: 'Shopping — Product Feed', status: 'failed', category: 'Bidding', requestedBy: 'Marcus Webb' },
  { id: 'a11', title: 'Schedule Display campaign for peak hours', recommendation: 'Display performs 3x better 9am-9pm. Apply ad schedule with -60% off-peak.', confidence: 89, expectedImpact: 5200, expectedSaving: 1800, risk: 'low', executionTime: '2 min', campaign: 'Display — Awareness', status: 'pending', category: 'Schedule', requestedBy: 'GrowthFlow AI' },
  { id: 'a12', title: 'Generate competitor conquesting ad copy', recommendation: '3 competitors show share-of-voice gaps. Generate comparison ad copy.', confidence: 77, expectedImpact: 11200, expectedSaving: 0, risk: 'high', executionTime: '8 min', campaign: 'Competitor Conquesting', status: 'needs-review', category: 'Creative', requestedBy: 'GrowthFlow AI' },
];

/* ------------------------------------------------------------------ */
/* Activities                                                         */
/* ------------------------------------------------------------------ */

export const ACTIVITIES: Activity[] = [
  { id: 'ac1', title: 'AI optimized bids on 3 campaigns', description: 'Brand Search, Retargeting, and Shopping bids adjusted based on conversion data.', time: '2 min ago', type: 'ai' },
  { id: 'ac2', title: 'Approval requested: Shift $12k budget', description: 'GrowthFlow AI recommends reallocating Display budget to Search.', time: '14 min ago', type: 'approval' },
  { id: 'ac3', title: 'Performance Max — Growth hit daily budget', description: 'Campaign reached 98% of daily budget at 3:42 PM.', time: '48 min ago', type: 'campaign' },
  { id: 'ac4', title: 'Automation "Pause Low ROAS" executed', description: 'Paused 4 ad groups with ROAS below 2.0x for 3+ days.', time: '1 hr ago', type: 'automation' },
  { id: 'ac5', title: 'Sara Lin joined the workspace', description: 'Sara Lin accepted the invitation to Northwind Labs.', time: '3 hr ago', type: 'team', user: 'Sara Lin' },
  { id: 'ac6', title: 'Weekly report scheduled', description: 'Executive summary report will be emailed every Monday 8 AM.', time: '5 hr ago', type: 'system' },
  { id: 'ac7', title: 'AI generated 4 new ad variants', description: 'New RSA drafts ready for review on Non-Brand Search.', time: '6 hr ago', type: 'ai' },
  { id: 'ac8', title: 'Budget alert: 94% of monthly budget used', description: 'Consider increasing monthly cap or reallocating.', time: '8 hr ago', type: 'system' },
];

/* ------------------------------------------------------------------ */
/* AI Assistant                                                       */
/* ------------------------------------------------------------------ */

export const CONVERSATIONS: Conversation[] = [
  { id: 'cv1', title: 'Optimize Brand Search ROAS', preview: 'I analyzed your top campaign and found...', time: '2m', pinned: true, unread: true },
  { id: 'cv2', title: 'Why did CPA spike last week?', preview: 'Looking at the data, the spike was driven by...', time: '1h', pinned: true },
  { id: 'cv3', title: 'Generate Q3 budget plan', preview: 'Here is a recommended allocation across...', time: '3h' },
  { id: 'cv4', title: 'Competitor analysis: 3 rivals', preview: 'I found share-of-voice gaps against...', time: '5h' },
  { id: 'cv5', title: 'New RSA creative variants', preview: 'I drafted 4 responsive search ad variants...', time: '8h' },
  { id: 'cv6', title: 'Audience expansion ideas', preview: 'Based on converter data, lookalike audiences...', time: '1d' },
  { id: 'cv7', title: 'Weekly performance summary', preview: 'This week revenue grew 18% driven by...', time: '2d' },
  { id: 'cv8', title: 'Negative keyword cleanup', preview: 'I identified 38 wasteful search terms...', time: '3d' },
];

export const SAVED_PROMPTS = [
  { id: 'p1', label: 'Optimize my top campaign', icon: 'TrendingUp' },
  { id: 'p2', label: 'Find wasted spend', icon: 'Search' },
  { id: 'p3', label: 'Generate ad copy', icon: 'PenLine' },
  { id: 'p4', label: 'Forecast next month', icon: 'LineChart' },
  { id: 'p5', label: 'Competitor analysis', icon: 'Users' },
  { id: 'p6', label: 'Audience recommendations', icon: 'UserPlus' },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Optimize my Brand Search — Core campaign. What should I change to scale revenue without hurting ROAS?',
    time: '10:24 AM',
  },
  {
    id: 'm2',
    role: 'assistant',
    content: `I analyzed **Brand Search — Core** over the last 30 days. It's your strongest campaign with a **9.4x ROAS** and \$38.2k spend of a \$45k budget.\n\nHere's what I found:\n\n| Lever | Current | Opportunity |\n|---|---|---|\n| Daily budget | \$1,400 | +22% to \$1,708 |\n| Avg CPC | \$2.08 | -8% via bid refinement |\n| Impression share | 71% | +9pts with budget lift |\n| Lost IS (budget) | 12% | → ~0% |\n\n**Recommended actions:**\n\n1. Increase daily budget by 22% — you're losing 12% of impression share to budget.\n2. Refine exact-match bids on top 5 converting keywords.\n3. Add 6 negative keywords I flagged from the search term report.\n\nForecasted impact: **+\$18,400 revenue / week** at maintained 9.0x+ ROAS.`,
    time: '10:24 AM',
    actions: [
      { label: 'Approve budget increase', type: 'approve' },
      { label: 'Apply negative keywords', type: 'apply' },
      { label: 'See full analysis', type: 'detail' },
    ],
  },
];

export const QUICK_COMMANDS = [
  { id: 'q1', label: 'Summarize this week', icon: 'Calendar' },
  { id: 'q2', label: 'Show underperforming ads', icon: 'TrendingDown' },
  { id: 'q3', label: 'Create new campaign', icon: 'Plus' },
  { id: 'q4', label: 'Audit landing page', icon: 'FileSearch' },
];

export const AI_INSIGHTS = [
  { id: 'i1', title: 'Revenue pacing ahead', detail: '18% above target with 6 days left in month.', tone: 'positive' as const },
  { id: 'i2', title: 'Budget at risk', detail: 'Display campaign wasting \$4.8k/wk. Reallocate recommended.', tone: 'warning' as const },
  { id: 'i3', title: 'New competitor detected', detail: 'Agilink raised bids on 8 shared keywords.', tone: 'neutral' as const },
  { id: 'i4', title: 'Audience opportunity', detail: 'Lookalike 1% has \$6.4k/wk revenue headroom.', tone: 'positive' as const },
];

export const APPROVAL_QUEUE = [
  { id: 'q1', title: 'Budget +22% Brand Search', impact: '+$18.4k/wk', risk: 'Low', confidence: 96 },
  { id: 'q2', title: 'Pause 14 keywords', impact: '+$4.8k/wk saved', risk: 'Low', confidence: 91 },
  { id: 'q3', title: 'Launch 4 RSA variants', impact: '+0.8pts CTR', risk: 'Medium', confidence: 84 },
];

/* ------------------------------------------------------------------ */
/* Automation                                                         */
/* ------------------------------------------------------------------ */

export const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'r1', name: 'Pause Low ROAS Ad Groups', description: 'Auto-pause ad groups with ROAS below 2.0x for 3+ consecutive days.', trigger: 'ROAS < 2.0 for 3 days', action: 'Pause ad group', status: 'active', executions: 142, successRate: 99.3, lastRun: '1 hr ago', schedule: 'Daily 12:00 AM' },
  { id: 'r2', name: 'Scale Winning Campaigns', description: 'Increase daily budget by 15% for campaigns with ROAS > 6x and < 80% budget utilization.', trigger: 'ROAS > 6.0 & IS lost (budget) > 5%', action: 'Increase budget 15%', status: 'active', executions: 38, successRate: 97.4, lastRun: '3 hr ago', schedule: 'Every 6 hours' },
  { id: 'r3', name: 'Negative Keyword Sync', description: 'Add search terms with CPA > $80 and > 5 clicks as exact negative keywords.', trigger: 'Search term CPA > $80', action: 'Add negative keyword', status: 'active', executions: 412, successRate: 100, lastRun: '20 min ago', schedule: 'Hourly' },
  { id: 'r4', name: 'Budget Pacing Alert', description: 'Notify team when monthly budget utilization crosses 90%.', trigger: 'Budget used > 90%', action: 'Send notification', status: 'active', executions: 6, successRate: 100, lastRun: '8 hr ago', schedule: 'Daily 6:00 PM' },
  { id: 'r5', name: 'Off-Hours Bid Reduction', description: 'Reduce bids 40% between 11 PM and 6 AM for non-24/7 campaigns.', trigger: 'Time is 11 PM - 6 AM', action: 'Apply -40% bid modifier', status: 'paused', executions: 0, successRate: 0, lastRun: 'Never', schedule: 'Nightly' },
  { id: 'r6', name: 'Creative Refresh Detection', description: 'Flag ads with CTR declining > 20% over 7 days for creative review.', trigger: 'CTR decline > 20% / 7d', action: 'Create approval request', status: 'active', executions: 24, successRate: 95.8, lastRun: '2 hr ago', schedule: 'Daily 9:00 AM' },
  { id: 'r7', name: 'Anomaly Detection', description: 'Pause spend when CPA spikes > 150% above 14-day rolling average.', trigger: 'CPA > 150% of 14d avg', action: 'Pause + alert', status: 'error', executions: 18, successRate: 88.9, lastRun: '4 hr ago', schedule: 'Every 15 min' },
];

export const AUTOMATION_LOGS = [
  { id: 'l1', rule: 'Negative Keyword Sync', status: 'success', detail: 'Added 6 negative keywords to Non-Brand Search', time: '20 min ago' },
  { id: 'l2', rule: 'Scale Winning Campaigns', status: 'success', detail: 'Increased Brand Search budget +15%', time: '3 hr ago' },
  { id: 'l3', rule: 'Pause Low ROAS Ad Groups', status: 'success', detail: 'Paused 4 ad groups on Display', time: '4 hr ago' },
  { id: 'l4', rule: 'Anomaly Detection', status: 'error', detail: 'Failed to pause — permissions error on Shopping', time: '4 hr ago' },
  { id: 'l5', rule: 'Creative Refresh Detection', status: 'success', detail: 'Created approval for Video campaign refresh', time: '6 hr ago' },
  { id: 'l6', rule: 'Budget Pacing Alert', status: 'success', detail: 'Alert sent to #growth-team', time: '8 hr ago' },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                      */
/* ------------------------------------------------------------------ */

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Approval needed: Budget +22% on Brand Search', description: 'GrowthFlow AI recommends scaling your top campaign. Expected +$18.4k/wk.', time: '2 min ago', group: 'today', type: 'approval', read: false },
  { id: 'n2', title: 'Automation executed: 6 negatives added', description: 'Negative Keyword Sync added 6 exact negatives to Non-Brand Search.', time: '22 min ago', group: 'today', type: 'automation', read: false },
  { id: 'n3', title: 'Performance Max hit daily budget', description: 'Campaign reached 98% of daily budget at 3:42 PM.', time: '1 hr ago', group: 'today', type: 'campaign', read: false },
  { id: 'n4', title: 'AI insight: Audience opportunity', description: 'Lookalike 1% has $6.4k/wk revenue headroom.', time: '2 hr ago', group: 'today', type: 'ai', read: true },
  { id: 'n5', title: 'Sara Lin joined the workspace', description: 'Sara accepted your invitation to Northwind Labs.', time: '3 hr ago', group: 'today', type: 'team', read: true },
  { id: 'n6', title: 'Weekly report delivered', description: 'Executive summary sent to leadership@northwind.co.', time: '8 hr ago', group: 'today', type: 'system', read: true },
  { id: 'n7', title: 'Budget at 90% utilization', description: 'Monthly budget pacing alert — consider increasing cap.', time: 'Yesterday at 6:00 PM', group: 'yesterday', type: 'system', read: true },
  { id: 'n8', title: 'Approval approved: Geo bid modifiers', description: 'West Coast +15% bid modifier applied successfully.', time: 'Yesterday at 2:14 PM', group: 'yesterday', type: 'approval', read: true },
  { id: 'n9', title: 'New competitor detected', description: 'Agilink raised bids on 8 shared keywords.', time: 'Yesterday at 9:30 AM', group: 'yesterday', type: 'ai', read: true },
  { id: 'n10', title: 'Invoice paid — $4,800', description: 'Your Enterprise plan invoice for June was paid.', time: '2 days ago', group: 'earlier', type: 'billing', read: true },
  { id: 'n11', title: 'Campaign ended: Holiday Push — Q4', description: 'Holiday campaign ended. Final ROAS 6.8x.', time: '4 days ago', group: 'earlier', type: 'campaign', read: true },
  { id: 'n12', title: 'API key rotated', description: 'Production API key was rotated by Alex Chen.', time: '6 days ago', group: 'earlier', type: 'system', read: true },
];

/* ------------------------------------------------------------------ */
/* Forecast & Risk                                                    */
/* ------------------------------------------------------------------ */

export const FORECAST = Array.from({ length: 12 }, (_, i) => {
  const base = 120000 + i * 14000 + Math.sin(i / 2) * 12000;
  return {
    label: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    actual: i < 7 ? Math.round(base * 0.78) : undefined,
    forecast: Math.round(base),
    lower: Math.round(base * 0.82),
    upper: Math.round(base * 1.16),
  };
});

export const RISK_FACTORS = [
  { id: 'rf1', label: 'Budget exhaustion', level: 'high' as const, detail: '6 days left, 94% used', impact: 'Campaigns may pause' },
  { id: 'rf2', label: 'Competitor aggression', level: 'medium' as const, detail: 'Agilink +18% bids', impact: 'CPC inflation on 8 kw' },
  { id: 'rf3', label: 'Creative fatigue', level: 'medium' as const, detail: 'Video CTR -0.3pts/14d', impact: 'Declining conversions' },
  { id: 'rf4', label: 'Audience saturation', level: 'low' as const, detail: 'Retargeting freq 5.2', impact: 'Diminishing returns' },
];

export const AI_RECOMMENDATIONS = [
  { id: 'rec1', title: 'Scale Brand Search budget +22%', impact: '+$18.4k/wk revenue', confidence: 96, risk: 'low' as const, category: 'Budget' },
  { id: 'rec2', title: 'Reallocate $12k Display → Search', impact: '+$28.8k/mo revenue', confidence: 88, risk: 'medium' as const, category: 'Budget' },
  { id: 'rec3', title: 'Pause 14 wasteful keywords', impact: '+$4.8k/wk saved', confidence: 91, risk: 'low' as const, category: 'Keywords' },
  { id: 'rec4', title: 'Launch 4 RSA variants', impact: '+0.8pts CTR', confidence: 84, risk: 'medium' as const, category: 'Creative' },
];

export const AUTOMATION_STATUS = [
  { id: 'as1', label: 'Active automations', value: 6, total: 7 },
  { id: 'as2', label: 'Executions today', value: 42 },
  { id: 'as3', label: 'Success rate (7d)', value: 97.8, format: 'percent' as const },
  { id: 'as4', label: 'Hours saved this week', value: 38 },
];

/* ------------------------------------------------------------------ */
/* Team & Integrations                                                */
/* ------------------------------------------------------------------ */

export const TEAM_MEMBERS = [
  { id: 't1', name: 'Alex Chen', email: 'alex@northwind.co', role: 'Owner', status: 'active', avatar: 'AC', lastActive: 'Online', color: 'chart-1' },
  { id: 't2', name: 'Priya Shah', email: 'priya@northwind.co', role: 'Admin', status: 'active', avatar: 'PS', lastActive: '12 min ago', color: 'chart-2' },
  { id: 't3', name: 'Marcus Webb', email: 'marcus@northwind.co', role: 'Editor', status: 'active', avatar: 'MW', lastActive: '1 hr ago', color: 'chart-3' },
  { id: 't4', name: 'Sara Lin', email: 'sara@northwind.co', role: 'Editor', status: 'active', avatar: 'SL', lastActive: '3 hr ago', color: 'chart-4' },
  { id: 't5', name: 'David Park', email: 'david@northwind.co', role: 'Viewer', status: 'invited', avatar: 'DP', lastActive: 'Pending', color: 'chart-5' },
  { id: 't6', name: 'Nina Costa', email: 'nina@northwind.co', role: 'Viewer', status: 'active', avatar: 'NC', lastActive: '2 days ago', color: 'chart-6' },
];

export const INTEGRATIONS_LIST = [
  { id: 'google-ads', name: 'Google Ads', category: 'Advertising', status: 'connected', accounts: 3, color: 'chart-4', description: 'Search, Display, Shopping, PMax, Video' },
  { id: 'google-analytics', name: 'Google Analytics 4', category: 'Analytics', status: 'connected', accounts: 2, color: 'chart-5', description: 'Web & app analytics' },
  { id: 'meta-ads', name: 'Meta Ads', category: 'Advertising', status: 'available', accounts: 0, color: 'chart-6', description: 'Facebook & Instagram ads' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', category: 'Advertising', status: 'available', accounts: 0, color: 'chart-1', description: 'B2B professional ads' },
  { id: 'tiktok-ads', name: 'TikTok Ads', category: 'Advertising', status: 'available', accounts: 0, color: 'chart-5', description: 'Short-form video ads' },
  { id: 'slack', name: 'Slack', category: 'Communication', status: 'connected', accounts: 1, color: 'chart-7', description: 'Team notifications' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'available', accounts: 0, color: 'chart-3', description: 'CRM & marketing automation' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', status: 'available', accounts: 0, color: 'chart-1', description: 'Enterprise CRM' },
];

/* ------------------------------------------------------------------ */
/* Billing & Settings                                                 */
/* ------------------------------------------------------------------ */

export const BILLING = {
  plan: 'Enterprise',
  price: 4800,
  cycle: 'monthly',
  seats: 24,
  seatsUsed: 19,
  nextInvoice: 'Aug 1, 2025',
  amount: 4800,
  paymentMethod: 'Visa •••• 4242',
  history: [
    { id: 'b1', date: 'Jul 1, 2025', amount: 4800, status: 'paid' },
    { id: 'b2', date: 'Jun 1, 2025', amount: 4800, status: 'paid' },
    { id: 'b3', date: 'May 1, 2025', amount: 4200, status: 'paid' },
    { id: 'b4', date: 'Apr 1, 2025', amount: 4200, status: 'paid' },
  ],
};

export const AUDIT_LOGS = [
  { id: 'al1', actor: 'Alex Chen', action: 'Approved automation: Geo bid modifiers', time: 'Yesterday 2:14 PM', ip: '72.14.201.10' },
  { id: 'al2', actor: 'Priya Shah', action: 'Updated AI preferences — confidence threshold 80%', time: 'Yesterday 11:02 AM', ip: '72.14.201.10' },
  { id: 'al3', actor: 'GrowthFlow AI', action: 'Auto-paused 4 low ROAS ad groups', time: 'Yesterday 9:30 AM', ip: 'system' },
  { id: 'al4', actor: 'Marcus Webb', action: 'Connected Google Analytics 4', time: '2 days ago', ip: '204.11.50.22' },
  { id: 'al5', actor: 'Alex Chen', action: 'Rotated production API key', time: '6 days ago', ip: '72.14.201.10' },
  { id: 'al6', actor: 'Sara Lin', action: 'Accepted workspace invitation', time: '3 hr ago', ip: '98.34.12.8' },
];

export const REPORTS_LIST = [
  { id: 'rp1', name: 'Executive Summary', schedule: 'Weekly — Mon 8 AM', recipients: 5, lastSent: '2 days ago', format: 'PDF' },
  { id: 'rp2', name: 'Campaign Performance', schedule: 'Daily 7 AM', recipients: 3, lastSent: '12 hr ago', format: 'PDF' },
  { id: 'rp3', name: 'Budget Utilization', schedule: 'Monthly 1st', recipients: 8, lastSent: '14 days ago', format: 'Excel' },
  { id: 'rp4', name: 'ROAS Deep Dive', schedule: 'On demand', recipients: 0, lastSent: 'Never', format: 'PowerPoint' },
];

export const REPORT_TEMPLATES = [
  { id: 'rt1', name: 'Executive Summary', description: 'High-level KPIs, trends, and AI insights', widgets: 6 },
  { id: 'rt2', name: 'Campaign Performance', description: 'Per-campaign spend, ROAS, conversions', widgets: 8 },
  { id: 'rt3', name: 'Budget Analysis', description: 'Allocation, pacing, reallocation suggestions', widgets: 5 },
  { id: 'rt4', name: 'Audience Report', description: 'Segment performance & expansion ideas', widgets: 7 },
  { id: 'rt5', name: 'Competitor Intel', description: 'Share of voice, positioning, gaps', widgets: 4 },
];

/* ------------------------------------------------------------------ */
/* Competitor & Audience                                              */
/* ------------------------------------------------------------------ */

export const COMPETITORS = [
  { id: 'cmp1', name: 'Agilink', sov: 28, change: 4, keywords: 42, overlap: 38, threat: 'high' as const },
  { id: 'cmp2', name: 'MarketWave', sov: 21, change: -2, keywords: 36, overlap: 24, threat: 'medium' as const },
  { id: 'cmp3', name: 'AdForge', sov: 17, change: 1, keywords: 28, overlap: 19, threat: 'medium' as const },
  { id: 'cmp4', name: 'ReachBoost', sov: 11, change: 0, keywords: 22, overlap: 12, threat: 'low' as const },
  { id: 'cmp5', name: 'ClickHydra', sov: 8, change: -1, keywords: 18, overlap: 8, threat: 'low' as const },
];

export const COMPETITOR_TIMELINE = Array.from({ length: 12 }, (_, i) => ({
  label: `W${i + 1}`,
  you: 30 + i * 1.4 + Math.sin(i) * 2,
  agilink: 24 + i * 0.5 + Math.cos(i) * 2,
  marketwave: 22 - i * 0.3,
  adforge: 16 + Math.sin(i / 2) * 2,
}));

export const AUDIENCE_SEGMENTS = [
  { id: 's1', name: 'High-Intent Searchers', size: 184000, growth: 12, conversions: 2280, roas: 9.4, match: 92 },
  { id: 's2', name: 'Cart Abandoners', size: 42000, growth: 8, conversions: 1480, roas: 8.1, match: 88 },
  { id: 's3', name: 'Past Customers', size: 28000, growth: 4, conversions: 980, roas: 7.2, match: 95 },
  { id: 's4', name: 'Lookalike 1%', size: 320000, growth: 22, conversions: 920, roas: 5.2, match: 76 },
  { id: 's5', name: 'In-Market: Software', size: 540000, growth: 6, conversions: 720, roas: 4.1, match: 64 },
  { id: 's6', name: 'Newsletter Subscribers', size: 64000, growth: 18, conversions: 640, roas: 6.8, match: 84 },
];

export const KEYWORD_IDEAS = [
  { keyword: 'ai marketing automation', volume: 8100, difficulty: 54, intent: 'commercial', cpc: 4.8, opportunity: 84 },
  { keyword: 'best growth marketing platform', volume: 5400, difficulty: 62, intent: 'commercial', cpc: 5.6, opportunity: 78 },
  { keyword: 'google ads ai optimizer', volume: 3600, difficulty: 41, intent: 'transactional', cpc: 3.9, opportunity: 91 },
  { keyword: 'marketing campaign software', volume: 14800, difficulty: 72, intent: 'commercial', cpc: 6.2, opportunity: 64 },
  { keyword: 'automated bidding strategy', volume: 2900, difficulty: 38, intent: 'informational', cpc: 2.8, opportunity: 88 },
  { keyword: 'saas growth tools', volume: 6700, difficulty: 58, intent: 'commercial', cpc: 5.1, opportunity: 76 },
  { keyword: 'performance max best practices', volume: 4200, difficulty: 44, intent: 'informational', cpc: 3.2, opportunity: 82 },
  { keyword: 'roas calculator marketing', volume: 2200, difficulty: 28, intent: 'informational', cpc: 2.1, opportunity: 94 },
];

export const LANDING_AUDITS = [
  { id: 'la1', url: 'northwind.co/ai-marketing', score: 84, loadTime: 1.8, issues: 3, conversions: 6.2, status: 'good' as const },
  { id: 'la2', url: 'northwind.co/pricing', score: 91, loadTime: 1.2, issues: 1, conversions: 8.4, status: 'excellent' as const },
  { id: 'la3', url: 'northwind.co/features', score: 68, loadTime: 3.4, issues: 7, conversions: 2.8, status: 'needs-work' as const },
  { id: 'la4', url: 'northwind.co/case-studies', score: 76, loadTime: 2.1, issues: 4, conversions: 4.1, status: 'fair' as const },
];
