import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuditLogController } from '../controllers/AuditLogController.fastify';
import { AuthMiddleware } from '../middleware/AuthMiddleware.fastify';
import { RbacGuard } from '../middleware/RbacGuard.fastify';
import { Role } from '../../domain/identity/value-objects/Role';

/**
 * Роуты для аудит-лога (Fastify version)
 */
export async function registerAuditLogRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  // Получаем зависимости из декораторов
  const auditLogController = (fastify as any).auditLogController as AuditLogController;
  const authMiddleware = (fastify as any).authMiddleware as AuthMiddleware;

  if (!auditLogController) {
    throw new Error('AuditLogController not found in Fastify instance');
  }

  if (!authMiddleware) {
    throw new Error('AuthMiddleware not found in Fastify instance');
  }

  /**
   * GET /api/admin/audit-log
   * Получить список записей аудит-лога
   * Доступ: owner, assistant (assistant видит только свои записи)
   */
  fastify.get(
    '/audit-log',
    {
      preHandler: [authMiddleware.authenticate(), RbacGuard.requireOwnerOrAssistant()],
    },
    async (_request, _reply) => {
      await auditLogController.listAuditLog(_request, _reply);
    },
  );
}
