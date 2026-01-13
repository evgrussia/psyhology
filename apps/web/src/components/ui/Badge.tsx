import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Цветовой вариант бейджа */
  variant?: 'sage' | 'coral' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Размер бейджа */
  size?: 'sm' | 'md' | 'lg';
  /** Иконка слева */
  icon?: ReactNode;
  /** Точка-индикатор слева */
  dot?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Компонент бейджа для меток, статусов и категорий
 * 
 * @example
 * ```tsx
 * <Badge variant="sage">В процессе</Badge>
 * <Badge variant="success" icon={<CheckIcon />}>Завершено</Badge>
 * <Badge variant="warning" dot>Требует внимания</Badge>
 * ```
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  icon,
  dot,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';
