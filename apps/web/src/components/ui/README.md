# UI Kit — Компоненты дизайн-системы

Библиотека базовых UI компонентов для проекта «Эмоциональный баланс», построенная в соответствии с [дизайн-системой](../../../../docs/UI-Kit-Design-System.md) и референсом [Q Psychology](https://www.qpsychology.com.au/).

## 📋 Содержание

- [Установка](#установка)
- [Компоненты](#компоненты)
- [Принципы использования](#принципы-использования)
- [Доступность](#доступность)
- [Тестирование](#тестирование)

---

## Установка

Все компоненты доступны через единую точку входа:

```tsx
import { Button, Input, Card, Container } from '@/components/ui';
```

---

## Компоненты

### Button

Базовый компонент кнопки с множеством вариантов оформления.

**Варианты**: `primary` | `secondary` | `ghost` | `pill`  
**Размеры**: `sm` | `md` | `lg`

```tsx
import { Button } from '@/components/ui';

// Primary кнопка (по умолчанию)
<Button variant="primary" size="md">
  Нажми меня
</Button>

// Secondary кнопка (outline)
<Button variant="secondary" size="lg">
  Вторичное действие
</Button>

// Ghost кнопка (прозрачная)
<Button variant="ghost" onClick={handleCancel}>
  Отмена
</Button>

// Pill кнопка (фирменная капсула с иконкой)
<Button variant="pill" icon={<ArrowRightIcon />}>
  Начать →
</Button>

// Состояния
<Button loading>Загрузка...</Button>
<Button disabled>Недоступно</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'pill'` — вариант оформления
- `size?: 'sm' | 'md' | 'lg'` — размер кнопки
- `loading?: boolean` — состояние загрузки
- `icon?: ReactNode` — иконка (для pill — справа в кружке)
- `disabled?: boolean` — отключена
- Все стандартные HTML атрибуты кнопки

---

### IconButton

Круглая кнопка для иконок (search, menu, close и т.д.).

**Варианты**: `default` | `ghost` | `sage`  
**Размеры**: `sm` | `md` | `lg`

```tsx
import { IconButton } from '@/components/ui';

// Базовое использование
<IconButton 
  icon={<SearchIcon />} 
  aria-label="Поиск"
/>

// Варианты оформления
<IconButton 
  icon={<MenuIcon />} 
  variant="ghost"
  aria-label="Меню"
/>

<IconButton 
  icon={<CloseIcon />} 
  variant="sage"
  size="lg"
  aria-label="Закрыть"
/>
```

**Props:**
- `icon: ReactNode` — иконка (обязательно)
- `aria-label: string` — текстовая метка для screen readers (обязательно!)
- `variant?: 'default' | 'ghost' | 'sage'` — вариант оформления
- `size?: 'sm' | 'md' | 'lg'` — размер

---

### Card

Компонент карточки с вложенными элементами.

**Варианты**: `default` | `outlined` | `flat`

```tsx
import { Card } from '@/components/ui';

// Базовая карточка
<Card variant="default">
  <Card.Header>
    <Card.Title as="h3">Название карточки</Card.Title>
  </Card.Header>
  <Card.Body>
    Содержимое карточки с текстом и другими элементами.
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Действие</Button>
  </Card.Footer>
</Card>

// Интерактивная карточка (с hover эффектом)
<Card variant="outlined" interactive onClick={handleClick}>
  <Card.Header>
    <Card.Title>Кликабельная карточка</Card.Title>
  </Card.Header>
  <Card.Body>
    Эта карточка реагирует на наведение и клик
  </Card.Body>
</Card>

// Плоская карточка
<Card variant="flat">
  <p>Простое содержимое без рамки</p>
</Card>
```

**Props:**
- `variant?: 'default' | 'outlined' | 'flat'` — вариант оформления
- `interactive?: boolean` — делает карточку кликабельной
- `Card.Title`: `as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` — HTML тег заголовка

---

### Input

Текстовое поле ввода с поддержкой label, hint и error.

```tsx
import { Input } from '@/components/ui';

// Базовое использование
<Input 
  label="Email" 
  type="email" 
  placeholder="your@email.com"
/>

// С подсказкой
<Input 
  label="Пароль"
  type="password"
  hint="Минимум 8 символов"
  required
/>

// С ошибкой
<Input 
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error="Неверный формат email"
/>

// С иконками
<Input 
  label="Поиск"
  leftIcon={<SearchIcon />}
  rightIcon={<CloseIcon />}
  placeholder="Введите запрос..."
/>

// Отключенное поле
<Input 
  label="ID пользователя"
  value={userId}
  disabled
/>
```

**Props:**
- `label?: string` — метка поля
- `hint?: string` — текст подсказки
- `error?: string` — текст ошибки (заменяет hint)
- `leftIcon?: ReactNode` — иконка слева
- `rightIcon?: ReactNode` — иконка справа
- `required?: boolean` — обязательное поле (показывает звёздочку)
- Все стандартные HTML атрибуты input

---

### Textarea

Многострочное текстовое поле.

```tsx
import { Textarea } from '@/components/ui';

// Базовое использование
<Textarea 
  label="Ваше сообщение" 
  rows={5}
  placeholder="Расскажите о своей ситуации..."
/>

// С подсказкой и ошибкой
<Textarea 
  label="Описание"
  hint="Минимум 50 символов"
  error={errors.description}
  value={description}
  onChange={handleChange}
  required
/>
```

**Props:**
- `label?: string` — метка поля
- `hint?: string` — текст подсказки
- `error?: string` — текст ошибки
- `rows?: number` — количество строк (по умолчанию 4)
- `required?: boolean` — обязательное поле
- Все стандартные HTML атрибуты textarea

---

### Badge

Компонент бейджа для меток, статусов и категорий.

**Варианты**: `sage` | `coral` | `success` | `warning` | `error` | `info` | `neutral`  
**Размеры**: `sm` | `md` | `lg`

```tsx
import { Badge } from '@/components/ui';

// Базовое использование
<Badge variant="sage">В процессе</Badge>

// С иконкой
<Badge variant="success" icon={<CheckIcon />}>
  Завершено
</Badge>

// С точкой-индикатором
<Badge variant="warning" dot>
  Требует внимания
</Badge>

// Размеры
<Badge size="sm" variant="info">Мелкий</Badge>
<Badge size="md" variant="coral">Средний</Badge>
<Badge size="lg" variant="error">Крупный</Badge>
```

**Props:**
- `variant?: 'sage' | 'coral' | 'success' | 'warning' | 'error' | 'info' | 'neutral'`
- `size?: 'sm' | 'md' | 'lg'`
- `icon?: ReactNode` — иконка слева
- `dot?: boolean` — точка-индикатор слева

---

### Tag

Компонент тега для фильтров, выбора опций, категорий.

**Варианты**: `sage` | `coral` | `lavender` | `neutral`  
**Размеры**: `sm` | `md`

```tsx
import { Tag } from '@/components/ui';

// Статичный тег
<Tag variant="sage">Тревожность</Tag>

// Интерактивный тег (кликабельный)
<Tag 
  variant="coral" 
  interactive 
  selected={isSelected}
  onClick={handleSelect}
>
  Стресс
</Tag>

// С удалением
<Tag 
  variant="neutral" 
  onRemove={() => handleRemove('depression')}
>
  Депрессия
</Tag>

// Группа тегов
<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  <Tag variant="sage" interactive selected>Выбрано</Tag>
  <Tag variant="coral" interactive>Не выбрано</Tag>
  <Tag variant="lavender" interactive>Опция 3</Tag>
</div>
```

**Props:**
- `variant?: 'sage' | 'coral' | 'lavender' | 'neutral'`
- `size?: 'sm' | 'md'`
- `interactive?: boolean` — делает тег кликабельным
- `selected?: boolean` — выбран (для селекторов)
- `onRemove?: () => void` — показывает кнопку удаления

---

### Accordion

Компонент аккордеона с полной поддержкой доступности.

```tsx
import { Accordion, AccordionItem } from '@/components/ui';

// Использование
<Accordion>
  <AccordionItem title="Что такое когнитивно-поведенческая терапия?">
    КПТ — это форма психотерапии, которая помогает изменить 
    негативные мысли и поведение...
  </AccordionItem>
  
  <AccordionItem title="Сколько длится курс?" defaultOpen>
    Обычно курс состоит из 8-12 сессий, каждая длится 
    50 минут...
  </AccordionItem>
  
  <AccordionItem title="Как проходят онлайн-сессии?">
    Онлайн-сессии проводятся через видеосвязь в удобное 
    для вас время...
  </AccordionItem>
</Accordion>

// Отдельный элемент
<AccordionItem title="Вопрос" defaultOpen>
  Ответ на вопрос
</AccordionItem>
```

**Props:**
- `AccordionItem.title: string` — заголовок (обязательно)
- `AccordionItem.defaultOpen?: boolean` — открыт по умолчанию
- `AccordionItem.children: ReactNode` — содержимое

**Доступность:**
- Полная поддержка клавиатуры (Tab, Enter, Space)
- Корректные `aria-expanded`, `aria-controls`
- Role `region` для контента

---

### Container

Контейнер для центрирования контента с ограничением ширины.

**Размеры**: `xs` | `sm` | `md` | `lg` | `xl` | `2xl`

```tsx
import { Container } from '@/components/ui';

// Базовое использование
<Container maxWidth="xl">
  <h1>Контент по центру</h1>
  <p>С отступами слева и справа</p>
</Container>

// Без отступов
<Container maxWidth="lg" noPadding>
  <img src="hero.jpg" alt="Hero" style={{ width: '100%' }} />
</Container>

// Узкий контейнер (для форм)
<Container maxWidth="md">
  <form>...</form>
</Container>
```

**Props:**
- `maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` — максимальная ширина
- `noPadding?: boolean` — убрать боковые отступы

---

### Section

Секция страницы с вертикальными отступами и фоном.

**Spacing**: `none` | `sm` | `md` | `lg` | `xl`  
**Background**: `primary` | `secondary` | `sage` | `sage-light` | `white`

```tsx
import { Section, Container } from '@/components/ui';

// Базовое использование
<Section spacing="lg" background="sage-light">
  <Container>
    <h2>Заголовок секции</h2>
    <p>Контент секции...</p>
  </Container>
</Section>

// Тёмная секция
<Section spacing="xl" background="sage">
  <Container>
    <h2>Текст на тёмном фоне</h2>
  </Container>
</Section>

// Без отступов
<Section spacing="none" background="white">
  <img src="banner.jpg" alt="Banner" />
</Section>
```

**Props:**
- `spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'` — вертикальные отступы
- `background?: 'primary' | 'secondary' | 'sage' | 'sage-light' | 'white'` — фон

---

### Link

Компонент ссылки с интеграцией Next.js Link.

**Варианты**: `default` | `primary` | `ghost` | `cta`  
**Underline**: `always` | `hover` | `none`

```tsx
import { Link } from '@/components/ui';

// Внутренняя ссылка
<Link href="/about" variant="primary">
  О нас
</Link>

// CTA ссылка
<Link href="/services" variant="cta">
  Начать →
</Link>

// Внешняя ссылка (откроется в новой вкладке)
<Link href="https://example.com" external>
  Внешний ресурс
</Link>

// Без подчёркивания
<Link href="/contact" underline="none">
  Контакты
</Link>

// Всегда с подчёркиванием
<Link href="/faq" underline="always">
  Часто задаваемые вопросы
</Link>
```

**Props:**
- `href: string` — URL (обязательно)
- `variant?: 'default' | 'primary' | 'ghost' | 'cta'`
- `underline?: 'always' | 'hover' | 'none'`
- `external?: boolean` — внешняя ссылка (автоопределение по http)

---

### Toast

Система уведомлений без внешних зависимостей.

**Варианты**: `info` | `success` | `warning` | `error`

```tsx
'use client';

import { ToastProvider, useToast } from '@/components/ui';

// 1. Оберните приложение в ToastProvider (в layout.tsx)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

// 2. Используйте хук useToast в компонентах
function MyComponent() {
  const { showToast } = useToast();

  const handleSave = () => {
    // ... сохранение данных
    showToast('Сохранено.', { variant: 'success', duration: 3000 });
  };

  const handleError = () => {
    showToast('Произошла ошибка.', { 
      variant: 'error', 
      duration: 5000 
    });
  };

  const handleCopy = () => {
    showToast('Скопировано в буфер обмена.', { variant: 'info' });
  };

  return (
    <div>
      <Button onClick={handleSave}>Сохранить</Button>
      <Button onClick={handleCopy}>Копировать</Button>
    </div>
  );
}
```

**API:**
- `showToast(message: string, options?: ToastOptions)` — показать уведомление
- `ToastOptions`:
  - `variant?: 'info' | 'success' | 'warning' | 'error'` — тип
  - `duration?: number` — длительность в мс (0 = бесконечно, по умолчанию 3000)

**Правила:**
- Короткие сообщения (1 строка)
- Без "маркетинга": «Скопировано.» вместо «Успешно скопировано в буфер!»
- Автоматическое закрытие через 2-4 секунды
- Доступность: `role="status"`, `aria-live="polite"`

---

## Принципы использования

### 1. CSS Variables вместо хардкода

❌ **Неправильно:**
```css
.myButton {
  background: #4E8E82;
  padding: 12px 24px;
  border-radius: 16px;
}
```

✅ **Правильно:**
```css
.myButton {
  background: var(--color-sage-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
}
```

### 2. Composition вместо кастомизации

❌ **Неправильно:**
```tsx
<Button customStyle={{ fontSize: '20px', padding: '20px' }}>
  Большая кнопка
</Button>
```

✅ **Правильно:**
```tsx
<Button size="lg" className={styles.myCustomButton}>
  Большая кнопка
</Button>
```

### 3. Semantic HTML

✅ **Правильно:**
```tsx
<Section as="section">
  <Container>
    <h1>Заголовок</h1>
    <nav>
      <Link href="/about">О нас</Link>
    </nav>
  </Container>
</Section>
```

### 4. Доступность всегда

✅ **Всегда:**
- Используйте `aria-label` для IconButton
- Связывайте `label` с `input` через `htmlFor`
- Проверяйте клавиатурную навигацию (Tab, Enter, Space)
- Тестируйте с screen reader

---

## Доступность

Все компоненты соответствуют **WCAG 2.1 AA**:

✅ **Контрастность:**
- Текст: минимум 4.5:1
- Интерактивные элементы: минимум 3:1

✅ **Touch targets:**
- Минимум 44×44px для всех кнопок/ссылок
- Расстояние между элементами минимум 8px

✅ **Focus states:**
- Видимые `:focus-visible` для клавиатуры
- `outline: none` для мыши

✅ **Motion:**
- Учитывается `prefers-reduced-motion`
- Анимации можно отключить в настройках

✅ **Keyboard:**
- Все интерактивные элементы доступны с клавиатуры
- Логический порядок Tab (по DOM)

✅ **Screen readers:**
- Корректные `aria-*` атрибуты
- Связанные label и input
- `role` для кастомных элементов

---

## Тестирование

Все компоненты покрыты тестами на:
- Рендеринг и базовые props
- Интерактивность (клики, ввод текста)
- Доступность (aria, роли, клавиатура)
- Edge cases (disabled, loading, error)

```bash
# Запустить тесты
npm test

# Запустить тесты UI компонентов
npm test -- src/components/ui

# Запустить тесты с coverage
npm test -- --coverage
```

---

## Примеры использования

### Форма входа

```tsx
'use client';

import { useState } from 'react';
import { Input, Button, Card, Container, Section } from '@/components/ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Валидация и отправка...
  };

  return (
    <Section spacing="xl" background="sage-light">
      <Container maxWidth="sm">
        <Card variant="default">
          <Card.Header>
            <Card.Title as="h1">Вход</Card.Title>
          </Card.Header>
          
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />
              
              <Input
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                hint="Минимум 8 символов"
                required
              />
              
              <Button type="submit" variant="primary" size="lg">
                Войти
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </Section>
  );
}
```

### Hero секция

```tsx
import { Button, Container, Section } from '@/components/ui';

export function HeroSection() {
  return (
    <Section spacing="xl" background="primary">
      <Container maxWidth="xl">
        <h1 className="text-hero">
          Найдите эмоциональный баланс
        </h1>
        <p className="text-body-lg">
          Профессиональная психологическая помощь онлайн
        </p>
        
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <Button variant="pill" size="lg">
            Начать бесплатно
          </Button>
          <Button variant="secondary" size="lg">
            Узнать больше
          </Button>
        </div>
      </Container>
    </Section>
  );
}
```

### FAQ Аккордеон

```tsx
import { Accordion, AccordionItem, Container, Section } from '@/components/ui';

export function FAQSection() {
  return (
    <Section spacing="lg" background="white">
      <Container maxWidth="lg">
        <h2 className="text-h2">Часто задаваемые вопросы</h2>
        
        <Accordion>
          <AccordionItem title="Как работает онлайн-терапия?">
            Онлайн-терапия проходит через защищённую видеосвязь...
          </AccordionItem>
          
          <AccordionItem title="Сколько стоит сессия?">
            Стоимость зависит от специалиста и формата...
          </AccordionItem>
          
          <AccordionItem title="Как выбрать психолога?">
            Мы поможем подобрать специалиста под ваши задачи...
          </AccordionItem>
        </Accordion>
      </Container>
    </Section>
  );
}
```

---

## Связанные документы

- [Полная дизайн-система](../../../../docs/UI-Kit-Design-System.md)
- [Токены и переменные](../../../../docs/design-system/tokens-reference.md)
- [Референс Q Psychology](https://www.qpsychology.com.au/)

---

**Версия**: 1.0  
**Дата**: 9 января 2026  
**Разработчик**: UI Kit Team
