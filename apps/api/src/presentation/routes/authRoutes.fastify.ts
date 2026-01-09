import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { AuthController } from '../controllers/AuthController.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';

/**
 * Роуты для аутентификации (Fastify version)
 */
export async function registerAuthRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  // Получаем зависимости из декораторов
  const authController = (fastify as any).authController as AuthController;
  const authMiddleware = (fastify as any).authMiddleware as AuthMiddleware;

  /**
   * POST /api/auth/admin/login
   * Rate limiting: 5 попыток в 15 минут по IP
   */
  await fastify.register(async function (fastify) {
    await fastify.register(fastifyRateLimit, {
      max: 5, // максимум 5 попыток
      timeWindow: 15 * 60 * 1000, // 15 минут в миллисекундах
      keyGenerator: (request) => {
        // Используем IP адрес для rate limiting
        return request.ip || request.socket.remoteAddress || 'unknown';
      },
      errorResponseBuilder: (_request, context) => {
        return {
          success: false,
          error: 'TooManyRequests',
          message: 'Too many login attempts. Please try again later.',
          retryAfter: Math.ceil(context.ttl / 1000), // секунды до следующей попытки
        };
      },
    });

    fastify.post('/admin/login', async (_request, _reply) => {
      await authController.adminLogin(_request, _reply);
    });
  });

  /**
   * POST /api/auth/logout
   */
  fastify.post('/logout', async (_request, _reply) => {
    await authController.logout(_request, _reply);
  });

  /**
   * GET /api/auth/me
   */
  fastify.get(
    '/me',
    {
      preHandler: authMiddleware.authenticate(),
    },
    async (_request, _reply) => {
      await authController.getCurrentUser(_request, _reply);
    },
  );
}
