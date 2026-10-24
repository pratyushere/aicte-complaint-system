/* ============================================================
   Prisma Client Singleton
   Ensures a single PrismaClient instance across the app.
   ============================================================ */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const log = logger.child('prisma');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Log queries in debug mode (without exposing parameters that might contain secrets)
prisma.$on('query' as never, (e: unknown) => {
  const event = e as { query: string; duration: number };
  log.debug('Query executed', {
    query: event.query,
    duration: `${event.duration}ms`,
  });
});

/**
 * Tests database connectivity. Returns true if connection succeeds.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    log.info('Database connection established');
    return true;
  } catch (error) {
    log.error('Database connection failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

/**
 * Gracefully disconnects from the database.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  log.info('Database connection closed');
}
