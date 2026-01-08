import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    // Исключаем интеграционные тесты из обычного запуска
    // Они требуют БД и должны запускаться отдельно
    include: ['src/**/*.test.ts', 'src/**/*smoke*.ts'],
    exclude: ['src/**/*.integration.test.ts'],
    testTimeout: 10000,
    globals: true,
  },
});
