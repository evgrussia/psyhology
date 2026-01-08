import { randomUUID as cryptoRandomUUID } from 'crypto';

/**
 * Базовый класс для типизированных ID сущностей
 * Обеспечивает type-safety и предотвращает смешивание разных типов ID
 */
export abstract class EntityId {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty');
    }
  }

  equals(other: EntityId): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): string {
    // Используем crypto.randomUUID() из Node.js crypto модуля
    // Это работает и в браузере (если доступен) и в Node.js
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback для Node.js
    return cryptoRandomUUID();
  }
}
