import { FastifyRequest, FastifyReply } from 'fastify';
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
 * Controller для аутентификации (Fastify version)
 */
export class AuthController {
  constructor(
    private readonly adminLoginUseCase: AdminLoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  /**
   * POST /api/auth/admin/login
   */
  async adminLogin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { email?: string; password?: string };
      const { email, password } = body;

      // Получаем IP и User-Agent
      const ipAddress = request.ip || null;
      const userAgent = request.headers['user-agent'] || null;

      const result = await this.adminLoginUseCase.execute({
        email: email || '',
        password: password || '',
        ipAddress,
        userAgent,
      });

      // Устанавливаем cookie с session ID
      reply.setCookie('sessionId', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 часа в секундах
        path: '/',
      });

      reply.code(200).send({
        success: true,
        data: {
          user: result.user,
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const sessionId =
        request.cookies?.sessionId || request.headers['x-session-id'];

      if (sessionId) {
        await this.logoutUseCase.execute({ sessionId: sessionId as string });
      }

      // Удаляем cookie
      reply.clearCookie('sessionId', { path: '/' });

      reply.code(204).send();
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Используем middleware для установки request.currentUser
      if (request.currentUser) {
        const user = {
          id: request.currentUser.userId.value,
          email: request.currentUser.userEmail?.value || null,
          displayName: request.currentUser.userDisplayName,
          roles: request.currentUser.userRoles.map((r) => r.code),
          isAdmin: request.currentUser.isAdmin(),
        };

        reply.code(200).send({
          success: true,
          data: { user },
        });
        return;
      }

      // Fallback
      const sessionId =
        request.cookies?.sessionId || request.headers['x-session-id'];

      if (!sessionId) {
        reply.code(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'Session ID required',
        });
        return;
      }

      const user = await this.getCurrentUserUseCase.execute({
        sessionId: sessionId as string,
      });

      reply.code(200).send({
        success: true,
        data: { user },
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('Auth error:', error);

    if (error instanceof ValidationError) {
      reply.code(400).send({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error instanceof AuthenticationError) {
      reply.code(401).send({
        success: false,
        error: 'AuthenticationError',
        message: error.message,
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

    if (error instanceof DomainError) {
      reply.code(400).send({
        success: false,
        error: 'DomainError',
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
