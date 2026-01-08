# Скрипт для создания первой миграции БД (PowerShell)
# Использование: .\scripts\create-initial-migration.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Создание первой миграции БД..." -ForegroundColor Cyan

# Проверяем, что DATABASE_URL установлен
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Ошибка: DATABASE_URL не установлен" -ForegroundColor Red
    Write-Host "Установите DATABASE_URL в .env или экспортируйте переменную окружения" -ForegroundColor Yellow
    exit 1
}

# Проверяем, что миграции ещё не созданы
if (Test-Path "prisma\migrations") {
    Write-Host "⚠️  Миграции уже существуют. Пропускаем создание." -ForegroundColor Yellow
    exit 0
}

# Генерируем Prisma Client
Write-Host "📦 Генерация Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate

# Создаём первую миграцию
Write-Host "📝 Создание миграции 'init'..." -ForegroundColor Cyan
npm run migrate:dev -- --name init

Write-Host "✅ Миграция создана успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Проверьте созданную миграцию в prisma\migrations\" -ForegroundColor White
Write-Host "2. Примените миграции: npm run migrate:up" -ForegroundColor White
Write-Host "3. Примените seed данные: npm run seed" -ForegroundColor White
