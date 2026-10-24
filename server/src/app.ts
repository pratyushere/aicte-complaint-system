/* ============================================================
   Express Application Setup
   Configures middleware, routes, and error handling.
   ============================================================ */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { v1Router } from './routes';
import { errorHandler } from './middleware';

export function createApp(): express.Application {
  const app = express();

  // ---- Security ----
  app.use(helmet());
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : true)
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }));

  // ---- Parsing ----
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ---- Request Logging ----
  // Use 'combined' in production, 'dev' in development
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ---- API Routes ----
  app.use('/api/v1', v1Router);

  // ---- 404 handler for unknown routes ----
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested endpoint does not exist',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // ---- Centralized Error Handler ----
  app.use(errorHandler);

  return app;
}
