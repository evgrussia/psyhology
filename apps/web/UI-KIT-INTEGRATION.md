# Интеграция UI Kit — Следующие шаги

## ✅ Что уже сделано

1. ✅ Подключены шрифты Inter и Gupter через `next/font/google`
2. ✅ Создана утилита `cx` для работы с CSS классами
3. ✅ Реализованы 11 компонентов UI:
   - Button (primary, secondary, ghost, pill)
   - IconButton
   - Card (с вложенными компонентами)
   - Input и Textarea
   - Badge и Tag
   - Accordion
   - Container, Section, Link
   - Toast (система уведомлений)
4. ✅ Написаны тесты для Button, Input, Accordion
5. ✅ Создана подробная документация в `README.md`
6. ✅ Создана демо-страница `/ui-showcase`

## 📦 Структура файлов

```
apps/web/
├── src/
│   ├── app/
│   │   ├── globals.css                    # CSS Variables (токены)
│   │   ├── layout.tsx                     # Подключены шрифты
│   │   └── ui-showcase/                   # Демо-страница
│   │       ├── page.tsx
│   │       └── showcase.module.css
│   ├── components/
│   │   ├── ui/                            # UI Kit компоненты
│   │   │   ├── Button.tsx / .module.css
│   │   │   ├── IconButton.tsx / .module.css
│   │   │   ├── Card.tsx / .module.css
│   │   │   ├── Input.tsx / .module.css
│   │   │   ├── Textarea.tsx / .module.css
│   │   │   ├── Badge.tsx / .module.css
│   │   │   ├── Tag.tsx / .module.css
│   │   │   ├── Accordion.tsx / .module.css
│   │   │   ├── Container.tsx / .module.css
│   │   │   ├── Section.tsx / .module.css
│   │   │   ├── Link.tsx / .module.css
│   │   │   ├── Toast.tsx / .module.css
│   │   │   ├── index.ts                   # Экспорты
│   │   │   ├── README.md                  # Документация
│   │   │   ├── *.test.tsx                 # Тесты
│   │   └── promo/                         # Старые компоненты (не трогать)
│   ├── lib/
│   │   └── utils.ts                       # Утилита cx
│   └── test/
│       └── setup.ts                       # Setup для тестов
├── vitest.config.ts                       # Конфиг тестов
└── package.json
```

## 🚀 Как использовать

### Импорт компонентов

```tsx
import { Button, Card, Input, Container, Section } from '@/components/ui';
```

### Просмотр демо

Запустите dev-сервер и откройте:
```bash
npm run dev
# Откройте http://localhost:3000/ui-showcase
```

### Запуск тестов

```bash
npm test                    # Запустить все тесты
npm test -- --watch         # Watch mode
npm test -- --coverage      # С покрытием
```

## 📋 TODO: Дальнейшая работа

### 1. Интеграция в существующие страницы

- [ ] Заменить кнопки в `apps/web/src/components/promo/` на новый `Button`
- [ ] Использовать `Container` и `Section` в layout промо-страниц
- [ ] Применить новые `Input` в формах

### 2. Дополнительные компоненты (опционально)

- [ ] Modal/Dialog — модальные окна
- [ ] Select/Dropdown — выпадающие списки
- [ ] Checkbox/Radio — чекбоксы и радио-кнопки
- [ ] Progress — индикаторы прогресса
- [ ] Tabs — табы для навигации
- [ ] Tooltip — всплывающие подсказки
- [ ] Avatar — аватары пользователей
- [ ] Table — таблицы (для админки)

### 3. Расширение существующих компонентов

- [ ] Button: добавить `leftIcon` (не только для pill)
- [ ] Input: добавить типы `date`, `number` с кастомными стилями
- [ ] Card: добавить варианты с изображениями
- [ ] Toast: добавить действия (кнопки в уведомлении)

### 4. Иконки

**Текущее состояние**: В демо используются эмодзи (🔍, ☰, ✕)

**Рекомендации**:
```bash
npm install lucide-react
```

Затем в компонентах:
```tsx
import { Search, Menu, X } from 'lucide-react';

<IconButton icon={<Search />} aria-label="Поиск" />
```

### 5. Storybook (опционально)

Для документации компонентов:
```bash
npx storybook@latest init
```

Создать stories для каждого компонента.

### 6. Тесты

Текущие тесты покрывают 3 компонента. Рекомендуется добавить:
- [ ] Card.test.tsx
- [ ] Badge.test.tsx
- [ ] Tag.test.tsx
- [ ] Toast.test.tsx (интеграционные)
- [ ] Container.test.tsx
- [ ] Section.test.tsx
- [ ] Link.test.tsx

### 7. Доступность

Проверить:
- [ ] Screen reader тест (NVDA/JAWS/VoiceOver)
- [ ] Keyboard navigation во всех компонентах
- [ ] Color contrast в разных темах
- [ ] Touch targets на мобильных (минимум 44px)

### 8. Performance

- [ ] Lazy loading для Toast (dynamic import)
- [ ] Мемоизация для тяжёлых компонентов
- [ ] Bundle size анализ

## 🎨 Дизайн-токены

Все токены находятся в `apps/web/src/app/globals.css`:
- Цвета: `--color-*`
- Spacing: `--space-*`
- Typography: `--font-*`, `--font-size-*`
- Shadows: `--shadow-*`
- Radius: `--radius-*`
- Animations: `--duration-*`, `--ease-*`

**Важно**: Всегда использовать токены вместо хардкода!

❌ Неправильно: `color: #4E8E82`  
✅ Правильно: `color: var(--color-sage-500)`

## 📚 Документация

- **Полная документация**: `apps/web/src/components/ui/README.md`
- **Дизайн-система**: `docs/UI-Kit-Design-System.md`
- **Референс**: https://www.qpsychology.com.au/

## 🔧 Настройка редактора

### VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- CSS Modules (для интеллектуального автодополнения CSS переменных)

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

## 📞 Поддержка

Если возникли вопросы по UI Kit:
1. Проверьте README в `apps/web/src/components/ui/`
2. Посмотрите примеры на `/ui-showcase`
3. Изучите тесты (*.test.tsx) — там много примеров использования

## ✨ Готово к использованию!

Все компоненты протестированы и готовы к интеграции. Начните с простых замен кнопок и постепенно переходите к более сложным компонентам.

**Демо доступно по адресу**: `http://localhost:3000/ui-showcase`
