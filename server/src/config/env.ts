/* ============================================================
   Environment Configuration
   Loads .env and validates required environment variables.
   NEVER log or expose secret values.
   ============================================================ */

import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  LOG_LEVEL: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '3001'), 10),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
};

/**
 * Returns a safe representation of the config for logging.
 * Database URL is masked to prevent credential leakage.
 */
export function getSafeConfig(): Record<string, string | number> {
  const dbUrl = config.DATABASE_URL;
  let maskedUrl = '[MASKED]';
  try {
    const url = new URL(dbUrl);
    maskedUrl = `${url.protocol}//${url.username ? '***' : ''}@${url.host}${url.pathname}`;
  } catch {
    maskedUrl = '[INVALID_URL]';
  }

  return {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    DATABASE_URL: maskedUrl,
    LOG_LEVEL: config.LOG_LEVEL,
  };
}
