import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Вариант оформления карточки */
  variant?: 'default' | 'outlined' | 'flat';
  /** Делает карточку интерактивной (hover эффекты) */
  interactive?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

/**
 * Базовый компонент карточки с вложенными компонентами
 * 
 * @example
 * ```tsx
 * <Card variant="default" interactive>
 *   <Card.Header>
 *     <Card.Title>Заголовок</Card.Title>
 *   </Card.Header>
 *   <Card.Body>
 *     Содержимое карточки
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button>Действие</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      interactive = false,
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
          styles.card,
          styles[variant],
          interactive && styles.interactive,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* Card.Header */
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx(styles.header, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'Card.Header';

/* Card.Title */
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className, children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cx(styles.title, className)} {...props}>
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'Card.Title';

/* Card.Body */
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx(styles.body, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'Card.Body';

/* Card.Footer */
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cx(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'Card.Footer';

/* Экспорт вложенных компонентов */
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
