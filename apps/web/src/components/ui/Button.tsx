import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант оформления кнопки */
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  /** Размер кнопки */
  size?: 'sm' | 'md' | 'lg';
  /** Состояние загрузки */
  loading?: boolean;
  /** Иконка (для pill варианта - отображается справа в кружке) */
  icon?: ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Базовый компонент кнопки с поддержкой различных вариантов оформления
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Нажми меня</Button>
 * <Button variant="pill" icon={<ArrowRight />}>Начать</Button>
 * <Button variant="secondary" loading>Загрузка...</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isPill = variant === 'pill';
    const isDisabled = disabled || loading;

    const buttonClass = cx(
      styles.button,
      styles[variant],
      styles[size],
      loading && styles.loading,
      className
    );

    if (isPill) {
      return (
        <button
          ref={ref}
          className={buttonClass}
          disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          <span className={styles.pillText}>{children}</span>
          <span className={styles.pillIcon} aria-hidden="true">
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              icon || <span className={styles.arrow}>→</span>
            )}
          </span>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClass}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {children}
        {icon && !loading && <span aria-hidden="true">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
