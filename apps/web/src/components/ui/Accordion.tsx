'use client';

import { useState, useId, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Accordion.module.css';

export interface AccordionItemProps {
  /** Заголовок аккордеона */
  title: string;
  /** Содержимое */
  children: ReactNode;
  /** Открыт по умолчанию */
  defaultOpen?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Отдельный элемент аккордеона
 * 
 * @example
 * ```tsx
 * <AccordionItem title="Как это работает?" defaultOpen>
 *   Подробное описание...
 * </AccordionItem>
 * ```
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `accordion-content-${id}`;

  return (
    <div
      className={cx(styles.accordion, isOpen && styles.open, className)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.icon} aria-hidden="true">
          +
        </span>
      </button>

      <div
        id={contentId}
        className={styles.content}
        role="region"
        aria-labelledby={contentId}
        hidden={!isOpen}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}

AccordionItem.displayName = 'AccordionItem';

export interface AccordionProps {
  /** Элементы аккордеона */
  children: ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Контейнер для группы аккордеонов
 * 
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="Вопрос 1">Ответ 1</AccordionItem>
 *   <AccordionItem title="Вопрос 2">Ответ 2</AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({ children, className }: AccordionProps) {
  return <div className={cx(styles.accordionGroup, className)}>{children}</div>;
}

Accordion.displayName = 'Accordion';
Accordion.Item = AccordionItem;
