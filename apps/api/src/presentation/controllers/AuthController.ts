import { Request, Response } from 'express';
import { AdminLoginUseCase } from '../../../application/identity/use-cases/AdminLoginUseCase';
import { LogoutUseCase } from '../../../application/identity/use-cases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../../application/identity/use-cases/GetCurrentUserUseCase';
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../../../application/shared/errors/ApplicationError';
import { DomainError } from '../../../domain/shared/errors/DomainError';

/**
 * Controller для аутентификации
 */
export class AuthController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  /**
   * POST /api/auth/admin/login
   * Вход админа в систему
   */
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Получаем IP и User-Agent из request
      const ipAddress = req.ip || req.socket.remoteAddress || null;
      const userAgent = req.headers['user-agent'] || null;

      const result = await this.adminLoginUseCase.execute({
        email,
        password,
        ipAddress,
        userAgent,
      });

      // Устанавливаем cookie с session ID
      res.cookie('sessionId', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // только HTTPS в production
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
      });

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * POST /api/auth/logout
   * Выход из системы
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

      if (sessionId) {
        await this.logoutUseCase.execute({ sessionId });
      }

      // Удаляем cookie
      res.clearCookie('sessionId');

      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * GET /api/auth/me
   * Получить информацию о текущем пользователе
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // Используем middleware для установки req.currentUser
      if (req.currentUser) {
        const user = {
          id: req.currentUser.userId.value,
          email: req.currentUser.userEmail?.value || null,
          displayName: req.currentUser.userDisplayName,
          roles: req.currentUser.userRoles.map((r) => r.code),
          isAdmin: req.currentUser.isAdmin(),
        };

        res.status(200).json({
          success: true,
          data: { user },
        });
        return;
      }

      // Fallback: используем Use Case
      const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

      if (!sessionId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Session ID required',
        });
        return;
      }

      const user = await this.getCurrentUserUseCase.execute({ sessionId });

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: unknown, res: Response): void {
    console.error('Auth error:', error);

    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error instanceof AuthenticationError) {
      res.status(401).json({
        success: false,
        error: 'AuthenticationError',
        message: error.message,
      });
      return;
    }

    if (error instanceof AuthorizationError) {
      res.status(403).json({
        success: false,
        error: 'AuthorizationError',
        message: error.message,
      });
      return;
    }

    if (error instanceof DomainError) {
      res.status(400).json({
        success: false,
        error: 'DomainError',
        message: error.message,
      });
      return;
    }

    // Неизвестная ошибка
    res.status(500).json({
      success: false,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    });
  }
}
