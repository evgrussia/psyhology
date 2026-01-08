import { UserId } from '../value-objects/Ids';

/**
 * Session Value Object для работы с сессиями
 */
export class Session {
  constructor(
    readonly sessionId: string,
    readonly userId: UserId,
    readonly createdAt: Date,
    readonly expiresAt: Date,
    readonly ipAddress: string | null,
    readonly userAgent: string | null
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired();
  }
}

/**
 * Repository интерфейс для сессий
 * Реализация может быть в БД или Redis
 */
export interface ISessionRepository {
  /**
   * Создать новую сессию
   */
  create(
    userId: UserId,
    ttlSeconds: number,
    ipAddress: string | null,
    userAgent: string | null
  ): Promise<Session>;

  /**
   * Найти сессию по ID
   */
  findById(sessionId: string): Promise<Session | null>;

  /**
   * Найти все активные сессии пользователя
   */
  findByUserId(userId: UserId): Promise<Session[]>;

  /**
   * Удалить сессию (logout)
   */
  delete(sessionId: string): Promise<void>;

  /**
   * Удалить все сессии пользователя
   */
  deleteAllByUserId(userId: UserId): Promise<void>;

  /**
   * Обновить время истечения сессии
   */
  extendExpiration(sessionId: string, ttlSeconds: number): Promise<void>;
}
