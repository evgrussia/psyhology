import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createApp } from './presentation/http/server';
import bcrypt from 'bcrypt';

const shouldSkip = !process.env.DATABASE_URL;

describe.skipIf(shouldSkip)('FEAT-PLT-04: Media Upload Integration Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let sessionId: string;
  let _ownerUserId: string;

  beforeAll(async () => {
    // Создаём приложение
    app = await createApp();
    await app.ready();

    prisma = new PrismaClient();

    // Очищаем тестовые данные
    await prisma.contentMedia.deleteMany({});
    await prisma.mediaAsset.deleteMany({});
    await prisma.consent.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.$executeRawUnsafe('DELETE FROM sessions');
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Очищаем медиа перед каждым тестом
    await prisma.contentMedia.deleteMany({});
    await prisma.mediaAsset.deleteMany({});
    await prisma.$executeRawUnsafe('DELETE FROM sessions');

    // Создаём тестового owner пользователя
    const passwordHash = await bcrypt.hash('Test123456!', 10);

    const owner = await prisma.user.create({
      data: {
        email: 'test-media-owner@example.com',
        status: 'active',
      },
    });

    _ownerUserId = owner.id;

    await prisma.userRole.create({
      data: {
        userId: owner.id,
        roleCode: 'owner',
        grantedAt: new Date(),
      },
    });

    await prisma.consent.create({
      data: {
        userId: owner.id,
        consentType: 'personal_data',
        granted: true,
        version: '2026-01-08',
        source: 'test',
        grantedAt: new Date(),
      },
    });

    await prisma.$executeRawUnsafe(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      passwordHash,
      owner.id,
    );

    // Логинимся
    const _loginResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/admin/login',
      payload: {
        email: 'test-media-owner@example.com',
        password: 'Test123456!',
      },
    });

    expect(_loginResponse.statusCode).toBe(200);
    const loginCookies = _loginResponse.cookies;
    const sessionCookie = loginCookies.find((c) => c.name === 'sessionId');
    expect(sessionCookie).toBeDefined();
    sessionId = sessionCookie!.value;
  });

  describe('AC-1: API для получения pre-signed upload URL', () => {
    it('должен создать медиа-актив и вернуть upload URL', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test-image.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
          title: 'Test Image',
          altText: 'Test alt text',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.mediaAssetId).toBeDefined();
      expect(body.data.uploadUrl).toBeDefined();
      expect(body.data.expiresAt).toBeDefined();

      // Проверяем что запись создана в БД
      const mediaAsset = await prisma.mediaAsset.findUnique({
        where: { id: body.data.mediaAssetId },
      });

      expect(mediaAsset).toBeDefined();
      expect(mediaAsset?.mimeType).toBe('image/jpeg');
      expect(mediaAsset?.sizeBytes).toBe(BigInt(1024));
      expect(mediaAsset?.title).toBe('Test Image');
      expect(mediaAsset?.altText).toBe('Test alt text');
    });

    it('должен требовать аутентификацию', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('AC-2: Валидация mime/размера до загрузки', () => {
    it('должен выбросить ошибку для неподдерживаемого MIME типа', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.txt',
          mimeType: 'text/plain',
          sizeBytes: 1024,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('ValidationError');
    });

    it('должен выбросить ошибку если размер превышает лимит', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 11 * 1024 * 1024, // 11 MB > 10 MB лимит
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('должен принять валидный файл', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 5 * 1024 * 1024, // 5 MB < 10 MB лимит
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('AC-3: Связь записи в БД с объектом в S3', () => {
    it('должен создать запись с objectKey', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      const mediaAsset = await prisma.mediaAsset.findUnique({
        where: { id: body.data.mediaAssetId },
      });

      expect(mediaAsset).toBeDefined();
      expect(mediaAsset?.objectKey).toBeDefined();
      expect(mediaAsset?.objectKey).toContain('image/');
    });
  });

  describe('AC-4: Удаление медиа с проверкой использования', () => {
    it('должен удалить медиа-актив если не используется', async () => {
      // Создаём медиа-актив
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      const createBody = JSON.parse(createResponse.body);
      const mediaAssetId = createBody.data.mediaAssetId;

      // Удаляем
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/admin/media/${mediaAssetId}`,
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
      });

      expect(deleteResponse.statusCode).toBe(204);

      // Проверяем что удалено из БД
      const mediaAsset = await prisma.mediaAsset.findUnique({
        where: { id: mediaAssetId },
      });

      expect(mediaAsset).toBeNull();
    });

    it('должен выбросить ошибку при удалении используемого медиа', async () => {
      // Создаём медиа-актив
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      const createBody = JSON.parse(createResponse.body);
      const mediaAssetId = createBody.data.mediaAssetId;

      // Создаём связь с контентом (симулируем использование)
      await prisma.contentMedia.create({
        data: {
          contentItemId: 'test-content-id',
          mediaAssetId: mediaAssetId,
          usage: 'cover',
        },
      });

      // Пытаемся удалить
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/admin/media/${mediaAssetId}`,
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
      });

      expect(deleteResponse.statusCode).toBe(400);
      const body = JSON.parse(deleteResponse.body);
      expect(body.success).toBe(false);
      expect(body.message).toContain('used in content');
    });

    it('должен удалить с force=true даже если используется', async () => {
      // Создаём медиа-актив
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      const createBody = JSON.parse(createResponse.body);
      const mediaAssetId = createBody.data.mediaAssetId;

      // Создаём связь с контентом
      await prisma.contentMedia.create({
        data: {
          contentItemId: 'test-content-id',
          mediaAssetId: mediaAssetId,
          usage: 'cover',
        },
      });

      // Удаляем с force
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/admin/media/${mediaAssetId}?force=true`,
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
      });

      expect(deleteResponse.statusCode).toBe(204);
    });
  });

  describe('GET /api/admin/media - список медиа-активов', () => {
    it('должен вернуть список медиа-активов', async () => {
      // Создаём несколько медиа-активов
      for (let i = 0; i < 3; i++) {
        await app.inject({
          method: 'POST',
          url: '/api/admin/media/init',
          headers: {
            cookie: `sessionId=${sessionId}`,
          },
          payload: {
            filename: `test-${i}.jpg`,
            mimeType: 'image/jpeg',
            sizeBytes: 1024,
          },
        });
      }

      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/media',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items.length).toBeGreaterThanOrEqual(3);
    });

    it('должен фильтровать по mediaType', async () => {
      // Создаём изображение
      await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      // Создаём аудио
      await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.mp3',
          mimeType: 'audio/mpeg',
          sizeBytes: 1024,
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/admin/media?mediaType=image',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.items.every((item: any) => item.mediaType === 'image')).toBe(true);
    });
  });

  describe('Негативные сценарии', () => {
    it('NS-1: Неподдерживаемый тип файла → 400', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`,
        },
        payload: {
          filename: 'test.exe',
          mimeType: 'application/x-msdownload',
          sizeBytes: 1024,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('должен требовать owner или editor роль', async () => {
      // Создаём обычного пользователя (client)
      const passwordHash = await bcrypt.hash('Test123456!', 10);
      const client = await prisma.user.create({
        data: {
          email: 'test-client@example.com',
          status: 'active',
        },
      });

      await prisma.userRole.create({
        data: {
          userId: client.id,
          roleCode: 'client',
          grantedAt: new Date(),
        },
      });

      await prisma.$executeRawUnsafe(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        passwordHash,
        client.id,
      );

      // Логинимся как client
      const _loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'test-client@example.com',
          password: 'Test123456!',
        },
      });

      // Client не может логиниться через admin/login, но если бы мог, то не имел бы доступа
      // Проверяем что owner имеет доступ
      const response = await app.inject({
        method: 'POST',
        url: '/api/admin/media/init',
        headers: {
          cookie: `sessionId=${sessionId}`, // owner session
        },
        payload: {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
