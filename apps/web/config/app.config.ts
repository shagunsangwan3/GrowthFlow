export const APP_CONFIG = {
  name: 'GrowthFlow',
  tagline: 'The Future of AI-Powered Growth',
  description:
    'An AI-powered Growth Operating Platform that helps businesses plan, launch, optimize, automate, and scale digital marketing campaigns.',
  version: '2.4.1',
  workspace: {
    name: 'Northwind Labs',
    plan: 'Enterprise',
    seats: 24,
    seatsUsed: 19,
  },
  ai: {
    model: 'GrowthFlow AI',
    version: 'v4.2',
    status: 'operational',
    uptime: '99.98%',
  },
} as const;

export const PLATFORMS = [
  { id: 'google-ads', name: 'Google Ads', status: 'connected', color: 'chart-4' },
  { id: 'meta-ads', name: 'Meta Ads', status: 'coming-soon', color: 'chart-6' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', status: 'coming-soon', color: 'chart-1' },
  { id: 'tiktok-ads', name: 'TikTok Ads', status: 'coming-soon', color: 'chart-5' },
  { id: 'seo', name: 'SEO', status: 'coming-soon', color: 'chart-3' },
  { id: 'email', name: 'Email Marketing', status: 'coming-soon', color: 'chart-2' },
  { id: 'analytics', name: 'Analytics', status: 'coming-soon', color: 'chart-7' },
  { id: 'crm', name: 'CRM', status: 'coming-soon', color: 'chart-1' },
  { id: 'ai-agents', name: 'AI Agents', status: 'coming-soon', color: 'chart-2' },
] as const;
