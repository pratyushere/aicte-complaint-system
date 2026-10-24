/* ============================================================
   Authentication & Session Helper Utilities
   Handles password hashing, secure session tokens, and CSRF tokens.
   ============================================================ */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './prisma';
import { User, Session, UserRole } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'aicte_session';
export const CSRF_COOKIE_NAME = 'aicte_csrf';
export const SESSION_MAX_AGE_DAYS = 7;
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Hash a plain text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a plain text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a cryptographically secure random token.
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export type SafeUser = Omit<User, 'passwordHash'> & {
  bureau?: { id: string; code: string; name: string } | null;
};

/**
 * Create a new user session in the database.
 */
export async function createUserSession(userId: string): Promise<{ session: Session; token: string; csrfToken: string }> {
  const token = generateSecureToken(32);
  const csrfToken = generateSecureToken(16);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      csrfToken,
      expiresAt,
    },
  });

  return { session, token, csrfToken };
}

/**
 * Invalidate a session by token.
 */
export async function invalidateSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

/**
 * Invalidate all sessions for a specific user (e.g. on password reset or account deactivation).
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}
