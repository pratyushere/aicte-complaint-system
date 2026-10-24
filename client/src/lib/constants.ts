/* ============================================================
   Application-wide constants — light enterprise theme
   ============================================================ */

import type {
  Bureau,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  OverlapAlertStatus,
  ApprovalStatus,
  InstitutionType,
} from '@/types';

// ---- Bureau Labels ----
export const BUREAU_LABELS: Record<Bureau, string> = {
  RB: 'Regulation Bureau',
  PGRC: 'Public Grievance Redressal Cell',
  OTHER: 'Other Bureau / Cell',
};

export const BUREAU_SHORT: Record<Bureau, string> = {
  RB: 'RB',
  PGRC: 'PGRC',
  OTHER: 'Other',
};

// ---- Complaint Status ----
export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  RECEIVED: 'Received',
  UNDER_REVIEW: 'Under Review',
  INVESTIGATION: 'Investigation',
  AWAITING_RESPONSE: 'Awaiting Response',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  ESCALATED: 'Escalated',
};

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  RECEIVED: 'bg-blue-50 text-blue-700 border border-blue-200',
  UNDER_REVIEW: 'bg-amber-50 text-amber-700 border border-amber-200',
  INVESTIGATION: 'bg-navy-50 text-navy-700 border border-navy-200',
  AWAITING_RESPONSE: 'bg-amber-50 text-amber-600 border border-amber-200',
  RESOLVED: 'bg-green-50 text-green-700 border border-green-100',
  CLOSED: 'bg-gray-100 text-gray-500 border border-gray-200',
  ESCALATED: 'bg-red-50 text-red-700 border border-red-200',
};

// ---- Priority ----
export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_COLORS: Record<ComplaintPriority, string> = {
  CRITICAL: 'bg-red-50 text-red-700 border border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border border-blue-200',
  LOW: 'bg-gray-100 text-gray-600 border border-gray-200',
};

// ---- Categories ----
export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  APPROVAL_VIOLATION: 'Approval Violation',
  FEE_DISPUTE: 'Fee Dispute',
  FACULTY: 'Faculty Related',
  INFRASTRUCTURE: 'Infrastructure',
  RAGGING: 'Ragging',
  OTHER: 'Other',
};

// ---- Institution Types ----
export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  ENGINEERING: 'Engineering',
  PHARMACY: 'Pharmacy',
  MBA: 'MBA',
  MCA: 'MCA',
  ARCHITECTURE: 'Architecture',
  OTHER: 'Other',
};

// ---- Approval Status ----
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  APPROVED: 'Approved',
  REVOKED: 'Revoked',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
};

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  APPROVED: 'bg-green-50 text-green-700 border border-green-100',
  REVOKED: 'bg-red-50 text-red-700 border border-red-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 border border-blue-200',
};

// ---- Overlap Alert Status ----
export const OVERLAP_STATUS_LABELS: Record<OverlapAlertStatus, string> = {
  PENDING: 'Pending Review',
  ACKNOWLEDGED: 'Acknowledged',
  DISMISSED: 'Dismissed',
  LINKED: 'Linked',
};

export const OVERLAP_STATUS_COLORS: Record<OverlapAlertStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  ACKNOWLEDGED: 'bg-blue-50 text-blue-700 border border-blue-200',
  DISMISSED: 'bg-gray-100 text-gray-500 border border-gray-200',
  LINKED: 'bg-green-50 text-green-700 border border-green-100',
};

// ---- User Roles ----
export const ROLE_LABELS: Record<string, string> = {
  SYSTEM_ADMIN: 'System Administrator',
  PGRC_OFFICER: 'PGRC Officer',
  REGULATION_BUREAU_OFFICER: 'Regulation Bureau Officer',
  OTHER_BUREAU_OFFICER: 'Other Bureau / Cell Officer',
  REGIONAL_OFFICER: 'Regional Officer',
  SENIOR_MANAGEMENT: 'Senior Management',
  READ_ONLY_AUDITOR: 'Read-Only Auditor',
};

export const ROLE_COLORS: Record<string, string> = {
  SYSTEM_ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200',
  PGRC_OFFICER: 'bg-blue-50 text-blue-700 border border-blue-200',
  REGULATION_BUREAU_OFFICER: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  OTHER_BUREAU_OFFICER: 'bg-teal-50 text-teal-700 border border-teal-200',
  REGIONAL_OFFICER: 'bg-amber-50 text-amber-700 border border-amber-200',
  SENIOR_MANAGEMENT: 'bg-rose-50 text-rose-700 border border-rose-200',
  READ_ONLY_AUDITOR: 'bg-slate-100 text-slate-700 border border-slate-300',
};

// ---- Fictional Demonstration Accounts for quick access ----
export const DEMO_ACCOUNTS = [
  {
    role: 'SYSTEM_ADMIN',
    email: 'admin.demo@fictional-aicte.example',
    name: 'Rajesh Kumar',
    label: 'System Admin',
    desc: 'Full administrative access & user management',
  },
  {
    role: 'REGULATION_BUREAU_OFFICER',
    email: 'regulation.demo@fictional-aicte.example',
    name: 'Priya Sharma',
    label: 'Regulation Officer',
    desc: 'Regulation Bureau & compliance cases',
  },
  {
    role: 'PGRC_OFFICER',
    email: 'pgrc.demo@fictional-aicte.example',
    name: 'Amit Patel',
    label: 'PGRC Officer',
    desc: 'Public grievances intake & redressal',
  },
  {
    role: 'OTHER_BUREAU_OFFICER',
    email: 'otherbureau.demo@fictional-aicte.example',
    name: 'Sunita Reddy',
    label: 'Other Bureau Officer',
    desc: 'Miscellaneous bureau/cell cases',
  },
  {
    role: 'REGIONAL_OFFICER',
    email: 'regional.demo@fictional-aicte.example',
    name: 'Vikram Singh',
    label: 'Regional Officer',
    desc: 'Western Region complaints & institutions',
  },
  {
    role: 'SENIOR_MANAGEMENT',
    email: 'senior.demo@fictional-aicte.example',
    name: 'Dr. Arvind Swaminathan',
    label: 'Senior Management',
    desc: 'Executive overview, nationwide metrics & reports',
  },
  {
    role: 'READ_ONLY_AUDITOR',
    email: 'auditor.demo@fictional-aicte.example',
    name: 'Meera Joshi',
    label: 'Read-Only Auditor',
    desc: 'Audit visibility; mutation strictly forbidden',
  },
];

