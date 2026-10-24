/* ============================================================
   Request Validation Middleware
   Uses Zod schemas to validate request body, query, and params.
   ============================================================ */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Express middleware that validates request parts against Zod schemas.
 * In Express 5, req.query and req.params are read-only getters,
 * so we validate only (no reassignment). Parsed body replaces req.body.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        // Validate only — Express 5 req.query is read-only
        schemas.query.parse(req.query);
      }
      if (schemas.params) {
        // Validate only — Express 5 req.params is read-only
        schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
}
