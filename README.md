# Эмоциональный баланс

Стартовый каркас проекта (монорепо) по `FEAT-PLT-01`.

## Требования

- Node.js **18.18+** (рекомендуется LTS)
- Docker Desktop (для локального Postgres)

## Структура

- `apps/web` — публичный сайт (Next.js)
- `apps/admin` — админ-панель (Next.js)
- `apps/api` — backend API (Fastify, Clean Architecture/DDD)
- `apps/bot` — Telegram бот (Telegraf)
- `tools/asset-pipeline` — утилиты для ассетов

## Быстрый старт (dev)

1. Установить зависимости:

```bash
npm install
```

2. Поднять инфраструктуру (Postgres + локальный S3/MinIO):

```bash
npm run dev:infra
```

3. Подготовить переменные окружения:

- Скопируйте `env.example` → `.env` (опционально)
- Скопируйте `apps/api/env.example` → `apps/api/.env` (при необходимости)
- Скопируйте `apps/bot/env.example` → `apps/bot/.env` (бот можно не запускать без токена)

4. Запуск сервисов:

```bash
npm run dev
```

## Проверки (как в CI)

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Окружения (dev/stage/prod)

- **Секреты не хранятся в репозитории**. Используйте secret store CI/CD (GitHub Actions Secrets) или менеджер секретов выбранного облака.
- В `stage/prod` обязательно задавайте:
  - `COMMIT_SHA`
  - `DATABASE_URL`
  - (для бота) `BOT_TOKEN`
