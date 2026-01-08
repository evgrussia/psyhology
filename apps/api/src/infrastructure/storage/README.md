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
S3_REGION=ru-central1
S3_ACCESS_KEY_ID=your_access_key_id
S3_SECRET_ACCESS_KEY=your_secret_access_key
S3_FORCE_PATH_STYLE=false
S3_CDN_URL=https://cdn.example.com  # опционально, для CDN
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
