import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Infrastructure
import { PrismaUserRepository } from './infrastructure/identity/repositories/PrismaUserRepository';
import { PrismaSessionRepository } from './infrastructure/identity/repositories/PrismaSessionRepository';
import { BcryptPasswordHasher } from './infrastructure/identity/services/BcryptPasswordHasher';
import { InMemoryEventBus } from './infrastructure/event-bus/InMemoryEventBus';

// Application
import { AdminLoginUseCase } from './application/identity/use-cases/AdminLoginUseCase';
import { LogoutUseCase } from './application/identity/use-cases/LogoutUseCase';
import { GetCurrentUserUseCase } from './application/identity/use-cases/GetCurrentUserUseCase';

// Presentation
import { AuthController } from './presentation/controllers/AuthController';
import { AuthMiddleware } from './presentation/middleware/AuthMiddleware';
import { createAuthRoutes } from './presentation/routes/authRoutes';

/**
 * Dependency Injection Container
 * Инициализация всех зависимостей и создание Express приложения
 */
export function createApp(): Express {
  const app = express();

  // ============================================
  // Middleware
  // ============================================
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // ============================================
  // Infrastructure Layer
  // ============================================
  const prisma = new PrismaClient();
  const userRepository = new PrismaUserRepository(prisma);
  const sessionRepository = new PrismaSessionRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const eventBus = new InMemoryEventBus();

  // ============================================
  // Application Layer
  // ============================================
  const adminLoginUseCase = new AdminLoginUseCase(
    userRepository,
    sessionRepository,
    passwordHasher,
    eventBus
  );

  const logoutUseCase = new LogoutUseCase(sessionRepository);

  const getCurrentUserUseCase = new GetCurrentUserUseCase(
    sessionRepository,
    userRepository
  );

  // ============================================
  // Presentation Layer
  // ============================================
  const authController = new AuthController(
    adminLoginUseCase,
    logoutUseCase,
    getCurrentUserUseCase
  );

  const authMiddleware = new AuthMiddleware(sessionRepository, userRepository);

  // ============================================
  // Routes
  // ============================================
  app.use('/api/auth', createAuthRoutes(authController, authMiddleware));

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}

// ============================================
// Server startup
// ============================================
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
  });
}
