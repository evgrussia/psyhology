import { User } from '../aggregates/User';
import { UserId } from '../value-objects/Ids';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

/**
 * Repository интерфейс для User aggregate
 * Реализация находится в Infrastructure Layer
 */
export interface IUserRepository {
  /**
   * Найти пользователя по ID
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Найти пользователя по email
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Найти пользователя по телефону
   */
  findByPhone(phone: PhoneNumber): Promise<User | null>;

  /**
   * Найти пользователя по Telegram User ID
   */
  findByTelegramUserId(telegramUserId: string): Promise<User | null>;

  /**
   * Сохранить пользователя (create или update)
   */
  save(user: User): Promise<void>;

  /**
   * Найти всех пользователей с определённой ролью
   */
  findByRole(roleCode: string): Promise<User[]>;

  /**
   * Проверить существование email
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Получить password hash для пользователя (только для админов)
   */
  getPasswordHash(userId: UserId): Promise<string | null>;
}
