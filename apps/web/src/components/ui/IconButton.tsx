import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './IconButton.module.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Иконка для отображения */
  icon: ReactNode;
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Вариант оформления */
  variant?: 'default' | 'ghost' | 'sage';
  /** Текстовая метка для screen readers (обязательно!) */
  'aria-label': string;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Круглая кнопка для иконок (search, menu, close и т.д.)
 * 
 * @example
 * ```tsx
 * <IconButton icon={<SearchIcon />} aria-label="Поиск" />
 * <IconButton icon={<MenuIcon />} aria-label="Меню" variant="ghost" />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cx(
          styles.iconButton,
          styles[variant],
          styles[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
