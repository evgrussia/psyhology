import { FastifyRequest, FastifyReply } from 'fastify';
import { ISessionRepository } from '../../../domain/identity/repositories/ISessionRepository';
import { IUserRepository } from '../../../domain/identity/repositories/IUserRepository';

/**
 * Middleware для проверки аутентификации (Fastify version)
 * Проверяет наличие валидной сессии и добавляет пользователя в request
 */
export class AuthMiddleware {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Fastify preHandler hook
   */
  authenticate() {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // 1. Получаем session ID из cookie или заголовка
        const sessionId =
          request.cookies?.sessionId || request.headers['x-session-id'];

        if (!sessionId) {
          return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Session ID required',
          });
        }

        // 2. Проверяем сессию
        const session = await this.sessionRepository.findById(sessionId as string);

        if (!session) {
          return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Invalid session',
          });
        }

        if (session.isExpired()) {
          await this.sessionRepository.delete(sessionId as string);
          return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Session expired',
          });
        }

        // 3. Получаем пользователя
        const user = await this.userRepository.findById(session.userId);

        if (!user) {
          await this.sessionRepository.delete(sessionId as string);
          return reply.code(401).send({
            error: 'Unauthorized',
            message: 'User not found',
          });
        }

        // 4. Проверяем статус
        if (user.userStatus.isBlocked()) {
          await this.sessionRepository.delete(sessionId as string);
          return reply.code(403).send({
            error: 'Forbidden',
            message: 'User is blocked',
          });
        }

        // 5. Добавляем пользователя в request
        request.currentUser = user;
        request.sessionId = sessionId as string;
      } catch (error) {
        request.log.error('Auth middleware error:', error);
        return reply.code(500).send({ error: 'Internal Server Error' });
      }
    };
  }
}
