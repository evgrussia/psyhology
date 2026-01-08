import { FastifyRequest, FastifyReply } from 'fastify';
import { ListAuditLogUseCase } from '../../../application/audit/use-cases/ListAuditLogUseCase';
import {
  ValidationError,
  AuthorizationError,
} from '../../../application/shared/errors/ApplicationError';
import { Role } from '../../../domain/identity/value-objects/Role';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';

/**
 * Query параметры для GET /api/admin/audit-log
 */
interface AuditLogQuery {
  actorUserId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  actorRole?: string;
  fromDate?: string;
  toDate?: string;
  page?: string;
  pageSize?: string;
}

/**
 * Controller для аудит-лога (Fastify version)
 */
export class AuditLogController {
  constructor(private readonly listAuditLogUseCase: ListAuditLogUseCase) {}

  /**
   * GET /api/admin/audit-log
   * Получить список записей аудит-лога с фильтрами и пагинацией
   */
  async listAuditLog(
    request: FastifyRequest<{ Querystring: AuditLogQuery }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      // Проверяем наличие пользователя (должен быть установлен AuthMiddleware)
      if (!request.currentUser) {
        return reply.code(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      // Проверяем права доступа
      const userRoles = request.currentUser.userRoles;
      const isOwner = userRoles.some((r) => r.equals(Role.Owner));
      const isAssistant = userRoles.some((r) => r.equals(Role.Assistant));

      if (!isOwner && !isAssistant) {
        return reply.code(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Access denied: owner or assistant role required',
        });
      }

      // Определяем роль для фильтрации
      const currentUserRole = isOwner ? 'owner' : 'assistant';

      // Парсим query параметры
      const query = request.query;

      const filters = {
        actorUserId: query.actorUserId,
        action: query.action,
        entityType: query.entityType,
        entityId: query.entityId,
        actorRole: query.actorRole,
        fromDate: query.fromDate,
        toDate: query.toDate,
      };

      const pagination = {
        page: query.page ? parseInt(query.page, 10) : undefined,
        pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      };

      // Выполняем use case
      const result = await this.listAuditLogUseCase.execute(
        filters,
        pagination,
        request.currentUser.userId.value,
        currentUserRole,
      );

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('AuditLog error:', error);

    if (error instanceof ValidationError) {
      reply.code(400).send({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: (error as any).errors,
      });
      return;
    }

    if (error instanceof AuthorizationError) {
      reply.code(403).send({
        success: false,
        error: 'AuthorizationError',
        message: error.message,
      });
      return;
    }

    // Неизвестная ошибка
    reply.code(500).send({
      success: false,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    });
  }
}
