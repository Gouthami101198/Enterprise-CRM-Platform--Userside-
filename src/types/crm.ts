export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Converted' | 'Lost';

export type LeadSource = 'Website' | 'Referral' | 'LinkedIn' | 'Cold Outreach' | 'Webinar' | 'Google Ads' | 'Partner';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  value: number;
  status: LeadStatus;
  source: LeadSource;
  score: number; // 0 - 100
  assignedTo: string;
  assignedAvatar?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type DealStage = 'Discovery' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactName: string;
  contactEmail: string;
  value: number;
  stage: DealStage;
  probability: number; // 0 - 100%
  expectedCloseDate: string;
  assignedTo: string;
  assignedAvatar?: string;
  priority: PriorityLevel;
  notes?: string;
  products?: string[];
  createdAt: string;
  updatedAt: string;
}

export type CustomerTier = 'Enterprise' | 'Mid-Market' | 'Startup' | 'SMB';
export type CustomerStatus = 'Active' | 'Onboarding' | 'At Risk' | 'Churned';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  tier: CustomerTier;
  status: CustomerStatus;
  accountManager: string;
  accountManagerAvatar?: string;
  lifetimeValue: number;
  mrr: number; // Monthly Recurring Revenue
  healthScore: number; // 0 - 100
  website: string;
  address: string;
  employees: string;
  since: string;
  notes: string;
  tags: string[];
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TaskCategory = 'Call' | 'Meeting' | 'Email' | 'Follow-up' | 'Review' | 'Contract';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  category: TaskCategory;
  dueDate: string;
  assignedTo: string;
  assignedAvatar?: string;
  relatedTo?: {
    type: 'Lead' | 'Deal' | 'Customer';
    id: string;
    name: string;
  };
  createdAt: string;
}

export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'Note' | 'Status Change' | 'Deal Won' | 'Task Completed';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  entityType: 'Lead' | 'Deal' | 'Customer' | 'Task';
  entityId: string;
  entityName: string;
  performedBy: string;
  performedAvatar?: string;
  timestamp: string;
  outcome?: string;
  duration?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  dealsCount: number;
  revenue: number;
  target: number;
}

export type NotificationType = 'lead_assigned' | 'task_reminder' | 'meeting_alert' | 'deal_update' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  read: boolean;
  linkTab?: string;
  entityId?: string;
}

export interface LeadFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  scheduledDate: string;
  scheduledTime: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Demo';
  notes: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

