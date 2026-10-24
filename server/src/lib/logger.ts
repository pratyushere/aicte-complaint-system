/* ============================================================
   Structured Logger
   Provides JSON-formatted logging in production and
   human-readable output in development. Never logs secrets.
   ============================================================ */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: number;
  private context: string;

  constructor(context: string = 'app') {
    const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel;
    this.level = LOG_LEVELS[envLevel] ?? LOG_LEVELS.info;
    this.context = context;
  }

  child(context: string): Logger {
    const child = new Logger(context);
    child.level = this.level;
    return child;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log('error', message, meta);
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (LOG_LEVELS[level] < this.level) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...(meta ? { meta: this.sanitize(meta) } : {}),
    };

    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      const output = JSON.stringify(entry);
      if (level === 'error') {
        process.stderr.write(output + '\n');
      } else {
        process.stdout.write(output + '\n');
      }
    } else {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}]`;
      const metaStr = meta ? ` ${JSON.stringify(this.sanitize(meta))}` : '';
      if (level === 'error') {
        console.error(`${prefix} ${message}${metaStr}`);
      } else if (level === 'warn') {
        console.warn(`${prefix} ${message}${metaStr}`);
      } else {
        console.log(`${prefix} ${message}${metaStr}`);
      }
    }
  }

  /**
   * Strips known secret keys from metadata to prevent accidental exposure.
   */
  private sanitize(meta: Record<string, unknown>): Record<string, unknown> {
    const SENSITIVE_KEYS = [
      'password', 'secret', 'token', 'authorization',
      'cookie', 'database_url', 'db_url', 'connection_string',
      'api_key', 'apiKey', 'passwordHash',
    ];

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(meta)) {
      if (SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitize(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}

export const logger = new Logger('app');
export { Logger };
