import 'dotenv/config';
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

// Infrastructure
import { PrismaUserRepository } from '../../infrastructure/identity/repositories/PrismaUserRepository';
import { PrismaSessionRepository } from '../../infrastructure/identity/repositories/PrismaSessionRepository';
import { BcryptPasswordHasher } from '../../infrastructure/identity/services/BcryptPasswordHasher';
import { InMemoryEventBus } from '../../infrastructure/event-bus/InMemoryEventBus';
import { PrismaMediaAssetRepository } from '../../infrastructure/media/repositories/PrismaMediaAssetRepository';
import { S3StorageService } from '../../infrastructure/storage/S3StorageService';
import { PrismaAuditLogRepository } from '../../infrastructure/audit/repositories/PrismaAuditLogRepository';

// Application
import { AdminLoginUseCase } from '../../application/identity/use-cases/AdminLoginUseCase';
import { LogoutUseCase } from '../../application/identity/use-cases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../application/identity/use-cases/GetCurrentUserUseCase';
import { CreateMediaAssetUseCase } from '../../application/media/use-cases/CreateMediaAssetUseCase';
import { FinalizeMediaUploadUseCase } from '../../application/media/use-cases/FinalizeMediaUploadUseCase';
import { DeleteMediaAssetUseCase } from '../../application/media/use-cases/DeleteMediaAssetUseCase';
import { ListMediaAssetsUseCase } from '../../application/media/use-cases/ListMediaAssetsUseCase';
import { WriteAuditLogUseCase } from '../../application/audit/use-cases/WriteAuditLogUseCase';
import { ListAuditLogUseCase } from '../../application/audit/use-cases/ListAuditLogUseCase';
import { AuditLogWriter } from '../../application/audit/services/AuditLogWriter';

// Presentation
import { AuthController } from '../controllers/AuthController.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';
import { registerAuthRoutes } from '../routes/authRoutes.fastify';
import { MediaController } from '../controllers/MediaController.fastify';
import { registerMediaRoutes } from '../routes/mediaRoutes.fastify';
import { AuditLogController } from '../controllers/AuditLogController.fastify';
import { registerAuditLogRoutes } from '../routes/auditLogRoutes.fastify';

import { User } from '../../domain/identity/aggregates/User';

// Расширяем Fastify Request типом для пользователя
declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: User;
    sessionId?: string;
  }
}

/**
 * Создание и настройка Fastify приложения
 */
export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // ============================================
  // Plugins
  // ============================================
  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'change-me-in-production',
  });

  // ============================================
  // Infrastructure Layer
  // ============================================
  const prisma = new PrismaClient();
  const userRepository = new PrismaUserRepository(prisma);
  const sessionRepository = new PrismaSessionRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const eventBus = new InMemoryEventBus();
  const mediaAssetRepository = new PrismaMediaAssetRepository(prisma);
  const storageService = new S3StorageService();
  const auditLogRepository = new PrismaAuditLogRepository(prisma);

  // Graceful shutdown
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  // ============================================
  // Application Layer
  // ============================================
  const adminLoginUseCase = new AdminLoginUseCase(
    userRepository,
    sessionRepository,
    passwordHasher,
    eventBus,
  );

  const logoutUseCase = new LogoutUseCase(sessionRepository);

  const getCurrentUserUseCase = new GetCurrentUserUseCase(sessionRepository, userRepository);

  const createMediaAssetUseCase = new CreateMediaAssetUseCase(
    mediaAssetRepository,
    storageService,
    eventBus,
  );

  const finalizeMediaUploadUseCase = new FinalizeMediaUploadUseCase(
    mediaAssetRepository,
    storageService,
    eventBus,
  );

  const writeAuditLogUseCase = new WriteAuditLogUseCase(auditLogRepository);
  const listAuditLogUseCase = new ListAuditLogUseCase(auditLogRepository);
  const auditLogWriter = new AuditLogWriter(writeAuditLogUseCase);

  const deleteMediaAssetUseCase = new DeleteMediaAssetUseCase(
    mediaAssetRepository,
    storageService,
    eventBus,
    auditLogWriter,
  );

  const listMediaAssetsUseCase = new ListMediaAssetsUseCase(mediaAssetRepository);

  // ============================================
  // Presentation Layer
  // ============================================
  const authController = new AuthController(
    adminLoginUseCase,
    logoutUseCase,
    getCurrentUserUseCase,
  );

  const authMiddleware = new AuthMiddleware(sessionRepository, userRepository);

  const mediaController = new MediaController(
    createMediaAssetUseCase,
    finalizeMediaUploadUseCase,
    deleteMediaAssetUseCase,
    listMediaAssetsUseCase,
  );

  const auditLogController = new AuditLogController(listAuditLogUseCase);

  // Добавляем зависимости в декоратор для доступа в routes
  app.decorate('authController', authController);
  app.decorate('authMiddleware', authMiddleware);
  app.decorate('mediaController', mediaController);
  app.decorate('auditLogController', auditLogController);

  // ============================================
  // Routes
  // ============================================
  await app.register(registerAuthRoutes, { prefix: '/api/auth' });
  await app.register(registerMediaRoutes, { prefix: '/api/admin/media' });
  await app.register(registerAuditLogRoutes, { prefix: '/api/admin' });

  // Health check endpoint
  app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  return app;
}

/**
 * Server startup
 */
async function start() {
  try {
    const app = await createApp();
    const PORT = Number(process.env.PORT) || 3001;
    const HOST = process.env.HOST || '0.0.0.0';

    await app.listen({ port: PORT, host: HOST });

    app.log.info(`🚀 API Server running on http://${HOST}:${PORT}`);
    app.log.info(`📍 Health check: http://${HOST}:${PORT}/health`);
    app.log.info(`🔐 Auth endpoint: http://${HOST}:${PORT}/api/auth`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start server
// При запуске через tsx watch этот файл всегда является главным модулем
start();
