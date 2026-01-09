import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Section.module.css';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Размер вертикальных отступов */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Цвет фона секции */
  background?: 'primary' | 'secondary' | 'sage' | 'sage-light' | 'white';
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Секция страницы с вертикальными отступами и фоном
 * 
 * @example
 * ```tsx
 * <Section spacing="lg" background="sage-light">
 *   <Container>
 *     <h2>Заголовок секции</h2>
 *   </Container>
 * </Section>
 * ```
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      spacing = 'md',
      background = 'primary',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cx(
          styles.section,
          styles[`spacing-${spacing}`],
          styles[`bg-${background}`],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
