import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WriteAuditLogUseCase } from './WriteAuditLogUseCase';
import { IAuditLogRepository } from '../../../domain/audit/repositories/IAuditLogRepository';
import { ValidationError } from '../../shared/errors/ApplicationError';
import { AuditLogEntry } from '../../../domain/audit/entities/AuditLogEntry';
import { AuditLogEntryId } from '../../../domain/audit/value-objects/AuditLogEntryId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { AuditAction } from '../../../domain/audit/value-objects/AuditAction';
import { EntityType } from '../../../domain/audit/value-objects/EntityType';
import { ActorRole } from '../../../domain/audit/value-objects/ActorRole';

describe('WriteAuditLogUseCase', () => {
  let useCase: WriteAuditLogUseCase;
  let mockRepository: IAuditLogRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    };

    useCase = new WriteAuditLogUseCase(mockRepository);
  });

  describe('валидация', () => {
    it('должен выбросить ошибку если actorUserId отсутствует', async () => {
      await expect(
        useCase.execute({
          actorUserId: '',
          actorRole: 'owner',
          action: 'admin_price_changed',
          entityType: 'service',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если action отсутствует', async () => {
      await expect(
        useCase.execute({
          actorUserId: 'user-id',
          actorRole: 'owner',
          action: '',
          entityType: 'service',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если entityType отсутствует', async () => {
      await expect(
        useCase.execute({
          actorUserId: 'user-id',
          actorRole: 'owner',
          action: 'admin_price_changed',
          entityType: '',
        }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('успешная запись', () => {
    it('должен сохранить запись аудит-лога', async () => {
      const dto = {
        actorUserId: 'user-id',
        actorRole: 'owner',
        action: 'admin_price_changed',
        entityType: 'service',
        entityId: 'service-id',
        oldValue: { price: 1000 },
        newValue: { price: 1500 },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      };

      await useCase.execute(dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedEntry = (mockRepository.save as any).mock.calls[0][0];
      expect(savedEntry).toBeInstanceOf(AuditLogEntry);
      expect(savedEntry.actor.value).toBe('user-id');
      expect(savedEntry.role.value).toBe('owner');
      expect(savedEntry.auditAction.value).toBe('admin_price_changed');
    });

    it('должен санитизировать oldValue и newValue', async () => {
      const dto = {
        actorUserId: 'user-id',
        actorRole: 'owner',
        action: 'admin_price_changed',
        entityType: 'service',
        oldValue: {
          price: 1000,
          email: 'test@example.com', // P2 - должно быть удалено
        },
        newValue: {
          price: 1500,
          email: 'test@example.com', // P2 - должно быть удалено
        },
      };

      await useCase.execute(dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedEntry = (mockRepository.save as any).mock.calls[0][0];
      const oldValue = savedEntry.previousValue;
      const newValue = savedEntry.currentValue;

      // Email должен быть удалён
      expect(oldValue).not.toHaveProperty('email');
      expect(newValue).not.toHaveProperty('email');
      // Price должен остаться
      expect(oldValue).toHaveProperty('price', 1000);
      expect(newValue).toHaveProperty('price', 1500);
    });
  });

  describe('best effort', () => {
    it('не должен пробрасывать ошибку при неудачной записи', async () => {
      mockRepository.save = vi.fn().mockRejectedValue(new Error('DB error'));

      const dto = {
        actorUserId: 'user-id',
        actorRole: 'owner',
        action: 'admin_price_changed',
        entityType: 'service',
      };

      // Не должно выбросить ошибку (best effort)
      await expect(useCase.execute(dto)).resolves.not.toThrow();
    });
  });
});
