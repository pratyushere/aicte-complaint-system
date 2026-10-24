/* ============================================================
   Complaint Routes
   CRUD operations for complaints with RBAC and scoped permissions.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { validate } from '../../middleware/validate';
import { NotFoundError, ForbiddenError } from '../../middleware/errors';
import {
  authenticate,
  disallowReadOnly,
  verifyCsrf,
  getComplaintScopeFilter,
} from '../../middleware/auth';
import {
  createComplaintSchema,
  listComplaintsQuerySchema,
  idParamSchema,
} from '../schemas';
import { generateTrackingNumber } from '../../lib/trackingNumber';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const router = Router();

const addActionSchema = z.object({
  actionType: z.enum([
    'STATUS_CHANGE',
    'ASSIGNMENT',
    'REASSIGNMENT',
    'NOTE_ADDED',
    'DOCUMENT_ATTACHED',
    'ESCALATION',
    'RESPONSE_RECEIVED',
    'DEADLINE_EXTENDED',
    'CLOSURE',
  ]),
  newStatus: z.enum([
    'RECEIVED',
    'UNDER_REVIEW',
    'INVESTIGATION',
    'AWAITING_RESPONSE',
    'RESOLVED',
    'CLOSED',
    'ESCALATED',
  ]).optional(),
  remarks: z.string().min(1, 'Remarks are required'),
  nextAction: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  assignedToId: z.string().uuid().optional(),
});

/**
 * GET /api/v1/complaints
 * List complaints with pagination, filtering, search, and RBAC scope filtering.
 */
