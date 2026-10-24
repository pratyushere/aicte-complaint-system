/* ============================================================
   Global Application Store — AICTE VIGIL Executive Platform
   Reactive state management with real CRUD, simulation of AI Overlap
   detection, timeline audit tracking, notifications, role switcher & toasts.
   ============================================================ */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Complaint,
  Institution,
  OverlapAlert,
  Notification,
  DashboardStats,
  ComplaintStatus,
  ComplaintPriority,
  Bureau,
  UserRole,
  User,
} from '@/types';
import {
  mockComplaints as initialComplaints,
  mockInstitutions as initialInstitutions,
  mockOverlapAlerts as initialOverlaps,
  mockNotifications as initialNotifications,
} from './mock-data';
import { DEMO_ACCOUNTS } from './constants';

export interface TimelineItem {
  id: string;
  complaintId: string;
  type: 'CREATED' | 'STATUS_CHANGE' | 'ASSIGNMENT' | 'OVERLAP_FLAG' | 'NOTE' | 'ESCALATED';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface OfficerRemark {
  id: string;
  complaintId: string;
  authorName: string;
  authorRole: string;
  authorBureau: string;
  text: string;
  isInternal: boolean;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppStoreContextType {
  // Data
  complaints: Complaint[];
  institutions: Institution[];
  overlapAlerts: OverlapAlert[];
  notifications: Notification[];
  unreadNotificationCount: number;
  timeline: Record<string, TimelineItem[]>;
  remarks: Record<string, OfficerRemark[]>;
  stats: DashboardStats;

  // Active User / Persona
  currentUser: User;
  switchPersona: (role: UserRole) => void;

  // Complaint Actions
  addComplaint: (data: {
    institutionId: string;
    bureau: Bureau;
    category: Complaint['category'];
    priority: ComplaintPriority;
    subject: string;
    description: string;
    complainantName: string;
    complainantContact: string;
    deadline?: string;
  }) => Complaint;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, reason?: string) => void;
  updateComplaintPriority: (id: string, newPriority: ComplaintPriority) => void;
  reassignComplaint: (id: string, newAssigneeName: string) => void;

  // Remarks / Notes
  addRemark: (complaintId: string, text: string, isInternal?: boolean) => void;

  // Overlap Actions
  linkOverlap: (alertId: string, reviewNote?: string) => void;
  dismissOverlap: (alertId: string, reviewNote?: string) => void;
  acknowledgeOverlap: (alertId: string, reviewNote?: string) => void;

  // Institution Actions
  addInstitution: (data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => Institution;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Global Command Palette & Modals
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  trackModalOpen: boolean;
  setTrackModalOpen: (open: boolean) => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

// Initial timeline generator
const generateInitialTimeline = (complaints: Complaint[]): Record<string, TimelineItem[]> => {
  const map: Record<string, TimelineItem[]> = {};
  complaints.forEach((c) => {
    map[c.id] = [
      {
        id: `t-${c.id}-1`,
        complaintId: c.id,
        type: 'CREATED',
        title: 'Grievance Registered',
        description: `Grievance registered under ${c.bureau} bureau with tracking ID ${c.trackingNumber}.`,
        actor: c.complainantName || 'Online Portal Intake',
        timestamp: c.createdAt,
      },
    ];

    if (c.status !== 'RECEIVED') {
      map[c.id].push({
        id: `t-${c.id}-2`,
        complaintId: c.id,
        type: 'STATUS_CHANGE',
        title: `Status set to ${c.status.replace(/_/g, ' ')}`,
        description: `Case moved into official review and evaluation workflow.`,
        actor: 'Priya Sharma (Regulation Officer)',
        timestamp: c.updatedAt,
      });
    }

    if (c.priority === 'CRITICAL') {
      map[c.id].push({
        id: `t-${c.id}-3`,
        complaintId: c.id,
        type: 'ESCALATED',
        title: 'Priority Escalated to Critical',
        description: 'Auto-flagged due to severe regulatory compliance violation / student welfare risk.',
        actor: 'AICTE Compliance Bot',
        timestamp: c.updatedAt,
      });
    }
  });
  return map;
};

// Initial remarks generator
const generateInitialRemarks = (complaints: Complaint[]): Record<string, OfficerRemark[]> => {
  const map: Record<string, OfficerRemark[]> = {};
  complaints.forEach((c, idx) => {
    if (idx === 0) {
      map[c.id] = [
        {
          id: 'rem-1',
          complaintId: c.id,
          authorName: 'Priya Sharma',
          authorRole: 'Regulation Bureau Officer',
          authorBureau: 'RB',
          text: 'Notice sent to college management regarding unauthorized intake in B.Tech AI & ML. Awaiting compliance affidavit within 14 days.',
          isInternal: false,
          createdAt: '2024-10-18T10:00:00Z',
        },
      ];
    } else if (idx === 3) {
      map[c.id] = [
        {
          id: 'rem-2',
          complaintId: c.id,
          authorName: 'Amit Patel',
          authorRole: 'PGRC Officer',
          authorBureau: 'PGRC',
          text: 'Contacted regional anti-ragging squad coordinator. Emergency inspection initiated.',
          isInternal: true,
          createdAt: '2024-10-19T11:30:00Z',
        },
      ];
    } else {
      map[c.id] = [];
    }
  });
  return map;
};

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(() => initialComplaints);
  const [institutions, setInstitutions] = useState<Institution[]>(() => initialInstitutions);
  const [overlapAlerts, setOverlapAlerts] = useState<OverlapAlert[]>(() => initialOverlaps);
  const [notifications, setNotifications] = useState<Notification[]>(() => initialNotifications);
  const [timeline, setTimeline] = useState<Record<string, TimelineItem[]>>(() =>
    generateInitialTimeline(initialComplaints),
  );
  const [remarks, setRemarks] = useState<Record<string, OfficerRemark[]>>(() =>
    generateInitialRemarks(initialComplaints),
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Active persona
  const [currentRole, setCurrentRole] = useState<UserRole>('REGULATION_BUREAU_OFFICER');

  const currentUser: User = useMemo(() => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === currentRole) || DEMO_ACCOUNTS[0];
    return {
      id: `usr-${account.role.toLowerCase()}`,
      name: account.name,
      email: account.email,
      role: account.role as UserRole,
      bureau: {
        id: 'b-1',
        code: account.role.includes('REGULATION')
          ? 'RB'
          : account.role.includes('PGRC')
            ? 'PGRC'
            : 'OTHER',
        name: account.label,
      },
      region: account.role === 'REGIONAL_OFFICER' ? 'Western Regional Office (Mumbai)' : 'Headquarters (New Delhi)',
      isActive: true,
    };
  }, [currentRole]);

  // Toast Helpers
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Switch Persona
  const switchPersona = useCallback(
    (role: UserRole) => {
      setCurrentRole(role);
      const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
      addToast({
        title: `Switched Persona to ${acc?.name || role}`,
        message: `Now operating with ${acc?.label || role} privileges.`,
        type: 'info',
      });
    },
    [addToast],
  );

  // Unread notification count
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  // Computed dynamic stats
  const stats: DashboardStats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status)).length;
    const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
    const critical = complaints.filter((c) => c.priority === 'CRITICAL').length;
    const pendingOverlaps = overlapAlerts.filter((a) => a.status === 'PENDING').length;

    // Check deadlines approaching (within 7 days)
    const now = new Date();
    const approachingDeadlines = complaints.filter((c) => {
      if (!c.deadline || ['RESOLVED', 'CLOSED'].includes(c.status)) return false;
      const diff = new Date(c.deadline).getTime() - now.getTime();
      return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    const complaintsByBureau: Record<Bureau, number> = { RB: 0, PGRC: 0, OTHER: 0 };
    complaints.forEach((c) => {
      complaintsByBureau[c.bureau] = (complaintsByBureau[c.bureau] || 0) + 1;
    });

    const complaintsByStatus: Record<ComplaintStatus, number> = {
      RECEIVED: 0,
      UNDER_REVIEW: 0,
      INVESTIGATION: 0,
      AWAITING_RESPONSE: 0,
      RESOLVED: 0,
      CLOSED: 0,
      ESCALATED: 0,
    };
    complaints.forEach((c) => {
      complaintsByStatus[c.status] = (complaintsByStatus[c.status] || 0) + 1;
    });

    const complaintsByPriority: Record<ComplaintPriority, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };
    complaints.forEach((c) => {
      complaintsByPriority[c.priority] = (complaintsByPriority[c.priority] || 0) + 1;
    });

    return {
      totalComplaints: total,
      openComplaints: open,
      resolvedComplaints: resolved,
      criticalComplaints: critical,
      pendingOverlaps,
      approachingDeadlines,
      complaintsByBureau,
      complaintsByStatus,
      complaintsByPriority,
      complaintsTrend: [
        { date: 'May', count: Math.max(12, total - 42) },
        { date: 'Jun', count: Math.max(18, total - 35) },
        { date: 'Jul', count: Math.max(24, total - 28) },
        { date: 'Aug', count: Math.max(30, total - 19) },
        { date: 'Sep', count: Math.max(38, total - 8) },
        { date: 'Oct', count: total },
      ],
    };
  }, [complaints, overlapAlerts]);

  // Add Complaint
  const addComplaint = useCallback(
    (data: {
      institutionId: string;
      bureau: Bureau;
      category: Complaint['category'];
      priority: ComplaintPriority;
      subject: string;
      description: string;
      complainantName: string;
      complainantContact: string;
      deadline?: string;
    }) => {
      const targetInstitution = institutions.find((i) => i.id === data.institutionId);
      const newId = `c-${Date.now()}`;
      const year = new Date().getFullYear();
      const randSeq = String(Math.floor(100 + Math.random() * 900));
      const trackingNumber = `${data.bureau}-${year}-${randSeq}`;

      const nowIso = new Date().toISOString();
      const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const newComplaint: Complaint = {
        id: newId,
        trackingNumber,
        institutionId: data.institutionId,
        institution: targetInstitution,
        assignedToId: currentUser.id,
        assignedTo: currentUser,
        createdById: currentUser.id,
        createdBy: currentUser,
        bureau: data.bureau,
        category: data.category,
        priority: data.priority,
        status: 'RECEIVED',
        subject: data.subject,
        description: data.description,
        complainantName: data.complainantName || 'Anonymous Complainant',
        complainantContact: data.complainantContact || 'N/A',
        deadline: data.deadline ? new Date(data.deadline).toISOString() : defaultDeadline,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setComplaints((prev) => [newComplaint, ...prev]);

      // Add timeline event
      setTimeline((prev) => ({
        ...prev,
        [newId]: [
          {
            id: `t-${newId}-created`,
            complaintId: newId,
            type: 'CREATED',
            title: 'Grievance Docket Registered',
            description: `Grievance successfully recorded with tracking code ${trackingNumber} under ${data.bureau}.`,
            actor: currentUser.name,
            timestamp: nowIso,
          },
        ],
      }));

      setRemarks((prev) => ({ ...prev, [newId]: [] }));

      // Check if there are other complaints for the same institution (AI Overlap Simulation)
      const existingSameInst = complaints.filter((c) => c.institutionId === data.institutionId);
      if (existingSameInst.length > 0) {
        const matchedComplaint = existingSameInst[0];
        const newOverlapId = `oa-${Date.now()}`;
        const newOverlapAlert: OverlapAlert = {
          id: newOverlapId,
          complaintAId: matchedComplaint.id,
          complaintA: matchedComplaint,
          complaintBId: newId,
          complaintB: newComplaint,
          institutionId: data.institutionId,
          institution: targetInstitution,
          similarityScore: 0.84,
          matchReasons: [
            {
              factor: 'Same Institution',
              weight: 0.4,
              matched: true,
              detail: targetInstitution?.name,
            },
            {
              factor: 'Cross-Bureau Convergence',
              weight: 0.25,
              matched: matchedComplaint.bureau !== data.bureau,
              detail: `${matchedComplaint.bureau} vs ${data.bureau}`,
            },
            {
              factor: 'Same Category',
              weight: 0.2,
              matched: matchedComplaint.category === data.category,
              detail: data.category.replace(/_/g, ' '),
            },
            {
              factor: 'Temporal Proximity',
              weight: 0.15,
              matched: true,
              detail: 'Filed within contemporary reporting period',
            },
          ],
          status: 'PENDING',
          reviewedById: null,
          reviewNote: null,
          createdAt: nowIso,
          reviewedAt: null,
        };

        setOverlapAlerts((prev) => [newOverlapAlert, ...prev]);

        // Add Notification
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: currentUser.id,
            type: 'OVERLAP_DETECTED',
            title: 'Potential Inter-Bureau Overlap Flagged',
            message: `New grievance ${trackingNumber} overlaps with existing case ${matchedComplaint.trackingNumber} (${targetInstitution?.name}).`,
            referenceId: newOverlapId,
            referenceType: 'overlap_alert',
            isRead: false,
            createdAt: nowIso,
          },
          ...prev,
        ]);
      }

      addToast({
        title: `Grievance ${trackingNumber} Registered`,
        message: `Assigned tracking ID: ${trackingNumber}. Case dossier is now active.`,
        type: 'success',
      });

      return newComplaint;
    },
    [complaints, currentUser, institutions, addToast],
  );

  // Update Status
  const updateComplaintStatus = useCallback(
    (id: string, newStatus: ComplaintStatus, reason?: string) => {
      const nowIso = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus, updatedAt: nowIso } : c)),
      );

      const target = complaints.find((c) => c.id === id);
      const tracking = target?.trackingNumber || id;

      setTimeline((prev) => {
        const existing = prev[id] || [];
        return {
          ...prev,
          [id]: [
            ...existing,
            {
              id: `t-${id}-${Date.now()}`,
              complaintId: id,
              type: 'STATUS_CHANGE',
              title: `Status Changed to ${newStatus.replace(/_/g, ' ')}`,
              description: reason || `Updated by officer ${currentUser.name}.`,
              actor: currentUser.name,
              timestamp: nowIso,
            },
          ],
        };
      });

      // Notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          type: 'STATUS_CHANGE',
          title: `Status Updated: ${tracking}`,
          message: `Status transitioned to ${newStatus.replace(/_/g, ' ')}. ${reason ? `Reason: ${reason}` : ''}`,
          referenceId: id,
          referenceType: 'complaint',
          isRead: false,
          createdAt: nowIso,
        },
        ...prev,
      ]);

      addToast({
        title: `Status Updated to ${newStatus.replace(/_/g, ' ')}`,
        message: `Case ${tracking} record updated successfully.`,
        type: 'success',
      });
    },
    [complaints, currentUser, addToast],
  );

  // Update Priority
  const updateComplaintPriority = useCallback(
    (id: string, newPriority: ComplaintPriority) => {
      const nowIso = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, priority: newPriority, updatedAt: nowIso } : c)),
      );

      const target = complaints.find((c) => c.id === id);
      addToast({
        title: `Priority Updated: ${target?.trackingNumber}`,
        message: `Escalation rating changed to ${newPriority}.`,
        type: 'info',
      });
    },
    [complaints, addToast],
  );

  // Reassign Complaint
  const reassignComplaint = useCallback(
    (id: string, newAssigneeName: string) => {
      const nowIso = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                assignedTo: { ...(c.assignedTo || currentUser), name: newAssigneeName },
                updatedAt: nowIso,
              }
            : c,
        ),
      );

      setTimeline((prev) => {
        const existing = prev[id] || [];
        return {
          ...prev,
          [id]: [
            ...existing,
            {
              id: `t-${id}-${Date.now()}`,
              complaintId: id,
              type: 'ASSIGNMENT',
              title: `Reassigned to ${newAssigneeName}`,
              description: `Responsibility reallocated by ${currentUser.name}.`,
              actor: currentUser.name,
              timestamp: nowIso,
            },
          ],
        };
      });

      addToast({
        title: 'Officer Reassigned',
        message: `Complaint reassigned to ${newAssigneeName}.`,
        type: 'success',
      });
    },
    [currentUser, addToast],
  );

  // Add Remark
  const addRemark = useCallback(
    (complaintId: string, text: string, isInternal: boolean = false) => {
      const nowIso = new Date().toISOString();
      const newRemark: OfficerRemark = {
        id: `rem-${Date.now()}`,
        complaintId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        authorBureau: currentUser.bureau?.code || 'RB',
        text,
        isInternal,
        createdAt: nowIso,
      };

      setRemarks((prev) => ({
        ...prev,
        [complaintId]: [...(prev[complaintId] || []), newRemark],
      }));

      setTimeline((prev) => ({
        ...prev,
        [complaintId]: [
          ...(prev[complaintId] || []),
          {
            id: `t-${complaintId}-${Date.now()}`,
            complaintId,
            type: 'NOTE',
            title: isInternal ? 'Confidential Officer Note' : 'Investigation Note Added',
            description: text,
            actor: currentUser.name,
            timestamp: nowIso,
          },
        ],
      }));

      addToast({
        title: 'Remark Recorded',
        message: 'Investigation log has been updated.',
        type: 'success',
      });
    },
    [currentUser, addToast],
  );

  // Overlap Actions
  const linkOverlap = useCallback(
    (alertId: string, reviewNote?: string) => {
      const nowIso = new Date().toISOString();
      setOverlapAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: 'LINKED',
                reviewedById: currentUser.id,
                reviewedBy: currentUser,
                reviewNote: reviewNote || 'Linked as coordinated inter-bureau inquiry.',
                reviewedAt: nowIso,
              }
            : a,
        ),
      );

      addToast({
        title: 'Complaints Successfully Linked',
        message: 'Joint coordination docket created between corresponding bureaus.',
        type: 'success',
      });
    },
    [currentUser, addToast],
  );

  const dismissOverlap = useCallback(
    (alertId: string, reviewNote?: string) => {
      const nowIso = new Date().toISOString();
      setOverlapAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: 'DISMISSED',
                reviewedById: currentUser.id,
                reviewedBy: currentUser,
                reviewNote: reviewNote || 'Evaluated and dismissed as independent grievance.',
                reviewedAt: nowIso,
              }
            : a,
        ),
      );

      addToast({
        title: 'Overlap Alert Dismissed',
        message: 'Alert marked as reviewed with no cross-bureau dependency.',
        type: 'info',
      });
    },
    [currentUser, addToast],
  );

  const acknowledgeOverlap = useCallback(
    (alertId: string, reviewNote?: string) => {
      const nowIso = new Date().toISOString();
      setOverlapAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                status: 'ACKNOWLEDGED',
                reviewedById: currentUser.id,
                reviewedBy: currentUser,
                reviewNote: reviewNote || 'Acknowledged for parallel monitoring.',
                reviewedAt: nowIso,
              }
            : a,
        ),
      );

      addToast({
        title: 'Overlap Acknowledged',
        message: 'Both bureaus notified for parallel monitoring.',
        type: 'info',
      });
    },
    [currentUser, addToast],
  );

  // Add Institution
  const addInstitution = useCallback(
    (data: Omit<Institution, 'id' | 'createdAt' | 'updatedAt'>) => {
      const nowIso = new Date().toISOString();
      const newInst: Institution = {
        ...data,
        id: `inst-${Date.now()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setInstitutions((prev) => [newInst, ...prev]);

      addToast({
        title: 'Institution Added',
        message: `${newInst.name} has been enrolled in AICTE Registry.`,
        type: 'success',
      });

      return newInst;
    },
    [addToast],
  );

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast({
      title: 'All Notifications Cleared',
      message: 'All unread alerts have been marked as read.',
      type: 'info',
    });
  }, [addToast]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    addToast({
      title: 'Notification Center Cleared',
      type: 'info',
    });
  }, [addToast]);

  // Keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        complaints,
        institutions,
        overlapAlerts,
        notifications,
        unreadNotificationCount,
        timeline,
        remarks,
        stats,
        currentUser,
        switchPersona,
        addComplaint,
        updateComplaintStatus,
        updateComplaintPriority,
        reassignComplaint,
        addRemark,
        linkOverlap,
        dismissOverlap,
        acknowledgeOverlap,
        addInstitution,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        toasts,
        addToast,
        removeToast,
        commandPaletteOpen,
        setCommandPaletteOpen,
        trackModalOpen,
        setTrackModalOpen,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
