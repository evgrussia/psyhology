import type { IdempotencyKey } from './IdempotencyKey.js';

/**
 * Результат проверки idempotency key
 */
export type IdempotencyResult<T = unknown> =
  | { isNew: true; value: null }
  | { isNew: false; value: T };

/**
 * Интерфейс для хранения idempotency keys.
 * Используется для предотвращения повторной обработки операций.
 */
export interface IIdempotencyStore {
  /**
   * Проверяет, был ли ключ использован ранее.
   * Если ключ новый, сохраняет его с результатом операции.
   * Если ключ уже существует, возвращает сохранённый результат.
   * 
   * @param key idempotency key
   * @param ttl время жизни в секундах (по умолчанию 24 часа)
   * @returns результат проверки
   */
  checkOrStore<T>(
    key: IdempotencyKey,
    value: T,
    ttlSeconds?: number
  ): Promise<IdempotencyResult<T>>;

  /**
   * Проверяет, существует ли ключ
   */
  exists(key: IdempotencyKey): Promise<boolean>;

  /**
   * Получает сохранённое значение по ключу
   */
  get<T>(key: IdempotencyKey): Promise<T | null>;

  /**
   * Удаляет ключ (для тестов)
   */
  delete(key: IdempotencyKey): Promise<void>;
}
