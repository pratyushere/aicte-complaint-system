/* ============================================================
   Authentication Routes
   Endpoints for login, logout, and current-user retrieval.
   Uses HTTP-only session cookies with double-submit CSRF protection.
   ============================================================ */

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import {
  createUserSession,
  invalidateSession,
  verifyPassword,
  SESSION_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
  SafeUser,
} from '../../lib/auth';
import { authenticate, verifyCsrf } from '../../middleware/auth';
import { UnauthorizedError, ForbiddenError, ValidationError } from '../../middleware/errors';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const isProduction = process.env.NODE_ENV === 'production';

/**
 * POST /api/v1/auth/login
 * Authenticates user credentials, generates session & CSRF tokens,
 * sets secure HTTP-only session cookie, and returns sanitized profile.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError('Invalid login request format', parseResult.error.flatten());
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        bureau: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Inactive account check
    if (!user.isActive) {
      throw new ForbiddenError('This account has been deactivated. Please contact your system administrator.');
    }

    // Password validation
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Create session in database
    const { token, csrfToken } = await createUserSession(user.id);

    // Set secure HTTP-only session cookie
    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_MS,
      path: '/',
    });

    // Set CSRF token cookie readable by frontend client
    res.cookie(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_MS,
      path: '/',
    });

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      data: {
        user: safeUser,
        csrfToken,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/logout
 * Destroys the active session in DB and clears session cookies.
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session?.token) {
      await invalidateSession(req.session.token);
    }

    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.clearCookie(CSRF_COOKIE_NAME, { path: '/' });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/auth/me
 * Returns current authenticated user and session state.
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
        csrfToken: req.session?.csrfToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
