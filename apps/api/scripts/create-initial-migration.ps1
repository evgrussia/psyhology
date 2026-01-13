# Скрипт для создания первой миграции БД (PowerShell)
# Использование: .\scripts\create-initial-migration.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Создание первой миграции БД..." -ForegroundColor Cyan

# Функция для загрузки .env файла
function Load-EnvFile {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        return $false
    }
    
    Write-Host "📄 Загрузка переменных из $Path..." -ForegroundColor Gray
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Удаляем кавычки, если есть
            if ($value -match '^["''](.*)["'']$') {
                $value = $matches[1]
            }
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    return $true
}

# Определяем корневую директорию (apps/api)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Split-Path -Parent $scriptDir
$rootDir = Split-Path -Parent (Split-Path -Parent $apiDir)

# Загружаем .env файл (проверяем в текущей директории и в корне проекта)
$envLoaded = $false
$envPaths = @(
    "$apiDir\.env",           # apps/api/.env
    "$rootDir\.env",          # корень проекта/.env
    ".\.env",                 # текущая директория
    "..\..\..\.env"           # относительный путь от apps/api
)

foreach ($envPath in $envPaths) {
    $fullPath = $envPath
    if (-not [System.IO.Path]::IsPathRooted($envPath)) {
        $fullPath = Join-Path (Get-Location) $envPath
    }
    
    if (Test-Path $fullPath) {
        if (Load-EnvFile -Path $fullPath) {
            $envLoaded = $true
            Write-Host "✅ Найден .env файл: $fullPath" -ForegroundColor Green
            break
        }
    }
}

# Проверяем, что DATABASE_URL установлен
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Ошибка: DATABASE_URL не установлен" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите DATABASE_URL одним из способов:" -ForegroundColor Yellow
    Write-Host "1. Создайте файл .env в директории apps/api/ с содержимым:" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL=`"postgresql://postgres:postgres@localhost:5432/emotional_balance?schema=public`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Или экспортируйте переменную окружения:" -ForegroundColor Yellow
    Write-Host "   `$env:DATABASE_URL = `"postgresql://postgres:postgres@localhost:5432/emotional_balance?schema=public`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Проверенные пути для .env файла:" -ForegroundColor Yellow
    foreach ($envPath in $envPaths) {
        $fullPath = $envPath
        if (-not [System.IO.Path]::IsPathRooted($envPath)) {
            $fullPath = Join-Path (Get-Location) $envPath
        }
        $exists = if (Test-Path $fullPath) { "✅ существует" } else { "❌ не найден" }
        Write-Host "  - $fullPath ($exists)" -ForegroundColor $(if (Test-Path $fullPath) { "Green" } else { "Gray" })
    }
    exit 1
}

if ($envLoaded) {
    Write-Host "✅ Переменные окружения загружены" -ForegroundColor Green
}

# Проверяем, что миграции ещё не созданы
if (Test-Path "prisma\migrations") {
    Write-Host "⚠️  Миграции уже существуют. Пропускаем создание." -ForegroundColor Yellow
    exit 0
}

# Проверяем наличие node_modules (в текущей директории или в корне проекта)
$nodeModulesLocal = Join-Path $apiDir "node_modules"
$nodeModulesRoot = Join-Path $rootDir "node_modules"

if (-not (Test-Path $nodeModulesLocal) -and -not (Test-Path $nodeModulesRoot)) {
    Write-Host "⚠️  node_modules не найден. Устанавливаем зависимости..." -ForegroundColor Yellow
    Push-Location $rootDir
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Ошибка при установке зависимостей" -ForegroundColor Red
            exit 1
        }
    }
    finally {
        Pop-Location
    }
}

# Используем npx для запуска Prisma (работает в монорепо)
# npx автоматически найдет prisma в node_modules (локальном или корневом)
Write-Host "📦 Генерация Prisma Client..." -ForegroundColor Cyan
Push-Location $apiDir
try {
    npx prisma generate --schema=prisma/schema.prisma
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при генерации Prisma Client" -ForegroundColor Red
        Write-Host "Попробуйте выполнить: npm install в корне проекта" -ForegroundColor Yellow
        exit 1
    }
}
finally {
    Pop-Location
}

# Создаём первую миграцию
Write-Host "📝 Создание миграции 'init'..." -ForegroundColor Cyan
Push-Location $apiDir
try {
    npx prisma migrate dev --schema=prisma/schema.prisma --name init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при создании миграции" -ForegroundColor Red
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host "✅ Миграция создана успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Проверьте созданную миграцию в prisma\migrations\" -ForegroundColor White
Write-Host "2. Примените миграции: npm run migrate:up" -ForegroundColor White
Write-Host "3. Примените seed данные: npm run seed" -ForegroundColor White
