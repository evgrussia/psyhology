import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MediaController } from '../controllers/MediaController.fastify';
import { RbacGuard } from '../middleware/RbacGuard.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';

/**
 * Роуты для работы с медиа-активами (Fastify version)
 */
export async function registerMediaRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  // Получаем зависимости из декораторов
  const mediaController = (fastify as any).mediaController as MediaController;
  const authMiddleware = (fastify as any).authMiddleware as AuthMiddleware;

  /**
   * POST /api/admin/media/init
   * Создать медиа-актив и получить pre-signed URL для загрузки
   * Требует: owner или editor
   */
  fastify.post(
    '/init',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (_request, _reply) => {
      await mediaController.initUpload(_request, _reply);
    },
  );

  /**
   * POST /api/admin/media/:id/finalize
   * Завершить загрузку медиа-файла
   * Требует: owner или editor
   */
  fastify.post(
    '/:id/finalize',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (_request, _reply) => {
      await mediaController.finalizeUpload(_request as any, _reply);
    },
  );

  /**
   * DELETE /api/admin/media/:id
   * Удалить медиа-актив
   * Требует: owner или editor
   */
  fastify.delete(
    '/:id',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (_request, _reply) => {
      await mediaController.deleteMedia(_request as any, _reply);
    },
  );

  /**
   * GET /api/admin/media
   * Получить список медиа-активов
   * Требует: owner или editor
   */
  fastify.get(
    '/',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireContentManager()],
    },
    async (_request, _reply) => {
      await mediaController.listMedia(_request as any, _reply);
    },
  );
}
