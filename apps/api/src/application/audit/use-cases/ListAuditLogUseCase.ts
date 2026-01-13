import { IAuditLogRepository } from '../../../domain/audit/repositories/IAuditLogRepository';
import { AuditLogFilters } from '../../../domain/audit/repositories/IAuditLogRepository';
import { AuditAction } from '../../../domain/audit/value-objects/AuditAction';
import { EntityType } from '../../../domain/audit/value-objects/EntityType';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { AuthorizationError, ValidationError } from '../../shared/errors/ApplicationError';

/**
 * DTO для фильтров аудит-лога
 */
export interface ListAuditLogFiltersDto {
  actorUserId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  actorRole?: string;
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
}

/**
 * DTO для пагинации
 */
export interface PaginationDto {
  page?: number;
  pageSize?: number;
}

/**
 * DTO для результата
 */
export interface AuditLogEntryDto {
  id: string;
  actorUserId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  occurredAt: Date;
}

export interface ListAuditLogResultDto {
  items: AuditLogEntryDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Use Case: Получить список записей аудит-лога
 *
 * Бизнес-правила:
 * - owner видит все записи
 * - assistant видит только свои записи
 * - editor не имеет доступа (проверяется на уровне middleware)
 */
export class ListAuditLogUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(
    filters: ListAuditLogFiltersDto,
    pagination: PaginationDto,
    currentUserId: string,
    currentUserRole: string,
  ): Promise<ListAuditLogResultDto> {
    // 1. Валидация пагинации
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 20;

    if (page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }

    if (pageSize < 1 || pageSize > 100) {
      throw new ValidationError('Page size must be between 1 and 100');
    }

    // 2. Проверка прав доступа и применение фильтров
    const actorRole = ActorRole.fromString(currentUserRole);

    if (!actorRole.canViewAuditLog()) {
      throw new AuthorizationError('Access denied: insufficient permissions');
    }

    // 3. Строим фильтры для репозитория
    const repoFilters: AuditLogFilters = {};

    // Assistant видит только свои записи
    if (actorRole.value === 'assistant') {
      repoFilters.actorUserId = UserId.create(currentUserId);
    } else if (filters.actorUserId) {
      // Owner может фильтровать по любому пользователю
      repoFilters.actorUserId = UserId.create(filters.actorUserId);
    }

    // Применяем остальные фильтры
    if (filters.action) {
      try {
        repoFilters.action = AuditAction.fromString(filters.action);
      } catch (_error) {
        throw new ValidationError(`Invalid action: ${filters.action}`);
      }
    }

    if (filters.entityType) {
      try {
        repoFilters.entityType = EntityType.fromString(filters.entityType);
      } catch (_error) {
        throw new ValidationError(`Invalid entity type: ${filters.entityType}`);
      }
    }

    if (filters.entityId) {
      repoFilters.entityId = filters.entityId;
    }

    if (filters.actorRole) {
      try {
        repoFilters.actorRole = ActorRole.fromString(filters.actorRole);
      } catch (_error) {
        throw new ValidationError(`Invalid actor role: ${filters.actorRole}`);
      }
    }

    if (filters.fromDate) {
      repoFilters.fromDate = new Date(filters.fromDate);
      if (isNaN(repoFilters.fromDate.getTime())) {
        throw new ValidationError('Invalid fromDate format');
      }
    }

    if (filters.toDate) {
      repoFilters.toDate = new Date(filters.toDate);
      if (isNaN(repoFilters.toDate.getTime())) {
        throw new ValidationError('Invalid toDate format');
      }
    }

    // 4. Получаем данные из репозитория
    const result = await this.auditLogRepository.findMany(repoFilters, {
      page,
      pageSize,
    });

    // 5. Преобразуем в DTO
    const items: AuditLogEntryDto[] = result.items.map((entry) => ({
      id: entry.entryId.value,
      actorUserId: entry.actor.value,
      actorRole: entry.role.value,
      action: entry.auditAction.value,
      entityType: entry.type.value,
      entityId: entry.targetEntityId,
      oldValue: entry.previousValue,
      newValue: entry.currentValue,
      // IP и User-Agent скрываем от assistant (только owner видит)
      ipAddress: actorRole.canViewAllEntries() ? entry.ip : null,
      userAgent: actorRole.canViewAllEntries() ? entry.agent : null,
      occurredAt: entry.timestamp,
    }));

    return {
      items,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}
