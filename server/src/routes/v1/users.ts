/* ============================================================
   User Management Routes
   Enforces SYSTEM_ADMIN permissions for user role and assignment edits.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, requireRole, verifyCsrf } from '../../middleware/auth';
import { NotFoundError, ValidationError } from '../../middleware/errors';
import { invalidateUserSessions } from '../../lib/auth';
import { z } from 'zod';

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum([
    'SYSTEM_ADMIN',
    'PGRC_OFFICER',
    'REGULATION_BUREAU_OFFICER',
    'OTHER_BUREAU_OFFICER',
    'REGIONAL_OFFICER',
    'SENIOR_MANAGEMENT',
    'READ_ONLY_AUDITOR',
  ]).optional(),
  bureauId: z.string().uuid().nullable().optional(),
  region: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/v1/users
 * List all users. Open to all authenticated users for assignment dropdowns.
 */
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bureauId: true,
        bureau: { select: { id: true, code: true, name: true } },
        region: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/v1/users/:id
 * Update user details, role, bureau assignment, region, or active status.
 * Restricted strictly to SYSTEM_ADMIN.
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('SYSTEM_ADMIN'),
  verifyCsrf,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = updateUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError('Invalid update parameters', parseResult.error.flatten());
      }

      const userId = req.params.id as string;
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        throw new NotFoundError('User', userId);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: parseResult.data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          bureauId: true,
          bureau: { select: { id: true, code: true, name: true } },
          region: true,
          isActive: true,
          updatedAt: true,
        },
      });

      // If user was deactivated, invalidate all active sessions immediately
      if (parseResult.data.isActive === false) {
        await invalidateUserSessions(userId);
      }

      res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
