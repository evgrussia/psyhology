import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListAuditLogUseCase } from './ListAuditLogUseCase';
import { IAuditLogRepository } from '../../../domain/audit/repositories/IAuditLogRepository';
import { ValidationError, AuthorizationError } from '../../shared/errors/ApplicationError';
import { AuditLogEntry } from '../../../domain/audit/entities/AuditLogEntry';
import { AuditLogEntryId } from '../../../domain/audit/value-objects/AuditLogEntryId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { AuditAction } from '../../../domain/audit/value-objects/AuditAction';
import { EntityType } from '../../../domain/audit/value-objects/EntityType';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';

describe('ListAuditLogUseCase', () => {
  let useCase: ListAuditLogUseCase;
  let mockRepository: IAuditLogRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn().mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
      }),
      count: vi.fn(),
    };

    useCase = new ListAuditLogUseCase(mockRepository);
  });

  describe('валидация пагинации', () => {
    it('должен выбросить ошибку если page < 1', async () => {
      await expect(
        useCase.execute({}, { page: 0, pageSize: 20 }, 'user-id', 'owner'),
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если pageSize < 1', async () => {
      await expect(
        useCase.execute({}, { page: 1, pageSize: 0 }, 'user-id', 'owner'),
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если pageSize > 100', async () => {
      await expect(
        useCase.execute({}, { page: 1, pageSize: 101 }, 'user-id', 'owner'),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('права доступа', () => {
    it('должен выбросить ошибку если editor пытается получить доступ', async () => {
      await expect(
        useCase.execute({}, { page: 1, pageSize: 20 }, 'user-id', 'editor'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('должен фильтровать по actorUserId для assistant', async () => {
      const userId = UserId.create('assistant-id');
      const entry = AuditLogEntry.create({
        actorUserId: userId,
        actorRole: ActorRole.Assistant,
        action: AuditAction.AdminPriceChanged,
        entityType: EntityType.Service,
      });

      mockRepository.findMany = vi.fn().mockResolvedValue({
        items: [entry],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      const result = await useCase.execute(
        {},
        { page: 1, pageSize: 20 },
        'assistant-id',
        'assistant',
      );

      expect(mockRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          actorUserId: expect.objectContaining({ value: 'assistant-id' }),
        }),
        { page: 1, pageSize: 20 },
      );
      expect(result.items).toHaveLength(1);
    });

    it('owner должен видеть все записи', async () => {
      const entry = AuditLogEntry.create({
        actorUserId: UserId.create('any-user-id'),
        actorRole: ActorRole.Owner,
        action: AuditAction.AdminPriceChanged,
        entityType: EntityType.Service,
      });

      mockRepository.findMany = vi.fn().mockResolvedValue({
        items: [entry],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      const result = await useCase.execute({}, { page: 1, pageSize: 20 }, 'owner-id', 'owner');

      // owner не должен иметь фильтр по actorUserId
      expect(mockRepository.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          actorUserId: expect.anything(),
        }),
        { page: 1, pageSize: 20 },
      );
      expect(result.items).toHaveLength(1);
    });
  });

  describe('фильтры', () => {
    it('должен применять фильтр по action', async () => {
      await useCase.execute(
        { action: 'admin_price_changed' },
        { page: 1, pageSize: 20 },
        'user-id',
        'owner',
      );

      expect(mockRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({ value: 'admin_price_changed' }),
        }),
        { page: 1, pageSize: 20 },
      );
    });

    it('должен применять фильтр по entityType', async () => {
      await useCase.execute(
        { entityType: 'service' },
        { page: 1, pageSize: 20 },
        'user-id',
        'owner',
      );

      expect(mockRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: expect.objectContaining({ value: 'service' }),
        }),
        { page: 1, pageSize: 20 },
      );
    });
  });

  describe('скрытие P1 данных', () => {
    it('assistant не должен видеть IP и User-Agent', async () => {
      const entry = AuditLogEntry.create({
        actorUserId: UserId.create('assistant-id'),
        actorRole: ActorRole.Assistant,
        action: AuditAction.AdminPriceChanged,
        entityType: EntityType.Service,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      mockRepository.findMany = vi.fn().mockResolvedValue({
        items: [entry],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      const result = await useCase.execute(
        {},
        { page: 1, pageSize: 20 },
        'assistant-id',
        'assistant',
      );

      expect(result.items[0].ipAddress).toBeNull();
      expect(result.items[0].userAgent).toBeNull();
    });

    it('owner должен видеть IP и User-Agent', async () => {
      const entry = AuditLogEntry.create({
        actorUserId: UserId.create('owner-id'),
        actorRole: ActorRole.Owner,
        action: AuditAction.AdminPriceChanged,
        entityType: EntityType.Service,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      mockRepository.findMany = vi.fn().mockResolvedValue({
        items: [entry],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });

      const result = await useCase.execute({}, { page: 1, pageSize: 20 }, 'owner-id', 'owner');

      expect(result.items[0].ipAddress).toBe('192.168.1.1');
      expect(result.items[0].userAgent).toBe('Mozilla/5.0');
    });
  });
});
