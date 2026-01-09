import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Container.module.css';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Максимальная ширина контейнера */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Убрать padding */
  noPadding?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Контейнер для центрирования контента с ограничением ширины
 * 
 * @example
 * ```tsx
 * <Container maxWidth="xl">
 *   <h1>Контент по центру</h1>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = 'xl',
      noPadding = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          styles.container,
          styles[maxWidth],
          noPadding && styles.noPadding,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
