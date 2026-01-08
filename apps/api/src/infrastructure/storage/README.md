# S3 Storage Service

Реализация для работы с S3-совместимым хранилищем (Yandex Object Storage или аналог).

## Установка зависимостей

```bash
cd apps/api
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Настройка переменных окружения

Добавьте в `.env`:

```env
# S3 Storage (Yandex Object Storage или аналог)
S3_ENDPOINT=https://storage.yandexcloud.net
S3_INTERNAL_ENDPOINT=https://storage.yandexcloud.net # опционально (если нужно разделить internal/public)
S3_PUBLIC_ENDPOINT=https://storage.yandexcloud.net   # опционально (если нужно разделить internal/public)
S3_REGION=ru-central1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_FORCE_PATH_STYLE=false
S3_CDN_URL=https://cdn.example.com  # опционально, для CDN
```

## Локальный S3 в Docker (MinIO)

В проекте есть `docker-compose.yml`, который поднимает MinIO и автоматически:

- создаёт бакеты `emotional-balance-media` и `emotional-balance-audio`
- включает публичное чтение (для публичных URL)
- настраивает CORS (для загрузки из браузера по pre-signed URL)

### Рекомендуемая конфигурация для dev (API запускается на хосте)

```env
S3_INTERNAL_ENDPOINT=http://localhost:9000
S3_PUBLIC_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_FORCE_PATH_STYLE=true
```

### Конфигурация для случая, если API запущен в Docker

Важно: **pre-signed URL должен быть доступен клиенту (браузеру)**, поэтому публичный endpoint обычно должен быть `http://localhost:9000`,
а internal endpoint — `http://minio:9000`.

```env
S3_INTERNAL_ENDPOINT=http://minio:9000
S3_PUBLIC_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_FORCE_PATH_STYLE=true
```

## Бакеты

Система использует два бакета:

- `emotional-balance-media` - для изображений и PDF
- `emotional-balance-audio` - для аудио-файлов

Убедитесь, что бакеты созданы и настроены с публичным доступом на чтение.

## Использование

Сервис автоматически инициализируется в `server.ts` и используется через use cases:

- `CreateMediaAssetUseCase` - создание и получение pre-signed URL
- `FinalizeMediaUploadUseCase` - завершение загрузки
- `DeleteMediaAssetUseCase` - удаление медиа
