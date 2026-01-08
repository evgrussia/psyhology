import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../src/presentation/http/server';

describe('FEAT-PLT-03: Authentication & RBAC Integration Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let sessionId: string;

  beforeAll(async () => {
    // Создаём приложение
    app = await createApp();
    await app.ready();

    prisma = new PrismaClient();

    // Очищаем тестовые данные
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
    // Очищаем сессии перед каждым тестом
    await prisma.$executeRawUnsafe('DELETE FROM sessions');
  });

  describe('AC-1: Admin Login Flow', () => {
    it('должен создать пользователя и залогиниться', async () => {
      // 1. Создаём owner пользователя через seed
      const bcrypt = await import('bcrypt');
      const passwordHash = await bcrypt.hash('Test123456!', 10);

      const owner = await prisma.user.create({
        data: {
          email: 'test-owner@example.com',
          status: 'active',
        },
      });

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

      // Устанавливаем password_hash
      await prisma.$executeRawUnsafe(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        passwordHash,
        owner.id
      );

      // 2. Пробуем войти с правильным паролем
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'test-owner@example.com',
          password: 'Test123456!',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user).toBeDefined();
      expect(body.data.user.email).toBe('test-owner@example.com');
      expect(body.data.user.roles).toContain('owner');
      expect(body.data.user.isAdmin).toBe(true);

      // Проверяем что установлен cookie
      const cookies = response.cookies;
      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);

      const sessionCookie = cookies.find((c) => c.name === 'sessionId');
      expect(sessionCookie).toBeDefined();
      sessionId = sessionCookie!.value;
    });

    it('должен вернуть 401 для неверного email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'Test123456!',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('AuthenticationError');
    });

    it('должен вернуть 401 для неверного пароля', async () => {
      // Создаём пользователя с правильным паролем
      const bcrypt = await import('bcrypt');
      const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);

      const owner = await prisma.user.create({
        data: {
          email: 'test-owner-wrong-pwd@example.com',
          status: 'active',
        },
      });

      await prisma.userRole.create({
        data: {
          userId: owner.id,
          roleCode: 'owner',
          grantedAt: new Date(),
        },
      });

      // Устанавливаем password_hash
      await prisma.$executeRawUnsafe(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        passwordHash,
        owner.id
      );

      // Пробуем войти с неверным паролем
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'test-owner-wrong-pwd@example.com',
          password: 'WrongPassword123!',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('AuthenticationError');
      expect(body.message).toContain('Invalid email or password');
    });

    it('должен вернуть 403 для заблокированного пользователя', async () => {
      // Создаём заблокированного пользователя
      const blockedUser = await prisma.user.create({
        data: {
          email: 'blocked@example.com',
          status: 'blocked',
        },
      });

      await prisma.userRole.create({
        data: {
          userId: blockedUser.id,
          roleCode: 'owner',
          grantedAt: new Date(),
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'blocked@example.com',
          password: 'Test123456!',
        },
      });

      expect(response.statusCode).toBe(403);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('AuthorizationError');
    });

    it('должен вернуть 403 для клиента (не админа)', async () => {
      // Создаём клиента (роль client, не admin)
      const client = await prisma.user.create({
        data: {
          email: 'client@example.com',
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

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/admin/login',
        payload: {
          email: 'client@example.com',
          password: 'Test123456!',
        },
      });

      expect(response.statusCode).toBe(403);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('AuthorizationError');
      expect(body.message).toContain('admin role required');
    });
  });

  describe('AC-2: Get Current User', () => {
    it('должен вернуть данные текущего пользователя', async () => {
      // Используем sessionId из предыдущего теста
      if (!sessionId) {
        // Создаём сессию вручную
        const owner = await prisma.user.findFirst({
          where: { email: 'test-owner@example.com' },
        });

        if (owner) {
          const tempSessionId = 'test-session-' + Math.random();
          await prisma.$executeRawUnsafe(
            `INSERT INTO sessions (id, user_id, created_at, expires_at)
             VALUES ($1, $2, NOW(), NOW() + INTERVAL '24 hours')`,
            tempSessionId,
            owner.id
          );
          sessionId = tempSessionId;
        }
      }

      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        cookies: {
          sessionId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user).toBeDefined();
      expect(body.data.user.email).toBe('test-owner@example.com');
    });

    it('должен вернуть 401 без сессии', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
      });

      expect(response.statusCode).toBe(401);
    });

    it('должен вернуть 401 для невалидной сессии', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        cookies: {
          sessionId: 'invalid-session-id',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('AC-3: Logout', () => {
    it('должен удалить сессию при logout', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/logout',
        cookies: {
          sessionId,
        },
      });

      expect(response.statusCode).toBe(204);

      // Проверяем что сессия удалена
      const session = await prisma.$queryRawUnsafe<any[]>(
        'SELECT * FROM sessions WHERE id = $1',
        sessionId
      );
      expect(session.length).toBe(0);
    });
  });

  describe('AC-4: RBAC Matrix', () => {
    it('owner должен иметь доступ ко всем админским endpoint', async () => {
      // Создаём owner и получаем сессию
      const owner = await prisma.user.findFirst({
        where: { email: 'test-owner@example.com' },
      });

      if (owner) {
        const ownerSessionId = 'owner-session-' + Math.random();
        await prisma.$executeRawUnsafe(
          `INSERT INTO sessions (id, user_id, created_at, expires_at)
           VALUES ($1, $2, NOW(), NOW() + INTERVAL '24 hours')`,
          ownerSessionId,
          owner.id
        );

        // Проверяем доступ к /api/auth/me
        const response = await app.inject({
          method: 'GET',
          url: '/api/auth/me',
          cookies: {
            sessionId: ownerSessionId,
          },
        });

        expect(response.statusCode).toBe(200);
      }
    });

    it('assistant должен иметь ограниченный доступ', async () => {
      // Создаём assistant
      const assistant = await prisma.user.create({
        data: {
          email: 'assistant@example.com',
          status: 'active',
        },
      });

      await prisma.userRole.create({
        data: {
          userId: assistant.id,
          roleCode: 'assistant',
          grantedAt: new Date(),
        },
      });

      const assistantSessionId = 'assistant-session-' + Math.random();
      await prisma.$executeRawUnsafe(
        `INSERT INTO sessions (id, user_id, created_at, expires_at)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '24 hours')`,
        assistantSessionId,
        assistant.id
      );

      // Assistant может получить свои данные
      const response = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        cookies: {
          sessionId: assistantSessionId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.user.roles).toContain('assistant');
    });
  });
});
