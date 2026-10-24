/* ============================================================
   Centralized Error Handler Middleware
   Catches all errors and returns consistent JSON responses.
   ============================================================ */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';

const log = logger.child('error-handler');

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.issues.map((e) => ({
          path: e.path.map(String).join('.'),
          message: e.message,
        })),
      },
      timestamp: new Date().toISOString(),
    };
    res.status(400).json(response);
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
      timestamp: new Date().toISOString(),
    };

    if (err.statusCode >= 500) {
      log.error('Server error', { code: err.code, message: err.message, stack: err.stack });
    } else {
      log.warn('Client error', { code: err.code, message: err.message });
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  log.error('Unhandled error', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
}
