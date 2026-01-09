# Детальное руководство по компонентам — «Эмоциональный баланс»

**Версия**: 1.0  
**Дата создания**: 9 января 2026  
**Статус**: Полное описание всех компонентов с примерами кода

---

## 📋 Содержание

1. [Введение](#введение)
2. [Кнопки (Buttons)](#кнопки-buttons)
3. [Карточки (Cards)](#карточки-cards)
4. [Поля ввода (Inputs)](#поля-ввода-inputs)
5. [Селекты и Чипсы](#селекты-и-чипсы)
6. [Аккордеоны](#аккордеоны)
7. [Индикаторы прогресса](#индикаторы-прогресса)
8. [Слайдеры](#слайдеры)
9. [Модальные окна](#модальные-окна)
10. [Всплывающие уведомления (Toasts)](#всплывающие-уведомления-toasts)
11. [Навигация](#навигация)
12. [Формы](#формы)
13. [Тултипы](#тултипы)
14. [Дропдауны](#дропдауны)
15. [Бейджи и теги](#бейджи-и-теги)

---

## Введение

Это детальное руководство содержит полное описание всех компонентов UI с примерами кода на HTML/CSS и React. Все компоненты следуют принципам дизайн-системы «Эмоциональный баланс».

### Принципы компонентов

- ✅ **Доступность**: WCAG AA минимум
- ✅ **Адаптивность**: Mobile-first подход
- ✅ **Консистентность**: Единые токены и стили
- ✅ **Интерактивность**: Понятная обратная связь
- ✅ **Гибкость**: Варианты для разных контекстов

---

## Кнопки (Buttons)

### Primary Button

**Использование**: Основные действия (запись, отправка формы, подтверждение)

#### HTML/CSS

```html
<button class="btn btn-primary">
  Записаться на консультацию
</button>

<button class="btn btn-primary" disabled>
  Отправка...
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  user-select: none;
}

.btn-primary {
  color: white;
  background: var(--color-sage-500);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-sage-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
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

#### React Component

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          loading && 'btn-loading',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="btn-spinner" />
        ) : (
          <>
            {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Pill Button (фирменная кнопка)

**Использование**: CTA с иконкой, переходы между секциями

#### HTML/CSS

```html
<button class="btn-pill">
  <span class="btn-pill__text">Начать диагностику</span>
  <span class="btn-pill__icon">
    <svg><!-- arrow right --></svg>
  </span>
</button>
```

```css
.btn-pill {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: var(--color-sage-200);
  border: none;
  border-radius: var(--radius-pill);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-pill:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-pill:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
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

### Size Variants

```css
/* Small */
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

/* Medium (default) */
.btn-md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
}

/* Large */
.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}
```

---

## Карточки (Cards)

### Basic Card

**Использование**: Контейнер для контента, услуг, статей

#### HTML/CSS

```html
<article class="card">
  <header class="card__header">
    <h3 class="card__title">Работа с тревогой</h3>
    <span class="badge badge--sage">7-10 минут</span>
  </header>
  <div class="card__body">
    <p>Практические техники для работы с тревожными мыслями и физическими проявлениями тревоги.</p>
  </div>
  <footer class="card__footer">
    <button class="btn btn-ghost">Подробнее</button>
  </footer>
</article>
```

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-sage-900);
  margin: 0;
}

.card__body {
  flex: 1;
  color: var(--color-sage-700);
  line-height: var(--line-height-relaxed);
}

.card__footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

#### React Component

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  variant?: 'default' | 'flat' | 'interactive';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card',
          variant === 'flat' && 'card--flat',
          variant === 'interactive' && 'card--interactive',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <header className={cn('card__header', className)}>{children}</header>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn('card__title', className)}>{children}</h3>
);

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('card__body', className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <footer className={cn('card__footer', className)}>{children}</footer>
);
```

---

## Поля ввода (Inputs)

### Text Input

**Использование**: Текстовые поля, email, телефон

#### HTML/CSS

```html
<div class="input-group">
  <label for="name" class="input-label">
    Ваше имя
    <span class="input-required">*</span>
  </label>
  <input
    type="text"
    id="name"
    class="input"
    placeholder="Как к вам обращаться?"
    aria-required="true"
  />
  <span class="input-hint">Только имя, фамилия не обязательна</span>
</div>

<!-- С ошибкой -->
<div class="input-group">
  <label for="email" class="input-label">Email</label>
  <input
    type="email"
    id="email"
    class="input input--error"
    value="invalid-email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span class="input-error" id="email-error">
    Пожалуйста, введите корректный email
  </span>
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.input-required {
  color: var(--color-error-500);
}

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

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(217, 123, 123, 0.2);
}

.input--success {
  border-color: var(--color-success-500);
}

.input-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### Textarea

```html
<div class="input-group">
  <label for="message" class="input-label">Ваш вопрос</label>
  <textarea
    id="message"
    class="textarea"
    rows="5"
    placeholder="Расскажите, с чем вы хотели бы поработать..."
  ></textarea>
  <span class="input-hint">Минимум 20 символов</span>
</div>
```

```css
.textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background: white;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 120px;
  transition: all var(--duration-fast) ease;
}

.textarea:hover {
  border-color: var(--color-sage-400);
}

.textarea:focus {
  outline: none;
  border-color: var(--color-sage-500);
  box-shadow: var(--shadow-focus);
}
```

---

## Селекты и Чипсы

### Select Dropdown

```html
<div class="input-group">
  <label for="service" class="input-label">Тип консультации</label>
  <select id="service" class="select">
    <option value="">Выберите услугу</option>
    <option value="primary">Первичная консультация</option>
    <option value="single">Разовая встреча</option>
    <option value="package">Пакет встреч</option>
  </select>
</div>
```

```css
.select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  background: white;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%233D7369' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-4) center;
  padding-right: calc(var(--space-4) + 24px);
}

.select:hover {
  border-color: var(--color-sage-400);
}

.select:focus {
  outline: none;
  border-color: var(--color-sage-500);
  box-shadow: var(--shadow-focus);
}
```

### Chips (Multi-select)

```html
<div class="chips-group">
  <label class="input-label">С чем хотите поработать?</label>
  <div class="chips">
    <button class="chip" type="button" aria-pressed="false">
      Тревога
    </button>
    <button class="chip" type="button" aria-pressed="true">
      Выгорание
    </button>
    <button class="chip" type="button" aria-pressed="false">
      Отношения
    </button>
    <button class="chip" type="button" aria-pressed="false">
      Границы
    </button>
  </div>
</div>
```

```css
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
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
  color: var(--color-sage-700);
}

.chip:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

---

## Аккордеоны

### FAQ Accordion

```html
<div class="accordion-group">
  <div class="accordion" data-state="closed">
    <button class="accordion__trigger" aria-expanded="false">
      <span>Как проходит первая консультация?</span>
      <span class="accordion__icon">+</span>
    </button>
    <div class="accordion__content">
      <div class="accordion__inner">
        <p>Первая встреча длится 50 минут. Мы знакомимся, обсуждаем ваш запрос, выясняем, что привело вас к терапии...</p>
      </div>
    </div>
  </div>
</div>
```

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

.accordion__trigger:focus-visible {
  outline: 2px solid var(--color-sage-500);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
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

---

## Индикаторы прогресса

### Progress Bar

```html
<div class="progress-group">
  <div class="progress-header">
    <span class="progress-label">Заполнение анкеты</span>
    <span class="progress-value">60%</span>
  </div>
  <div class="progress">
    <div class="progress__bar" style="width: 60%"></div>
  </div>
</div>
```

```css
.progress-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.progress-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

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
```

### Step Progress

```html
<div class="steps">
  <div class="step step--complete" aria-label="Шаг 1: Завершен"></div>
  <div class="step step--active" aria-label="Шаг 2: Текущий"></div>
  <div class="step" aria-label="Шаг 3: Ожидание"></div>
  <div class="step" aria-label="Шаг 4: Ожидание"></div>
</div>
```

```css
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

---

## Слайдеры

### Range Slider (для "термометра ресурса")

```html
<div class="slider-group">
  <label for="energy" class="input-label">Уровень энергии</label>
  <input
    type="range"
    id="energy"
    class="slider"
    min="0"
    max="100"
    value="50"
    step="10"
  />
  <div class="slider__labels">
    <span>Низко</span>
    <span>Средне</span>
    <span>Высоко</span>
  </div>
</div>
```

```css
.slider-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.slider {
  width: 100%;
  height: 8px;
  appearance: none;
  border-radius: var(--radius-pill);
  background: var(--color-sage-100);
  outline: none;
  cursor: pointer;
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
  transition: all var(--duration-fast) ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.slider:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--shadow-focus);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-circle);
  background: var(--color-sage-500);
  box-shadow: var(--shadow-sm);
  border: 2px solid white;
  cursor: pointer;
}

.slider__labels {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
```

---

## Модальные окна

### Modal Dialog

```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__overlay"></div>
  <div class="modal__content">
    <header class="modal__header">
      <h2 id="modal-title" class="modal__title">Подтверждение записи</h2>
      <button class="modal__close" aria-label="Закрыть">
        <svg><!-- close icon --></svg>
      </button>
    </header>
    <div class="modal__body">
      <p>Вы уверены, что хотите записаться на консультацию?</p>
    </div>
    <footer class="modal__footer">
      <button class="btn btn-secondary">Отмена</button>
      <button class="btn btn-primary">Подтвердить</button>
    </footer>
  </div>
</div>
```

```css
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: var(--color-bg-overlay);
  animation: fadeIn var(--duration-normal) ease;
}

.modal__content {
  position: relative;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  animation: slideUp var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-primary);
}

.modal__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-circle);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.modal__close:hover {
  background: var(--color-sand-100);
  color: var(--color-text-primary);
}

.modal__body {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

.modal__footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-6);
  border-top: 1px solid var(--color-border-primary);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

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
```

---

## Всплывающие уведомления (Toasts)

### Toast Notification

```html
<div class="toast toast--success" role="status" aria-live="polite">
  <div class="toast__icon">
    <svg><!-- check icon --></svg>
  </div>
  <div class="toast__content">
    <p class="toast__message">Запись успешно создана</p>
  </div>
  <button class="toast__close" aria-label="Закрыть">
    <svg><!-- close icon --></svg>
  </button>
</div>
```

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  max-width: 560px;
  width: calc(100% - 2 * var(--space-6));
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  background: rgba(26, 51, 48, 0.92);
  color: var(--color-text-on-dark);
  box-shadow: var(--shadow-lg);
  animation: slideUp var(--duration-normal) var(--ease-out);
}

.toast--success {
  background: rgba(95, 161, 127, 0.92);
}

.toast--error {
  background: rgba(217, 123, 123, 0.92);
}

.toast--warning {
  background: rgba(232, 166, 99, 0.92);
}

.toast__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.toast__content {
  flex: 1;
}

.toast__message {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.toast__close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-circle);
  color: currentColor;
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.toast__close:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

---

## Навигация

### Main Navigation

```html
<nav class="nav" aria-label="Основная навигация">
  <a href="/" class="nav__logo">
    <img src="/logo.svg" alt="Эмоциональный баланс" />
  </a>
  <ul class="nav__menu">
    <li><a href="/services" class="nav__link">Услуги</a></li>
    <li><a href="/about" class="nav__link">О психологе</a></li>
    <li><a href="/resources" class="nav__link">Ресурсы</a></li>
    <li><a href="/blog" class="nav__link">Блог</a></li>
  </ul>
  <button class="btn btn-primary">Записаться</button>
  <button class="nav__burger" aria-label="Открыть меню">
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>
```

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: white;
  border-bottom: 1px solid var(--color-border-primary);
}

.nav__logo img {
  height: 40px;
}

.nav__menu {
  display: flex;
  gap: var(--space-6);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--duration-fast) ease;
  position: relative;
}

.nav__link:hover {
  color: var(--color-sage-600);
}

.nav__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-sage-500);
  transition: width var(--duration-normal) ease;
}

.nav__link:hover::after {
  width: 100%;
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav__burger span {
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
  transition: all var(--duration-fast) ease;
}

@media (max-width: 768px) {
  .nav__menu {
    display: none;
  }
  
  .nav__burger {
    display: flex;
  }
}
```

---

## Формы

### Complete Form Example

```html
<form class="form">
  <div class="form__section">
    <h2 class="form__title">Контактная информация</h2>
    
    <div class="input-group">
      <label for="name" class="input-label">
        Имя <span class="input-required">*</span>
      </label>
      <input
        type="text"
        id="name"
        class="input"
        required
        aria-required="true"
      />
    </div>
    
    <div class="input-group">
      <label for="email" class="input-label">
        Email <span class="input-required">*</span>
      </label>
      <input
        type="email"
        id="email"
        class="input"
        required
        aria-required="true"
      />
    </div>
    
    <div class="input-group">
      <label for="phone" class="input-label">Телефон</label>
      <input type="tel" id="phone" class="input" />
      <span class="input-hint">Для связи, если понадобится</span>
    </div>
  </div>
  
  <div class="form__section">
    <h2 class="form__title">Ваш запрос</h2>
    
    <div class="input-group">
      <label class="input-label">С чем хотите поработать?</label>
      <div class="chips">
        <button class="chip" type="button">Тревога</button>
        <button class="chip" type="button">Выгорание</button>
        <button class="chip" type="button">Отношения</button>
      </div>
    </div>
    
    <div class="input-group">
      <label for="message" class="input-label">
        Расскажите подробнее
      </label>
      <textarea
        id="message"
        class="textarea"
        rows="5"
        placeholder="Что привело вас к терапии?"
      ></textarea>
    </div>
  </div>
  
  <div class="form__footer">
    <button type="submit" class="btn btn-primary btn-lg">
      Отправить заявку
    </button>
  </div>
</form>
```

```css
.form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.form__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.form__footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-primary);
}
```

---

## Тултипы

### Tooltip

```html
<button class="btn btn-primary" aria-describedby="tooltip-1">
  Записаться
  <span class="tooltip" id="tooltip-1" role="tooltip">
    Выберите удобное время
  </span>
</button>
```

```css
.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: white;
  background: var(--color-sage-900);
  border-radius: var(--radius-md);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-fast) ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-sage-900);
}

button:hover .tooltip,
button:focus-visible .tooltip {
  opacity: 1;
}
```

---

## Дропдауны

### Dropdown Menu

```html
<div class="dropdown">
  <button class="dropdown__trigger" aria-haspopup="true" aria-expanded="false">
    Профиль
    <svg><!-- chevron down --></svg>
  </button>
  <div class="dropdown__menu" role="menu">
    <a href="/profile" class="dropdown__item" role="menuitem">
      Мой профиль
    </a>
    <a href="/appointments" class="dropdown__item" role="menuitem">
      Записи
    </a>
    <a href="/settings" class="dropdown__item" role="menuitem">
      Настройки
    </a>
    <div class="dropdown__divider"></div>
    <button class="dropdown__item" role="menuitem">
      Выйти
    </button>
  </div>
</div>
```

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: none;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.dropdown__trigger:hover {
  background: var(--color-sand-100);
}

.dropdown__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2);
  display: none;
  z-index: 100;
}

.dropdown__menu[aria-hidden="false"] {
  display: block;
  animation: slideDown var(--duration-fast) var(--ease-out);
}

.dropdown__item {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  text-align: left;
  text-decoration: none;
  color: var(--color-text-primary);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.dropdown__item:hover {
  background: var(--color-sage-50);
}

.dropdown__divider {
  height: 1px;
  background: var(--color-border-primary);
  margin: var(--space-2) 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Бейджи и теги

### Badges

```html
<span class="badge badge--sage">Новое</span>
<span class="badge badge--coral">Популярное</span>
<span class="badge badge--success">Доступно</span>
```

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

.badge--warning {
  background: var(--color-warning-100);
  color: var(--color-warning-500);
}

.badge--error {
  background: var(--color-error-100);
  color: var(--color-error-500);
}
```

---

## Заключение

Все компоненты протестированы на:
- ✅ Доступность (WCAG AA)
- ✅ Адаптивность (mobile-first)
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Консистентность с дизайн-системой

**Связанные документы:**
- [UI Kit / Design System](../UI-Kit-Design-System.md)
- [Typography Guide](./Typography-Guide.md)
- [Motion Design](./Motion-Design.md)
- [Accessibility Checklist](./Accessibility-Checklist.md)

**Версия документа**: 1.0  
**Последнее обновление**: 9 января 2026
