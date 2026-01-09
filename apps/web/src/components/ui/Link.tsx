import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import NextLink from 'next/link';
import { cx } from '@/lib/utils';
import styles from './Link.module.css';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** URL ссылки */
  href: string;
  /** Вариант оформления */
  variant?: 'default' | 'primary' | 'ghost' | 'cta';
  /** Подчёркивание */
  underline?: 'always' | 'hover' | 'none';
  /** Внешняя ссылка (открывать в новой вкладке) */
  external?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
  children: ReactNode;
}

/**
 * Компонент ссылки с интеграцией Next.js Link
 * 
 * @example
 * ```tsx
 * <Link href="/about" variant="primary">О нас</Link>
 * <Link href="/services" variant="cta">Начать →</Link>
 * <Link href="https://example.com" external>Внешняя ссылка</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      variant = 'default',
      underline = 'hover',
      external = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isExternal = external || href.startsWith('http');
    const externalProps = isExternal
      ? {
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      : {};

    const linkClass = cx(
      styles.link,
      styles[variant],
      styles[`underline-${underline}`],
      className
    );

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={linkClass}
          {...externalProps}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={linkClass}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';
