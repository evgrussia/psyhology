# Отчет о проверке реализации FEAT-CNT-01

**Дата проверки:** 2026-01-08  
**Проверяемая техспека:** `docs/generated/tech-specs/FEAT-CNT-01.md`  
**Статус:** ⚠️ Частично реализовано (основной функционал готов, есть недостающие компоненты)

---

## ✅ Реализованные компоненты

### 1. Модель данных (БД)

✅ **Полностью реализовано**

- `ContentItem` - основная модель контента
  - Все поля из техспекы присутствуют: `contentType`, `slug`, `title`, `excerpt`, `bodyMarkdown`, `status`, `publishedAt`, `authorUserId`, `timeToBenefit`, `format`, `supportLevel`, `metaTitle`, `metaDescription`, `canonicalUrl`
  - Уникальность slug по паре `(contentType, slug)` через `@@unique([contentType, slug])`
  
- `ContentRevision` - версионирование
  - Поля: `bodyMarkdown`, `meta` (JSON), `changedByUserId`, `createdAt`
  - Индексы для быстрого поиска по `contentItemId` и `createdAt`

- `Topic`, `Tag`, `ContentItemTopic`, `ContentItemTag` - темы и теги
- `MediaAsset`, `ContentMedia` - интеграция с медиа

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 187-307)

### 2. Контент-типы

✅ **Реализовано** (с небольшим отклонением)

- `article` ✅
- `resource` ✅
- `landing` ✅
- `page` ✅
- `note` ⚠️ (дополнительный тип, не упомянут в техспеке, но не мешает)

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 133-139)
- `apps/api/src/domain/content/value-objects/ContentType.ts`

### 3. Статусы контента

✅ **Полностью реализовано**

- `draft` ✅
- `review` ✅
- `published` ✅
- `archived` ✅

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 141-146)
- `apps/api/src/domain/content/value-objects/ContentStatus.ts`

### 4. SEO поля

✅ **Полностью реализовано**

- `metaTitle` ✅
- `metaDescription` ✅
- `canonicalUrl` ✅ (опционально)

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 200-202)
- `apps/api/src/domain/content/aggregates/ContentItem.ts` (строки 36-38)

### 5. Метаданные

✅ **Полностью реализовано**

- `timeToBenefit` ✅ (enum: `one_to_three_min`, `seven_to_ten_min`, `twenty_to_thirty_min`, `series`)
- `format` ✅ (enum: `article`, `note`, `resource`, `audio`, `checklist`)
- `supportLevel` ✅ (enum: `self_help`, `micro_support`, `consultation`)
- Темы (`topics`) ✅
- Теги (`tags`) ✅

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 148-167, 233-277)
- `apps/api/src/domain/content/value-objects/TimeToBenefit.ts`
- `apps/api/src/domain/content/value-objects/ContentFormat.ts`
- `apps/api/src/domain/content/value-objects/SupportLevel.ts`

### 6. QA чеклист публикации

✅ **Полностью реализовано**

- Обязательные проверки: `hasDisclaimer`, `hasAltText`, `hasCta`
- Валидация в доменной модели перед публикацией
- Блокировка публикации без обязательных пунктов

**Файлы:**
- `apps/api/src/domain/content/aggregates/ContentItem.ts` (строки 240-283)
- `apps/api/src/domain/content/value-objects/QaChecklist.ts`
- `apps/api/src/application/content/use-cases/PublishContentItemUseCase.ts`

### 7. Версионирование

✅ **Реализовано**

- Таблица `ContentRevision` с историей изменений
- Методы для получения списка ревизий и отката
- Сохранение ревизий при обновлении контента

**Файлы:**
- `apps/api/prisma/schema.prisma` (строки 219-231)
- `apps/api/src/application/content/use-cases/ListContentRevisionsUseCase.ts`
- `apps/api/src/application/content/use-cases/RollbackContentItemUseCase.ts`

### 8. API Endpoints (Admin)

✅ **Почти полностью реализовано**

| Endpoint | Method | Статус | Файл |
|----------|--------|--------|------|
| `/api/admin/content` | GET | ✅ | `contentRoutes.fastify.ts:26-34` |
| `/api/admin/content` | POST | ✅ | `contentRoutes.fastify.ts:41-49` |
| `/api/admin/content/:id` | GET | ✅ | `contentRoutes.fastify.ts:56-64` |
| `/api/admin/content/:id` | PUT | ✅ | `contentRoutes.fastify.ts:71-79` |
| `/api/admin/content/:id/publish` | POST | ✅ | `contentRoutes.fastify.ts:86-94` |
| `/api/admin/content/:id/archive` | POST | ❌ **ОТСУТСТВУЕТ** | - |
| `/api/admin/content/:id/revisions` | GET | ✅ | `contentRoutes.fastify.ts:101-109` |
| `/api/admin/content/:id/rollback/:revisionId` | POST | ✅ | `contentRoutes.fastify.ts:116-124` |

