# Design System — «Эмоциональный баланс»

Эта папка содержит все файлы дизайн-системы проекта.

## 📁 Структура

### Основные документы

- **[Image Generation Prompts](./Image-Generation-Prompts.md)** - Промпты для генерации всех визуальных элементов через AI
- **[Components Detailed](./Components-Detailed.md)** - Детальное описание всех компонентов с примерами кода (HTML/CSS/React)
- **[Icons Reference](./Icons.md)** - Справочник всех иконок проекта с кодами SVG
- **[Typography Guide](./Typography-Guide.md)** - Расширенное руководство по типографике
- **[Motion Design](./Motion-Design.md)** - Детальное руководство по анимациям и transitions
- **[Accessibility Checklist](./Accessibility-Checklist.md)** - Полный чеклист доступности (WCAG 2.1 AA)
- **[Tokens Reference](./tokens-reference.md)** - Быстрая справка по design tokens

### Дополнительные материалы (в планах)

- `Color-Psychology.md` - Психология цвета и применение палитры

### Графические ресурсы (папки)

```
design-system/
├── assets/
│   ├── images/
│   │   ├── hero/           # Hero изображения
│   │   ├── spots/          # Spot иллюстрации
│   │   ├── photos/         # Фотографии для контента
│   │   └── abstract/       # Абстрактные композиции
│   ├── icons/
│   │   ├── svg/            # SVG иконки
│   │   └── png/            # PNG fallbacks
│   ├── patterns/
│   │   └── backgrounds/    # Фоновые паттерны
│   └── logos/
│       ├── main/           # Основные логотипы
│       └── variants/       # Вариации логотипов
└── tokens/
    ├── colors.json         # Токены цветов
    ├── spacing.json        # Токены отступов
    ├── typography.json     # Токены типографики
    └── shadows.json        # Токены теней
```

## 🎨 Быстрый старт

### Для дизайнеров:
1. **Изучите основной документ**: [../UI-Kit-Design-System.md](../UI-Kit-Design-System.md)
2. **Генерируйте визуалы**: Используйте промпты из [Image-Generation-Prompts.md](./Image-Generation-Prompts.md)
3. **Изучите компоненты**: [Components-Detailed.md](./Components-Detailed.md)
4. **Создайте Figma UI Kit**: Используя всё вышеперечисленное

### Для разработчиков:
1. **Настройте токены**: [tokens-reference.md](./tokens-reference.md) - скопируйте CSS/Tailwind config
2. **Реализуйте компоненты**: [Components-Detailed.md](./Components-Detailed.md) - примеры кода
3. **Добавьте иконки**: [Icons.md](./Icons.md) - используйте Lucide Icons
4. **Настройте типографику**: [Typography-Guide.md](./Typography-Guide.md)
5. **Добавьте анимации**: [Motion-Design.md](./Motion-Design.md)
6. **Проверьте доступность**: [Accessibility-Checklist.md](./Accessibility-Checklist.md)

## 🔗 Связанные документы

- [UI Kit / Design System (основной)](../UI-Kit-Design-System.md)
- [Q Psychology Complete Spec](../generated/frontend/QPsychology-Complete-Design-Specification.md)
- [Q Psychology Homepage Analysis](../generated/frontend/QPsychology-Homepage-UI-Effects.md)

## 📋 Статус документации

- [x] UI Kit / Design System - **Готов** (1,330 строк)
- [x] Image Generation Prompts - **Готов** (583 строки)
- [x] Components Detailed - **Готов** (1,200+ строк)
- [x] Icons Reference - **Готов** (800+ строк)
- [x] Typography Guide - **Готов** (900+ строк)
- [x] Motion Design - **Готов** (1,100+ строк)
- [x] Accessibility Checklist - **Готов** (1,000+ строк)
- [x] Tokens Reference - **Готов** (150 строк)

**Итого**: ~7,000+ строк полной документации дизайн-системы ✅

---

**Версия**: 1.1  
**Последнее обновление**: 9 января 2026  
**Что нового в v1.1**: Добавлена вся недостающая документация по компонентам, иконкам, типографике, анимациям и доступности
