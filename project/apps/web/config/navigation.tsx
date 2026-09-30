import {
  LayoutDashboard,
  Megaphone,
  Sparkles,
  Workflow,
  ClipboardCheck,
  BarChart3,
  FileText,
  Search,
  FileSearch,
  Users2,
  UserSearch,
  Blocks,
  Users,
  Bell,
  CreditCard,
  Settings,
  Shield,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  group?: NavGroup;
};

export type NavGroup =
  | 'Overview'
  | 'Growth'
  | 'Insights'
  | 'System'
  | 'Administration';

export const NAV_GROUPS: { label: NavGroup; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campaigns', href: '/campaigns', icon: Megaphone, badge: '24' },
      { id: 'ai-assistant', label: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
      { id: 'automation', label: 'Automation', href: '/automation', icon: Workflow, badge: '7' },
      { id: 'approval-center', label: 'Approval Center', href: '/approval-center', icon: ClipboardCheck, badge: '12' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', href: '/reports', icon: FileText },
      { id: 'keyword-research', label: 'Keyword Research', href: '/keyword-research', icon: Search },
      { id: 'landing-audit', label: 'Landing Page Audit', href: '/landing-audit', icon: FileSearch },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'competitor-analysis', label: 'Competitor Analysis', href: '/competitor-analysis', icon: Users2 },
      { id: 'audience-insights', label: 'Audience Insights', href: '/audience-insights', icon: UserSearch },
      { id: 'integrations', label: 'Integrations', href: '/integrations', icon: Blocks },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'team', label: 'Team', href: '/team', icon: Users },
      { id: 'notifications', label: 'Notifications', href: '/notifications', icon: Bell, badge: '5' },
      { id: 'billing', label: 'Billing', href: '/billing', icon: CreditCard },
      { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
  {
    label: 'Administration',
    items: [
      { id: 'admin', label: 'Admin', href: '/admin', icon: Shield },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
