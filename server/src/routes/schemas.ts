/* ============================================================
   Zod Validation Schemas for API Requests
   ============================================================ */

import { z } from 'zod';

// ---- Institution Schemas ----

export const createInstitutionSchema = z.object({
  aictePermanentId: z.string().min(1, 'AICTE Permanent ID is required'),
  name: z.string().min(1, 'Institution name is required').max(500),
  address: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  region: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['ENGINEERING', 'PHARMACY', 'MBA', 'MCA', 'ARCHITECTURE', 'OTHER']).default('OTHER'),
  approvalStatus: z.enum(['APPROVED', 'REVOKED', 'PENDING', 'UNDER_REVIEW']).default('PENDING'),
});

export const listInstitutionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  state: z.string().optional(),
  type: z.enum(['ENGINEERING', 'PHARMACY', 'MBA', 'MCA', 'ARCHITECTURE', 'OTHER']).optional(),
  search: z.string().optional(),
  approvalStatus: z.enum(['APPROVED', 'REVOKED', 'PENDING', 'UNDER_REVIEW']).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// ---- Complaint Schemas ----

export const createComplaintSchema = z.object({
  institutionId: z.string().uuid('Invalid institution ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  bureauId: z.string().uuid('Invalid bureau ID'),
  createdById: z.string().uuid('Invalid creator user ID').optional(),
  assignedToId: z.string().uuid('Invalid assignee user ID').optional().nullable(),
  receivedDate: z.coerce.date().default(() => new Date()),
  subject: z.string().min(1, 'Subject is required').max(1000),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  complainantName: z.string().optional(),
  complainantContact: z.string().optional(),
  nextAction: z.string().optional(),
  nextActionDueDate: z.coerce.date().optional(),
  expectedDisposalDate: z.coerce.date().optional(),
});

export const listComplaintsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  status: z.enum([
    'RECEIVED', 'UNDER_REVIEW', 'INVESTIGATION',
    'AWAITING_RESPONSE', 'RESOLVED', 'CLOSED', 'ESCALATED',
  ]).optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  bureauId: z.string().uuid().optional(),
  institutionId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type ListInstitutionsQuery = z.infer<typeof listInstitutionsQuerySchema>;
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type ListComplaintsQuery = z.infer<typeof listComplaintsQuerySchema>;
