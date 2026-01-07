# Design Tokens — Справочник

## Цветовая палитра в коде

### CSS Custom Properties

```css
:root {
  /* Sage Green Scale */
  --color-sage-900: #1A3330;
  --color-sage-800: #234540;
  --color-sage-700: #2C5850;
  --color-sage-600: #3D7369;
  --color-sage-500: #4E8E82;
  --color-sage-400: #6FA99C;
  --color-sage-300: #90C4B6;
  --color-sage-200: #B8DDD2;
  --color-sage-100: #D9EFE8;
  --color-sage-50: #F0F9F6;

  /* Warm Sand Scale */
  --color-sand-900: #3A3530;
  --color-sand-800: #54504A;
  --color-sand-700: #6D6860;
  --color-sand-600: #87827A;
  --color-sand-500: #A19C94;
  --color-sand-400: #BBB6AE;
  --color-sand-300: #D5D0C8;
  --color-sand-200: #E8E5DF;
  --color-sand-100: #F4F2ED;
  --color-sand-50: #FAF8F4;

  /* Accent Colors */
  --color-coral-500: #E89B8F;
  --color-coral-400: #F0B3A9;
  --color-coral-300: #F8D3CC;
  
  --color-terracotta-500: #C97B63;
  --color-terracotta-400: #D99A85;
  
  --color-lavender-500: #B8A7D9;
  --color-lavender-400: #CFC2E6;
}
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F0F9F6',
          100: '#D9EFE8',
          200: '#B8DDD2',
          300: '#90C4B6',
          400: '#6FA99C',
          500: '#4E8E82',
          600: '#3D7369',
          700: '#2C5850',
          800: '#234540',
          900: '#1A3330',
        },
        sand: {
          50: '#FAF8F4',
          100: '#F4F2ED',
          200: '#E8E5DF',
          300: '#D5D0C8',
          400: '#BBB6AE',
          500: '#A19C94',
          600: '#87827A',
          700: '#6D6860',
          800: '#54504A',
          900: '#3A3530',
        },
        coral: {
          300: '#F8D3CC',
          400: '#F0B3A9',
          500: '#E89B8F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
}
```

## Быстрая справка

### Применение цветов

| Назначение | Light mode | Dark mode (если нужен) |
|-----------|------------|------------------------|
| Основной текст | sage-900 | sand-50 |
| Вторичный текст | sage-600 | sage-300 |
| Фон страницы | sand-50 | sage-900 |
| Фон карточки | white | sage-800 |
| Primary CTA | sage-500 | sage-400 |
| Secondary CTA | sage-700 outline | sage-300 outline |
| Accent CTA | coral-500 | coral-400 |

### Spacing (8px grid)

```
xs: 4px   (0.25rem)
sm: 8px   (0.5rem)
md: 16px  (1rem)
lg: 24px  (1.5rem)
xl: 32px  (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

### Border Radius

```
sm: 8px
md: 12px
lg: 16px
xl: 24px
pill: 9999px
```

### Typography Scale

```
xs: 12px
sm: 14px
base: 16px
lg: 18px
xl: 20px
2xl: 24px
3xl: 28px
4xl: 32px
5xl: 40px
hero: clamp(48px, 6vw, 72px)
```

---

См. полную документацию: [UI Kit / Design System](../../UI-Kit-Design-System.md)
