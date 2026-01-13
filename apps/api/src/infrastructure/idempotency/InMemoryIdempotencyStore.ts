import type { IdempotencyKey } from './IdempotencyKey.js';
import type { IIdempotencyStore, IdempotencyResult } from './IIdempotencyStore.js';

type StoredValue = {
  value: unknown;
  expiresAt: number;
};

/**
 * In-memory реализация IdempotencyStore для разработки и тестирования.
 * В production должна быть заменена на Redis/Postgres/etc.
 */
export class InMemoryIdempotencyStore implements IIdempotencyStore {
  private readonly store = new Map<string, StoredValue>();

  async checkOrStore<T>(
    key: IdempotencyKey,
    value: T,
    ttlSeconds = 86400, // 24 часа по умолчанию
  ): Promise<IdempotencyResult<T>> {
    const keyStr = key.toString();
    const existing = this.store.get(keyStr);

    // Очищаем истёкшие ключи
    if (existing && existing.expiresAt < Date.now()) {
      this.store.delete(keyStr);
    }

    const now = Date.now();
    const expiresAt = now + ttlSeconds * 1000;

    if (existing && existing.expiresAt >= now) {
      // Ключ уже существует, возвращаем сохранённое значение
      return {
        isNew: false,
        value: existing.value as T,
      };
    }

    // Ключ новый, сохраняем
    this.store.set(keyStr, {
      value,
      expiresAt,
    });

    return {
      isNew: true,
      value: null,
    };
  }

  async exists(key: IdempotencyKey): Promise<boolean> {
    const keyStr = key.toString();
    const existing = this.store.get(keyStr);

    if (!existing) {
      return false;
    }

    if (existing.expiresAt < Date.now()) {
      this.store.delete(keyStr);
      return false;
    }

    return true;
  }

  async get<T>(key: IdempotencyKey): Promise<T | null> {
    const keyStr = key.toString();
    const existing = this.store.get(keyStr);

    if (!existing) {
      return null;
    }

    if (existing.expiresAt < Date.now()) {
      this.store.delete(keyStr);
      return null;
    }

    return existing.value as T;
  }

  async delete(key: IdempotencyKey): Promise<void> {
    this.store.delete(key.toString());
  }

  /**
   * Очищает все ключи (для тестов)
   */
  clear(): void {
    this.store.clear();
  }
}
