import { AuditLogEntry } from '../../../domain/audit/entities/AuditLogEntry';
import { AuditLogEntryId } from '../../../domain/audit/value-objects/AuditLogEntryId';
import { AuditAction } from '../../../domain/audit/value-objects/AuditAction';
import { EntityType } from '../../../domain/audit/value-objects/EntityType';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';
import { UserId } from '../../../domain/identity/value-objects/Ids';

/**
 * Mapper для AuditLogEntry
 * Преобразование между Domain Model и Prisma DB Model
 */
export class AuditLogEntryMapper {
  /**
   * Преобразование из Prisma модели в Domain Model
   */
  static toDomain(record: any): AuditLogEntry {
    return AuditLogEntry.reconstitute({
      id: AuditLogEntryId.create(record.id),
      actorUserId: UserId.create(record.actorUserId),
      actorRole: ActorRole.fromString(record.actorRole),
      action: AuditAction.fromString(record.action),
      entityType: EntityType.fromString(record.entityType),
      entityId: record.entityId,
      oldValue: record.oldValue as Record<string, unknown> | null,
      newValue: record.newValue as Record<string, unknown> | null,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      occurredAt: record.createdAt,
    });
  }

  /**
   * Преобразование из Domain Model в Prisma данные
   */
  static toPersistence(entry: AuditLogEntry): any {
    return {
      id: entry.entryId.value,
      actorUserId: entry.actor.value,
      actorRole: entry.role.value,
      action: entry.auditAction.value,
      entityType: entry.type.value,
      entityId: entry.targetEntityId,
      oldValue: entry.previousValue,
      newValue: entry.currentValue,
      ipAddress: entry.ip,
      userAgent: entry.agent,
      createdAt: entry.timestamp,
    };
  }
}
