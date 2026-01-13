import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ContentController } from '../controllers/ContentController.fastify';
import { RbacGuard } from '../middleware/RbacGuard.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';

/**
 * Роуты для работы с контентом (Fastify version)
 */
export async function registerContentRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  // Получаем зависимости из декораторов
  const contentController = (fastify as any).contentController as ContentController;
  const authMiddleware = (fastify as any).authMiddleware as AuthMiddleware;

  // ============================================
  // Admin API Routes
  // ============================================

  /**
   * GET /api/admin/content
   * Получить список контент-айтемов
   * Требует: owner или editor
   */
  fastify.get(
    '/api/admin/content',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.listContent(request, reply);
    },
  );

  /**
   * POST /api/admin/content
   * Создать новый контент-айтем
   * Требует: owner или editor
   */
  fastify.post(
    '/api/admin/content',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.createContent(request, reply);
    },
  );

  /**
   * GET /api/admin/content/:id
   * Получить контент-айтем по ID
   * Требует: owner или editor
   */
  fastify.get(
    '/api/admin/content/:id',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.getContent(request, reply);
    },
  );

  /**
   * PUT /api/admin/content/:id
   * Обновить контент-айтем
   * Требует: owner или editor
   */
  fastify.put(
    '/api/admin/content/:id',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.updateContent(request, reply);
    },
  );

  /**
   * POST /api/admin/content/:id/publish
   * Опубликовать контент-айтем
   * Требует: owner или editor
   */
  fastify.post(
    '/api/admin/content/:id/publish',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.publishContent(request, reply);
    },
  );

  /**
   * POST /api/admin/content/:id/archive
   * Заархивировать контент-айтем
   * Требует: owner или editor
   */
  fastify.post(
    '/api/admin/content/:id/archive',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.archiveContent(request, reply);
    },
  );

  /**
   * GET /api/admin/content/:id/revisions
   * Получить список ревизий контент-айтема
   * Требует: owner или editor
   */
  fastify.get(
    '/api/admin/content/:id/revisions',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.listRevisions(request, reply);
    },
  );

  /**
   * POST /api/admin/content/:id/rollback/:revisionId
   * Откатить контент-айтем к предыдущей ревизии
   * Требует: owner или editor
   */
  fastify.post(
    '/api/admin/content/:id/rollback/:revisionId',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.rollbackContent(request, reply);
    },
  );

  /**
   * POST /api/admin/content/preview
   * Рендер markdown в HTML для live preview (админка)
   * Требует: owner или editor
   */
  fastify.post(
    '/api/admin/content/preview',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (request, reply) => {
      await contentController.renderPreview(request, reply);
    },
  );

  // ============================================
  // Public API Routes
  // ============================================

  /**
   * GET /api/public/content/:type/:slug
   * Получить опубликованный контент-айтем (публичный API, без авторизации)
   */
  fastify.get('/api/public/content/:type/:slug', async (request, reply) => {
    await contentController.getPublicContent(request, reply);
  });

  /**
   * GET /api/public/content/:type
   * Получить список опубликованного контента по типу (публичный API)
   */
  fastify.get('/api/public/content/:type', async (request, reply) => {
    await contentController.listPublicContent(request as any, reply);
  });
}