router.get(
  '/',
  authenticate,
  validate({ query: listComplaintsQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const query = req.query as Record<string, string | undefined>;
      const user = req.user!;
      const scopeFilter = getComplaintScopeFilter(user);

      const where: Prisma.ComplaintWhereInput = {
        AND: [scopeFilter],
      };

      const andClauses = where.AND as Prisma.ComplaintWhereInput[];

      if (query.status) {
        andClauses.push({ status: query.status as Prisma.EnumComplaintStatusFilter });
      }
      if (query.priority) {
        andClauses.push({ priority: query.priority as Prisma.EnumComplaintPriorityFilter });
      }
      if (query.bureauId) {
        andClauses.push({ bureauId: query.bureauId });
      }
      if (query.institutionId) {
        andClauses.push({ institutionId: query.institutionId });
      }
      if (query.assignedToId) {
        andClauses.push({ assignedToId: query.assignedToId });
      }
      if (query.search) {
        const search = query.search;
        andClauses.push({
          OR: [
            { subject: { contains: search, mode: 'insensitive' } },
            { trackingNumber: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { complainantName: { contains: search, mode: 'insensitive' } },
          ],
        });
      }

      const [complaints, total] = await Promise.all([
        prisma.complaint.findMany({
          where,
          skip,
          take: limit,
          include: {
            institution: {
              select: { id: true, name: true, aictePermanentId: true, region: true, state: true },
            },
            category: {
              select: { id: true, code: true, name: true },
            },
            bureau: {
              select: { id: true, code: true, name: true },
            },
            assignedTo: {
              select: { id: true, name: true, email: true, role: true },
            },
            createdBy: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.complaint.count({ where }),
      ]);

      res.json({
        success: true,
        data: complaints,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /api/v1/complaints/:id
 * Get complaint detail by ID with RBAC scope authorization check.
 */
router.get(
  '/:id',
  authenticate,
  validate({ params: idParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const complaintId = req.params.id as string;
      const complaint = await prisma.complaint.findUnique({
        where: { id: complaintId },
        include: {
          institution: true,
          category: true,
          bureau: true,
          assignedTo: {
            select: { id: true, name: true, email: true, role: true },
          },
          createdBy: {
            select: { id: true, name: true, email: true, role: true },
          },
          caseActions: {
            include: {
              actor: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          documents: true,
          assignmentHistory: {
            include: {
              assignedTo: { select: { id: true, name: true, role: true } },
              assignedBy: { select: { id: true, name: true, role: true } },
            },
            orderBy: { assignedAt: 'desc' },
          },
        },
      });

      if (!complaint) {
        throw new NotFoundError('Complaint', complaintId);
      }

      // Authorization check for scoped roles
      const user = req.user!;
      if (user.role === 'REGIONAL_OFFICER' && user.region) {
        const matchesRegion = complaint.institution.region?.toLowerCase() === user.region.toLowerCase();
        const isAssigned = complaint.assignedToId === user.id;
        if (!matchesRegion && !isAssigned) {
          throw new ForbiddenError('You do not have permission to view complaints outside your assigned region.');
        }
      } else if (
        ['PGRC_OFFICER', 'REGULATION_BUREAU_OFFICER', 'OTHER_BUREAU_OFFICER'].includes(user.role) &&
        user.bureauId
      ) {
        const matchesBureau = complaint.bureauId === user.bureauId;
        const isAssigned = complaint.assignedToId === user.id;
        if (!matchesBureau && !isAssigned) {
          throw new ForbiddenError('You do not have permission to view complaints outside your assigned bureau.');
        }
      }

      res.json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /api/v1/complaints
 * Create a new complaint.
 * Disallows READ_ONLY_AUDITOR and SENIOR_MANAGEMENT.
 * Creator is automatically authenticated user.
 */
router.post(
  '/',
  authenticate,
  disallowReadOnly,
  verifyCsrf,
  validate({ body: createComplaintSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      if (user.role === 'SENIOR_MANAGEMENT') {
        throw new ForbiddenError('Senior Management role has supervisory view-only access and cannot register complaints.');
      }

      const [institution, category, bureau] = await Promise.all([
        prisma.institution.findUnique({ where: { id: req.body.institutionId } }),
        prisma.complaintCategory.findUnique({ where: { id: req.body.categoryId } }),
        prisma.bureau.findUnique({ where: { id: req.body.bureauId } }),
      ]);

      if (!institution) throw new NotFoundError('Institution', req.body.institutionId);
      if (!category) throw new NotFoundError('ComplaintCategory', req.body.categoryId);
      if (!bureau) throw new NotFoundError('Bureau', req.body.bureauId);

      if (req.body.assignedToId) {
        const assignee = await prisma.user.findUnique({
          where: { id: req.body.assignedToId },
        });
        if (!assignee) throw new NotFoundError('User (assignee)', req.body.assignedToId);
      }

      const trackingNumber = await generateTrackingNumber(bureau.code);

      const complaint = await prisma.complaint.create({
        data: {
          ...req.body,
          createdById: user.id,
          trackingNumber,
          status: 'RECEIVED',
        },
        include: {
          institution: {
            select: { id: true, name: true, aictePermanentId: true, region: true },
          },
          category: {
            select: { id: true, code: true, name: true },
          },
          bureau: {
            select: { id: true, code: true, name: true },
          },
        },
      });

      // Create initial case action
      await prisma.caseAction.create({
        data: {
          complaintId: complaint.id,
          actorId: user.id,
          actionType: 'STATUS_CHANGE',
          newStatus: 'RECEIVED',
          remarks: 'Complaint registered by ' + user.name,
          nextAction: req.body.nextAction,
          dueDate: req.body.nextActionDueDate,
        },
      });

      res.status(201).json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /api/v1/complaints/:id/actions
 * Record an action, status update, remark, or assignment change on a complaint.
 * Disallows READ_ONLY_AUDITOR and SENIOR_MANAGEMENT.
 */
router.post(
  '/:id/actions',
  authenticate,
  disallowReadOnly,
  verifyCsrf,
  validate({ params: idParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      if (user.role === 'SENIOR_MANAGEMENT') {
        throw new ForbiddenError('Senior Management role has supervisory oversight and cannot modify case actions directly.');
      }

      const parseResult = addActionSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ForbiddenError('Invalid action payload: ' + JSON.stringify(parseResult.error.flatten()));
      }

      const complaintId = req.params.id as string;
      const complaint = await prisma.complaint.findUnique({
        where: { id: complaintId },
        include: { institution: true },
      });

      if (!complaint) {
        throw new NotFoundError('Complaint', complaintId);
      }

      const actionData = parseResult.data;
      const prevStatus = complaint.status;
      const newStatus = actionData.newStatus || prevStatus;

      // Update complaint status/action if changed
      const updateData: Prisma.ComplaintUpdateInput = {
        lastActionAt: new Date(),
      };

      if (actionData.newStatus) {
        updateData.status = actionData.newStatus;
        if (actionData.newStatus === 'RESOLVED' || actionData.newStatus === 'CLOSED') {
          updateData.disposalDate = new Date();
        }
      }
      if (actionData.nextAction) {
        updateData.nextAction = actionData.nextAction;
      }
      if (actionData.dueDate) {
        updateData.nextActionDueDate = actionData.dueDate;
      }
      if (actionData.assignedToId) {
        updateData.assignedTo = { connect: { id: actionData.assignedToId } };
      }

      const [action, updatedComplaint] = await prisma.$transaction([
        prisma.caseAction.create({
          data: {
            complaintId,
            actorId: user.id,
            actionType: actionData.actionType,
            previousStatus: prevStatus,
            newStatus,
            remarks: actionData.remarks,
            nextAction: actionData.nextAction,
            dueDate: actionData.dueDate,
          },
          include: {
            actor: { select: { id: true, name: true, role: true } },
          },
        }),
        prisma.complaint.update({
          where: { id: complaintId },
          data: updateData,
        }),
      ]);

      res.status(201).json({
        success: true,
        data: {
          action,
          complaint: updatedComplaint,
        },
        message: 'Case action recorded successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
