import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Метка поля */
  label?: string;
  /** Текст подсказки под полем */
  hint?: string;
  /** Текст ошибки */
  error?: string;
  /** ID поля (используется для связи с label) */
  id?: string;
  /** Иконка слева */
  leftIcon?: ReactNode;
  /** Иконка справа */
  rightIcon?: ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент текстового поля ввода с поддержкой label, hint и error
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   placeholder="your@email.com"
 *   hint="Мы не передадим ваш email третьим лицам"
 * />
 * 
 * <Input
 *   label="Поиск"
 *   leftIcon={<SearchIcon />}
 *   error="Слишком короткий запрос"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      id,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={cx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required} aria-label="обязательное поле"> *</span>}
          </label>
        )}
        
        <div className={cx(
          styles.inputWrapper,
          leftIcon && styles.hasLeftIcon,
          rightIcon && styles.hasRightIcon,
          error && styles.hasError,
          disabled && styles.disabled
        )}>
          {leftIcon && (
            <span className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cx(hintId, errorId)}
            {...props}
          />
          
          {rightIcon && (
            <span className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
