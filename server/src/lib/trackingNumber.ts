/* ============================================================
   Tracking Number Generator
   Generates unique tracking numbers in the format:
   {BUREAU_CODE}-{YEAR}-{SEQUENCE}
   ============================================================ */

import { prisma } from '../lib/prisma';

/**
 * Generates a unique tracking number for a new complaint.
 * Format: {BUREAU_CODE}-{YEAR}-{5-digit sequence}
 * Example: RB-2024-00147
 */
export async function generateTrackingNumber(bureauCode: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${bureauCode}-${year}-`;

  // Find the highest existing tracking number for this bureau+year
  const latest = await prisma.complaint.findFirst({
    where: {
      trackingNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      trackingNumber: 'desc',
    },
    select: {
      trackingNumber: true,
    },
  });

  let nextSeq = 1;
  if (latest) {
    const parts = latest.trackingNumber.split('-');
    const currentSeq = parseInt(parts[parts.length - 1], 10);
    nextSeq = currentSeq + 1;
  }

  return `${prefix}${nextSeq.toString().padStart(5, '0')}`;
}
