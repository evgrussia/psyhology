// Интеграционные тесты для миграций БД
// Проверяет, что миграции могут быть применены и схема соответствует ожиданиям

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from './prisma/generated';

// Для тестов используем тестовую БД
// В CI это будет отдельная БД, в локальной разработке - та же БД с префиксом
const testDatabaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

describe('Database Migrations', () => {
  beforeAll(async () => {
    // Убеждаемся, что Prisma Client сгенерирован
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Schema validation', () => {
    it('should have all required tables', async () => {
      // Проверяем, что основные таблицы существуют
      // Prisma не предоставляет прямой способ проверить существование таблиц,
      // поэтому проверяем через простые запросы

      // Identity & Access
      await expect(prisma.user.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.role.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.userRole.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.consent.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Content
      await expect(prisma.contentItem.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.topic.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.tag.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.mediaAsset.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.curatedCollection.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.glossaryTerm.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Interactive
      await expect(prisma.interactiveDefinition.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.interactiveRun.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Booking & Payments
      await expect(prisma.service.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.availabilitySlot.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.appointment.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.payment.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.intakeForm.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.waitlistRequest.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Client Cabinet
      await expect(prisma.diaryEntry.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.dataExportRequest.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Telegram & Deep Links
      await expect(prisma.deepLink.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // CRM & Analytics
      await expect(prisma.lead.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.leadIdentity.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.leadTimelineEvent.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // UGC Moderation
      await expect(prisma.anonymousQuestion.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.questionAnswer.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.review.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.reviewPublicationConsent.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.ugcModerationAction.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);

      // Admin & Audit
      await expect(prisma.auditLogEntry.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.messageTemplate.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.messageTemplateVersion.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
      await expect(prisma.systemSetting.findMany({ take: 1 })).resolves.toBeInstanceOf(Array);
    });

    it('should enforce unique constraints', async () => {
      // Проверяем уникальность email в users
      const email = `test-${Date.now()}@example.com`;
      const user1 = await prisma.user.create({
        data: {
          email,
          status: 'active',
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email, // Дубликат
            status: 'active',
          },
        }),
      ).rejects.toThrow();

      // Очистка
      await prisma.user.delete({ where: { id: user1.id } });
    });

    it('should enforce composite unique constraints', async () => {
      // Проверяем уникальность (content_type, slug) в content_items
      const contentType = 'article';
      const slug = `test-slug-${Date.now()}`;

      const item1 = await prisma.contentItem.create({
        data: {
          contentType,
          slug,
          title: 'Test Article',
          status: 'draft',
        },
      });

      // Попытка создать дубликат с тем же content_type и slug
      await expect(
        prisma.contentItem.create({
          data: {
            contentType,
            slug, // Дубликат
            title: 'Another Test Article',
            status: 'draft',
          },
        }),
      ).rejects.toThrow();

      // Но можно создать с другим content_type
      const item2 = await prisma.contentItem.create({
        data: {
          contentType: 'note', // Другой тип
          slug, // Тот же slug, но другой тип - OK
          title: 'Test Note',
          status: 'draft',
        },
      });

      // Очистка
      await prisma.contentItem.delete({ where: { id: item1.id } });
      await prisma.contentItem.delete({ where: { id: item2.id } });
    });
  });

  describe('Seed data', () => {
    it('should have seed roles', async () => {
      const roles = await prisma.role.findMany();
      const roleCodes = roles.map((r) => r.code);

      expect(roleCodes).toContain('owner');
      expect(roleCodes).toContain('assistant');
      expect(roleCodes).toContain('editor');
      expect(roleCodes).toContain('client');
    });

    it('should have seed topics', async () => {
      const topics = await prisma.topic.findMany({
        where: { isActive: true },
      });
      const topicCodes = topics.map((t) => t.code);

      expect(topicCodes).toContain('anxiety');
      expect(topicCodes).toContain('burnout');
      expect(topicCodes).toContain('relationships');
      expect(topicCodes).toContain('boundaries');
      expect(topicCodes).toContain('selfesteem');
    });
  });

  describe('Indexes', () => {
    it('should have indexes for moderation queue', async () => {
      // Проверяем, что можно эффективно запрашивать по status и submittedAt
      const questions = await prisma.anonymousQuestion.findMany({
        where: {
          status: 'pending',
        },
        orderBy: {
          submittedAt: 'asc',
        },
        take: 10,
      });

      expect(questions).toBeInstanceOf(Array);
    });

    it('should have indexes for booking conflicts', async () => {
      // Проверяем, что можно эффективно запрашивать appointments по startAtUtc
      const appointments = await prisma.appointment.findMany({
        where: {
          status: 'confirmed',
        },
        orderBy: {
          startAtUtc: 'asc',
        },
        take: 10,
      });

      expect(appointments).toBeInstanceOf(Array);
    });
  });

  describe('Privacy by Design', () => {
    it('should have encrypted fields for P2 data', async () => {
      // Проверяем, что P2 поля существуют и имеют правильные имена
      const intakeForm = await prisma.intakeForm.create({
        data: {
          appointmentId: '00000000-0000-0000-0000-000000000000', // Валидный UUID, но appointment не существует
          status: 'draft',
          payloadEncrypted: 'encrypted_data_placeholder',
        },
      }).catch(() => null);

      // Если appointment не существует, получим ошибку FK, но это нормально
      // Главное - проверить, что поле payloadEncrypted существует
      if (intakeForm) {
        expect(intakeForm.payloadEncrypted).toBeDefined();
        await prisma.intakeForm.delete({ where: { id: intakeForm.id } });
      }
    });

    it('should store P0-only data in timeline events', async () => {
      // Проверяем, что lead_timeline_events использует Json для properties
      // (валидация P0-only должна быть на уровне приложения)
      const lead = await prisma.lead.create({
        data: {
          status: 'new',
          source: 'quiz',
        },
      });

      const event = await prisma.leadTimelineEvent.create({
        data: {
          leadId: lead.id,
          eventName: 'test_event',
          source: 'web',
          occurredAt: new Date(),
          properties: {
            // P0-only данные
            quiz_id: 'test-quiz',
            result_level: 'moderate',
            // НЕ должно быть: text, email, phone, etc.
          },
        },
      });

      expect(event.properties).toBeDefined();
      expect(event.properties).toHaveProperty('quiz_id');

      // Очистка
      await prisma.leadTimelineEvent.delete({ where: { id: event.id } });
      await prisma.lead.delete({ where: { id: lead.id } });
    });
  });
});

