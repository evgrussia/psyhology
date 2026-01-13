import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * AuditLogEntryId Value Object
 * Уникальный идентификатор записи аудит-лога
 */
export class AuditLogEntryId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): AuditLogEntryId {
    return new AuditLogEntryId(value);
  }

  static generate(): AuditLogEntryId {
    return new AuditLogEntryId(EntityId.generate());
  }
}
