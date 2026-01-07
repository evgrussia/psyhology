# Структура документации Design System

```
docs/
│
├── 📘 UI-Kit-Design-System.md ⭐ ГЛАВНЫЙ ДОКУМЕНТ
│   ├── Философия дизайна
│   ├── Design Tokens (цвета, spacing, shadows)
│   ├── Типографика (Inter + Lora)
│   ├── Компоненты UI (Buttons, Cards, Inputs, etc.)
│   ├── Анимации и transitions
│   ├── Иконография
│   ├── Иллюстрации
│   ├── Accessibility
│   └── Responsive guidelines
│
├── design-system/
│   │
│   ├── 📄 README.md (индекс дизайн-системы)
│   │
│   ├── 🎨 Image-Generation-Prompts.md ⭐ ПРОМПТЫ
│   │   ├── Hero Images (4 варианта)
│   │   ├── Spot Illustrations (8 вариантов)
│   │   ├── Background Patterns (4 типа)
│   │   ├── Icons (стиль + примеры)
│   │   ├── Content Photos (4 типа)
│   │   ├── Abstract Compositions (4 типа)
│   │   └── Секции сайта (готовые промпты)
│   │
│   ├── 📋 tokens-reference.md (быстрая справка)
│   │   ├── CSS Custom Properties
│   │   ├── Tailwind Config
│   │   └── Quick Reference Tables
│   │
│   ├── ✅ SUMMARY.md (сводка создания)
│   │   ├── Что создано
│   │   ├── Следующие шаги
│   │   └── Чеклисты
│   │
│   └── [Будущие файлы]
│       ├── Components-Detailed.md
│       ├── Icons.md
│       ├── Typography-Guide.md
│       ├── Motion-Design.md
│       └── Accessibility-Checklist.md
│
└── generated/
    └── frontend/
        │
        ├── 📄 README.md (индекс + связи)
        │
        ├── 📘 QPsychology-Complete-Design-Specification.md ⭐ РЕФЕРЕНС
        │   ├── Design Tokens Q Psychology
        │   ├── Типографика Q Psychology
        │   ├── Все компоненты с кодом
        │   ├── Секции страницы
        │   ├── Анимации
        │   ├── JavaScript логика
        │   └── Чеклист реализации
        │
        ├── Gemini-QPsychology-Homepage-Full-Analysis.md
        └── q-copy.md
```

---

## Связи между документами

```
[PRD.md] ──────┐
[Vision.md] ────┼──> [UI-Kit-Design-System.md] ⭐ MAIN
                │           │
                │           ├──> [Image-Generation-Prompts.md]
                │           │
                │           ├──> [tokens-reference.md]
                │           │
                │           └──> [Components in code]
                │
[QPsychology-Complete-Design-Specification.md] (reference)
                │
                └──> Адаптировано в UI Kit
```

---

## Workflow: От документации к реализации

```
1. ИЗУЧЕНИЕ
   ├── Читаем PRD.md (требования)
   ├── Читаем Vision.md (философия)
   └── Изучаем QPsychology-Complete-Design-Specification.md (референс)
         ↓
2. ДИЗАЙН
   ├── Применяем UI-Kit-Design-System.md (адаптированная система)
   ├── Генерируем визуалы через Image-Generation-Prompts.md
   └── Создаем Figma UI Kit
         ↓
3. РАЗРАБОТКА
   ├── Настраиваем tokens (tokens-reference.md)
   ├── Реализуем компоненты (код из QPsychology spec + UI Kit)
   └── Интегрируем визуалы
         ↓
4. ТЕСТИРОВАНИЕ
   ├── Проверяем accessibility (чеклисты из UI Kit)
   ├── Тестируем responsive
   └── Валидируем контрастность
```

---

## Для быстрого старта

### Я дизайнер:
1. Открой **UI-Kit-Design-System.md** (цвета, типографика, компоненты)
2. Открой **Image-Generation-Prompts.md** (генерируй визуалы)
3. Создай UI Kit в Figma

### Я разработчик:
1. Открой **tokens-reference.md** (скопируй CSS/Tailwind config)
2. Открой **QPsychology-Complete-Design-Specification.md** (примеры кода)
3. Реализуй компоненты из **UI-Kit-Design-System.md**

### Я контент-менеджер:
1. Изучи **UI-Kit-Design-System.md** → раздел "Философия дизайна"
2. Изучи **Vision.md** (тон коммуникации)
3. Используй **Content-Guide-UX-Copywriting.md**

---

## Иерархия приоритетов документов

### Tier 1 (критичные, читать обязательно):
- ⭐ UI-Kit-Design-System.md
- ⭐ Image-Generation-Prompts.md
- ⭐ QPsychology-Complete-Design-Specification.md

### Tier 2 (важные, для работы):
- tokens-reference.md
- generated/frontend/README.md
- design-system/README.md

### Tier 3 (справочные):
- SUMMARY.md
- Gemini-QPsychology-Homepage-Full-Analysis.md
- q-copy.md

---

## Размер документов

| Документ | Строк | Размер | Время чтения |
|----------|-------|--------|--------------|
| UI-Kit-Design-System.md | ~1,300 | ~45 KB | 15-20 мин |
| Image-Generation-Prompts.md | ~850 | ~35 KB | 10-15 мин |
| QPsychology-Complete-Design-Specification.md | ~2,100 | ~75 KB | 25-30 мин |
| tokens-reference.md | ~150 | ~6 KB | 3-5 мин |
| SUMMARY.md | ~300 | ~12 KB | 5-7 мин |

**Итого**: ~4,700 строк документации

---

## Версионирование

```
v1.0 (7 января 2026) - Initial Release
├── Основной UI Kit создан
├── Промпты для визуалов готовы
├── Референс Q Psychology адаптирован
└── Вся структура документации создана

Planned:
v1.1 - Дополнительные компоненты (Modals, Tooltips, Dropdowns)
v1.2 - Детальное руководство по Motion Design
v1.3 - Расширенный Accessibility Guide
v2.0 - Dark Mode варианты (если потребуется)
```

---

**Документация готова к использованию!**
Все файлы связаны, структурированы и готовы для команды.
