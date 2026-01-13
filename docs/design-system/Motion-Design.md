# Руководство по Motion Design — «Эмоциональный баланс»

**Версия**: 1.0  
**Дата создания**: 9 января 2026  
**Статус**: Полное руководство по анимациям и переходам

---

## 📋 Содержание

1. [Философия анимации](#философия-анимации)
2. [Timing и Easing](#timing-и-easing)
3. [Transitions](#transitions)
4. [Keyframe Animations](#keyframe-animations)
5. [Микро-взаимодействия](#микро-взаимодействия)
6. [Loading States](#loading-states)
7. [Page Transitions](#page-transitions)
8. [Gesture Animations](#gesture-animations)
9. [Accessibility](#accessibility)
10. [Performance](#performance)

---

## Философия анимации

### Ключевые принципы

**1. Естественность**
- Движения должны имитировать реальный мир
- Учитываем физику (инерция, трение, гравитация)
- Избегаем роботических linear transitions

**2. Ненавязчивость**
- Анимации поддерживают, а не отвлекают
- Длительность 200-400ms для большинства эффектов
- Subtle > Dramatic

**3. Целесообразность**
- Каждая анимация имеет цель
- Помогает понять интерфейс и навигацию
- Обеспечивает обратную связь

**4. Консистентность**
- Одинаковые элементы анимируются одинаково
- Используем единые timing и easing functions
- Создаем предсказуемый опыт

---

## Timing и Easing

### Duration (Длительность)

```css
:root {
  /* Ultra Fast - для hover, subtle effects */
  --duration-instant: 100ms;
  
  /* Fast - для большинства transitions */
  --duration-fast: 200ms;
  
  /* Normal - для стандартных анимаций */
  --duration-normal: 300ms;
  
  /* Slow - для сложных анимаций, modals */
  --duration-slow: 400ms;
  
  /* Slower - для page transitions */
  --duration-slower: 600ms;
}
```

**Рекомендации по длительности:**
- Мелкие элементы (кнопки, иконки): 200ms
- Средние элементы (карточки, dropdowns): 300ms
- Крупные элементы (modals, sidebars): 400-600ms
- Page transitions: 600ms+

---

### Easing Functions

```css
:root {
  /* Ease Out (выход из движения) - DEFAULT */
  /* Используется для появления элементов */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* Ease In (вход в движение) */
  /* Используется для исчезновения элементов */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* Ease In Out (комбинированное) */
  /* Используется для движения между состояниями */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Spring (эластичное) */
  /* Используется для playful interactions */
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Smooth (очень плавное) */
  /* Используется для scrolling, long animations */
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**Когда использовать:**

**Ease Out** (по умолчанию для большинства анимаций):
- Появление элементов (fade in, slide in)
- Открытие модалок
- Hover effects

**Ease In**:
- Исчезновение элементов
- Закрытие модалок
- Навигация "назад"

**Ease In Out**:
- Переключение состояний (tabs, toggles)
- Движение элементов по экрану
- Accordion раскрытие/сворачивание

**Spring**:
- Playful buttons (pill button)
- Interactive icons
- Акцентные действия

**Smooth**:
- Scroll to section
- Длинные анимации (>600ms)
- Carousel transitions

---

## Transitions

### Basic Transition Pattern

```css
.element {
  /* Property | Duration | Easing | Delay */
  transition: all var(--duration-normal) var(--ease-out);
}

/* Лучше: специфичные свойства */
.element {
  transition: 
    transform var(--duration-normal) var(--ease-out),
    opacity var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}
```

### Common Transitions

#### Opacity (Fade)

```css
.fade {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade.is-visible {
  opacity: 1;
}
```

#### Transform (Scale, Translate, Rotate)

```css
/* Scale (увеличение/уменьшение) */
.scale-hover {
  transition: transform var(--duration-fast) var(--ease-out);
}

.scale-hover:hover {
  transform: scale(1.05);
}

/* Translate (движение) */
.lift-hover {
  transition: 
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.lift-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Rotate */
.rotate-icon {
  transition: transform var(--duration-normal) var(--ease-spring);
}

.rotate-icon.is-active {
  transform: rotate(45deg); /* + icon → × */
}
```

#### Color (Background, Border, Text)

```css
.button {
  background: var(--color-sage-500);
  color: white;
  transition: background var(--duration-fast) ease;
}

.button:hover {
  background: var(--color-sage-600);
}
```

#### Box Shadow

```css
.card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

---

## Keyframe Animations

### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

---

### Slide Up

```css
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

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

---

### Slide Down

```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down {
  animation: slideDown var(--duration-normal) var(--ease-out);
}
```

---

### Scale In

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}
```

---

### Pulse (для notifications)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse {
  animation: pulse 2s var(--ease-in-out) infinite;
}
```

---

### Breathing (для медитаций, calm effects)

```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.breathe {
  animation: breathe 4s var(--ease-smooth) infinite;
}
```

---

### Shimmer (для skeleton loaders)

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-sand-200) 25%,
    var(--color-sand-100) 50%,
    var(--color-sand-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

### Spin (для spinners)

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 0.8s linear infinite;
}
```

---

### Bounce (для playful interactions)

```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.bounce {
  animation: bounce 0.6s var(--ease-out);
}
```

---

## Микро-взаимодействия

### Button Interactions

```css
.btn {
  position: relative;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

/* Lift effect */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Ripple effect */
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  transform: scale(0);
  border-radius: inherit;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn:active::after {
  opacity: 0.2;
  transform: scale(1);
  transition: none;
}
```

---

### Pill Button Animation

```css
.btn-pill {
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-pill:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-pill__icon {
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-pill:hover .btn-pill__icon {
  background: var(--color-sage-600);
  transform: scale(1.05);
}

.btn-pill__icon svg {
  transition: transform var(--duration-normal) var(--ease-out);
}

.btn-pill:hover .btn-pill__icon svg {
  transform: translateX(3px);
}
```

---

### Checkbox/Toggle Animation

```css
.checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.checkbox:checked {
  background: var(--color-sage-500);
  border-color: var(--color-sage-500);
}

.checkbox::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg) scale(0);
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-spring);
}

.checkbox:checked::after {
  transform: translate(-50%, -60%) rotate(45deg) scale(1);
  opacity: 1;
}
```

---

### Input Focus Animation

```css
.input {
  border: 2px solid var(--color-border-primary);
  transition: all var(--duration-fast) ease;
  position: relative;
}

.input:focus {
  border-color: var(--color-sage-500);
  box-shadow: var(--shadow-focus);
}

/* Floating label */
.input-wrapper {
  position: relative;
}

.input-label {
  position: absolute;
  top: 50%;
  left: var(--space-4);
  transform: translateY(-50%);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus + .input-label,
.input:not(:placeholder-shown) + .input-label {
  top: 0;
  font-size: var(--font-size-sm);
  background: white;
  padding: 0 var(--space-1);
}
```

---

### Accordion Animation

```css
.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.accordion[data-state="open"] .accordion__content {
  grid-template-rows: 1fr;
}

.accordion__icon {
  transition: transform var(--duration-normal) var(--ease-spring);
}

.accordion[data-state="open"] .accordion__icon {
  transform: rotate(45deg); /* + → × */
}
```

---

### Tooltip Animation

```css
.tooltip {
  opacity: 0;
  transform: translateY(8px);
  transition: 
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

button:hover .tooltip,
button:focus-visible .tooltip {
  opacity: 1;
  transform: translateY(0);
}
```

---

### Dropdown Menu Animation

```css
.dropdown__menu {
  opacity: 0;
  transform: translateY(-8px);
  transition: 
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

.dropdown__menu[aria-hidden="false"] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

---

## Loading States

### Spinner

```css
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

### Dots Loader

```css
.dots-loader {
  display: flex;
  gap: var(--space-2);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--color-sage-500);
  border-radius: var(--radius-circle);
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

### Progress Bar Animation

```css
.progress__bar {
  width: 0%;
  transition: width var(--duration-slow) var(--ease-out);
}

/* Indeterminate (неопределенный прогресс) */
.progress--indeterminate .progress__bar {
  width: 30%;
  animation: progressIndeterminate 1.5s ease-in-out infinite;
}

@keyframes progressIndeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(350%);
  }
  100% {
    transform: translateX(350%);
  }
}
```

---

### Skeleton Loader

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-sand-200) 25%,
    var(--color-sand-100) 50%,
    var(--color-sand-200) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

---

## Page Transitions

### Fade Transition

```css
.page-transition-fade-enter {
  opacity: 0;
}

.page-transition-fade-enter-active {
  opacity: 1;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.page-transition-fade-exit {
  opacity: 1;
}

.page-transition-fade-exit-active {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-in);
}
```

---

### Slide Transition

```css
.page-transition-slide-enter {
  transform: translateX(100%);
}

.page-transition-slide-enter-active {
  transform: translateX(0);
  transition: transform var(--duration-slower) var(--ease-out);
}

.page-transition-slide-exit {
  transform: translateX(0);
}

.page-transition-slide-exit-active {
  transform: translateX(-100%);
  transition: transform var(--duration-slower) var(--ease-in);
}
```

---

### Scale Fade Transition

```css
.page-transition-scale-enter {
  opacity: 0;
  transform: scale(0.98);
}

.page-transition-scale-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: 
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}
```

---

## Gesture Animations

### Swipe Animation (для mobile)

```css
.swipeable {
  touch-action: pan-y;
  transition: transform var(--duration-fast) var(--ease-out);
}

.swipeable.is-swiping {
  transition: none; /* Отключаем transition во время свайпа */
}

.swipeable.is-dismissed {
  transform: translateX(-100%);
  opacity: 0;
  transition: 
    transform var(--duration-normal) var(--ease-in),
    opacity var(--duration-normal) var(--ease-in);
}
```

---

### Pull to Refresh

```css
.pull-to-refresh {
  position: relative;
}

.pull-to-refresh__indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%) scale(0);
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.pull-to-refresh.is-pulling .pull-to-refresh__indicator {
  transform: translate(-50%, 0) scale(1);
  opacity: 1;
}

.pull-to-refresh.is-refreshing .pull-to-refresh__indicator {
  animation: spin 0.8s linear infinite;
}
```

---

## Accessibility

### prefers-reduced-motion

**Критически важно!** Всегда учитывайте пользователей с чувствительностью к анимациям.

```css
/* Отключаем все анимации для пользователей с prefers-reduced-motion */
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

### JavaScript Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate(element, animation) {
  if (prefersReducedMotion) {
    // Пропускаем анимацию или используем instant
    element.classList.add('instant');
  } else {
    element.classList.add(animation);
  }
}
```

---

### Focus Indicators

```css
/* Не удаляйте focus states анимацией */
*:focus-visible {
  outline: 3px solid var(--color-sage-500);
  outline-offset: 2px;
  /* Не добавляем transition на outline! */
}
```

---

## Performance

### Оптимизация анимаций

**1. Используйте transform и opacity (GPU-accelerated)**

```css
/* Хорошо (GPU) */
.good {
  transform: translateX(100px);
  opacity: 0.5;
}

/* Плохо (CPU) */
.bad {
  left: 100px;
  visibility: hidden;
}
```

**2. will-change для сложных анимаций**

```css
.complex-animation {
  will-change: transform, opacity;
}

/* Удалите после анимации! */
.complex-animation.is-done {
  will-change: auto;
}
```

**3. Избегайте анимации layout properties**

Избегайте: `width`, `height`, `top`, `left`, `margin`, `padding`  
Используйте: `transform`, `opacity`

---

### Measuring Performance

```javascript
// Измерение FPS
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
    console.log(`FPS: ${fps}`);
    frames = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(measureFPS);
}

measureFPS();
```

---

### Debugging Animations

```css
/* Визуализация всех анимаций */
* {
  animation-play-state: paused !important;
  transition: none !important;
}

/* Slow motion (для debugging) */
* {
  animation-duration: 3s !important;
  transition-duration: 3s !important;
}
```

---

## Чеклист анимаций

### Перед релизом:

- [ ] Все анимации имеют цель и улучшают UX
- [ ] Длительность адекватна (200-400ms для большинства)
- [ ] Используются правильные easing functions
- [ ] Implemented `prefers-reduced-motion`
- [ ] Анимации не вызывают layout shifts
- [ ] Используются GPU-accelerated свойства (transform, opacity)
- [ ] Нет конфликтов между transition и animation
- [ ] Focus states видны и доступны
- [ ] Performance проверен (60 FPS минимум)
- [ ] Нет лишних `will-change`

### Для каждой анимации:

- [ ] Работает на всех устройствах
- [ ] Не блокирует взаимодействие
- [ ] Имеет fallback для старых браузеров
- [ ] Протестирована с медленным CPU

---

## Примеры использования

### Hero секция с анимацией

```html
<section class="hero">
  <h1 class="hero__title slide-up">Найдите опору в себе</h1>
  <p class="hero__lead slide-up" style="animation-delay: 100ms">
    Профессиональная психологическая помощь...
  </p>
  <button class="btn btn-primary slide-up" style="animation-delay: 200ms">
    Записаться
  </button>
</section>
```

---

### Карточки с stagger animation

```css
.card {
  opacity: 0;
  animation: slideUp var(--duration-normal) var(--ease-out) forwards;
}

.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
.card:nth-child(4) { animation-delay: 300ms; }
```

---

### Modal с backdrop animation

```css
.modal {
  display: none;
}

.modal.is-open {
  display: flex;
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.modal__overlay {
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.modal__content {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

---

## Связанные документы

- [UI Kit / Design System](../UI-Kit-Design-System.md)
- [Components Detailed](./Components-Detailed.md)
- [Accessibility Checklist](./Accessibility-Checklist.md)

**Версия документа**: 1.0  
**Последнее обновление**: 9 января 2026

**Полезные ресурсы:**
- [Cubic Bezier Editor](https://cubic-bezier.com/)
- [Easing Functions Cheat Sheet](https://easings.net/)
- [Animation Performance Guide](https://web.dev/animations/)
