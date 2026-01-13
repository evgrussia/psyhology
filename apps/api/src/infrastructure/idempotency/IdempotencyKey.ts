/**
 * Value Object для idempotency key.
 * Используется для обеспечения идемпотентности операций (payments, booking, etc.)
 */
export class IdempotencyKey {
  private constructor(private readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error('Idempotency key cannot be empty');
    }
    if (value.length > 255) {
      throw new Error('Idempotency key cannot exceed 255 characters');
    }
  }

  /**
   * Создаёт новый idempotency key из строки
   */
  static fromString(value: string): IdempotencyKey {
    return new IdempotencyKey(value);
  }

  /**
   * Генерирует новый случайный idempotency key (UUID)
   */
  static generate(): IdempotencyKey {
    return new IdempotencyKey(crypto.randomUUID());
  }

  /**
   * Генерирует idempotency key из данных операции
   * @param prefix префикс (например, 'payment', 'booking')
   * @param data данные операции для хеширования
   */
  static fromData(prefix: string, data: Record<string, unknown>): IdempotencyKey {
    const dataStr = JSON.stringify(data);
    const hash = Buffer.from(dataStr).toString('base64url').slice(0, 32);
    return new IdempotencyKey(`${prefix}_${hash}`);
  }

  /**
   * Возвращает строковое значение ключа
   */
  toString(): string {
    return this.value;
  }

  /**
   * Сравнивает два ключа
   */
  equals(other: IdempotencyKey): boolean {
    return this.value === other.value;
  }
}
