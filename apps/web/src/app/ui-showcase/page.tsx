'use client';

import { useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  Input,
  Textarea,
  Badge,
  Tag,
  Accordion,
  AccordionItem,
  Container,
  Section,
  Link,
  ToastProvider,
  useToast,
} from '@/components/ui';
import styles from './showcase.module.css';

function ShowcaseContent() {
  const { showToast } = useToast();
  const [selectedTag, setSelectedTag] = useState('sage');

  return (
    <div className={styles.showcase}>
      {/* Hero */}
      <Section spacing="xl" background="primary">
        <Container maxWidth="xl">
          <h1 className={styles.hero}>UI Kit Showcase</h1>
          <p className={styles.lead}>
            Демонстрация всех компонентов дизайн-системы
          </p>
        </Container>
      </Section>

      {/* Buttons */}
      <Section spacing="lg" background="white">
        <Container maxWidth="lg">
          <h2 className={styles.sectionTitle}>Buttons</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Варианты</h3>
            <div className={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="pill">Pill Button →</Button>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Размеры</h3>
            <div className={styles.row}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Состояния</h3>
            <div className={styles.row}>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button onClick={() => showToast('Clicked!', { variant: 'success' })}>
                Show Toast
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* IconButtons */}
      <Section spacing="lg" background="sage-light">
        <Container maxWidth="lg">
          <h2 className={styles.sectionTitle}>Icon Buttons</h2>
          
          <div className={styles.row}>
            <IconButton 
              icon={<span>🔍</span>} 
              aria-label="Поиск"
              variant="default"
            />
            <IconButton 
              icon={<span>☰</span>} 
              aria-label="Меню"
              variant="ghost"
            />
            <IconButton 
              icon={<span>✕</span>} 
              aria-label="Закрыть"
              variant="sage"
            />
          </div>
        </Container>
      </Section>

      {/* Cards */}
      <Section spacing="lg" background="white">
        <Container maxWidth="lg">
          <h2 className={styles.sectionTitle}>Cards</h2>
          
          <div className={styles.grid}>
            <Card variant="default">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
              </Card.Header>
              <Card.Body>
                Карточка с тенью и белым фоном. Подходит для основного контента.
              </Card.Body>
              <Card.Footer>
                <Button size="sm">Действие</Button>
              </Card.Footer>
            </Card>

            <Card variant="outlined" interactive>
              <Card.Header>
                <Card.Title>Outlined Card</Card.Title>
              </Card.Header>
              <Card.Body>
                Карточка с границей. Интерактивная версия реагирует на hover.
              </Card.Body>
            </Card>

            <Card variant="flat">
              <Card.Header>
                <Card.Title>Flat Card</Card.Title>
              </Card.Header>
              <Card.Body>
                Плоская карточка с цветным фоном без тени.
              </Card.Body>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Forms */}
      <Section spacing="lg" background="secondary">
        <Container maxWidth="md">
          <h2 className={styles.sectionTitle}>Form Controls</h2>
          
          <div className={styles.form}>
            <Input 
              label="Email" 
              type="email"
              placeholder="your@email.com"
              hint="Мы не передадим ваш email третьим лицам"
            />
            
            <Input 
              label="Пароль" 
              type="password"
              hint="Минимум 8 символов"
              required
            />
            
            <Input 
              label="С ошибкой" 
              type="text"
              error="Это поле обязательно"
            />
            
            <Textarea 
              label="Ваше сообщение"
              rows={4}
              placeholder="Расскажите о себе..."
            />
          </div>
        </Container>
      </Section>

      {/* Badges & Tags */}
      <Section spacing="lg" background="white">
        <Container maxWidth="lg">
          <h2 className={styles.sectionTitle}>Badges & Tags</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Badges</h3>
            <div className={styles.row}>
              <Badge variant="sage">В процессе</Badge>
              <Badge variant="success">Завершено</Badge>
              <Badge variant="warning" dot>Внимание</Badge>
              <Badge variant="error">Ошибка</Badge>
              <Badge variant="info">Информация</Badge>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Tags</h3>
            <div className={styles.row}>
              <Tag 
                variant="sage" 
                interactive 
                selected={selectedTag === 'sage'}
                onClick={() => setSelectedTag('sage')}
              >
                Тревожность
              </Tag>
              <Tag 
                variant="coral" 
                interactive
                selected={selectedTag === 'coral'}
                onClick={() => setSelectedTag('coral')}
              >
                Стресс
              </Tag>
              <Tag 
                variant="lavender" 
                interactive
                selected={selectedTag === 'lavender'}
                onClick={() => setSelectedTag('lavender')}
              >
                Депрессия
              </Tag>
              <Tag 
                variant="neutral" 
                onRemove={() => showToast('Тег удалён', { variant: 'info' })}
              >
                С удалением
              </Tag>
            </div>
          </div>
        </Container>
      </Section>

      {/* Accordion */}
      <Section spacing="lg" background="sage-light">
        <Container maxWidth="md">
          <h2 className={styles.sectionTitle}>Accordion</h2>
          
          <Accordion>
            <AccordionItem title="Что такое когнитивно-поведенческая терапия?" defaultOpen>
              КПТ — это форма психотерапии, которая помогает изменить негативные мысли и поведение. 
              Она основана на понимании того, как наши мысли влияют на эмоции и действия.
            </AccordionItem>
            
            <AccordionItem title="Сколько длится курс терапии?">
              Обычно курс состоит из 8-12 сессий, каждая длится 50 минут. 
              Точная длительность зависит от ваших целей и прогресса.
            </AccordionItem>
            
            <AccordionItem title="Как проходят онлайн-сессии?">
              Онлайн-сессии проводятся через защищённую видеосвязь в удобное для вас время. 
              Всё что вам нужно — стабильный интернет и тихое место для разговора.
            </AccordionItem>
          </Accordion>
        </Container>
      </Section>

      {/* Links */}
      <Section spacing="lg" background="white">
        <Container maxWidth="lg">
          <h2 className={styles.sectionTitle}>Links</h2>
          
          <div className={styles.column}>
            <p>
              Это <Link href="#" variant="default">обычная ссылка</Link> в тексте.
            </p>
            <p>
              Это <Link href="#" variant="primary">акцентная ссылка</Link> с большим весом.
            </p>
            <p>
              <Link href="#" variant="cta">Призыв к действию →</Link>
            </p>
            <p>
              <Link href="#" variant="ghost" underline="none">Тихая ссылка без подчёркивания</Link>
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <ToastProvider>
      <ShowcaseContent />
    </ToastProvider>
  );
}
