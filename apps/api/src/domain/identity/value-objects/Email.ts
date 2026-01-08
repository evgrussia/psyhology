import { DomainError } from '../../shared/errors/DomainError';

/**
 * Email Value Object
 * Неизменяемый, валидация при создании
 */
export class Email {
  private constructor(readonly value: string) {}

  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new DomainError('Email cannot be empty');
    }

    const normalized = email.toLowerCase().trim();

    if (!Email.isValid(normalized)) {
      throw new DomainError('Invalid email format');
    }

    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    // RFC 5322 упрощённый формат
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email | null): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