**Примечание:** Метод `archive()` есть в доменной модели (`ContentItem.ts:312-321`), но нет API endpoint и use case.

### 9. API Endpoints (Public)

⚠️ **Частично реализовано**

| Endpoint | Method | Статус | Файл |
|----------|--------|--------|------|
| `/api/public/content/:type/:slug` | GET | ✅ | `contentRoutes.fastify.ts:134-136` |
| `/api/public/content/:type` | GET | ❌ **ОТСУТСТВУЕТ** | - |

**Примечание:** Согласно техспеке (строка 140), должен быть endpoint для получения списка контента по типу с фильтрами.

### 10. Валидация уникальности slug

✅ **Полностью реализовано**

- Проверка уникальности при создании контента
- Проверка уникальности при обновлении slug (исключая текущий айтем)
- Ошибка с понятным сообщением при дубликате

**Файлы:**
- `apps/api/src/application/content/use-cases/CreateContentItemUseCase.ts` (строки 44-50)
- `apps/api/src/application/content/use-cases/UpdateContentItemUseCase.ts` (строки 59-69)
- `apps/api/src/infrastructure/content/repositories/PrismaContentItemRepository.ts` (строки 81-105)

### 11. Markdown Renderer

✅ **Реализовано**

- Рендеринг markdown в HTML
- Использование в публичном API для отображения контента

**Файлы:**
- `apps/api/src/infrastructure/content/services/MarkdownRenderer.ts`
- `apps/api/src/application/content/use-cases/GetContentItemBySlugUseCase.ts` (строки 34-36)

### 12. Доменные события

✅ **Реализовано**

- `ContentCreatedEvent` ✅
- `ContentUpdatedEvent` ✅
- `ContentPublishedEvent` ✅
- `ContentArchivedEvent` ✅

**Файлы:**
- `apps/api/src/domain/content/events/ContentEvents.ts`

---

## ❌ Недостающие компоненты

### 1. API Endpoint для архивирования

**Проблема:** Метод `archive()` есть в доменной модели, но нет:
- Use case `ArchiveContentItemUseCase`
- API endpoint `POST /api/admin/content/:id/archive`
- Controller метод `archiveContent()`

**Требуется по техспеке:** Строка 150 - `POST /api/admin/content/:id/archive`

**Решение:**
1. Создать `ArchiveContentItemUseCase`
2. Добавить метод в `ContentController`
3. Добавить route в `contentRoutes.fastify.ts`

### 2. Публичный API для списка контента

**Проблема:** Отсутствует endpoint `GET /api/public/content/:type` для получения списка опубликованного контента с фильтрами.

**Требуется по техспеке:** Строка 140 - `GET /api/public/content/{type}` с фильтрами

**Решение:**
1. Создать `ListPublicContentItemsUseCase` (фильтрует только `published`)
2. Добавить метод в `ContentController`
3. Добавить route в `contentRoutes.fastify.ts`

### 3. Tracking событие `admin_content_published`

**Проблема:** Событие `ContentPublishedEvent` публикуется, но не обрабатывается в `AnalyticsEventSubscriber`.

**Требуется по техспеке:** Строка 164 - событие `admin_content_published` с props `content_type`, `content_slug` (без текста)

**Текущее состояние:**
- `AnalyticsEventSubscriber` обрабатывает только события интерактивов
- Нет подписки на `ContentPublishedEvent`

**Решение:**
1. Добавить подписку на `ContentPublishedEvent` в `AnalyticsEventSubscriber`
2. Реализовать метод `handleContentPublished()` для отправки события `admin_content_published`

**Файлы для изменения:**
- `apps/api/src/infrastructure/analytics/AnalyticsEventSubscriber.ts`

### 4. Тесты

**Проблема:** Полностью отсутствуют тесты для контента.

**Требуется по техспеке:** Раздел 12 - Unit tests, Integration tests, E2E tests

**Необходимо создать:**
1. Unit тесты:
   - `Slug.test.ts` (slugify)
   - `MarkdownRenderer.test.ts`
   - `QaChecklist.test.ts` (validator)
   
2. Integration тесты:
   - `content.integration.test.ts` - полный цикл: create draft → publish → public GET by slug
   - Проверка QA checklist validation
   - Проверка уникальности slug
   - Проверка версионирования

3. E2E тесты (критические happy paths):
   - admin: создать статью → опубликовать → открыть публичную `/blog/{slug}`

