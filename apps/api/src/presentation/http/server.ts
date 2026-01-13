import 'dotenv/config';
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { pathToFileURL } from 'url';
import { PrismaClient } from '@prisma/client';

// Infrastructure
import { PrismaUserRepository } from '../../infrastructure/identity/repositories/PrismaUserRepository';
import { PrismaSessionRepository } from '../../infrastructure/identity/repositories/PrismaSessionRepository';
import { BcryptPasswordHasher } from '../../infrastructure/identity/services/BcryptPasswordHasher';
import { InMemoryEventBus } from '../../infrastructure/event-bus/InMemoryEventBus';
import { PrismaMediaAssetRepository } from '../../infrastructure/media/repositories/PrismaMediaAssetRepository';
import { S3StorageService } from '../../infrastructure/storage/S3StorageService';
import { PrismaAuditLogRepository } from '../../infrastructure/audit/repositories/PrismaAuditLogRepository';
import { PrismaInteractiveRunRepository } from '../../infrastructure/interactive/repositories/PrismaInteractiveRunRepository';
import { PrismaInteractiveDefinitionRepository } from '../../infrastructure/interactive/repositories/PrismaInteractiveDefinitionRepository';
import { PrismaContentItemRepository } from '../../infrastructure/content/repositories/PrismaContentItemRepository';
import { MarkdownRenderer } from '../../infrastructure/content/services/MarkdownRenderer';
import { LoggingAnalyticsService } from '../../infrastructure/analytics/LoggingAnalyticsService';
import { AnalyticsEventSubscriber } from '../../infrastructure/analytics/AnalyticsEventSubscriber';

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
import { StartInteractiveRunUseCase } from '../../application/interactive/use-cases/StartInteractiveRunUseCase';
import { CompleteInteractiveRunUseCase } from '../../application/interactive/use-cases/CompleteInteractiveRunUseCase';
import { CreateContentItemUseCase } from '../../application/content/use-cases/CreateContentItemUseCase';
import { UpdateContentItemUseCase } from '../../application/content/use-cases/UpdateContentItemUseCase';
import { GetContentItemUseCase } from '../../application/content/use-cases/GetContentItemUseCase';
import { ListContentItemsUseCase } from '../../application/content/use-cases/ListContentItemsUseCase';
import { PublishContentItemUseCase } from '../../application/content/use-cases/PublishContentItemUseCase';
import { GetContentItemBySlugUseCase } from '../../application/content/use-cases/GetContentItemBySlugUseCase';
import { RollbackContentItemUseCase } from '../../application/content/use-cases/RollbackContentItemUseCase';
import { ListContentRevisionsUseCase } from '../../application/content/use-cases/ListContentRevisionsUseCase';
import { ArchiveContentItemUseCase } from '../../application/content/use-cases/ArchiveContentItemUseCase';
import { ListPublicContentItemsUseCase } from '../../application/content/use-cases/ListPublicContentItemsUseCase';
import { RenderMarkdownPreviewUseCase } from '../../application/content/use-cases/RenderMarkdownPreviewUseCase';

// Presentation
import { AuthController } from '../controllers/AuthController.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';
import { registerAuthRoutes } from '../routes/authRoutes.fastify';
import { MediaController } from '../controllers/MediaController.fastify';
import { registerMediaRoutes } from '../routes/mediaRoutes.fastify';
import { AuditLogController } from '../controllers/AuditLogController.fastify';
import { registerAuditLogRoutes } from '../routes/auditLogRoutes.fastify';
import { InteractiveController } from '../controllers/InteractiveController.fastify';
import { registerInteractiveRoutes } from '../routes/interactiveRoutes.fastify';
import { ContentController } from '../controllers/ContentController.fastify';
import { registerContentRoutes } from '../routes/contentRoutes.fastify';

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
  const corsOrigins =
    process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ||
    (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:3000', 'http://localhost:3002']);

  await app.register(fastifyCors, {
    origin: corsOrigins,
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
  const interactiveRunRepository = new PrismaInteractiveRunRepository(prisma);
  const interactiveDefinitionRepository = new PrismaInteractiveDefinitionRepository(prisma);
  const contentItemRepository = new PrismaContentItemRepository(prisma);
  const markdownRenderer = new MarkdownRenderer();
  const analyticsService = new LoggingAnalyticsService();

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

  // Interactive Use Cases
  const startInteractiveRunUseCase = new StartInteractiveRunUseCase(
    interactiveRunRepository,
    interactiveDefinitionRepository,
    eventBus,
  );

  const completeInteractiveRunUseCase = new CompleteInteractiveRunUseCase(
    interactiveRunRepository,
    eventBus,
  );

  // Content Use Cases
  const createContentItemUseCase = new CreateContentItemUseCase(contentItemRepository, eventBus);
  const updateContentItemUseCase = new UpdateContentItemUseCase(contentItemRepository, eventBus);
  const getContentItemUseCase = new GetContentItemUseCase(contentItemRepository);
  const listContentItemsUseCase = new ListContentItemsUseCase(contentItemRepository);
  const publishContentItemUseCase = new PublishContentItemUseCase(
    contentItemRepository,
    eventBus,
  );
  const getContentItemBySlugUseCase = new GetContentItemBySlugUseCase(
    contentItemRepository,
    markdownRenderer,
  );

  const listPublicContentItemsUseCase = new ListPublicContentItemsUseCase(contentItemRepository);

  const rollbackContentItemUseCase = new RollbackContentItemUseCase(
    contentItemRepository,
    eventBus,
  );

  const listContentRevisionsUseCase = new ListContentRevisionsUseCase(contentItemRepository);

  const archiveContentItemUseCase = new ArchiveContentItemUseCase(contentItemRepository, eventBus);
  const renderMarkdownPreviewUseCase = new RenderMarkdownPreviewUseCase(markdownRenderer);

  // Подписываемся на доменные события для аналитики
  new AnalyticsEventSubscriber(eventBus, analyticsService);

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

  const interactiveController = new InteractiveController(
    startInteractiveRunUseCase,
    completeInteractiveRunUseCase,
  );

  const contentController = new ContentController(
    createContentItemUseCase,
    updateContentItemUseCase,
    getContentItemUseCase,
    listContentItemsUseCase,
    publishContentItemUseCase,
    getContentItemBySlugUseCase,
    rollbackContentItemUseCase,
    listContentRevisionsUseCase,
    archiveContentItemUseCase,
    listPublicContentItemsUseCase,
    renderMarkdownPreviewUseCase,
  );

  // Добавляем зависимости в декоратор для доступа в routes
  app.decorate('authController', authController);
  app.decorate('authMiddleware', authMiddleware);
  app.decorate('mediaController', mediaController);
  app.decorate('auditLogController', auditLogController);
  app.decorate('interactiveController', interactiveController);
  app.decorate('contentController', contentController);

  // ============================================
  // Routes
  // ============================================
  await app.register(registerAuthRoutes, { prefix: '/api/auth' });
  await app.register(registerMediaRoutes, { prefix: '/api/admin/media' });
  await app.register(registerAuditLogRoutes, { prefix: '/api/admin' });
  await app.register(registerInteractiveRoutes, {
    interactiveController: interactiveController,
  });
  await app.register(registerContentRoutes);

  // Health check endpoint
  app.get('/health', async (_request: FastifyRequest, _reply: FastifyReply) => {
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
const isMainModule = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  start();
}
