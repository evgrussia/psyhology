import { IAuditLogRepository } from '../../../domain/audit/repositories/IAuditLogRepository';
import {
  AuditLogFilters,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/audit/repositories/IAuditLogRepository';
import { AuditLogEntry } from '../../../domain/audit/entities/AuditLogEntry';
import { AuditLogEntryId } from '../../../domain/audit/value-objects/AuditLogEntryId';
import { AuditLogEntryMapper } from '../mappers/AuditLogEntryMapper';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация AuditLogRepository через Prisma
 */
export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(entry: AuditLogEntry): Promise<void> {
    const data = AuditLogEntryMapper.toPersistence(entry);

    await this.prisma.auditLogEntry.create({
      data,
    });
  }

  async findById(id: AuditLogEntryId): Promise<AuditLogEntry | null> {
    const record = await this.prisma.auditLogEntry.findUnique({
      where: { id: id.value },
    });

    if (!record) {
      return null;
    }

    return AuditLogEntryMapper.toDomain(record);
  }

  async findMany(
    filters: AuditLogFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<AuditLogEntry>> {
    // Строим where условие для Prisma
    const where: any = {};

    if (filters.actorUserId) {
      where.actorUserId = filters.actorUserId.value;
    }

    if (filters.action) {
      where.action = filters.action.value;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType.value;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.actorRole) {
      where.actorRole = filters.actorRole.value;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    // Получаем общее количество записей
    const total = await this.prisma.auditLogEntry.count({ where });

    // Получаем записи с пагинацией
    const records = await this.prisma.auditLogEntry.findMany({
      where,
      orderBy: {
        createdAt: 'desc', // Новые записи первыми
      },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    const items = records.map((record: any) => AuditLogEntryMapper.toDomain(record));

    const totalPages = Math.ceil(total / pagination.pageSize);

    return {
      items,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
    };
  }

  async count(filters: AuditLogFilters): Promise<number> {
    const where: any = {};

    if (filters.actorUserId) {
      where.actorUserId = filters.actorUserId.value;
    }

    if (filters.action) {
      where.action = filters.action.value;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType.value;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.actorRole) {
      where.actorRole = filters.actorRole.value;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    return this.prisma.auditLogEntry.count({ where });
  }
}
