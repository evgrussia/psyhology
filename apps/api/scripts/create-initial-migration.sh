#!/bin/bash
# Скрипт для создания первой миграции БД
# Использование: ./scripts/create-initial-migration.sh

set -e

echo "🚀 Создание первой миграции БД..."

# Функция для загрузки .env файла
load_env_file() {
  local env_file="$1"
  if [ -f "$env_file" ]; then
    echo "📄 Загрузка переменных из $env_file..."
    set -a
    source "$env_file"
    set +a
    return 0
  fi
  return 1
}

# Загружаем .env файл (проверяем в текущей директории и в корне проекта)
ENV_LOADED=false
ENV_PATHS=(
  ".env"
  "../../.env"
  "$(dirname "$0")/../.env"
  "$(dirname "$0")/../../.env"
)

for env_path in "${ENV_PATHS[@]}"; do
  if [ -f "$env_path" ]; then
    if load_env_file "$env_path"; then
      ENV_LOADED=true
      break
    fi
  fi
done

# Проверяем, что DATABASE_URL установлен
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Ошибка: DATABASE_URL не установлен"
  echo "Установите DATABASE_URL в .env файл или экспортируйте переменную окружения"
  echo ""
  echo "Проверенные пути:"
  for env_path in "${ENV_PATHS[@]}"; do
    echo "  - $env_path"
  done
  exit 1
fi

if [ "$ENV_LOADED" = true ]; then
  echo "✅ Переменные окружения загружены"
fi

# Проверяем, что миграции ещё не созданы
if [ -d "prisma/migrations" ]; then
  echo "⚠️  Миграции уже существуют. Пропускаем создание."
  exit 0
fi

# Генерируем Prisma Client
echo "📦 Генерация Prisma Client..."
npm run prisma:generate

# Создаём первую миграцию
echo "📝 Создание миграции 'init'..."
npm run migrate:dev -- --name init

echo "✅ Миграция создана успешно!"
echo ""
echo "Следующие шаги:"
echo "1. Проверьте созданную миграцию в prisma/migrations/"
echo "2. Примените миграции: npm run migrate:up"
echo "3. Примените seed данные: npm run seed"