**Пример структуры:**
```
apps/api/src/
├── content.integration.test.ts
├── application/content/use-cases/
│   ├── CreateContentItemUseCase.test.ts
│   ├── PublishContentItemUseCase.test.ts
│   └── ...
└── domain/content/value-objects/
    ├── Slug.test.ts
    └── QaChecklist.test.ts
```

### 5. Админ UI (Markdown Editor + Live Preview)

**Проблема:** Админ-панель содержит только каркас, нет UI для управления контентом.

**Требуется по техспеке:** Раздел 4.1 - `/admin/content/` (список), `/admin/content/{type}/{id}` (редактор)

**Текущее состояние:**
- `apps/admin/src/app/page.tsx` - только заглушка
- Нет компонентов для:
  - Списка контента
  - Markdown редактора с live preview
  - Формы создания/редактирования контента
  - QA чеклиста перед публикацией

**Решение:**
1. Создать страницы:
   - `/admin/content/` - список контента
   - `/admin/content/[type]/[id]` - редактор
   
2. Интегрировать markdown редактор (например, CodeMirror или Monaco Editor)
3. Реализовать live preview (используя тот же `MarkdownRenderer` что и на бэкенде)
4. Добавить форму QA чеклиста перед публикацией

---

## ⚠️ Частично реализованные компоненты

### 1. Markdown Editor в админке

**Статус:** Не реализован (только бэкенд renderer)

**Требуется:** Markdown редактор с live preview в админ-панели (техспека, строка 46)

**Текущее состояние:** Только бэкенд `MarkdownRenderer`, нет UI компонента

---

## 📊 Сводная таблица соответствия техспеке

| Требование | Статус | Комментарий |
|------------|--------|-------------|
| G1: Контент-типы (article, resource, landing, page) | ✅ | Реализовано + дополнительный тип `note` |
| G2: Редактор markdown + live preview | ⚠️ | Бэкенд renderer есть, UI нет |
| G3: Статусы (draft → review → published → archived) | ✅ | Все статусы реализованы |
| G4: SEO поля (meta title/description + canonical) | ✅ | Все поля реализованы |
| G5: Метаданные (темы/теги, формат, time_to_benefit, support_level) | ✅ | Все метаданные реализованы |
| G6: Интеграция с медиа | ✅ | Связь через `ContentMedia` |
| G7: QA чеклист публикации | ✅ | Валидация реализована |
| AC-1: CRUD контента + публичная выдача | ⚠️ | CRUD есть, публичная выдача частично (нет списка) |
| AC-2: Markdown preview совпадает с публичным рендером | ✅ | Один и тот же `MarkdownRenderer` |
| AC-3: Публикация требует QA чеклист | ✅ | Валидация реализована |
| AC-4: Медиа вставляется через picker | ⚠️ | Бэкенд готов, UI нет |
| NS-1: Дубль slug → ошибка | ✅ | Валидация реализована |
| NS-2: Ошибка рендера markdown → fallback | ⚠️ | Нет обработки ошибок рендеринга |

---

## 🎯 Рекомендации по доработке

### Приоритет P0 (критично для релиза)

1. **Добавить API endpoint для архивирования**
   - `POST /api/admin/content/:id/archive`
   - Use case + controller метод

2. **Добавить публичный API для списка контента**
   - `GET /api/public/content/:type` с фильтрами (только published)

3. **Добавить обработку ContentPublishedEvent для аналитики**
   - Подписка в `AnalyticsEventSubscriber`
   - Событие `admin_content_published`

### Приоритет P1 (важно, но не блокирует)

4. **Создать тесты**
   - Unit тесты для value objects
   - Integration тесты для use cases
   - E2E тесты для критических сценариев

5. **Реализовать админ UI**
   - Список контента
   - Markdown редактор с live preview
   - Форма создания/редактирования
   - QA чеклист перед публикацией

### Приоритет P2 (можно отложить)

6. **Улучшить обработку ошибок markdown рендеринга**
   - Fallback при битом синтаксисе
   - Логирование ошибок

---

## ✅ Выводы

**Общая оценка:** ⚠️ **75% реализовано**

**Сильные стороны:**
- Полная модель данных соответствует техспеке
- Все доменные сущности и value objects реализованы
- QA чеклист работает корректно
- Версионирование реализовано
- Валидация уникальности slug работает

**Слабые стороны:**
- Отсутствуют тесты
- Нет админ UI
- Не хватает 2 API endpoints (archive, public list)
- Нет tracking события для публикации контента

**Рекомендация:** Основной функционал реализован и готов к использованию через API. Для полного соответствия техспеке необходимо доработать недостающие компоненты (особенно тесты и админ UI).
