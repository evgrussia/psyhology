import { AuditLogEntry } from '../entities/AuditLogEntry';
import { AuditLogEntryId } from '../value-objects/AuditLogEntryId';
import { UserId } from '../../identity/value-objects/Ids';
import { AuditAction } from '../value-objects/AuditAction';
import { EntityType } from '../value-objects/EntityType';
import { ActorRole } from '../value-objects/ActorRole';

/**
 * Фильтры для поиска записей аудит-лога
 */
export interface AuditLogFilters {
  actorUserId?: UserId;
  action?: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  actorRole?: ActorRole;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * Пагинация
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Результат пагинации
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Интерфейс репозитория для работы с аудит-логом
 */
export interface IAuditLogRepository {
  /**
   * Сохранить запись аудит-лога
   */
  save(entry: AuditLogEntry): Promise<void>;

  /**
   * Найти запись по ID
   */
  findById(id: AuditLogEntryId): Promise<AuditLogEntry | null>;

  /**
   * Найти записи с фильтрами и пагинацией
   */
  findMany(
    filters: AuditLogFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<AuditLogEntry>>;

  /**
   * Подсчитать количество записей по фильтрам
   */
  count(filters: AuditLogFilters): Promise<number>;
}
