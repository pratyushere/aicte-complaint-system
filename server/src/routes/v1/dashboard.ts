/* ============================================================
   Dashboard Routes
   Returns aggregated metrics from PostgreSQL scoped by RBAC.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, getComplaintScopeFilter } from '../../middleware/auth';
import { ComplaintStatus, ComplaintPriority, Prisma } from '@prisma/client';

const router = Router();

/**
 * GET /api/v1/dashboard
 * Returns aggregated dashboard metrics computed from real database data,
 * scoped according to the user's role, bureau, or region.
 */
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const scopeFilter = getComplaintScopeFilter(user);

    const OPEN_STATUSES: ComplaintStatus[] = [
      'RECEIVED',
      'UNDER_REVIEW',
      'INVESTIGATION',
      'AWAITING_RESPONSE',
      'ESCALATED',
    ];

    const baseWhere: Prisma.ComplaintWhereInput = scopeFilter;

    // Run aggregations in parallel
    const [
      totalComplaints,
      openComplaints,
      resolvedComplaints,
      criticalComplaints,
      pendingOverlaps,
      approachingDeadlines,
      complaintsByStatusRaw,
      complaintsByPriorityRaw,
      complaintsByBureauRaw,
    ] = await Promise.all([
      // Total complaints
      prisma.complaint.count({ where: baseWhere }),

      // Open complaints (not resolved/closed)
      prisma.complaint.count({
        where: {
          AND: [baseWhere, { status: { in: OPEN_STATUSES } }],
        },
      }),

      // Resolved complaints
      prisma.complaint.count({
        where: {
          AND: [baseWhere, { status: 'RESOLVED' }],
        },
      }),

      // Critical priority complaints
      prisma.complaint.count({
        where: {
          AND: [baseWhere, { priority: 'CRITICAL', status: { in: OPEN_STATUSES } }],
        },
      }),

      // Pending overlap alerts (nationwide or bureau relevant)
      prisma.overlapAlert.count({
        where: { status: 'PENDING' },
      }),

      // Approaching deadlines (within next 7 days)
      prisma.complaint.count({
        where: {
          AND: [
            baseWhere,
            {
              status: { in: OPEN_STATUSES },
              nextActionDueDate: {
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                gte: new Date(),
              },
            },
          ],
        },
      }),

      // Complaints grouped by status
      prisma.complaint.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { _all: true },
      }),

      // Complaints grouped by priority
      prisma.complaint.groupBy({
        by: ['priority'],
        where: baseWhere,
        _count: { _all: true },
      }),

      // Complaints grouped by bureau
      prisma.complaint.groupBy({
        by: ['bureauId'],
        where: baseWhere,
        _count: { _all: true },
      }),
    ]);

    // Monthly trend (last 6 months)
    const complaintsTrendRaw = await prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
        COUNT(*)::bigint AS count
      FROM complaints
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `;

    // Transform status counts into a record
    const allStatuses: ComplaintStatus[] = [
      'RECEIVED', 'UNDER_REVIEW', 'INVESTIGATION',
      'AWAITING_RESPONSE', 'RESOLVED', 'CLOSED', 'ESCALATED',
    ];
    const complaintsByStatus: Record<string, number> = {};
    for (const s of allStatuses) {
      const found = complaintsByStatusRaw.find(r => r.status === s);
      complaintsByStatus[s] = found ? found._count._all : 0;
    }

    // Transform priority counts
    const allPriorities: ComplaintPriority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const complaintsByPriority: Record<string, number> = {};
    for (const p of allPriorities) {
      const found = complaintsByPriorityRaw.find(r => r.priority === p);
      complaintsByPriority[p] = found ? found._count._all : 0;
    }

    // Transform bureau counts — resolve bureau codes
    const bureauIds = complaintsByBureauRaw.map(r => r.bureauId);
    const bureaus = bureauIds.length > 0
      ? await prisma.bureau.findMany({
          where: { id: { in: bureauIds } },
          select: { id: true, code: true },
        })
      : [];

    const complaintsByBureau: Record<string, number> = {};
    for (const row of complaintsByBureauRaw) {
      const bureau = bureaus.find(b => b.id === row.bureauId);
      const key = bureau?.code ?? row.bureauId;
      complaintsByBureau[key] = row._count._all;
    }

    // Transform trend data
    const complaintsTrend = complaintsTrendRaw.map(r => ({
      date: r.month,
      count: Number(r.count),
    }));

    res.json({
      success: true,
      data: {
        totalComplaints,
        openComplaints,
        resolvedComplaints,
        criticalComplaints,
        pendingOverlaps,
        approachingDeadlines,
        complaintsByBureau,
        complaintsByStatus,
        complaintsByPriority,
        complaintsTrend,
        scope: {
          role: user.role,
          bureau: user.bureau?.code ?? null,
          region: user.region ?? null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
