# Interactive Platform — Application Layer

## Обзор

Этот модуль реализует базовую платформу интерактивов без логина (FEAT-INT-01).

## Use Cases

### StartInteractiveRunUseCase

Запуск интерактива (квиз, навигатор, термометр, скрипты, ритуалы).

**Endpoint:** `POST /api/public/interactive/runs`

**Request:**
```typescript
{
  interactiveSlug: string;
  anonymousId?: string | null;
  userId?: string | null;
  topic?: string | null;
  entryPoint?: string | null;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    runId: string;
  }
}
```

**Пример:**
```bash
curl -X POST http://localhost:3000/api/public/interactive/runs \
  -H "Content-Type: application/json" \
  -H "X-Anonymous-Id: anon-123" \
  -d '{
    "interactiveSlug": "anxiety_gad7",
    "topic": "anxiety",
    "entryPoint": "homepage"
  }'
```

### CompleteInteractiveRunUseCase

Завершение интерактива с результатом.

**Endpoint:** `POST /api/public/interactive/runs/:runId/complete`

**Request:**
```typescript
{
  resultLevel?: 'low' | 'moderate' | 'high' | null;
  resultProfile?: string | null; // для навигатора: 'stabilize_now', 'restore_energy', etc.
  durationMs?: number | null;
  crisisTriggered?: boolean;
  crisisTriggerType?: string | null; // 'self_harm', 'suicidal_ideation', 'violence', 'minor_risk', 'panic_like'
}
```

**Response:** `204 No Content`

**Пример:**
```bash
curl -X POST http://localhost:3000/api/public/interactive/runs/{runId}/complete \
  -H "Content-Type: application/json" \
  -d '{
    "resultLevel": "moderate",
    "durationMs": 5000
  }'
```

## Важные замечания

### Privacy by Design

⚠️ **Важно:** API **не принимает** сырые ответы/тексты. Только агрегаты:
- `resultLevel` (low/moderate/high)
- `resultProfile` (для навигатора: стабильные категории)
- `durationMs` (число миллисекунд)
- `crisisTriggered` (boolean)
- `crisisTriggerType` (категория, не свободный текст)

**Запрещено:**
- `answers` (массив ответов)
- `rawAnswers` (сырые ответы)
- `text` (свободный текст)
- `question_text` (текст вопросов)
- `answer_text` (текст ответов)

Если попытаться отправить сырые ответы, API вернёт `400 Bad Request`.

### Deep Link ID

**Генерация `deep_link_id` — это ответственность frontend.**

Backend только хранит `deep_link_id` в таблице `interactive_runs` после того, как он был связан с run через метод `InteractiveRun.linkDeepLink()`.

**Frontend должен:**
1. Генерировать `deep_link_id` при рендере CTA "Получить план в Telegram"
2. Отправлять событие `cta_tg_click` с `deep_link_id` в аналитику
3. (Опционально) Связывать `deep_link_id` с run через отдельный API endpoint (если такой будет реализован)

**Backend предоставляет:**
- Поле `deepLinkId` в схеме БД для хранения связи
- Метод `InteractiveRun.linkDeepLink(deepLinkId)` для связывания

**Пример на frontend:**
```typescript
// Генерация deep_link_id (frontend)
const deepLinkId = generateShortId(); // или UUID

// Формирование Telegram deep link
const payload = {
  dl: deepLinkId,
  f: 'plan_7d',
  t: 'anxiety',
  s: 'quiz'
};
const encodedPayload = base64url(JSON.stringify(payload));
const telegramUrl = `https://t.me/emotional_balance_bot?start=${encodedPayload}`;

// Отправка события аналитики
track('cta_tg_click', {
  deep_link_id: deepLinkId,
  tg_flow: 'plan_7d',
  topic: 'anxiety',
  tg_target: 'bot'
});

// (Опционально) Связывание с run
// await linkDeepLinkToRun(runId, deepLinkId);
```

### Idempotency

Метод `complete` является идемпотентным: повторный вызов с теми же параметрами не создаст дубль.

**Поведение:**
- Если run уже завершён (`status = completed`), повторный `complete()` не изменит состояние
- `completedAt` не обновится при повторном вызове

**Пример:**
```typescript
// Первый вызов
await completeInteractiveRunUseCase.execute({
  runId: 'run-123',
  resultLevel: 'moderate',
  durationMs: 5000
});

// Повторный вызов (идемпотентный)
await completeInteractiveRunUseCase.execute({
  runId: 'run-123',
  resultLevel: 'moderate',
  durationMs: 5000
});
// Результат: состояние не изменится, дубль не создастся
```

## Доменные события

Use cases публикуют следующие доменные события:

### InteractiveRunStartedEvent

Публикуется при запуске интерактива.

**Свойства:**
- `runId: InteractiveRunId`
- `interactiveDefinitionId: string`
- `interactiveSlug: string`
- `interactiveType: string`
- `anonymousId: string | null`
- `userId: string | null`
- `topic: string | null`
- `entryPoint: string | null`

**Преобразуется в аналитику:**
- `start_quiz` (если `interactiveType === 'quiz'`)
- `navigator_start` (если `interactiveType === 'navigator'`)
- `resource_thermometer_start` (если `interactiveType === 'thermometer'`)
- и т.д.

### InteractiveRunCompletedEvent

Публикуется при завершении интерактива.

**Свойства:**
- `runId: InteractiveRunId`
- `interactiveDefinitionId: string`
- `interactiveSlug: string`
- `interactiveType: string`
- `resultLevel: ResultLevelVO | null`
- `resultProfile: string | null`
- `durationMs: number | null`
- `anonymousId: string | null`
- `userId: string | null`

**Преобразуется в аналитику:**
- `complete_quiz` (если `interactiveType === 'quiz'`)
- `navigator_complete` (если `interactiveType === 'navigator'`)
- `resource_thermometer_complete` (если `interactiveType === 'thermometer'`)
- и т.д.

**Важно:** События не содержат сырых ответов/текстов.

### CrisisTriggeredEvent

Публикуется при срабатывании кризисного триггера.

**Свойства:**
- `runId: InteractiveRunId`
- `triggerType: string` (категория: 'self_harm', 'suicidal_ideation', etc.)
- `surface: string` (тип интерактива: 'quiz', 'navigator', etc.)
- `anonymousId: string | null`
- `userId: string | null`

**Преобразуется в аналитику:**
- `crisis_banner_shown`

**Важно:** Событие содержит только категорию триггера, не детали текста.

## Тестирование

### Unit Tests

- `StartInteractiveRunUseCase.test.ts`
- `CompleteInteractiveRunUseCase.test.ts`

### Integration Tests

- `interactive.integration.test.ts` — проверяет полный цикл: start → complete → БД

**Запуск integration тестов:**
```bash
# Требуется настроенная тестовая БД
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/psychology_test \
  npm test -- apps/api/src/interactive.integration.test.ts
```

## Связанные документы

- Техспека: `docs/generated/tech-specs/FEAT-INT-01.md`
- Отчет о проверке: `docs/generated/tech-specs/FEAT-INT-01-Validation-Report.md`
- Domain Model: `docs/Domain-Model-Specification.md`
- Tracking Plan: `docs/Tracking-Plan.md`
- Telegram Deep Links: `docs/Telegram-Deep-Links-Schema.md`
