#!/bin/bash
# Скрипт для создания первой миграции БД
# Использование: ./scripts/create-initial-migration.sh

set -e

echo "🚀 Создание первой миграции БД..."

# Проверяем, что DATABASE_URL установлен
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Ошибка: DATABASE_URL не установлен"
  echo "Установите DATABASE_URL в .env или экспортируйте переменную окружения"
  exit 1
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
