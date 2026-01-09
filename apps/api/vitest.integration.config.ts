import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Отдельный конфиг для integration тестов (требуют БД).
 * Запуск:
 * - cd apps/api
 * - npx vitest run -c vitest.integration.config.ts
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    // Запускаем только контент (FEAT-CNT-01), чтобы не требовать внешние интеграции (S3 и т.п.)
    include: ['src/content.integration.test.ts'],
    testTimeout: 30000,
    globals: true,
  },
});

