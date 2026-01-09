/**
 * Utility для объединения CSS классов
 * Простая альтернатива clsx/classnames без внешних зависимостей
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Создаёт функцию для работы с вариантами компонента
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T
) {
  return (variantProps: { [K in keyof T]?: keyof T[K] }) => {
    const variantClasses = Object.entries(variantProps)
      .map(([key, value]) => {
        const variant = variants[key];
        return variant?.[value as string];
      })
      .filter(Boolean);

    return cx(base, ...variantClasses);
  };
}
