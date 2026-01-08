# Media Use Cases Tests

## Unit Tests

Unit тесты для всех use cases медиа-функциональности:

- `CreateMediaAssetUseCase.test.ts` - тесты создания медиа-активов
- `FinalizeMediaUploadUseCase.test.ts` - тесты завершения загрузки
- `DeleteMediaAssetUseCase.test.ts` - тесты удаления медиа-активов
- `ListMediaAssetsUseCase.test.ts` - тесты получения списка
- `MediaType.test.ts` - тесты value object MediaType
- `MediaAssetId.test.ts` - тесты value object MediaAssetId

## Integration Tests

Интеграционные тесты находятся в `src/media.integration.test.ts` и покрывают:

- AC-1: API для получения pre-signed upload URL
- AC-2: Валидация mime/размера до загрузки
- AC-3: Связь записи в БД с объектом в S3
- AC-4: Удаление медиа с проверкой использования
- Негативные сценарии (NS-1, NS-2)

## Запуск тестов

```bash
cd apps/api
npm test
```

Для запуска только unit тестов:
```bash
npm test -- use-cases
```

Для запуска только integration тестов:
```bash
npm test -- integration
```

## Требования

Для интеграционных тестов требуется:
- База данных PostgreSQL (настроена через DATABASE_URL)
- Тестовый пользователь с ролью owner (создаётся автоматически в тестах)

Примечание: Интеграционные тесты используют реальную БД, поэтому убедитесь, что используете тестовую БД, а не production.
