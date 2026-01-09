import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Tag.module.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Цветовой вариант тега */
  variant?: 'sage' | 'coral' | 'lavender' | 'neutral';
  /** Размер тега */
  size?: 'sm' | 'md';
  /** Кликабельный тег */
  interactive?: boolean;
  /** Выбран (для селекторов) */
  selected?: boolean;
  /** Иконка удаления */
  onRemove?: () => void;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Компонент тега для фильтров, выбора опций, категорий
 * 
 * @example
 * ```tsx
 * <Tag variant="sage">Тревожность</Tag>
 * <Tag variant="coral" interactive selected>Стресс</Tag>
 * <Tag variant="neutral" onRemove={() => {}}>Депрессия</Tag>
 * ```
 */
export function Tag({
  variant = 'neutral',
  size = 'md',
  interactive = false,
  selected = false,
  onRemove,
  className,
  children,
  ...props
}: TagProps) {
  const Component = interactive ? 'button' : 'span';
  const extraProps = interactive ? {
    type: 'button' as const,
    'aria-pressed': selected,
  } : {};

  return (
    <Component
      className={cx(
        styles.tag,
        styles[variant],
        styles[size],
        interactive && styles.interactive,
        selected && styles.selected,
        className
      )}
      {...extraProps}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Удалить"
        >
          ×
        </button>
      )}
    </Component>
  );
}

Tag.displayName = 'Tag';
