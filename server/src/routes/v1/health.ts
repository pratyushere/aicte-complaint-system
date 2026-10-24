/* ============================================================
   Health Check Routes
   ============================================================ */

import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../../lib/prisma';
import { getSafeConfig } from '../../config';

const router = Router();

/**
 * GET /api/v1/health
 * Returns server health status including database connectivity.
 */
router.get('/', async (_req: Request, res: Response) => {
  const dbConnected = await checkDatabaseConnection();
  const safeConfig = getSafeConfig();

  const status = dbConnected ? 'healthy' : 'degraded';
  const httpStatus = dbConnected ? 200 : 503;

  res.status(httpStatus).json({
    success: true,
    data: {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: safeConfig.NODE_ENV,
      database: {
        connected: dbConnected,
      },
      version: '1.0.0',
    },
  });
});

export default router;
