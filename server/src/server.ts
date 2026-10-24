/* ============================================================
   Server Entry Point
   Loads environment, checks DB, and starts the HTTP server.
   ============================================================ */

import { config, getSafeConfig } from './config';
import { createApp } from './app';
import { logger, checkDatabaseConnection, disconnectDatabase } from './lib';

const log = logger.child('server');

async function main(): Promise<void> {
  // Log safe configuration (secrets are masked)
  log.info('Starting AICTE Complaint Monitoring Server', getSafeConfig());

  // Check database connectivity
  const dbReady = await checkDatabaseConnection();
  if (!dbReady) {
    log.error('Cannot connect to the database. Server will start but API calls requiring DB will fail.');
    log.error('Ensure PostgreSQL is running and DATABASE_URL in .env is correct.');
  }

  const app = createApp();

  const server = app.listen(config.PORT, () => {
    log.info(`Server listening on port ${config.PORT}`);
    log.info(`Health check: http://localhost:${config.PORT}/api/v1/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    log.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      log.info('Server shut down complete');
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      log.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
    });
  });
}

main().catch((err) => {
  log.error('Failed to start server', {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
