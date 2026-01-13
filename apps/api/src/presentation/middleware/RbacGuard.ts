import { Request, Response, NextFunction } from 'express';
import { Role } from '../../domain/identity/value-objects/Role';

/**
 * RBAC Guard для проверки ролей пользователя
 * Используется после AuthMiddleware
 */
export class RbacGuard {
  /**
   * Проверка, что пользователь имеет одну из требуемых ролей
   */
  static requireRoles(...allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Проверяем наличие пользователя (должен быть установлен AuthMiddleware)
      if (!req.currentUser) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      // Проверяем наличие хотя бы одной из требуемых ролей
      const hasRequiredRole = allowedRoles.some((role) => req.currentUser!.hasRole(role));

      if (!hasRequiredRole) {
        res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }

  /**
   * Проверка, что пользователь - админ (любая админская роль)
   */
  static requireAdmin() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.currentUser) {
        res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        return;
      }

      if (!req.currentUser.isAdmin()) {
        res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
        return;
      }

      next();
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
