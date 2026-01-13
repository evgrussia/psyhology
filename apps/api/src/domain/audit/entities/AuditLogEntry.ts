import { AuditLogEntryId } from '../value-objects/AuditLogEntryId';
import { AuditAction } from '../value-objects/AuditAction';
import { EntityType } from '../value-objects/EntityType';
import { ActorRole } from '../value-objects/ActorRole';
import { UserId } from '../../identity/value-objects/Ids';

/**
 * AuditLogEntry Entity
 * Представляет запись в аудит-логе
 *
 * Бизнес-правила:
 * - Запись создаётся только для критичных действий
 * - oldValue и newValue должны быть санитизированы (без P2 данных)
 * - IP и User-Agent опциональны, но желательны для безопасности
 */
export class AuditLogEntry {
  private constructor(
    private readonly id: AuditLogEntryId,
    private readonly actorUserId: UserId,
    private readonly actorRole: ActorRole,
    private readonly action: AuditAction,
    private readonly entityType: EntityType,
    private readonly entityId: string | null,
    private readonly oldValue: Record<string, unknown> | null,
    private readonly newValue: Record<string, unknown> | null,
    private readonly ipAddress: string | null,
    private readonly userAgent: string | null,
    private readonly occurredAt: Date,
  ) {}

  /**
   * Создание новой записи аудит-лога
   */
  static create(params: {
    actorUserId: UserId;
    actorRole: ActorRole;
    action: AuditAction;
    entityType: EntityType;
    entityId?: string | null;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    occurredAt?: Date;
  }): AuditLogEntry {
    return new AuditLogEntry(
      AuditLogEntryId.generate(),
      params.actorUserId,
      params.actorRole,
      params.action,
      params.entityType,
      params.entityId ?? null,
      params.oldValue ?? null,
      params.newValue ?? null,
      params.ipAddress ?? null,
      params.userAgent ?? null,
      params.occurredAt ?? new Date(),
    );
  }

  /**
   * Восстановление из БД (reconstitute)
   */
  static reconstitute(data: {
    id: AuditLogEntryId;
    actorUserId: UserId;
    actorRole: ActorRole;
    action: AuditAction;
    entityType: EntityType;
    entityId: string | null;
    oldValue: Record<string, unknown> | null;
    newValue: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    occurredAt: Date;
  }): AuditLogEntry {
    return new AuditLogEntry(
      data.id,
      data.actorUserId,
      data.actorRole,
      data.action,
      data.entityType,
      data.entityId,
      data.oldValue,
      data.newValue,
      data.ipAddress,
      data.userAgent,
      data.occurredAt,
    );
  }

  // ============================================
  // Getters
  // ============================================

  get entryId(): AuditLogEntryId {
    return this.id;
  }

  get actor(): UserId {
    return this.actorUserId;
  }

  get role(): ActorRole {
    return this.actorRole;
  }

  get auditAction(): AuditAction {
    return this.action;
  }

  get type(): EntityType {
    return this.entityType;
  }

  get targetEntityId(): string | null {
    return this.entityId;
  }

  get previousValue(): Record<string, unknown> | null {
    return this.oldValue ? { ...this.oldValue } : null;
  }

  get currentValue(): Record<string, unknown> | null {
    return this.newValue ? { ...this.newValue } : null;
  }

  get ip(): string | null {
    return this.ipAddress;
  }

  get agent(): string | null {
    return this.userAgent;
  }

  get timestamp(): Date {
    return this.occurredAt;
  }
}
