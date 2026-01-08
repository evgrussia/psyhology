import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*smoke*.ts'],
    testTimeout: 10000, // 10 секунд для интеграционных тестов
  },
});
