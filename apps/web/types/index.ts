export type Trend = 'up' | 'down' | 'flat';

export type KpiStatus = 'positive' | 'negative' | 'warning' | 'neutral';

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'ended' | 'review';

export type ApprovalStatus =
  | 'pending'
  | 'needs-review'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Platform = 'google-ads' | 'meta-ads' | 'linkedin-ads' | 'tiktok-ads';

export type SeriesPoint = {
  label: string;
  value: number;
  compare?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
};

export type Kpi = {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'percent' | 'number' | 'ratio';
  trend: Trend;
  delta: number;
  status: KpiStatus;
  sparkline: number[];
  insight?: string;
  compareLabel?: string;
  compareValue?: number;
};

export type Campaign = {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  spend: number;
  clicks: number;
  impressions: number;
  ctr: number;
  conversions: number;
  cpa: number;
  roas: number;
  aiScore: number;
  owner: string;
  dailySpend: number[];
  startDate: string;
};

export type ApprovalCard = {
  id: string;
  title: string;
  recommendation: string;
  confidence: number;
  expectedImpact: number;
  expectedSaving: number;
  risk: RiskLevel;
  executionTime: string;
  campaign: string;
  status: ApprovalStatus;
  category: string;
  requestedBy: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ai' | 'campaign' | 'approval' | 'automation' | 'system' | 'team';
  user?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  time: string;
  actions?: { label: string; type: string }[];
};

export type Conversation = {
  id: string;
  title: string;
  preview: string;
  time: string;
  pinned?: boolean;
  unread?: boolean;
};

export type AutomationRule = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused' | 'error';
  executions: number;
  successRate: number;
  lastRun: string;
  schedule: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  group: 'today' | 'yesterday' | 'earlier';
  type: 'ai' | 'campaign' | 'approval' | 'system' | 'billing' | 'team' | 'automation';
  read: boolean;
};
