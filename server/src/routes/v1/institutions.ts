/* ============================================================
   Institution Routes
   CRUD operations for institutions with RBAC and scoped permissions.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { validate } from '../../middleware/validate';
import { NotFoundError, ConflictError, ForbiddenError } from '../../middleware/errors';
import {
  authenticate,
  requireRole,
  verifyCsrf,
  getInstitutionScopeFilter,
} from '../../middleware/auth';
import {
  createInstitutionSchema,
  listInstitutionsQuerySchema,
  idParamSchema,
} from '../schemas';
import { Prisma } from '@prisma/client';

const router = Router();

/**
 * GET /api/v1/institutions
 * List institutions with pagination, filtering, search, and regional officer scope.
 */
router.get(
  '/',
  authenticate,
  validate({ query: listInstitutionsQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const query = req.query as Record<string, string | undefined>;
      const user = req.user!;
      const scopeFilter = getInstitutionScopeFilter(user);

      const where: Prisma.InstitutionWhereInput = {
        AND: [scopeFilter],
      };

      const andClauses = where.AND as Prisma.InstitutionWhereInput[];

      if (query.state) {
        andClauses.push({ state: query.state });
      }
      if (query.type) {
        andClauses.push({ type: query.type as Prisma.EnumInstitutionTypeFilter });
      }
      if (query.approvalStatus) {
        andClauses.push({ approvalStatus: query.approvalStatus as Prisma.EnumApprovalStatusFilter });
      }
      if (query.search) {
        const search = query.search;
        andClauses.push({
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { aictePermanentId: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
          ],
        });
      }

      const [institutions, total] = await Promise.all([
        prisma.institution.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
        }),
        prisma.institution.count({ where }),
      ]);

      res.json({
        success: true,
        data: institutions,
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
 * GET /api/v1/institutions/:id
 * Get institution detail by ID with regional authorization check.
 */
router.get(
  '/:id',
  authenticate,
  validate({ params: idParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const institutionId = req.params.id as string;
      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        include: {
          complaints: {
            select: {
              id: true,
              trackingNumber: true,
              subject: true,
              status: true,
              priority: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          _count: {
            select: { complaints: true },
          },
        },
      });

      if (!institution) {
        throw new NotFoundError('Institution', institutionId);
      }

      const user = req.user!;
      if (
        user.role === 'REGIONAL_OFFICER' &&
        user.region &&
        institution.region &&
        institution.region.toLowerCase() !== user.region.toLowerCase()
      ) {
        throw new ForbiddenError('You do not have permission to view institutions outside your assigned region.');
      }

      res.json({
        success: true,
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /api/v1/institutions
 * Create a new institution.
 * Allowed for SYSTEM_ADMIN and REGULATION_BUREAU_OFFICER.
 */
router.post(
  '/',
  authenticate,
  requireRole('SYSTEM_ADMIN', 'REGULATION_BUREAU_OFFICER'),
  verifyCsrf,
  validate({ body: createInstitutionSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for duplicate AICTE permanent ID
      const existing = await prisma.institution.findUnique({
        where: { aictePermanentId: req.body.aictePermanentId },
      });

      if (existing) {
        throw new ConflictError(
          `Institution with AICTE Permanent ID '${req.body.aictePermanentId}' already exists`,
        );
      }

      const institution = await prisma.institution.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
