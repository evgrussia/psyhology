import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { createApp } from './presentation/http/app.js';

/**
 * Интеграционный smoke test для API.
 * Проверяет базовую работоспособность: healthcheck, версию, подключение к БД.
 */
describe('API smoke test', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    // Создаём приложение с тестовым commit SHA
    app = createApp({ commitSha: 'test-smoke-sha' });
  });

  afterAll(async () => {
    // Закрываем приложение после тестов
    await app.close();
  });

  it('healthcheck endpoint returns ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({ ok: true });
  });

  it('version endpoint returns commit SHA', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/version',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('commitSha');
    expect(body.commitSha).toBe('test-smoke-sha');
  });

  // Примечание: тест с реальной БД будет добавлен после настройки test БД в CI
  // Для этого нужно:
  // 1. Поднять test БД в docker-compose или CI
  // 2. Применить миграции
  // 3. Проверить подключение к БД
});
