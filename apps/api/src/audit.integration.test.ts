import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { WriteAuditLogUseCase } from './application/audit/use-cases/WriteAuditLogUseCase';
import { ListAuditLogUseCase } from './application/audit/use-cases/ListAuditLogUseCase';
import { PrismaAuditLogRepository } from './infrastructure/audit/repositories/PrismaAuditLogRepository';
import { PrismaUserRepository } from './infrastructure/identity/repositories/PrismaUserRepository';
import { User } from './domain/identity/aggregates/User';
import { UserId } from './domain/identity/value-objects/Ids';
import { Email } from './domain/identity/value-objects/Email';
import { UserStatus } from './domain/identity/value-objects/UserStatus';
import { Role } from './domain/identity/value-objects/Role';

/**
 * Integration тесты для Audit Log (FEAT-PLT-05)
 *
 * Проверяют:
 * - Сохранение записей в БД
 * - Фильтрацию и пагинацию
 * - Права доступа (owner vs assistant)
 * - Санитизацию данных
 * - Скрытие P1 данных (IP/User-Agent) от assistant
 */
describe('Audit Log Integration Tests', () => {
  let prisma: PrismaClient;
  let auditLogRepository: PrismaAuditLogRepository;
  let userRepository: PrismaUserRepository;
  let writeAuditLogUseCase: WriteAuditLogUseCase;
  let listAuditLogUseCase: ListAuditLogUseCase;

  let ownerUser: User;
  let assistantUser: User;

  beforeAll(async () => {
    // Подключаемся к тестовой БД
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/psychology_test',
        },
      },
    });

    auditLogRepository = new PrismaAuditLogRepository(prisma);
    userRepository = new PrismaUserRepository(prisma);
    writeAuditLogUseCase = new WriteAuditLogUseCase(auditLogRepository);
    listAuditLogUseCase = new ListAuditLogUseCase(auditLogRepository);

    // Создаём тестовых пользователей
    ownerUser = User.create({
      email: Email.create('owner@test.com'),
      roles: [Role.Owner],
      userStatus: UserStatus.Active,
    });

    assistantUser = User.create({
      email: Email.create('assistant@test.com'),
      roles: [Role.Assistant],
      userStatus: UserStatus.Active,
    });

    await userRepository.save(ownerUser);
    await userRepository.save(assistantUser);
  });

  afterAll(async () => {
    // Очищаем тестовые данные
    await prisma.auditLogEntry.deleteMany({
      where: {
        OR: [{ actorUserId: ownerUser.userId.value }, { actorUserId: assistantUser.userId.value }],
      },
    });

    await prisma.userRole.deleteMany({
      where: {
        OR: [{ userId: ownerUser.userId.value }, { userId: assistantUser.userId.value }],
      },
    });

    await prisma.user.deleteMany({
      where: {
        OR: [{ id: ownerUser.userId.value }, { id: assistantUser.userId.value }],
      },
    });

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Очищаем audit log перед каждым тестом
    await prisma.auditLogEntry.deleteMany({
      where: {
        OR: [{ actorUserId: ownerUser.userId.value }, { actorUserId: assistantUser.userId.value }],
      },
    });
  });

  describe('WriteAuditLogUseCase Integration', () => {
    it('должен сохранить запись в БД с полными данными', async () => {
      // Arrange & Act
      await writeAuditLogUseCase.execute({
        actorUserId: ownerUser.userId.value,
        actorRole: 'owner',
        action: 'admin_price_changed',
        entityType: 'service',
        entityId: 'service-123',
        oldValue: { price: 1000 },
        newValue: { price: 1500 },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      // Assert
      const records = await prisma.auditLogEntry.findMany({
        where: { actorUserId: ownerUser.userId.value },
      });

      expect(records).toHaveLength(1);
      expect(records[0].action).toBe('admin_price_changed');
      expect(records[0].entityType).toBe('service');
      expect(records[0].entityId).toBe('service-123');
      expect(records[0].ipAddress).toBe('192.168.1.1');
      expect(records[0].userAgent).toBe('Mozilla/5.0');
    });

    it('должен санитизировать P2 данные перед сохранением', async () => {
      // Arrange & Act
      await writeAuditLogUseCase.execute({
        actorUserId: ownerUser.userId.value,
        actorRole: 'owner',
        action: 'admin_content_deleted',
        entityType: 'content',
        entityId: 'content-456',
        oldValue: {
          id: 'content-456',
          title: 'Article Title',
          email: 'user@example.com', // P2 - должно быть удалено
          phone: '+79991234567', // P2 - должно быть удалено
        },
        newValue: null,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      // Assert
      const records = await prisma.auditLogEntry.findMany({
        where: { actorUserId: ownerUser.userId.value },
      });

      expect(records).toHaveLength(1);
      const oldValue = records[0].oldValue as any;
      expect(oldValue).not.toHaveProperty('email');
      expect(oldValue).not.toHaveProperty('phone');
      expect(oldValue).toHaveProperty('id', 'content-456');
      expect(oldValue).toHaveProperty('title', 'Article Title');
    });
  });

  describe('ListAuditLogUseCase Integration', () => {
    beforeEach(async () => {
      // Создаём тестовые записи
      await writeAuditLogUseCase.execute({
        actorUserId: ownerUser.userId.value,
        actorRole: 'owner',
        action: 'admin_price_changed',
        entityType: 'service',
        entityId: 'service-1',
        oldValue: { price: 1000 },
        newValue: { price: 1500 },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      await writeAuditLogUseCase.execute({
        actorUserId: assistantUser.userId.value,
        actorRole: 'assistant',
        action: 'admin_data_exported',
        entityType: 'lead',
        newValue: { exportType: 'csv' },
        ipAddress: '192.168.1.2',
        userAgent: 'Chrome/90.0',
      });

      await writeAuditLogUseCase.execute({
        actorUserId: ownerUser.userId.value,
        actorRole: 'owner',
        action: 'admin_content_deleted',
        entityType: 'content',
        entityId: 'content-1',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });
    });

    it('owner должен видеть все записи', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        {},
        { page: 1, pageSize: 20 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert
      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(3);
    });

    it('assistant должен видеть только свои записи', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        {},
        { page: 1, pageSize: 20 },
        assistantUser.userId.value,
        'assistant',
      );

      // Assert
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].actorUserId).toBe(assistantUser.userId.value);
      expect(result.items[0].action).toBe('admin_data_exported');
    });

    it('owner должен видеть IP и User-Agent', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        { actorUserId: ownerUser.userId.value },
        { page: 1, pageSize: 20 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert
      expect(result.items[0].ipAddress).toBe('192.168.1.1');
      expect(result.items[0].userAgent).toBe('Mozilla/5.0');
    });

    it('assistant НЕ должен видеть IP и User-Agent', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        {},
        { page: 1, pageSize: 20 },
        assistantUser.userId.value,
        'assistant',
      );

      // Assert
      expect(result.items[0].ipAddress).toBeNull();
      expect(result.items[0].userAgent).toBeNull();
    });

    it('должен фильтровать по action', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        { action: 'admin_price_changed' },
        { page: 1, pageSize: 20 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert
      expect(result.total).toBe(1);
      expect(result.items[0].action).toBe('admin_price_changed');
    });

    it('должен фильтровать по entityType', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        { entityType: 'service' },
        { page: 1, pageSize: 20 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert
      expect(result.total).toBe(1);
      expect(result.items[0].entityType).toBe('service');
    });

    it('должен поддерживать пагинацию', async () => {
      // Act - первая страница
      const page1 = await listAuditLogUseCase.execute(
        {},
        { page: 1, pageSize: 2 },
        ownerUser.userId.value,
        'owner',
      );

      // Act - вторая страница
      const page2 = await listAuditLogUseCase.execute(
        {},
        { page: 2, pageSize: 2 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert
      expect(page1.items).toHaveLength(2);
      expect(page2.items).toHaveLength(1);
      expect(page1.total).toBe(3);
      expect(page2.total).toBe(3);
      expect(page1.totalPages).toBe(2);
    });

    it('должен сортировать по created_at DESC (новые первыми)', async () => {
      // Act
      const result = await listAuditLogUseCase.execute(
        {},
        { page: 1, pageSize: 20 },
        ownerUser.userId.value,
        'owner',
      );

      // Assert - последняя созданная запись должна быть первой
      expect(result.items[0].action).toBe('admin_content_deleted');
      expect(result.items[1].action).toBe('admin_data_exported');
      expect(result.items[2].action).toBe('admin_price_changed');
    });
  });

  describe('Права доступа', () => {
    it('editor не должен иметь доступа к audit log', async () => {
      // Act & Assert
      await expect(
        listAuditLogUseCase.execute(
          {},
          { page: 1, pageSize: 20 },
          ownerUser.userId.value,
          'editor',
        ),
      ).rejects.toThrow('Access denied');
    });
  });
});
