/**
 * ActorRole Value Object
 * Определяет роль пользователя, который выполнил действие
 * Используется для фильтрации доступа к audit log
 */
export class ActorRole {
  private constructor(readonly value: string) {}

  static readonly Owner = new ActorRole('owner');
  static readonly Assistant = new ActorRole('assistant');
  static readonly Editor = new ActorRole('editor');

  static create(value: string): ActorRole {
    if (!value || value.trim().length === 0) {
      throw new Error('ActorRole cannot be empty');
    }

    const validRoles = ['owner', 'assistant', 'editor'];
    if (!validRoles.includes(value)) {
      throw new Error(`Invalid actor role: ${value}. Must be one of: ${validRoles.join(', ')}`);
    }

    return new ActorRole(value);
  }

  static fromString(value: string): ActorRole {
    return ActorRole.create(value);
  }

  /**
   * Проверяет, может ли роль видеть все записи аудит-лога
   */
  canViewAllEntries(): boolean {
    return this.value === 'owner';
  }

  /**
   * Проверяет, может ли роль видеть записи аудит-лога
   */
  canViewAuditLog(): boolean {
    return this.value === 'owner' || this.value === 'assistant';
  }

  equals(other: ActorRole): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
