# Миграции базы данных

Миграции управляются через Prisma Migrate.

## Быстрый старт (локальная разработка)

1. Поднять PostgreSQL через docker-compose:
```bash
cd ../../..  # в корень проекта
docker-compose up -d postgres
```

2. Настроить DATABASE_URL в `.env`:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/emotional_balance?schema=public"
```

3. Создать первую миграцию (если её ещё нет):
```bash
cd apps/api
# Linux/Mac:
./scripts/create-initial-migration.sh
# Windows (PowerShell):
.\scripts\create-initial-migration.ps1
# Или вручную:
npm run migrate:dev -- --name init
```

4. Применить миграции и seed-данные:
```bash
npm run migrate:up
npm run seed
```

5. Сгенерировать Prisma Client:
```bash
npm run prisma:generate
```

## Команды

```bash
# Создать новую миграцию
npm run migrate:create -- <migration_name>

# Применить миграции (для prod/stage)
npm run migrate:up

# Применить миграции с созданием БД (для dev)
npm run migrate:dev

# Откатить последнюю миграцию (только для dev)
npm run migrate:down

# Сбросить БД и применить все миграции (только для dev/test)
npm run migrate:reset

# Применить seed-данные (роли и темы)
npm run seed

# Сгенерировать Prisma Client
npm run prisma:generate

# Проверить статус миграций
npm run migrate:status
```

## Seed-данные

Seed-файл (`prisma/seed.ts`) создаёт базовые данные для разработки:
- **Роли**: `owner`, `assistant`, `editor`, `client`
- **Темы**: `anxiety`, `burnout`, `relationships`, `boundaries`, `selfesteem`

Seed-данные идемпотентны (используют `upsert`), их можно запускать многократно.

## Правила

- Миграции должны быть идемпотентными
- Запрещены destructive миграции без процедуры в prod
- Все миграции должны проходить на пустой БД
- Rollback поддерживается только для dev окружения
- В prod миграции применяются только вперёд (forward-only)

## Структура схемы

Схема БД (`prisma/schema.prisma`) включает все домены Release 1:
- **Identity & Access**: users, roles, user_roles, consents
- **Content**: content_items, topics, tags, media_assets, curated_collections, glossary_terms
- **Interactive**: interactive_definitions, interactive_runs
- **Booking & Payments**: services, availability_slots, appointments, payments, intake_forms, waitlist_requests
- **Client Cabinet**: diary_entries, data_export_requests
- **Telegram**: deep_links
- **CRM**: leads, lead_identities, lead_timeline_events
- **UGC Moderation**: anonymous_questions, reviews, ugc_moderation_actions
- **Admin & Audit**: audit_log_entries, message_templates, system_settings

## Privacy by Design

- P2 поля (чувствительные данные) помечены суффиксом `_encrypted`
- P1 поля (PII) хранятся в зашифрованном виде или с ограниченным доступом
- В аналитике/CRM timeline хранятся только P0 данные (без PII/текстов)

## Тестирование

Интеграционные тесты для миграций находятся в:
`src/infrastructure/persistence/migrations.test.ts`

Запуск тестов:
```bash
npm test
```