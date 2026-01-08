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
    // Используем crypto.randomUUID() вместо сторонних библиотек
    return crypto.randomUUID();
  }
}
