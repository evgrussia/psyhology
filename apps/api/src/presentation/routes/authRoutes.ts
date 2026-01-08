import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * Роуты для аутентификации
 */
export function createAuthRoutes(
  authController: AuthController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  /**
   * POST /api/auth/admin/login
   * Вход админа в систему
   */
  router.post('/admin/login', (req, res) => authController.adminLogin(req, res));

  /**
   * POST /api/auth/logout
   * Выход из системы (не требует аутентификации)
   */
  router.post('/logout', (req, res) => authController.logout(req, res));

  /**
   * GET /api/auth/me
   * Получить информацию о текущем пользователе (требует аутентификации)
   */
  router.get('/me', authMiddleware.authenticate(), (req, res) =>
    authController.getCurrentUser(req, res)
  );

  return router;
}
