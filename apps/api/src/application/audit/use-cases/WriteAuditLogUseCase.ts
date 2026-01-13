import { IAuditLogRepository } from '../../../domain/audit/repositories/IAuditLogRepository';
import { AuditLogEntry } from '../../../domain/audit/entities/AuditLogEntry';
import { AuditAction } from '../../../domain/audit/value-objects/AuditAction';
import { EntityType } from '../../../domain/audit/value-objects/EntityType';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { AuditDataSanitizer } from '../services/AuditDataSanitizer';
import { ValidationError } from '../../shared/errors/ApplicationError';

/**
 * DTO для записи в аудит-лог
 */
export interface WriteAuditLogDto {
  actorUserId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Use Case: Записать событие в аудит-лог
 *
 * Бизнес-правила:
 * - Данные автоматически санитизируются (удаляются P2)
 * - Запись должна быть "best effort" - не должна ломать основную операцию
 */
export class WriteAuditLogUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(dto: WriteAuditLogDto): Promise<void> {
    // 1. Валидация входных данных
    if (!dto.actorUserId || dto.actorUserId.trim().length === 0) {
      throw new ValidationError('Actor user ID is required');
    }

    if (!dto.action || dto.action.trim().length === 0) {
      throw new ValidationError('Action is required');
    }

    if (!dto.entityType || dto.entityType.trim().length === 0) {
      throw new ValidationError('Entity type is required');
    }

    // 2. Создаём Value Objects
    let actorUserId: UserId;
    let actorRole: ActorRole;
    let action: AuditAction;
    let entityType: EntityType;

    try {
      actorUserId = UserId.create(dto.actorUserId);
      actorRole = ActorRole.fromString(dto.actorRole);
      action = AuditAction.fromString(dto.action);
      entityType = EntityType.fromString(dto.entityType);
    } catch (_error) {
      throw new ValidationError(
        `Invalid value object: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      );
    }

    // 3. Санитизируем oldValue и newValue
    const sanitized = AuditDataSanitizer.createDiff(dto.oldValue ?? null, dto.newValue ?? null);

    // 4. Создаём доменную сущность
    const entry = AuditLogEntry.create({
      actorUserId,
      actorRole,
      action,
      entityType,
      entityId: dto.entityId ?? null,
      oldValue: sanitized.oldValue,
      newValue: sanitized.newValue,
      ipAddress: dto.ipAddress ?? null,
      userAgent: dto.userAgent ?? null,
    });

    // 5. Сохраняем в репозиторий
    // Используем try-catch для "best effort" - не ломаем основную операцию
    try {
      await this.auditLogRepository.save(entry);
    } catch (_error) {
      // Логируем ошибку, но не пробрасываем её дальше
      // В production здесь должен быть logger
      console.error('Failed to write audit log entry:', _error);
      // Для критичных действий (экспорт) можно пробросить ошибку
      // Но по умолчанию делаем "best effort"
    }
  }
}
