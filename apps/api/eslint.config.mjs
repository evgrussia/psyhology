import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/infrastructure/persistence/prisma/generated/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      // Разрешаем any для интеграционных тестов и мапперов
      '@typescript-eslint/no-explicit-any': 'off',
      // Разрешаем неиспользуемые переменные с префиксом _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          // Разрешаем неиспользуемые импорты - будут использоваться позже
          vars: 'local',
        },
      ],
      // Разрешаем namespace для Fastify type augmentation
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);
