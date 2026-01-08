import { Request, Response, NextFunction } from 'express';
import { ISessionRepository } from '../../../domain/identity/repositories/ISessionRepository';
import { IUserRepository } from '../../../domain/identity/repositories/IUserRepository';
import { User } from '../../../domain/identity/aggregates/User';

/**
 * Расширяем Request для добавления информации о пользователе
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      sessionId?: string;
    }
  }
}

/**
 * Middleware для проверки аутентификации
 * Проверяет наличие валидной сессии и добавляет пользователя в req
 */
export class AuthMiddleware {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Middleware функция
   */
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 1. Получаем session ID из cookie или заголовка
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];

        if (!sessionId) {
          res.status(401).json({ error: 'Unauthorized', message: 'Session ID required' });
          return;
        }

        // 2. Проверяем сессию
        const session = await this.sessionRepository.findById(sessionId);

        if (!session) {
          res.status(401).json({ error: 'Unauthorized', message: 'Invalid session' });
          return;
        }

        if (session.isExpired()) {
          await this.sessionRepository.delete(sessionId);
          res.status(401).json({ error: 'Unauthorized', message: 'Session expired' });
          return;
        }

        // 3. Получаем пользователя
        const user = await this.userRepository.findById(session.userId);

        if (!user) {
          await this.sessionRepository.delete(sessionId);
          res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
          return;
        }

        // 4. Проверяем статус
        if (user.userStatus.isBlocked()) {
          await this.sessionRepository.delete(sessionId);
          res.status(403).json({ error: 'Forbidden', message: 'User is blocked' });
          return;
        }

        // 5. Добавляем пользователя в request
        req.currentUser = user;
        req.sessionId = sessionId;

        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  }
}
