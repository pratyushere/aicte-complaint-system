/* ============================================================
   Authentication & Authorization (RBAC) Middleware
   Enforces backend authentication, session expiration,
   inactive-account checks, role-based access, and CSRF protection.
   ============================================================ */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { UnauthorizedError, ForbiddenError } from './errors';
import { SESSION_COOKIE_NAME, SafeUser } from '../lib/auth';
import { UserRole, Prisma } from '@prisma/client';

/**
 * Extracts session token from HTTP-only cookie or Authorization header.
 */
function extractToken(req: Request): string | null {
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Authentication middleware.
 * Verifies session, validates expiration, checks inactive account,
 * and attaches sanitized user and session objects to Request.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Authentication required. Please sign in.');
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            bureau: {
              select: { id: true, code: true, name: true },
            },
          },
        },
      },
    });

    if (!session) {
      throw new UnauthorizedError('Invalid or expired session. Please sign in again.');
    }

    // Session expiration check
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      throw new UnauthorizedError('Session expired. Please sign in again.');
    }

    // Inactive account check
    if (!session.user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact the administrator.');
    }

    const { passwordHash, ...safeUserData } = session.user;
    req.user = safeUserData as SafeUser;
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware.
 * If session token is present and valid, attaches user; does not reject if absent.
 */
export async function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            bureau: {
              select: { id: true, code: true, name: true },
            },
          },
        },
      },
    });

    if (session && session.expiresAt >= new Date() && session.user.isActive) {
      const { passwordHash, ...safeUserData } = session.user;
      req.user = safeUserData as SafeUser;
      req.session = session;
    }
    next();
  } catch {
    next();
  }
}

/**
 * Role-Based Access Control (RBAC) middleware.
 * Restricts access to users holding one of the specified roles.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Role '${req.user.role}' does not have permission to perform this action.`,
        ),
      );
    }

    next();
  };
}

/**
 * Guard that disallows mutation by read-only auditor.
 */
export function disallowReadOnly(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required.'));
  }

  if (req.user.role === 'READ_ONLY_AUDITOR') {
    return next(new ForbiddenError('Read-Only Auditors are not permitted to modify or create records.'));
  }

  next();
}

/**
 * CSRF verification middleware for state-changing requests.
 */
export function verifyCsrf(req: Request, _res: Response, next: NextFunction) {
  // Safe HTTP methods do not require CSRF token
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  if (!req.session) {
    return next();
  }

  const clientCsrfToken = req.headers['x-csrf-token'];
  if (!clientCsrfToken || clientCsrfToken !== req.session.csrfToken) {
    return next(new ForbiddenError('CSRF verification failed: missing or invalid X-CSRF-Token header.'));
  }

  next();
}

/**
 * Build Prisma WHERE filter for complaints based on user's role and assignments.
 */
export function getComplaintScopeFilter(user: SafeUser): Prisma.ComplaintWhereInput {
  switch (user.role) {
    case 'SYSTEM_ADMIN':
    case 'SENIOR_MANAGEMENT':
    case 'READ_ONLY_AUDITOR':
      // Nationwide read visibility
      return {};

    case 'REGIONAL_OFFICER':
      // Scoped to complaints from institutions in their region, or explicitly assigned to them
      if (user.region) {
        return {
          OR: [
            { institution: { region: { equals: user.region, mode: 'insensitive' } } },
            { assignedToId: user.id },
          ],
        };
      }
      return { assignedToId: user.id };

    case 'PGRC_OFFICER':
      // Complaints in PGRC Bureau, or assigned to this officer
      if (user.bureauId) {
        return {
          OR: [
            { bureauId: user.bureauId },
            { assignedToId: user.id },
          ],
        };
      }
      return { assignedToId: user.id };

    case 'REGULATION_BUREAU_OFFICER':
      // Complaints in Regulation Bureau, or assigned to this officer
      if (user.bureauId) {
        return {
          OR: [
            { bureauId: user.bureauId },
            { assignedToId: user.id },
          ],
        };
      }
      return { assignedToId: user.id };

    case 'OTHER_BUREAU_OFFICER':
      // Complaints in the user's assigned bureau, or assigned to this officer
      if (user.bureauId) {
        return {
          OR: [
            { bureauId: user.bureauId },
            { assignedToId: user.id },
          ],
        };
      }
      return { assignedToId: user.id };

    default:
      return { assignedToId: user.id };
  }
}

/**
 * Build Prisma WHERE filter for institutions based on user's role and assignments.
 */
export function getInstitutionScopeFilter(user: SafeUser): Prisma.InstitutionWhereInput {
  if (user.role === 'REGIONAL_OFFICER' && user.region) {
    return { region: { equals: user.region, mode: 'insensitive' } };
  }
  return {};
}
