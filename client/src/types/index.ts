/* ============================================================
   Core domain types for the AICTE Complaint Dashboard
   ============================================================ */

// ---- Enums ----

export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'PGRC_OFFICER'
  | 'REGULATION_BUREAU_OFFICER'
  | 'OTHER_BUREAU_OFFICER'
  | 'REGIONAL_OFFICER'
  | 'SENIOR_MANAGEMENT'
  | 'READ_ONLY_AUDITOR';

export type Bureau = 'RB' | 'PGRC' | 'OTHER';

export type InstitutionType =
  | 'ENGINEERING'
  | 'PHARMACY'
  | 'MBA'
  | 'MCA'
  | 'ARCHITECTURE'
  | 'OTHER';

export type ApprovalStatus =
  | 'APPROVED'
  | 'REVOKED'
  | 'PENDING'
  | 'UNDER_REVIEW';

export type ComplaintCategory =
  | 'APPROVAL_VIOLATION'
  | 'FEE_DISPUTE'
  | 'FACULTY'
  | 'INFRASTRUCTURE'
  | 'RAGGING'
  | 'OTHER';

export type ComplaintPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintStatus =
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'INVESTIGATION'
  | 'AWAITING_RESPONSE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

export type OverlapAlertStatus =
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'DISMISSED'
  | 'LINKED';

export type NotificationType =
  | 'DEADLINE_WARNING'
  | 'OVERLAP_DETECTED'
  | 'ASSIGNMENT'
  | 'ESCALATION'
  | 'STATUS_CHANGE';

// ---- Entities ----

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bureauId?: string | null;
  bureau?: { id: string; code: string; name: string } | null;
  region?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  state: string;
  district: string;
  city: string;
  type: InstitutionType;
  approvalStatus: ApprovalStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  institutionId: string;
  institution?: Institution;
  assignedToId: string | null;
  assignedTo?: User;
  createdById: string;
  createdBy?: User;
  bureau: Bureau;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  subject: string;
  description: string;
  complainantName: string;
  complainantContact: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OverlapAlert {
  id: string;
  complaintAId: string;
  complaintA?: Complaint;
  complaintBId: string;
  complaintB?: Complaint;
  institutionId: string;
  institution?: Institution;
  similarityScore: number;
  matchReasons: MatchReason[];
  status: OverlapAlertStatus;
  reviewedById: string | null;
  reviewedBy?: User;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface MatchReason {
  factor: string;
  weight: number;
  matched: boolean;
  detail?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string;
  referenceType: string;
  isRead: boolean;
  createdAt: string;
}

// ---- Dashboard Stats ----

export interface DashboardStats {
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  criticalComplaints: number;
  pendingOverlaps: number;
  approachingDeadlines: number;
  complaintsByBureau: Record<Bureau, number>;
  complaintsByStatus: Record<ComplaintStatus, number>;
  complaintsByPriority: Record<ComplaintPriority, number>;
  complaintsTrend: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  count: number;
  bureau?: Bureau;
}

// ---- Navigation ----

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}
