import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '../../domain/identity/value-objects/Role';

/**
 * RBAC Guard для Fastify
 * Проверка ролей пользователя
 */
export class RbacGuard {
  /**
   * Проверка, что пользователь имеет одну из требуемых ролей
   */
  static requireRoles(...allowedRoles: Role[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      // Проверяем наличие пользователя (должен быть установлен AuthMiddleware)
      if (!request.currentUser) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      // Проверяем наличие хотя бы одной из требуемых ролей
      const hasRequiredRole = allowedRoles.some((role) => request.currentUser!.hasRole(role));

      if (!hasRequiredRole) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }
    };
  }

  /**
   * Проверка, что пользователь - админ
   */
  static requireAdmin() {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.currentUser) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      if (!request.currentUser.isAdmin()) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Admin access required',
        });
      }
    };
  }

  /**
   * Проверка, что пользователь - owner
   */
  static requireOwner() {
    return RbacGuard.requireRoles(Role.Owner);
  }

  /**
   * Проверка, что пользователь - owner или assistant
   */
  static requireOwnerOrAssistant() {
    return RbacGuard.requireRoles(Role.Owner, Role.Assistant);
  }

  /**
   * Проверка, что пользователь может управлять контентом
   */
  static requireContentManager() {
    return RbacGuard.requireRoles(Role.Owner, Role.Editor);
  }
}
