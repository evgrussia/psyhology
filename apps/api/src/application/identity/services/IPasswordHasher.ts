/**
 * Сервис для хеширования и проверки паролей
 * Интерфейс в Domain/Application, реализация в Infrastructure
 */
export interface IPasswordHasher {
  /**
   * Хешировать пароль
   */
  hash(password: string): Promise<string>;

  /**
   * Проверить пароль
   */
  verify(password: string, hash: string): Promise<boolean>;
}
