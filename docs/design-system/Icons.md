# Справочник иконок — «Эмоциональный баланс»

**Версия**: 1.0  
**Дата создания**: 9 января 2026  
**Статус**: Полный справочник всех иконок проекта

---

## 📋 Содержание

1. [Общие принципы](#общие-принципы)
2. [Библиотека иконок](#библиотека-иконок)
3. [Ключевые иконки](#ключевые-иконки)
4. [SVG коды](#svg-коды)
5. [Использование](#использование)
6. [Кастомные иконки](#кастомные-иконки)

---

## Общие принципы

### Стиль иконок

- **Тип**: Outline (контурные), не filled
- **Толщина линии**: 2px (1.5px для размера 16px)
- **Скругления**: Rounded corners
- **Размеры**: 16px, 20px, 24px, 32px, 40px
- **Цвет**: Наследуется от родителя (currentColor)

### Технические требования

```css
.icon {
  width: 24px;
  height: 24px;
  color: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

### Доступность

- Всегда добавляйте `aria-label` или `aria-hidden="true"` + текстовое описание рядом
- Используйте `<title>` внутри SVG для описания
- Обеспечьте минимальный размер 24px для интерактивных элементов

---

## Библиотека иконок

**Рекомендуемая библиотека**: [Lucide Icons](https://lucide.dev/)

**Альтернативы**:
- [Heroicons](https://heroicons.com/)
- [Phosphor Icons](https://phosphoricons.com/)
- [Tabler Icons](https://tabler-icons.io/)

**Установка Lucide (React)**:
```bash
npm install lucide-react
```

**Использование**:
```tsx
import { Heart, Calendar, MessageCircle } from 'lucide-react';

<Heart size={24} color="var(--color-sage-500)" />
```

---

## Ключевые иконки

### Навигация и действия

#### Arrow Right (Вперед)
**Использование**: Кнопки "Далее", переходы, pill buttons

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

**Lucide**: `ArrowRight`

---

#### Arrow Left (Назад)
**Использование**: Кнопки "Назад", возврат к предыдущему шагу

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="19" y1="12" x2="5" y2="12"></line>
  <polyline points="12 19 5 12 12 5"></polyline>
</svg>
```

**Lucide**: `ArrowLeft`

---

#### Chevron Down (Раскрытие)
**Использование**: Аккордеоны, селекты, дропдауны

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="6 9 12 15 18 9"></polyline>
</svg>
```

**Lucide**: `ChevronDown`

---

#### Plus (Добавить/Раскрыть)
**Использование**: Аккордеоны, добавление элементов

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
```

**Lucide**: `Plus`

---

#### X (Закрыть)
**Использование**: Закрытие модалок, удаление, отмена

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
```

**Lucide**: `X`

---

#### Menu (Гамбургер)
**Использование**: Мобильное меню

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="3" y1="12" x2="21" y2="12"></line>
  <line x1="3" y1="6" x2="21" y2="6"></line>
  <line x1="3" y1="18" x2="21" y2="18"></line>
</svg>
```

**Lucide**: `Menu`

---

### Статусы и обратная связь

#### Check Circle (Успех)
**Использование**: Подтверждения, завершенные шаги

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
  <polyline points="22 4 12 14.01 9 11.01"></polyline>
</svg>
```

**Lucide**: `CheckCircle`  
**Цвет**: `var(--color-success-500)`

---

#### Alert Circle (Предупреждение)
**Использование**: Предупреждения, важная информация

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>
```

**Lucide**: `AlertCircle`  
**Цвет**: `var(--color-warning-500)`

---

#### X Circle (Ошибка)
**Использование**: Ошибки, неудачные действия

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="15" y1="9" x2="9" y2="15"></line>
  <line x1="9" y1="9" x2="15" y2="15"></line>
</svg>
```

**Lucide**: `XCircle`  
**Цвет**: `var(--color-error-500)`

---

#### Info (Информация)
**Использование**: Информационные подсказки

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="16" x2="12" y2="12"></line>
  <line x1="12" y1="8" x2="12.01" y2="8"></line>
</svg>
```

**Lucide**: `Info`  
**Цвет**: `var(--color-info-500)`

---

### Основные функции

#### Calendar (Запись)
**Использование**: Запись на консультацию, расписание

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>
```

**Lucide**: `Calendar`

---

#### Heart (Избранное)
**Использование**: Избранное, "аптечка", лайки

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>
```

**Lucide**: `Heart`  
**Filled вариант**: добавить `fill="currentColor"`

---

#### Message Circle (Сообщения)
**Использование**: Чат, вопросы, коммуникация

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
</svg>
```

**Lucide**: `MessageCircle`

---

#### User (Профиль)
**Использование**: Профиль пользователя, аккаунт

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  <circle cx="12" cy="7" r="4"></circle>
</svg>
```

**Lucide**: `User`

---

#### Search (Поиск)
**Использование**: Поиск по ресурсам, контенту

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
```

**Lucide**: `Search`

---

#### Settings (Настройки)
**Использование**: Настройки профиля, параметры

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M12 1v6m0 6v6m5.196-15.196l-4.243 4.243m-2.121 2.121l-4.243 4.243m12.728 0l-4.243-4.243m-2.121-2.121l-4.243-4.243"></path>
</svg>
```

**Lucide**: `Settings`

---

### Контент и документы

#### File Text (Документ)
**Использование**: Ресурсы, статьи, документация

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
  <polyline points="14 2 14 8 20 8"></polyline>
  <line x1="16" y1="13" x2="8" y2="13"></line>
  <line x1="16" y1="17" x2="8" y2="17"></line>
  <polyline points="10 9 9 9 8 9"></polyline>
</svg>
```

**Lucide**: `FileText`

---

#### Book Open (Чтение)
**Использование**: Статьи, образование, блог

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
</svg>
```

**Lucide**: `BookOpen`

---

#### Download (Скачивание)
**Использование**: Экспорт PDF, скачивание ресурсов

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
  <polyline points="7 10 12 15 17 10"></polyline>
  <line x1="12" y1="15" x2="12" y2="3"></line>
</svg>
```

**Lucide**: `Download`

---

#### Copy (Копировать)
**Использование**: Копирование скриптов, текста

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>
```

**Lucide**: `Copy`

---

### Специфичные для проекта

#### Brain (Ментальное здоровье)
**Использование**: Психологическая работа, мышление

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
</svg>
```

**Lucide**: `Brain`

---

#### Activity (Активность/Термометр)
**Использование**: Термометр ресурса, графики

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
</svg>
```

**Lucide**: `Activity`

---

#### Compass (Навигатор)
**Использование**: Навигатор состояния, ориентация

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
</svg>
```

**Lucide**: `Compass`

---

#### Sparkles (Интерактивы)
**Использование**: Интерактивные упражнения, новое

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
  <path d="M5 3v4"></path>
  <path d="M19 17v4"></path>
  <path d="M3 5h4"></path>
  <path d="M17 19h4"></path>
</svg>
```

**Lucide**: `Sparkles`

---

#### Lock (Безопасность)
**Использование**: Конфиденциальность, приватность

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>
```

**Lucide**: `Lock`

---

#### Shield Check (Доверие)
**Использование**: Безопасность, защита данных

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  <polyline points="9 12 11 14 15 10"></polyline>
</svg>
```

**Lucide**: `ShieldCheck`

---

## Использование

### HTML/CSS

```html
<!-- Inline SVG -->
<button class="btn btn-primary">
  <svg class="icon" width="20" height="20" viewBox="0 0 24 24">
    <!-- SVG path -->
  </svg>
  Записаться
</button>

<!-- Icon wrapper -->
<span class="icon-wrapper">
  <svg class="icon">...</svg>
</span>
```

```css
.icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon--sm { width: 16px; height: 16px; stroke-width: 1.5; }
.icon--md { width: 24px; height: 24px; }
.icon--lg { width: 32px; height: 32px; }
.icon--xl { width: 40px; height: 40px; }
```

### React

```tsx
import { Heart, Calendar, ArrowRight } from 'lucide-react';

// Basic usage
<Heart size={24} />

// With color
<Heart size={24} color="var(--color-sage-500)" />

// With custom class
<Heart size={24} className="icon-favorite" />

// In button
<button className="btn btn-primary">
  Записаться
  <ArrowRight size={20} />
</button>
```

### Accessibility

```tsx
// Decorative icon (screen readers ignore)
<Heart aria-hidden="true" />

// Icon with label
<button aria-label="Добавить в избранное">
  <Heart size={24} />
</button>

// Icon with text
<button>
  <Heart size={20} />
  <span>Избранное</span>
</button>
```

---

## Кастомные иконки

### Создание кастомной иконки

Если нужна иконка, которой нет в библиотеке:

1. **Создайте в Figma/Illustrator**:
   - Canvas 24x24px
   - Stroke 2px, rounded caps/joins
   - Экспорт в SVG

2. **Оптимизируйте**:
   - Используйте [SVGOMG](https://jakearchibald.github.io/svgomg/)
   - Удалите лишние атрибуты
   - Используйте `currentColor`

3. **Пример кастомной иконки**:

```svg
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <title>Дневник эмоций</title>
  <path
    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M8 8h8M8 12h8M8 16h4"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>
```

### React компонент для кастомной иконки

```tsx
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const DiaryIcon = ({ size = 24, color = 'currentColor', className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Дневник эмоций</title>
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* остальные paths */}
  </svg>
);
```

---

## Чеклист использования иконок

- [ ] Иконка имеет правильный размер (минимум 16px для просмотра, 24px для интерактива)
- [ ] Используется `currentColor` для гибкости
- [ ] Добавлена доступность (aria-label или aria-hidden)
- [ ] Консистентный стиль (outline, 2px stroke, rounded)
- [ ] SVG оптимизирован (удалены лишние атрибуты)
- [ ] Иконка читаема на всех фонах
- [ ] Есть hover/focus состояния для интерактивных иконок

---

## Связанные документы

- [UI Kit / Design System](../UI-Kit-Design-System.md)
- [Components Detailed](./Components-Detailed.md)
- [Accessibility Checklist](./Accessibility-Checklist.md)

**Версия документа**: 1.0  
**Последнее обновление**: 9 января 2026  

**Библиотеки**:
- [Lucide Icons](https://lucide.dev/) (рекомендуется)
- [Heroicons](https://heroicons.com/)
- [Phosphor Icons](https://phosphoricons.com/)
