/* ============================================================
   Bureaus & Categories Routes
   Reference data endpoints.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

/**
 * GET /api/v1/bureaus
 * List all bureaus.
 */
router.get('/bureaus', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const bureaus = await prisma.bureau.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: bureaus });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/categories
 * List all complaint categories.
 */
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.complaintCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users
 * List all active users (for assignment dropdowns).
 */
router.get('/users', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bureau: { select: { id: true, code: true, name: true } },
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

export default router;
