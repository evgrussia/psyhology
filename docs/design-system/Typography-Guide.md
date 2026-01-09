# Расширенное руководство по типографике — «Эмоциональный баланс»

**Версия**: 1.0  
**Дата создания**: 9 января 2026  
**Статус**: Полное руководство по типографической системе

---

## 📋 Содержание

1. [Философия типографики](#философия-типографики)
2. [Шрифтовые пары](#шрифтовые-пары)
3. [Типографическая шкала](#типографическая-шкала)
4. [Стили текста](#стили-текста)
5. [Иерархия и ритм](#иерархия-и-ритм)
6. [Читаемость и доступность](#читаемость-и-доступность)
7. [Адаптивная типографика](#адаптивная-типографика)
8. [Примеры использования](#примеры-использования)
9. [Типографические правила](#типографические-правила)

---

## Философия типографики

### Ключевые принципы

**1. Читаемость превыше всего**
- Комфортное чтение — главный приоритет
- Оптимальная длина строки: 60-75 символов
- Достаточная высота строки для релаксации

**2. Эмоциональный тон**
- Serif (Lora) для заголовков — теплота и доверие
- Sans-serif (Inter) для текста — современность и ясность
- Баланс между профессионализмом и человечностью

**3. Иерархия и контраст**
- Четкое различие между уровнями заголовков
- Контраст размеров создает визуальную структуру
- Consistent vertical rhythm

---

## Шрифтовые пары

### Primary Font: Inter

**Характеристики:**
- Гуманистичный sans-serif
- Отличная читаемость на экранах
- Широкий диапазон начертаний (300-700)
- Поддержка кириллицы

**Использование:**
- Body текст (основной контент)
- UI элементы (кнопки, формы)
- Навигация
- Лиды и подзаголовки

**Загрузка:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**CSS:**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

---

### Display Font: Lora

**Характеристики:**
- Современный serif с каллиграфическими элементами
- Теплый, читаемый на экранах
- Хорошо работает в крупных размерах
- Поддержка кириллицы

**Использование:**
- Hero заголовки (H1)
- Display заголовки
- Акцентные заголовки (H2)
- Цитаты и выделения

**Загрузка:**
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap" rel="stylesheet">
```

**CSS:**
```css
--font-display: 'Lora', 'Georgia', 'Times New Roman', serif;
```

---

### Monospace Font: JetBrains Mono

**Характеристики:**
- Четкий monospace для кода
- Только для технических элементов
- Редко используется в интерфейсе

**Использование:**
- Таймеры (время 00:00)
- Технические данные
- Редко: ID, коды

**CSS:**
```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

---

## Типографическая шкала

### Base Scale (Desktop)

```css
:root {
  /* Small text */
  --font-size-xs: 12px;    /* 0.75rem - Мелкие метки, timestamps */
  --font-size-sm: 14px;    /* 0.875rem - Вторичный текст, подписи */
  
  /* Body text */
  --font-size-base: 16px;  /* 1rem - Основной body текст */
  --font-size-lg: 18px;    /* 1.125rem - Увеличенный body, лиды */
  --font-size-xl: 20px;    /* 1.25rem - Крупный body */
  
  /* Headings */
  --font-size-2xl: 24px;   /* 1.5rem - H4 */
  --font-size-3xl: 28px;   /* 1.75rem - H3 */
  --font-size-4xl: 32px;   /* 2rem - H2 */
  --font-size-5xl: 40px;   /* 2.5rem - H1 */
  
  /* Display */
  --font-size-6xl: 48px;   /* 3rem - Display Large */
  --font-size-7xl: 56px;   /* 3.5rem - Hero Small */
  --font-size-8xl: 64px;   /* 4rem - Hero */
  --font-size-9xl: 72px;   /* 4.5rem - Hero Large */
}
```

### Responsive Scale

```css
/* Адаптивные размеры с clamp */
:root {
  --font-size-hero: clamp(48px, 6vw, 72px);
  --font-size-display: clamp(32px, 4vw, 48px);
  --font-size-h1: clamp(28px, 3.5vw, 40px);
  --font-size-h2: clamp(24px, 3vw, 32px);
  --font-size-h3: clamp(20px, 2.5vw, 28px);
  --font-size-h4: clamp(18px, 2vw, 24px);
}
```

### Mobile Adjustments

```css
@media (max-width: 768px) {
  :root {
    /* Slightly smaller on mobile */
    --font-size-base: 16px;  /* Keep base 16px for accessibility */
    --font-size-hero: 48px;
    --font-size-display: 32px;
    --font-size-h1: 28px;
    --font-size-h2: 24px;
    --font-size-h3: 20px;
    --font-size-h4: 18px;
  }
}
```

---

## Стили текста

### Hero

**Использование**: Главные заголовки страниц

```css
.text-hero {
  font-family: var(--font-display);
  font-size: var(--font-size-hero);
  font-weight: 400; /* Regular для Lora выглядит достаточно жирно */
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
}
```

**HTML:**
```html
<h1 class="text-hero">
  Найдите опору в себе
</h1>
```

---

### Display

**Использование**: Крупные секционные заголовки

```css
.text-display {
  font-family: var(--font-display);
  font-size: var(--font-size-display);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--color-text-primary);
}
```

---

### H1 - H4

```css
/* H1 */
.text-h1,
h1 {
  font-family: var(--font-display);
  font-size: var(--font-size-h1);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
}

/* H2 */
.text-h2,
h2 {
  font-family: var(--font-display);
  font-size: var(--font-size-h2);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
}

/* H3 */
.text-h3,
h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-h3);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
}

/* H4 */
.text-h4,
h4 {
  font-family: var(--font-primary);
  font-size: var(--font-size-h4);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}
```

---

### Body Text

```css
/* Large body (лиды, важный текст) */
.text-body-lg {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0;
  color: var(--color-text-primary);
}

/* Base body (основной текст) */
.text-body,
p {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
}

/* Small body (вторичный текст) */
.text-body-sm {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--color-text-secondary);
}
```

---

### Utility Styles

```css
/* Lead (вводный параграф) */
.text-lead {
  font-size: var(--font-size-xl);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-text-primary);
}

/* Caption (подписи к изображениям) */
.text-caption {
  font-size: var(--font-size-xs);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Overline (метки над заголовками) */
.text-overline {
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-sage-600);
}

/* Quote */
.text-quote {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 400;
  line-height: 1.6;
  font-style: italic;
  color: var(--color-text-primary);
}
```

---

## Иерархия и ритм

### Vertical Rhythm

**Базовая единица**: 8px (0.5rem)

```css
:root {
  --rhythm-base: 8px;
  
  /* Spacing между элементами */
  --rhythm-tight: calc(var(--rhythm-base) * 1);   /* 8px */
  --rhythm-normal: calc(var(--rhythm-base) * 2);  /* 16px */
  --rhythm-relaxed: calc(var(--rhythm-base) * 3); /* 24px */
  --rhythm-loose: calc(var(--rhythm-base) * 4);   /* 32px */
}
```

### Типографическая иерархия

**Уровень 1 (Hero/Display):**
- Используется 1 раз на странице
- Максимальный visual weight
- Четкое сообщение/заголовок

**Уровень 2 (H1):**
- Заголовок основной секции
- 1-2 раза на странице
- Вторичная иерархия

**Уровень 3 (H2):**
- Подсекции
- Несколько раз на странице
- Структурирует контент

**Уровень 4 (H3, H4):**
- Мелкие блоки
- Часто встречаются
- Минимальный контраст с body

**Уровень 5 (Body):**
- Основной контент
- Параграфы, списки

---

## Читаемость и доступность

### Оптимальные параметры

**Длина строки:**
```css
.content-width {
  max-width: 65ch; /* ~65 символов - оптимально для чтения */
}

.content-width-narrow {
  max-width: 50ch; /* Для коротких форм */
}

.content-width-wide {
  max-width: 80ch; /* Для табличных данных */
}
```

**Высота строки:**
```css
:root {
  --line-height-tight: 1.1;     /* Hero, крупные заголовки */
  --line-height-snug: 1.3;      /* Заголовки H1-H2 */
  --line-height-normal: 1.5;    /* UI элементы, короткий текст */
  --line-height-relaxed: 1.7;   /* Body текст для чтения */
  --line-height-loose: 2;       /* Очень просторный текст */
}
```

**Контрастность:**
```css
/* WCAG AA compliance */
:root {
  --color-text-primary: var(--color-sage-900);      /* Контраст 12.5:1 на white */
  --color-text-secondary: var(--color-sage-600);    /* Контраст 5.2:1 на white */
  --color-text-tertiary: var(--color-sand-600);     /* Контраст 4.6:1 на white */
}

/* Минимум для обычного текста: 4.5:1 */
/* Минимум для крупного текста (18px+): 3:1 */
```

### Letter Spacing

```css
:root {
  /* Отрицательные для крупного текста */
  --letter-spacing-tighter: -0.03em;  /* Hero */
  --letter-spacing-tight: -0.015em;   /* Display, H1, H2 */
  
  /* Нормальный */
  --letter-spacing-normal: 0;         /* Body, H3, H4 */
  
  /* Положительные для мелкого/uppercase */
  --letter-spacing-wide: 0.025em;     /* Кнопки, метки */
  --letter-spacing-wider: 0.05em;     /* Caption */
  --letter-spacing-widest: 0.1em;     /* Overline, uppercase */
}
```

---

## Адаптивная типографика

### Mobile-First Approach

```css
/* Base (Mobile 320px+) */
body {
  font-size: 16px;
  line-height: 1.6;
}

h1 {
  font-size: 28px;
  line-height: 1.2;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  h1 {
    font-size: 36px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  h1 {
    font-size: 40px;
  }
}
```

### Fluid Typography (clamp)

**Преимущества:**
- Плавное масштабирование между breakpoints
- Меньше media queries
- Лучший UX на всех размерах экрана

```css
.text-hero {
  /* min: 48px, preferred: 6vw, max: 72px */
  font-size: clamp(48px, 6vw, 72px);
}

.text-h1 {
  font-size: clamp(28px, 3.5vw, 40px);
}

.text-h2 {
  font-size: clamp(24px, 3vw, 32px);
}

.text-body-lg {
  font-size: clamp(16px, 1.8vw, 18px);
}
```

### Viewport Units

```css
/* Hero с viewport height */
.hero-title {
  font-size: min(10vw, 72px); /* Не больше 72px */
}

/* Адаптивный spacing */
.section {
  padding: clamp(2rem, 5vw, 6rem) 0;
}
```

---

## Примеры использования

### Hero секция

```html
<section class="hero">
  <span class="text-overline">Онлайн психотерапия</span>
  <h1 class="text-hero">
    Найдите опору<br>в себе
  </h1>
  <p class="text-lead">
    Профессиональная психологическая помощь в комфортной 
    для вас обстановке — онлайн или очно.
  </p>
</section>
```

```css
.hero {
  max-width: 800px;
  text-align: center;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}

.hero .text-overline {
  margin-bottom: var(--space-3);
}

.hero .text-hero {
  margin-bottom: var(--space-6);
}

.hero .text-lead {
  max-width: 60ch;
  margin: 0 auto;
}
```

---

### Статья/Блог

```html
<article class="article">
  <header class="article__header">
    <span class="text-caption">5 минут на чтение</span>
    <h1 class="text-h1">
      Как работать с тревогой: 5 практических техник
    </h1>
    <p class="text-body-lg">
      Тревога — естественная реакция организма, но иногда она 
      выходит из-под контроля...
    </p>
  </header>
  
  <div class="article__content">
    <h2 class="text-h2">1. Техника "5-4-3-2-1"</h2>
    <p class="text-body">
      Эта техника помогает вернуться в настоящий момент и 
      переключить внимание...
    </p>
    
    <blockquote class="text-quote">
      "Тревога живёт в будущем. Заземление возвращает нас 
      в настоящее."
    </blockquote>
  </div>
</article>
```

```css
.article__header {
  max-width: 65ch;
  margin: 0 auto var(--space-12);
}

.article__content {
  max-width: 65ch;
  margin: 0 auto;
}

.article__content h2 {
  margin-top: var(--space-10);
}

.article__content blockquote {
  margin: var(--space-8) 0;
  padding-left: var(--space-6);
  border-left: 4px solid var(--color-sage-500);
}
```

---

### Карточка

```html
<div class="card">
  <span class="badge badge--sage">7-10 минут</span>
  <h3 class="text-h3">Работа с тревогой</h3>
  <p class="text-body-sm">
    Практические техники для работы с тревожными мыслями 
    и физическими проявлениями тревоги.
  </p>
</div>
```

---

### Форма

```html
<form class="form">
  <div class="form-group">
    <label class="text-body-sm">
      Ваше имя
      <span class="text-caption" style="color: var(--color-error-500)">*</span>
    </label>
    <input type="text" class="input" />
    <span class="text-caption">Только имя, фамилия не обязательна</span>
  </div>
</form>
```

---

## Типографические правила

### Кавычки

**Русский текст:**
- Используйте «ёлочки» для основных кавычек
- „лапки" для вложенных кавычек
- Избегайте "английских" кавычек

**HTML entities:**
```html
&laquo; и &raquo; <!-- «ёлочки» -->
&bdquo; и &ldquo; <!-- „лапки" -->
```

---

### Тире и дефисы

**Дефис (-)**: слово-образование, номера телефонов  
**Среднее тире (–)**: диапазоны (2020–2024)  
**Длинное тире (—)**: в предложениях

**HTML entities:**
```html
- <!-- дефис -->
&ndash; <!-- среднее тире -->
&mdash; <!-- длинное тире -->
```

---

### Пробелы

**Неразрывный пробел (`&nbsp;`)** после:
- Предлогов (в доме, на улице)
- Союзов (а также, и т.д.)
- Инициалов (А. С. Пушкин)
- Перед единицами измерения (100 км, 5 мин)

---

### Списки

```css
/* Маркированный список */
ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-2);
}

ul li::before {
  content: '•';
  position: absolute;
  left: var(--space-3);
  color: var(--color-sage-500);
  font-weight: bold;
}

/* Нумерованный список */
ol {
  counter-reset: item;
  list-style: none;
  padding-left: 0;
}

ol li {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-2);
  counter-increment: item;
}

ol li::before {
  content: counter(item) '.';
  position: absolute;
  left: 0;
  color: var(--color-sage-600);
  font-weight: 600;
}
```

---

### Акцентирование

```css
/* Bold (сильное выделение) */
strong,
.text-strong {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Italic (эмфаза) */
em,
.text-em {
  font-style: italic;
  font-family: var(--font-display);
}

/* Mark (выделение фона) */
mark,
.text-mark {
  background: var(--color-sage-100);
  color: var(--color-sage-900);
  padding: 0 var(--space-1);
  border-radius: var(--radius-xs);
}

/* Link */
a {
  color: var(--color-sage-600);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color var(--duration-fast) ease;
}

a:hover {
  color: var(--color-sage-700);
}
```

---

## Чеклист типографики

### При создании контента:

- [ ] Заголовки имеют четкую иерархию (H1 → H2 → H3)
- [ ] Длина строки 60-75 символов
- [ ] Достаточная высота строки (1.6-1.7 для body)
- [ ] Контрастность минимум 4.5:1 (WCAG AA)
- [ ] Используются правильные кавычки и тире
- [ ] Неразрывные пробелы где нужно
- [ ] Адаптивность на мобильных (16px минимум для body)
- [ ] Semantic HTML (h1-h6, p, ul/ol, blockquote)

### При создании компонента:

- [ ] Используются токены из дизайн-системы
- [ ] Font family, size, weight консистентны
- [ ] Letter spacing применен корректно
- [ ] Vertical rhythm соблюдается
- [ ] Текст читаем на всех фонах
- [ ] Responsive масштабирование настроено

---

## Связанные документы

- [UI Kit / Design System](../UI-Kit-Design-System.md)
- [Components Detailed](./Components-Detailed.md)
- [Accessibility Checklist](./Accessibility-Checklist.md)

**Версия документа**: 1.0  
**Последнее обновление**: 9 января 2026

**Шрифты:**
- [Inter на Google Fonts](https://fonts.google.com/specimen/Inter)
- [Lora на Google Fonts](https://fonts.google.com/specimen/Lora)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
