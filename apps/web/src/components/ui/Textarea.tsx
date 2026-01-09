import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/utils';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Метка поля */
  label?: string;
  /** Текст подсказки под полем */
  hint?: string;
  /** Текст ошибки */
  error?: string;
  /** ID поля (используется для связи с label) */
  id?: string;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент многострочного текстового поля
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   label="Ваше сообщение" 
 *   placeholder="Расскажите о своей ситуации..."
 *   rows={5}
 *   hint="Минимум 50 символов"
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      id,
      className,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className={cx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required} aria-label="обязательное поле"> *</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cx(
            styles.textarea,
            error && styles.hasError
          )}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cx(hintId, errorId)}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
