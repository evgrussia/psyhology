/**
 * EntityType Value Object
 * Определяет тип сущности, над которой было выполнено действие
 */
export class EntityType {
  private constructor(readonly value: string) {}

  static readonly Service = new EntityType('service');
  static readonly Content = new EntityType('content');
  static readonly Lead = new EntityType('lead');
  static readonly User = new EntityType('user');
  static readonly Payment = new EntityType('payment');
  static readonly Appointment = new EntityType('appointment');
  static readonly Review = new EntityType('review');
  static readonly MessageTemplate = new EntityType('message_template');

  static create(value: string): EntityType {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityType cannot be empty');
    }

    // Валидация формата: только lowercase буквы и подчёркивания
    if (!/^[a-z][a-z0-9_]*$/.test(value)) {
      throw new Error(`Invalid entity type format: ${value}`);
    }

    return new EntityType(value);
  }

  static fromString(value: string): EntityType {
    return EntityType.create(value);
  }

  equals(other: EntityType): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
