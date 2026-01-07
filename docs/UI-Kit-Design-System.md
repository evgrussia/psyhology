# UI Kit / Design System — «Эмоциональный баланс»

**Версия**: v1.0  
**Дата создания**: 7 января 2026  
**Статус**: Основной документ дизайн-системы  
**Основа**: Анализ референса Q Psychology + требования проекта из PRD и Vision

---

## 📐 Содержание

1. [Философия дизайна](#1-философия-дизайна)
2. [Design Tokens](#2-design-tokens)
3. [Типографика](#3-типографика)
4. [Цветовая система](#4-цветовая-система)
5. [Spacing и Layout](#5-spacing-и-layout)
6. [Компоненты UI](#6-компоненты-ui)
7. [Анимации и микро-взаимодействия](#7-анимации-и-микро-взаимодействия)
8. [Иконография](#8-иконография)
9. [Иллюстрации и графика](#9-иллюстрации-и-графика)
10. [Accessibility](#10-accessibility)
11. [Responsive Guidelines](#11-responsive-guidelines)
12. [Чеклист применения](#12-чеклист-применения)

---

## 1. Философия дизайна

### 1.1 Ключевые принципы

**🤝 Эмпатия и безопасность**
- Дизайн должен создавать ощущение заботы, не давления
- Мягкие формы, тёплые цвета, достаточно "воздуха"
- Никакой агрессивной типографики или кричащих CTA

**🎯 Ясность и простота**
- Пользователь должен понимать "что дальше" за 3 секунды
- Минимум когнитивной нагрузки
- Четкая иерархия информации

**✨ Профессионализм с теплотой**
- Не "холодная клиника" и не "детский сад"
- Баланс между профессионализмом и человечностью
- Доверие через внимание к деталям

**♿ Доступность для всех**
- WCAG AA как минимум
- Понятные состояния и обратная связь
- Работа с клавиатуры и screen readers

### 1.2 Эмоциональный профиль

```
Спокойствие    ████████████░░░░  75%
Тепло          ███████████████░  90%
Профессионализм ████████████░░░░  70%
Современность  ██████████████░░  80%
Игривость      ████░░░░░░░░░░░░  25%
```

---

## 2. Design Tokens

### 2.1 Цветовая палитра

#### Основные цвета бренда

```css
/* === SAGE GREEN PALETTE (основа) === */
--color-sage-900: #1A3330;      /* Самый тёмный - текст на светлом */
--color-sage-800: #234540;      /* Тёмный акцент */
--color-sage-700: #2C5850;      /* Основной тёмный */
--color-sage-600: #3D7369;      /* Средний тёмный */
--color-sage-500: #4E8E82;      /* Базовый sage */
--color-sage-400: #6FA99C;      /* Светлый sage */
--color-sage-300: #90C4B6;      /* Очень светлый */
--color-sage-200: #B8DDD2;      /* Пастельный */
--color-sage-100: #D9EFE8;      /* Почти белый с оттенком */
--color-sage-50: #F0F9F6;       /* Фоновый светлый */

/* === WARM NEUTRALS (тёплые нейтральные) === */
--color-sand-900: #3A3530;      /* Почти чёрный с теплотой */
--color-sand-800: #54504A;      /* Тёмно-серый тёплый */
--color-sand-700: #6D6860;      /* Средний серый */
--color-sand-600: #87827A;      /* Приглушённый серый */
--color-sand-500: #A19C94;      /* Базовый песочный серый */
--color-sand-400: #BBB6AE;      /* Светлый серый */
--color-sand-300: #D5D0C8;      /* Очень светлый */
--color-sand-200: #E8E5DF;      /* Пастельный песочный */
--color-sand-100: #F4F2ED;      /* Светлый крем */
--color-sand-50: #FAF8F4;       /* Основной фон */

/* === ACCENT COLORS === */
--color-coral-500: #E89B8F;     /* Мягкий коралл - для тёплых акцентов */
--color-coral-400: #F0B3A9;     /* Светлый коралл */
--color-coral-300: #F8D3CC;     /* Пастельный коралл */

--color-terracotta-500: #C97B63; /* Терракота - дополнительный акцент */
--color-terracotta-400: #D99A85; /* Светлая терракота */

--color-lavender-500: #B8A7D9;  /* Мягкая лаванда - для разнообразия */
--color-lavender-400: #CFC2E6;  /* Светлая лаванда */

/* === SEMANTIC COLORS === */
--color-success-500: #5FA17F;   /* Мягкий зелёный успеха */
--color-success-400: #7FB899;   /* Светлый успех */
--color-success-100: #E3F2E9;   /* Фон успеха */

--color-warning-500: #E8A663;   /* Мягкий оранжевый */
--color-warning-400: #F0BE85;   /* Светлый warning */
--color-warning-100: #FBF0E0;   /* Фон warning */

--color-error-500: #D97B7B;     /* Мягкий красный */
--color-error-400: #E59999;     /* Светлый error */
--color-error-100: #F9E6E6;     /* Фон error */

--color-info-500: #7B9FD9;      /* Мягкий синий */
--color-info-400: #99B6E5;      /* Светлый info */
--color-info-100: #E6EFF9;      /* Фон info */
```

#### Применение цветов

```css
/* === TEXT COLORS === */
--color-text-primary: var(--color-sage-900);
--color-text-secondary: var(--color-sage-600);
--color-text-tertiary: var(--color-sand-600);
--color-text-disabled: var(--color-sand-400);
--color-text-on-dark: var(--color-sand-50);
--color-text-on-sage: var(--color-sand-50);

/* === BACKGROUND COLORS === */
--color-bg-primary: var(--color-sand-50);
--color-bg-secondary: var(--color-sand-100);
--color-bg-tertiary: var(--color-sage-50);
--color-bg-sage: var(--color-sage-700);
--color-bg-sage-light: var(--color-sage-100);
--color-bg-overlay: rgba(26, 51, 48, 0.85);

/* === BORDER COLORS === */
--color-border-primary: var(--color-sand-300);
--color-border-secondary: var(--color-sage-200);
--color-border-focus: var(--color-sage-500);
--color-border-error: var(--color-error-500);

/* === INTERACTIVE COLORS === */
--color-interactive-primary: var(--color-sage-500);
--color-interactive-primary-hover: var(--color-sage-600);
--color-interactive-primary-active: var(--color-sage-700);
--color-interactive-secondary: var(--color-coral-500);
--color-interactive-secondary-hover: var(--color-coral-400);
```

### 2.2 Shadows

```css
/* Мягкие, естественные тени */
--shadow-xs: 0 1px 2px rgba(26, 51, 48, 0.04);
--shadow-sm: 0 2px 6px rgba(26, 51, 48, 0.06);
--shadow-md: 0 4px 12px rgba(26, 51, 48, 0.08);
--shadow-lg: 0 8px 20px rgba(26, 51, 48, 0.1);
--shadow-xl: 0 12px 28px rgba(26, 51, 48, 0.12);
--shadow-2xl: 0 20px 40px rgba(26, 51, 48, 0.14);

/* Специальные тени */
--shadow-inner: inset 0 2px 4px rgba(26, 51, 48, 0.04);
--shadow-focus: 0 0 0 3px rgba(78, 142, 130, 0.2);
```

### 2.3 Border Radius

```css
/* Мягкие скругления для эмпатичного дизайна */
--radius-xs: 4px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-2xl: 32px;
--radius-pill: 9999px;
--radius-circle: 50%;
```

### 2.4 Transitions

```css
/* Плавные, естественные переходы */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 400ms;
--duration-slower: 600ms;

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

---

## 3. Типографика

### 3.1 Font Stack

```css
/* Основной шрифт - гуманистичный sans-serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* Заголовки - современный, читаемый serif */
--font-display: 'Lora', 'Georgia', 'Times New Roman', serif;

/* Моноширинный для кода/данных */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Альтернативы шрифтов (если Inter/Lora недоступны):**
- Primary: Work Sans, DM Sans, Plus Jakarta Sans
- Display: Gupter, Playfair Display, Cormorant

### 3.2 Type Scale

```css
/* Адаптивная типографическая шкала */
--font-size-xs: 12px;           /* Мелкий текст, метки */
--font-size-sm: 14px;           /* Вторичный текст */
--font-size-base: 16px;         /* Основной body */
--font-size-lg: 18px;           /* Увеличенный body */
--font-size-xl: 20px;           /* Крупный body */
--font-size-2xl: 24px;          /* H4 */
--font-size-3xl: 28px;          /* H3 */
--font-size-4xl: 32px;          /* H2 */
--font-size-5xl: 40px;          /* H1 */
--font-size-6xl: 48px;          /* Display Large */
--font-size-7xl: 56px;          /* Hero Small */
--font-size-8xl: 64px;          /* Hero */
--font-size-9xl: 72px;          /* Hero Large */

/* Responsive с clamp */
--font-size-hero: clamp(48px, 6vw, 72px);
--font-size-display: clamp(32px, 4vw, 48px);
--font-size-h1: clamp(28px, 3.5vw, 40px);
--font-size-h2: clamp(24px, 3vw, 32px);
--font-size-h3: clamp(20px, 2.5vw, 28px);
```

### 3.3 Font Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.4 Line Heights

```css
--line-height-tight: 1.1;       /* Hero, крупные заголовки */
--line-height-snug: 1.3;        /* Заголовки */
--line-height-normal: 1.5;      /* Body текст */
--line-height-relaxed: 1.7;     /* Комфортное чтение */
--line-height-loose: 2;         /* Очень просторный текст */
```

### 3.5 Letter Spacing

```css
--letter-spacing-tighter: -0.03em;
--letter-spacing-tight: -0.015em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### 3.6 Типографические стили

```css
/* Hero */
.text-hero {
  font-family: var(--font-display);
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-text-primary);
}

/* Display */
.text-display {
  font-family: var(--font-display);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  letter-spacing: var(--letter-spacing-tight);
}

/* H1-H4 */
.text-h1 { 
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

.text-h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

.text-h3 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

.text-h4 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

/* Body */
.text-body-lg {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

.text-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.text-body-sm {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

/* Utility */
.text-caption {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
```

---

## 4. Цветовая система

### 4.1 Семантическое использование

**Фоны страниц:**
- Основные страницы: `--color-sand-50` (тёплый белый)
- Альтернативные секции: `--color-sage-50` (мятный светлый)
- Тёмные секции: `--color-sage-700` (глубокий sage)
- Карточки/модули: `white` с тенью

**Текст:**
- Основной: `--color-sage-900` (максимальный контраст)
- Вторичный: `--color-sage-600` (меньший акцент)
- Tertiary: `--color-sand-600` (вспомогательный)
- На тёмном: `--color-sand-50`

**Интерактивные элементы:**
- Primary CTA: `--color-sage-500` → hover `--color-sage-600`
- Secondary CTA: outline с `--color-sage-500`
- Accent CTA: `--color-coral-500`
- Ссылки: `--color-sage-600` с underline

**Состояния:**
- Success: мягкий зелёный `--color-success-500`
- Warning: мягкий оранжевый `--color-warning-500`
- Error: мягкий красный `--color-error-500`
- Info: мягкий синий `--color-info-500`

### 4.2 Контрастность (WCAG AA)

Все комбинации текста и фона должны иметь контраст:
- Обычный текст: минимум **4.5:1**
- Крупный текст (18px+): минимум **3:1**
- UI-элементы: минимум **3:1**

### 4.3 Цветовые комбинации (готовые палитры)

**Спокойствие (по умолчанию):**
```
Фон: sand-50 (#FAF8F4)
Текст: sage-900 (#1A3330)
Акцент: sage-500 (#4E8E82)
```

**Тепло и поддержка:**
```
Фон: coral-300 (#F8D3CC)
Текст: sand-900 (#3A3530)
Акцент: coral-500 (#E89B8F)
```

**Доверие и профессионализм:**
```
Фон: sage-700 (#2C5850)
Текст: sand-50 (#FAF8F4)
Акцент: sage-300 (#90C4B6)
```

---

## 5. Spacing и Layout

### 5.1 Spacing Scale (8px grid)

```css
--space-0: 0;
--space-1: 4px;     /* 0.25rem */
--space-2: 8px;     /* 0.5rem */
--space-3: 12px;    /* 0.75rem */
--space-4: 16px;    /* 1rem */
--space-5: 20px;    /* 1.25rem */
--space-6: 24px;    /* 1.5rem */
--space-8: 32px;    /* 2rem */
--space-10: 40px;   /* 2.5rem */
--space-12: 48px;   /* 3rem */
--space-16: 64px;   /* 4rem */
--space-20: 80px;   /* 5rem */
--space-24: 96px;   /* 6rem */
--space-32: 128px;  /* 8rem */
--space-40: 160px;  /* 10rem */
--space-48: 192px;  /* 12rem */
```

### 5.2 Layout Containers

```css
--container-xs: 480px;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1440px;

/* Основной контейнер контента */
--container-max: 1280px;
--container-padding: var(--space-6);
--container-padding-mobile: var(--space-4);
```

### 5.3 Grid System

```css
/* 12-колоночная сетка */
--grid-columns: 12;
--grid-gap: var(--space-6);
--grid-gap-mobile: var(--space-4);
```

---

## 6. Компоненты UI

### 6.1 Buttons

#### Primary Button (основная CTA)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: white;
  background: var(--color-sage-500);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-primary:hover {
  background: var(--color-sage-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.btn-primary:disabled {
  background: var(--color-sand-300);
  color: var(--color-sand-600);
  cursor: not-allowed;
  transform: none;
}
```

#### Pill Button (фирменная кнопка-пилюля)

```css
.btn-pill {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: var(--color-sage-200);
  border-radius: var(--radius-pill);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-pill:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-pill__text {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-sage-900);
  transition: color var(--duration-normal) ease;
}

.btn-pill__icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-sage-700);
  border-radius: var(--radius-circle);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-pill:hover .btn-pill__icon {
  background: var(--color-sage-600);
  transform: scale(1.05);
}

.btn-pill__icon svg {
  width: 20px;
  height: 20px;
  color: white;
  transition: transform var(--duration-normal) var(--ease-out);
}

.btn-pill:hover .btn-pill__icon svg {
  transform: translateX(3px);
}
```

#### Secondary/Outline Button

```css
.btn-secondary {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-sage-700);
  background: transparent;
  border: 2px solid var(--color-sage-500);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-secondary:hover {
  background: var(--color-sage-500);
  color: white;
}
```

#### Ghost Button

```css
.btn-ghost {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-sage-600);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.btn-ghost:hover {
  background: var(--color-sage-100);
  color: var(--color-sage-700);
}
```

#### Size Variants

```css
/* Small */
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

/* Large */
.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}
```

### 6.2 Cards

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card--interactive {
  cursor: pointer;
}

.card--flat {
  background: var(--color-sand-100);
  box-shadow: none;
}

.card__header {
  margin-bottom: var(--space-4);
}

.card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-sage-900);
  margin-bottom: var(--space-2);
}

.card__body {
  color: var(--color-sage-700);
  line-height: var(--line-height-relaxed);
}

.card__footer {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-primary);
}
```

### 6.3 Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background: white;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;
}

.input:hover {
  border-color: var(--color-sage-400);
}

.input:focus {
  outline: none;
  border-color: var(--color-sage-500);
  box-shadow: var(--shadow-focus);
}

.input::placeholder {
  color: var(--color-sand-500);
}

.input:disabled {
  background: var(--color-sand-100);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.input--error {
  border-color: var(--color-error-500);
}

.input--success {
  border-color: var(--color-success-500);
}
```

### 6.4 Badges/Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-pill);
}

.badge--sage {
  background: var(--color-sage-100);
  color: var(--color-sage-700);
}

.badge--coral {
  background: var(--color-coral-300);
  color: var(--color-sand-900);
}

.badge--success {
  background: var(--color-success-100);
  color: var(--color-success-500);
}
```

### 6.5 Accordion

```css
.accordion {
  border-bottom: 1px solid var(--color-border-primary);
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  transition: color var(--duration-fast) ease;
}

.accordion__trigger:hover {
  color: var(--color-sage-600);
}

.accordion__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-circle);
  border: 1px solid var(--color-border-primary);
  font-size: 20px;
  font-weight: var(--font-weight-light);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.accordion[data-state="open"] .accordion__icon {
  transform: rotate(45deg);
}

.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.accordion[data-state="open"] .accordion__content {
  grid-template-rows: 1fr;
}

.accordion__inner {
  min-height: 0;
  padding-bottom: var(--space-5);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}
```

### 6.6 Progress Indicators

```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--color-sage-100);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: var(--color-sage-500);
  border-radius: var(--radius-pill);
  transition: width var(--duration-slow) var(--ease-out);
}

/* Step Progress */
.steps {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.step {
  flex: 1;
  height: 4px;
  background: var(--color-sage-100);
  border-radius: var(--radius-pill);
  transition: background var(--duration-normal) ease;
}

.step--active,
.step--complete {
  background: var(--color-sage-500);
}
```

### 6.7 Sliders (Range Inputs) — для “термометра ресурса”

```css
.slider {
  width: 100%;
  appearance: none;
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--color-sage-100);
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-circle);
  background: var(--color-sage-500);
  box-shadow: var(--shadow-sm);
  border: 2px solid white;
  cursor: pointer;
}

.slider:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--shadow-focus);
}

.slider__labels {
  margin-top: var(--space-2);
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
```

Рекомендации:
- по умолчанию 3 “якоря” (низко/средне/высоко) вместо “точных” чисел;
- на мобилке — увеличенный hit area (минимум 44px).

### 6.8 Segmented Control / Chips — для выбора сценариев/шагов

```css
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-secondary);
  background: white;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.chip:hover {
  background: var(--color-sage-50);
  border-color: var(--color-sage-300);
}

.chip[aria-pressed="true"] {
  background: var(--color-sage-100);
  border-color: var(--color-sage-500);
}
```

### 6.9 Timer Controls — для мини‑ритуалов (2–5 минут)

```css
.timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-sand-100);
  border: 1px solid var(--color-border-primary);
}

.timer__time {
  font-family: var(--font-mono);
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
}

.timer__actions {
  display: flex;
  gap: var(--space-2);
}
```

### 6.10 Toast / Inline feedback (Скопировано / Сохранено)

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  max-width: 560px;
  width: calc(100% - 2 * var(--space-6));
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  background: rgba(26, 51, 48, 0.92); /* sage-900 overlay */
  color: var(--color-text-on-dark);
  box-shadow: var(--shadow-lg);
}
```

Правила:
- коротко (1 строка), без “маркетинга”: «Скопировано.» / «Сохранено.»
- авто‑скрытие 2–4 секунды + доступность (`role="status"`).

### 6.11 Favorite (❤) — “избранное/аптечка”

```css
.favorite {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-circle);
  border: 1px solid var(--color-border-primary);
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.favorite:hover {
  background: var(--color-sand-100);
}

.favorite[aria-pressed="true"] {
  background: var(--color-coral-300);
  border-color: var(--color-coral-500);
}
```

---

## 7. Анимации и микро-взаимодействия

### 7.1 Hover Effects

```css
/* Lift effect */
.hover-lift {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Scale effect */
.hover-scale {
  transition: transform var(--duration-fast) var(--ease-out);
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Glow effect */
.hover-glow {
  transition: box-shadow var(--duration-normal) ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(78, 142, 130, 0.3);
}
```

### 7.2 Keyframe Animations

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Breathing */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}
```

### 7.3 Loading States

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-sand-200) 25%,
    var(--color-sand-100) 50%,
    var(--color-sand-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-sage-200);
  border-top-color: var(--color-sage-500);
  border-radius: var(--radius-circle);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 8. Иконография

### 8.1 Стиль иконок

- **Стиль**: Outline (контурные), не filled
- **Толщина линии**: 2px (1.5px для мелких иконок)
- **Скругления**: Rounded (мягкие углы)
- **Размеры**: 16px, 20px, 24px, 32px, 40px

### 8.2 Библиотека иконок

**Рекомендуемые наборы:**
- Lucide Icons (основной выбор)
- Heroicons (альтернатива)
- Phosphor Icons

### 8.3 Ключевые иконки проекта

```
✓ check-circle - успех, подтверждение
⚠ alert-circle - предупреждение
× x-circle - ошибка, закрытие
ℹ info - информация
→ arrow-right - навигация вперёд
← arrow-left - назад
↓ chevron-down - раскрытие
↑ chevron-up - сворачивание
+ plus - добавить, раскрыть
☰ menu - меню
🔍 search - поиск
👤 user - профиль
📅 calendar - запись
💬 message - сообщение
❤ heart - избранное, лайк
📊 chart - аналитика
⚙ settings - настройки
🏠 home - главная
📄 file - документ
🔒 lock - безопасность
```

---

## 9. Иллюстрации и графика

### 9.1 Стиль иллюстраций

**Характеристики:**
- Мягкие, органические формы
- Палитра из дизайн-системы (sage, sand, coral)
- Минимум деталей, фокус на эмоции
- Абстракция, не реалистичность
- Нет чёрных контуров (только цветные)

### 9.2 Типы графики

**Hero Images:**
- Атмосферные фотографии с людьми
- Мягкий фокус, естественное освещение
- Приглушённые, тёплые тона
- Overlay для читаемости текста

**Spot Illustrations:**
- Малые иллюстрации для разделов
- 200-400px размер
- 2-3 цвета максимум
- Простые, понятные метафоры

**Background Patterns:**
- Очень тонкие, едва заметные
- Органические формы (волны, круги)
- Opacity 3-5%
- Не отвлекают от контента

### 9.3 Prompt-шаблоны для генерации

См. отдельный документ: [Image-Generation-Prompts.md](./design-system/Image-Generation-Prompts.md)

---

## 10. Accessibility

### 10.1 Контрастность

- Весь текст соответствует WCAG AA (4.5:1)
- Интерактивные элементы: минимум 3:1
- Тестировать инструментами: WebAIM Contrast Checker

### 10.2 Focus States

```css
*:focus-visible {
  outline: 3px solid var(--color-sage-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Убрать для mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### 10.3 Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 10.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 11. Responsive Guidelines

### 11.1 Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Landscape phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large */
```

### 11.2 Touch Targets

- Минимум 44x44px для всех интерактивных элементов
- Расстояние между кнопками минимум 8px
- Увеличенный padding на мобильных

### 11.3 Typography Scale

Mobile: уменьшение на 10-20%
```css
@media (max-width: 768px) {
  :root {
    --font-size-hero: 48px;
    --font-size-display: 32px;
    --font-size-h1: 28px;
    --font-size-h2: 24px;
  }
}
```

---

## 12. Чеклист применения

### При создании нового компонента:

- [ ] Использованы токены цвета (не хардкод)
- [ ] Применены правильные spacing из scale
- [ ] Типографика из системы
- [ ] Есть все состояния (hover, focus, active, disabled)
- [ ] Focus state соответствует стандарту
- [ ] Контрастность проверена (WCAG AA)
- [ ] Работает с клавиатуры
- [ ] Адаптивен на мобильных
- [ ] Touch targets минимум 44x44px
- [ ] Учтён prefers-reduced-motion
- [ ] Добавлены aria-атрибуты где нужно

### При создании страницы:

- [ ] Общий тон страницы соответствует эмоциональному профилю
- [ ] Правильная иерархия заголовков (H1 → H2 → H3)
- [ ] Достаточно "воздуха" между секциями
- [ ] CTA чёткие и не агрессивные
- [ ] Есть обратная связь для всех действий
- [ ] Loading states для async операций
- [ ] Error states с понятными сообщениями
- [ ] Empty states с рекомендациями

---

**Версия документа**: 1.0  
**Последнее обновление**: 7 января 2026  
**Ответственный**: Design System Team

**Связанные документы:**
- [Image Generation Prompts](./design-system/Image-Generation-Prompts.md)
- [Component Library](./design-system/Components-Detailed.md)
- [Icons Reference](./design-system/Icons.md)
- [Q Psychology Design Spec](./generated/frontend/QPsychology-Complete-Design-Specification.md)
