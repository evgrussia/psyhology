import { DomainError } from '../../shared/errors/DomainError';

/**
 * PhoneNumber Value Object
 * Нормализация и валидация номера телефона
 */
export class PhoneNumber {
  private constructor(readonly value: string) {}

  static create(phone: string): PhoneNumber {
    if (!phone || phone.trim().length === 0) {
      throw new DomainError('Phone number cannot be empty');
    }

    // Нормализация: оставляем только цифры
    const normalized = phone.replace(/\D/g, '');

    if (normalized.length < 10 || normalized.length > 15) {
      throw new DomainError('Invalid phone number length');
    }

    return new PhoneNumber(normalized);
  }

  equals(other: PhoneNumber | null): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  /**
   * Форматирование для отображения
   * +7 (XXX) XXX-XX-XX
   */
  format(): string {
    if (this.value.length === 11 && this.value.startsWith('7')) {
      return `+7 (${this.value.slice(1, 4)}) ${this.value.slice(4, 7)}-${this.value.slice(7, 9)}-${this.value.slice(9)}`;
    }
    return `+${this.value}`;
  }

  toString(): string {
    return this.value;
  }
}
