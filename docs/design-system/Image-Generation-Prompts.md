# Промпты для генерации изображений — «Эмоциональный баланс»

**Версия**: 1.0  
**Дата**: 7 января 2026  
**Назначение**: Набор промптов для генерации визуального контента через AI (Midjourney, DALL-E 3, Stable Diffusion)

---

## 📋 Содержание

1. [Общие параметры стиля](#1-общие-параметры-стиля)
2. [Hero Images](#2-hero-images)
3. [Spot Illustrations](#3-spot-illustrations)
4. [Background Patterns](#4-background-patterns)
5. [Icons и Графические элементы](#5-icons-и-графические-элементы)
6. [Фотографии для контента](#6-фотографии-для-контента)
7. [Абстрактные композиции](#7-абстрактные-композиции)
8. [Дополнительные рекомендации](#8-дополнительные-рекомендации)

---

## 1. Общие параметры стиля

### 1.1 Ключевые слова для всех промптов

**Обязательно включать:**
```
soft, calming, warm tones, organic shapes, minimal, empathetic, gentle, 
natural lighting, peaceful, serene, welcoming, professional yet warm
```

**Цветовая палитра (указывать hex):**
```
sage green (#4E8E82, #90C4B6), warm sand (#FAF8F4, #E8E5DF), 
soft coral (#E89B8F, #F8D3CC), muted terracotta (#C97B63),
gentle lavender (#B8A7D9)
```

**Избегать:**
```
harsh shadows, bright neon colors, aggressive angles, clinical white,
sterile environment, overly saturated, dark moody, sharp edges
```

### 1.2 Технические параметры

**Для Midjourney:**
```
--ar 16:9 (hero images)
--ar 1:1 (spot illustrations, icons)
--ar 3:2 (content images)
--style raw (для более контролируемого результата)
--s 250 (умеренная стилизация)
--v 6 (последняя версия)
```

**Для DALL-E 3:**
```
Size: 1792x1024 (horizontal)
Size: 1024x1024 (square)
Style: natural (не vivid)
```

**Для Stable Diffusion:**
```
Steps: 30-40
CFG Scale: 7-9
Sampler: DPM++ 2M Karras
```

---

## 2. Hero Images

### 2.1 Hero: Спокойствие и поддержка

```
A serene, softly-lit scene with a person sitting peacefully by a window, 
natural morning light filtering through sheer curtains, warm sage green 
and sand tones, soft focus background with houseplants, minimal composition, 
professional photography style, calming atmosphere, shot on film camera, 
gentle grain, muted color palette (#4E8E82, #FAF8F4, #E89B8F), 
warm and welcoming mood, 8k resolution --ar 16:9 --style raw --s 250
```

### 2.2 Hero: Путь к себе

```
Abstract organic path made of soft flowing shapes, sage green and coral 
watercolor texture, gentle curves leading forward, minimal landscape, 
peaceful journey metaphor, top-down view, natural paper texture, 
hand-painted feel, warm tones, serene and hopeful, elegant simplicity,
pastel colors (#90C4B6, #F8D3CC, #D9EFE8), professional illustration style
--ar 16:9 --style raw --s 250
```

### 2.3 Hero: Доверие и профессионализм

```
Modern minimalist therapy office space, warm wooden elements, soft sage 
green accent wall, natural light from large window, comfortable seating, 
houseplants, books on shelf, warm sand colored textiles, professional yet 
cozy atmosphere, no people visible, inviting and safe environment, 
architectural photography style, soft shadows, muted color palette
--ar 16:9 --style raw --s 250
```

### 2.4 Hero: Внутренний баланс

```
Zen-inspired abstract composition with organic shapes, smooth pebbles 
balanced gently, soft sage green and sand gradient background, minimal 
negative space, peaceful harmony, natural textures, gentle lighting, 
serene mood, balance and equilibrium metaphor, professional photography,
shallow depth of field, (#4E8E82, #E8E5DF, #B8A7D9)
--ar 16:9 --style raw --s 250
```

---

## 3. Spot Illustrations

### 3.1 Тревога и спокойствие

```
Simple flat illustration of abstract overlapping organic shapes representing 
calm waters, flowing gentle curves, sage green (#90C4B6) and sand (#E8E5DF) 
colors only, minimal 2-color design, no outlines, soft gradients, peaceful 
waves, modern minimalist style, vector art feeling, clean and simple, 
300x300px composition --ar 1:1 --style raw --s 200
```

### 3.2 Рост и развитие

```
Minimalist illustration of a single sprouting plant with soft rounded leaves, 
organic growth metaphor, sage green (#4E8E82) and light coral (#F8D3CC), 
simple geometric shapes, no black lines, gradient fill, modern flat design, 
hopeful and gentle, clean composition, negative space, 
400x400px --ar 1:1 --style raw --s 200
```

### 3.3 Поддержка и связь

```
Abstract illustration of two organic blob shapes gently touching, 
connection and support metaphor, coral (#E89B8F) and sage (#90C4B6) colors, 
soft edges, minimal style, no outlines, modern flat design, warm and caring 
mood, simple composition with breathing room, vector feel
--ar 1:1 --style raw --s 200
```

### 3.4 Внутренний диалог

```
Minimalist illustration of overlapping speech bubble shapes as organic clouds, 
gentle conversation metaphor, muted lavender (#B8A7D9) and sand (#FAF8F4), 
soft rounded forms, no sharp edges, flat modern style, peaceful and reflective,
clean negative space, 2-color palette only
--ar 1:1 --style raw --s 200
```

### 3.5 Эмоциональная палитра

```
Abstract color swatches arranged in gentle wave pattern, representing 
emotional spectrum, sage green to coral gradient (#4E8E82 to #E89B8F), 
soft transitions, organic flowing shapes, minimalist design, no text, 
modern illustration style, calming and balanced composition
--ar 1:1 --style raw --s 200
```

### 3.6 Дневник и рефлексия

```
Simple flat illustration of an open journal with abstract flowing lines 
representing thoughts, sage green (#4E8E82) and sand (#E8E5DF) palette, 
minimal geometric style, soft rounded corners, no outlines, gentle and 
inviting, clean modern design, contemplative mood
--ar 1:1 --style raw --s 200
```

### 3.7 Путь к цели

```
Abstract minimalist path illustration with gentle curves and stepping stones, 
journey metaphor, coral (#E89B8F) and sage (#90C4B6) colors, organic shapes, 
flat design, no shadows, clean and simple, hopeful progression, 
modern vector style, warm and encouraging
--ar 1:1 --style raw --s 200
```

### 3.8 Безопасное пространство

```
Minimalist illustration of protective embracing shapes forming a safe space, 
abstract shelter metaphor, warm sand (#FAF8F4) and sage green (#4E8E82), 
soft organic forms, no outlines, gentle caring mood, modern flat style, 
breathing room, peaceful and secure feeling
--ar 1:1 --style raw --s 200
```

---

## 4. Background Patterns

### 4.1 Тонкие волны

```
Seamless pattern of very subtle organic wave shapes, barely visible texture, 
sage green (#4E8E82) on slightly lighter sage (#D9EFE8), 3% opacity, 
soft flowing lines, minimal abstract pattern, professional and calming, 
perfect for background, tileable pattern, ultra-subtle
--ar 1:1 --tile --style raw --s 150
```

### 4.2 Мягкие круги

```
Seamless pattern of scattered soft circles in various sizes, very low opacity, 
sand color (#E8E5DF) on warm white (#FAF8F4), 5% opacity maximum, 
gentle organic placement, minimal and unobtrusive, modern subtle texture, 
perfect background pattern, tileable
--ar 1:1 --tile --style raw --s 150
```

### 4.3 Органические линии

```
Seamless pattern of hand-drawn organic flowing lines, very delicate and thin, 
coral (#E89B8F) on light sand (#F4F2ED), 4% opacity, gentle movement, 
abstract and minimal, calming rhythm, professional texture, tileable, 
barely noticeable pattern
--ar 1:1 --tile --style raw --s 150
```

### 4.4 Природные текстуры

```
Very subtle paper texture with soft fibers, warm sand color (#FAF8F4), 
natural organic feel, minimal grain, professional and clean, 
perfect for backgrounds, high resolution, seamless tileable texture
--ar 1:1 --tile --style raw --s 100
```

---

## 5. Icons и Графические элементы

### 5.1 Стиль иконок (общий промпт)

```
Set of minimalist outline icons for mental health website, 2px stroke weight, 
rounded corners, organic friendly feel, sage green color (#4E8E82), 
simple and clean, professional medical style but warm, 32x32px, 
transparent background, consistent style across set
--ar 1:1 --style raw --s 150
```

### 5.2 Конкретные иконки

**Сердце (поддержка):**
```
Single minimalist outline heart icon, 2px stroke, rounded corners, 
sage green (#4E8E82), organic gentle curves, professional yet warm, 
32x32px, transparent background, vector style
--ar 1:1 --style raw --s 150
```

**Календарь (запись):**
```
Minimalist outline calendar icon with rounded corners, 2px stroke, 
sage green (#4E8E82), simple and friendly, 32x32px, clean design, 
professional medical style, transparent background
--ar 1:1 --style raw --s 150
```

**Сообщение (чат):**
```
Soft rounded speech bubble icon, outline style, 2px stroke, organic curves, 
sage green (#4E8E82), welcoming and friendly, 32x32px, minimal design,
transparent background, vector feel
--ar 1:1 --style raw --s 150
```

---

## 6. Фотографии для контента

### 6.1 Человек в спокойной обстановке

```
Professional lifestyle photography of a person sitting comfortably with 
a journal, soft natural window light, sage green cardigan, warm sand tones 
in interior, peaceful morning mood, shallow depth of field, film photography 
aesthetic, grain texture, muted color palette (#4E8E82, #FAF8F4), 
genuine peaceful expression, modern minimal home setting
--ar 3:2 --style raw --s 250
```

### 6.2 Руки с чашкой (тепло и забота)

```
Close-up photograph of hands gently holding a warm ceramic mug, 
soft natural light, sage green sweater, steam rising, cozy and comforting, 
warm tones, shallow depth of field, professional product photography style,
peaceful morning ritual, (#E89B8F, #FAF8F4), intimate and caring mood
--ar 3:2 --style raw --s 250
```

### 6.3 Природа и спокойствие

```
Serene nature scene with soft sage green plants, gentle morning light 
filtering through leaves, dewdrops, shallow depth of field, peaceful 
natural environment, warm muted tones, professional nature photography,
calming and grounding, organic textures, (#4E8E82, #90C4B6)
--ar 3:2 --style raw --s 250
```

### 6.4 Пространство для размышлений

```
Minimalist desk scene from above, open journal with pen, small plant, 
warm natural light, sage green and sand color palette, professional 
flat lay photography, negative space, peaceful and organized, inviting 
workspace, soft shadows, (#FAF8F4, #4E8E82, #E8E5DF)
--ar 3:2 --style raw --s 250
```

---

## 7. Абстрактные композиции

### 7.1 Эмоциональные волны

```
Abstract fluid art composition with organic flowing shapes, gentle waves 
of sage green (#4E8E82) blending into coral (#E89B8F) and sand (#E8E5DF), 
smooth gradients, peaceful movement, minimal modern art, digital painting,
calming rhythm, professional abstract art, no sharp edges, harmony and flow
--ar 16:9 --style raw --s 300
```

### 7.2 Внутренний ландшафт

```
Minimalist abstract landscape with soft rolling hills, sage green and 
warm sand gradient (#4E8E82 to #FAF8F4), gentle curves, peaceful horizon, 
minimal geometric shapes, modern illustration, serene and contemplative, 
breathing room, elegant simplicity, professional digital art
--ar 16:9 --style raw --s 300
```

### 7.3 Баланс форм

```
Geometric abstract composition with balanced organic shapes, sage green 
(#90C4B6), coral (#E89B8F), and sand (#E8E5DF), minimal modern design,
symmetry and asymmetry in harmony, peaceful arrangement, professional 
graphic design, clean and sophisticated, breathing space
--ar 16:9 --style raw --s 300
```

### 7.4 Световые переходы

```
Abstract gradient composition from sage green to warm coral, soft light 
transitions, peaceful color flow, minimal modern art, professional digital 
gradient design, calming atmosphere, smooth blending, (#4E8E82, #E89B8F, 
#F8D3CC), serene and balanced, breathing room
--ar 16:9 --style raw --s 250
```

---

## 8. Дополнительные рекомендации

### 8.1 Batch Generation Strategy

**Порядок генерации:**

1. **Приоритет 1** (критически важные):
   - Hero image для главной (2-3 варианта)
   - Spot illustrations для основных разделов (8 штук)
   - Icons set (12-15 ключевых иконок)

2. **Приоритет 2** (важные):
   - Background patterns (4 варианта)
   - Content photos (4-6 штук)
   - Абстрактные композиции для секций (3-4 штуки)

3. **Приоритет 3** (дополнительные):
   - Вариации hero images для разных состояний
   - Дополнительные spot illustrations
   - Сезонные/тематические вариации

### 8.2 Post-Processing

**После генерации обязательно:**

1. **Оптимизация:**
   - Конвертация в WebP для веба
   - Создание responsive вариантов (1x, 2x, 3x)
   - Сжатие без потери качества

2. **Коррекция цветов:**
   - Проверка соответствия палитре дизайн-системы
   - Коррекция в Figma/Photoshop при необходимости
   - Обеспечение WCAG AA контраста

3. **Форматы:**
   - Hero images: 1920x1080, 1280x720, 640x360 (WebP)
   - Spot illustrations: SVG (предпочтительно) или PNG
   - Icons: SVG обязательно
   - Patterns: SVG или tileable PNG

### 8.3 Альтернативные инструменты

**Если Midjourney/DALL-E недоступны:**

1. **Leonardo.ai** - хорош для абстракций и иллюстраций
2. **Adobe Firefly** - интеграция с Adobe Creative Cloud
3. **Ideogram** - хорош для типографики и графики
4. **Playground AI** - быстрое прототипирование

### 8.4 Ручная доработка

**Когда нужна:**
- Точная подгонка цветов под палитру
- Удаление нежелательных элементов
- Создание вариаций размеров
- Добавление текстур или эффектов

**Инструменты:**
- Figma - для векторной графики и иконок
- Photoshop - для фотографий
- Illustrator - для сложных иллюстраций
- Procreate - для рисованных элементов

### 8.5 Naming Convention

```
[type]-[section]-[variant]-[size].[format]

Примеры:
hero-homepage-calm-1920x1080.webp
spot-anxiety-main-400x400.svg
icon-calendar-outline-32x32.svg
pattern-waves-subtle-seamless.svg
photo-hands-mug-1280x854.webp
abstract-balance-hero-1920x1080.webp
```

### 8.6 Тестирование визуалов

**Чеклист перед использованием:**
- [ ] Соответствует цветовой палитре (±5% допустимо)
- [ ] Читается на всех фонах
- [ ] WCAG AA контраст соблюдён
- [ ] Нет культурных/этических проблем
- [ ] Соответствует тону бренда (эмпатия, тепло)
- [ ] Оптимизирован размер файла
- [ ] Есть alt-text для accessibility
- [ ] Responsive варианты созданы

---

## 9. Готовые промпты для конкретных секций сайта

### 9.1 Главная страница

**Hero:**
```
Serene minimalist scene with person meditating peacefully, soft morning 
light through large window, sage green yoga mat and plants, warm sand 
colored walls, professional lifestyle photography, calm and welcoming 
atmosphere, muted natural palette (#4E8E82, #FAF8F4, #90C4B6), 
shallow depth of field, 8k --ar 16:9 --style raw --s 250
```

**Секция "Как я работаю":**
```
Minimalist flat illustration of three connected organic shapes representing 
steps, sage green (#4E8E82) and coral (#E89B8F), flowing progression, 
simple modern design, no outlines, gentle and clear, professional style
--ar 16:9 --style raw --s 200
```

**Секция "Отзывы":**
```
Abstract composition of soft overlapping speech bubbles in organic shapes, 
sage green and lavender tones (#90C4B6, #B8A7D9), minimal design, 
conversation and trust metaphor, modern illustration, warm and authentic
--ar 16:9 --style raw --s 200
```

### 9.2 Страница "О психологе"

**Hero:**
```
Professional yet warm portrait environment, soft natural window light, 
sage green and sand interior tones, comfortable modern therapy office, 
plants and books, inviting atmosphere, no person in frame, architectural 
photography style, (#4E8E82, #FAF8F4) --ar 16:9 --style raw --s 250
```

**Образование и опыт:**
```
Minimalist illustration of stacked abstract books or certificates, 
sage green and terracotta (#4E8E82, #C97B63), simple geometric shapes, 
professional credentials metaphor, clean modern design, trustworthy feel
--ar 1:1 --style raw --s 200
```

### 9.3 Страница "Услуги"

**Индивидуальная терапия:**
```
Abstract illustration of single organic shape growing and flourishing, 
personal growth metaphor, sage green (#4E8E82) to light green gradient, 
minimal modern style, hopeful and gentle, clean composition
--ar 3:2 --style raw --s 200
```

**Парная терапия:**
```
Two organic shapes intertwined harmoniously, connection metaphor, 
coral (#E89B8F) and sage (#90C4B6), balanced composition, modern minimal 
illustration, warm and supportive feel
--ar 3:2 --style raw --s 200
```

**Групповая терапия:**
```
Multiple soft organic shapes arranged in harmonious circle, community 
metaphor, various shades of sage and sand (#4E8E82, #90C4B6, #E8E5DF), 
inclusive and welcoming, modern flat design, peaceful gathering
--ar 3:2 --style raw --s 200
```

### 9.4 Интерактивные модули

**Тест на тревогу:**
```
Abstract illustration of gentle waves calming down, transition from 
turbulent to peaceful, sage green gradient (#4E8E82 to #D9EFE8), 
calming process metaphor, minimal modern design, hopeful progression
--ar 3:2 --style raw --s 200
```

**Дневник эмоций:**
```
Minimalist illustration of abstract color swatches in journal format, 
emotional palette representation, sage, coral, lavender blend 
(#4E8E82, #E89B8F, #B8A7D9), organized and gentle, modern flat design
--ar 3:2 --style raw --s 200
```

**Упражнения:**
```
Simple illustration of hands in gentle meditation mudra, organic rounded 
shapes, sage green and sand (#4E8E82, #FAF8F4), peaceful practice metaphor,
minimal modern style, calming and accessible
--ar 3:2 --style raw --s 200
```

---

**Версия документа**: 1.0  
**Последнее обновление**: 7 января 2026

**Связанные документы:**
- [UI Kit / Design System](../UI-Kit-Design-System.md)
- [Q Psychology Complete Spec](../generated/frontend/QPsychology-Complete-Design-Specification.md)

**Инструменты для генерации:**
- Midjourney (рекомендуется)
- DALL-E 3 (OpenAI)
- Leonardo.ai
- Adobe Firefly
- Stable Diffusion (локально)
