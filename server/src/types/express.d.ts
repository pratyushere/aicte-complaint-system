import { Session, UserRole } from '@prisma/client';
import { SafeUser } from '../lib/auth';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
      session?: Session;
    }
  }
}
