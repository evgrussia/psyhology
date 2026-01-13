import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createApp } from './presentation/http/server';

describe('FEAT-CNT-01: Content CMS Integration Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let sessionId: string;

  beforeAll(async () => {
    // Гарантируем test DB по умолчанию для локального запуска
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/psychology_test';
    }

    app = await createApp();
    await app.ready();

    prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    });

    // Чистим данные тестового домена
    await prisma.contentMedia.deleteMany({});
    await prisma.contentRevision.deleteMany({});
    await prisma.contentItemTopic.deleteMany({});
    await prisma.contentItemTag.deleteMany({});
    await prisma.contentItem.deleteMany({});
    await prisma.tag.deleteMany({});

    // Чистим auth данные (для логина)
    await prisma.consent.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.$executeRawUnsafe('DELETE FROM sessions');
    await prisma.user.deleteMany({});

    // Гарантируем наличие темы (иначе FK при saveTopics)
    await prisma.topic.upsert({
      where: { code: 'anxiety' },
      update: { title: 'Тревога', isActive: true },
      create: { code: 'anxiety', title: 'Тревога', isActive: true },
    });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.contentMedia.deleteMany({});
    await prisma.contentRevision.deleteMany({});
    await prisma.contentItemTopic.deleteMany({});
    await prisma.contentItemTag.deleteMany({});
    await prisma.contentItem.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.$executeRawUnsafe('DELETE FROM sessions');
  });

  it('AC: create draft → publish → public GET by slug → public list → archive blocks public access', async () => {
    // 1) создаём owner юзера + логин (как в auth.integration.test.ts)
    const bcrypt = await import('bcrypt');
    const passwordHash = await bcrypt.hash('Test123456!', 10);

    const owner = await prisma.user.create({
      data: {
        email: 'content-owner@example.com',
        status: 'active',
      },
    });

    await prisma.userRole.create({
      data: { userId: owner.id, roleCode: 'owner', grantedAt: new Date() },
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

    await prisma.$executeRawUnsafe(`UPDATE users SET password_hash = $1 WHERE id = $2`, passwordHash, owner.id);

    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/admin/login',
      payload: { email: 'content-owner@example.com', password: 'Test123456!' },
    });
    expect(loginRes.statusCode).toBe(200);
    const sessionCookie = loginRes.cookies.find((c) => c.name === 'sessionId');
    expect(sessionCookie).toBeDefined();
    sessionId = sessionCookie!.value;

    const tag = await prisma.tag.create({
      data: { slug: `tag-${Date.now()}`, title: 'Тестовый тег' },
    });

    // 2) создаём draft
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/admin/content',
      headers: { cookie: `sessionId=${sessionId}` },
      payload: {
        contentType: 'article',
        title: `Тестовая статья ${Date.now()}`,
        bodyMarkdown: '# Заголовок\n\nТекст **жирный**\n\nДисклеймер: ...\n\nCTA: ...',
        metaTitle: 'Meta title',
        metaDescription: 'Meta description',
        canonicalUrl: null,
        topicCodes: ['anxiety'],
        tagIds: [tag.id],
      },
    });

    expect(createRes.statusCode).toBe(201);
    const created = JSON.parse(createRes.body);
    expect(created.success).toBe(true);
    expect(created.data.id).toBeDefined();
    expect(created.data.slug).toBeDefined();

    const contentId: string = created.data.id;
    const slug: string = created.data.slug;

    // 3) publish (QA checklist обязателен)
    const publishRes = await app.inject({
      method: 'POST',
      url: `/api/admin/content/${contentId}/publish`,
      headers: { cookie: `sessionId=${sessionId}` },
      payload: {
        qaChecklist: { hasDisclaimer: true, hasAltText: true, hasCta: true },
      },
    });
    expect(publishRes.statusCode).toBe(200);
    const published = JSON.parse(publishRes.body);
    expect(published.success).toBe(true);
    expect(published.data.status).toBe('published');

    // 4) public GET by slug
    const publicGetRes = await app.inject({
      method: 'GET',
      url: `/api/public/content/article/${slug}`,
    });
    expect(publicGetRes.statusCode).toBe(200);
    const publicGet = JSON.parse(publicGetRes.body);
    expect(publicGet.success).toBe(true);
    expect(publicGet.data.slug).toBe(slug);
    expect(publicGet.data.bodyHtml).toContain('<h1');

    // 5) public list по типу
    const publicListRes = await app.inject({
      method: 'GET',
      url: `/api/public/content/article?limit=10&offset=0`,
    });
    expect(publicListRes.statusCode).toBe(200);
    const publicList = JSON.parse(publicListRes.body);
    expect(publicList.success).toBe(true);
    expect(Array.isArray(publicList.data.items)).toBe(true);
    expect(publicList.data.items.some((i: any) => i.slug === slug)).toBe(true);

    // 6) archive
    const archiveRes = await app.inject({
      method: 'POST',
      url: `/api/admin/content/${contentId}/archive`,
      headers: { cookie: `sessionId=${sessionId}` },
    });
    expect(archiveRes.statusCode).toBe(200);
    const archived = JSON.parse(archiveRes.body);
    expect(archived.success).toBe(true);
    expect(archived.data.status).toBe('archived');

    // 7) public GET by slug должен стать 404 (контент больше не published)
    const publicAfterArchiveRes = await app.inject({
      method: 'GET',
      url: `/api/public/content/article/${slug}`,
    });
    expect(publicAfterArchiveRes.statusCode).toBe(404);
  });
});

