/* ============================================================
   API v1 Router
   Mounts all v1 sub-routes under /api/v1
   ============================================================ */

import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import usersRouter from './users';
import institutionsRouter from './institutions';
import complaintsRouter from './complaints';
import dashboardRouter from './dashboard';
import referenceRouter from './reference';

const router = Router();

// Health check (public)
router.use('/health', healthRouter);

// Authentication (login, logout, me)
router.use('/auth', authRouter);

// User Management (SYSTEM_ADMIN)
router.use('/users', usersRouter);

// Dashboard metrics (authenticated + scoped)
router.use('/dashboard', dashboardRouter);

// Institution CRUD (authenticated + scoped)
router.use('/institutions', institutionsRouter);

// Complaint CRUD (authenticated + scoped)
router.use('/complaints', complaintsRouter);

// Reference data (bureaus, categories)
router.use('/', referenceRouter);

export default router;
