import { DomainError } from '../../shared/errors/DomainError';

/**
 * Value Object: Slug для контента
 * Должен быть URL-safe и уникален в пределах типа контента
 */
export class Slug {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainError('Slug cannot be empty');
    }

    // Валидация формата: только латиница, цифры, дефисы, подчёркивания
    if (!/^[a-z0-9_-]+$/.test(value)) {
      throw new DomainError('Slug must contain only lowercase letters, numbers, hyphens, and underscores');
    }

    // Минимальная и максимальная длина
    if (value.length < 1) {
      throw new DomainError('Slug must be at least 1 character long');
    }

    if (value.length > 255) {
      throw new DomainError('Slug must be at most 255 characters long');
    }
  }

  /**
   * Создать Slug из строки (например, из title)
   */
  static fromString(value: string): Slug {
    return new Slug(value);
  }

  /**
   * Сгенерировать Slug из заголовка
   */
  static fromTitle(title: string): Slug {
    if (!title || title.trim().length === 0) {
      throw new DomainError('Title cannot be empty');
    }

    // Транслитерация кириллицы в латиницу (базовая)
    const transliteration: Record<string, string> = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'h',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
    };

    let slug = title
      .toLowerCase()
      .trim()
      .split('')
      .map((char) => transliteration[char] || char)
      .join('')
      // Заменяем все не-латинские символы на дефис
      .replace(/[^a-z0-9_-]/g, '-')
      // Удаляем множественные дефисы
      .replace(/-+/g, '-')
      // Удаляем дефисы в начале и конце
      .replace(/^-+|-+$/g, '');

    // Если после обработки slug пустой, используем fallback
    if (slug.length === 0) {
      slug = 'untitled';
    }

    // Ограничиваем длину
    if (slug.length > 255) {
      slug = slug.substring(0, 255).replace(/-+$/, '');
    }

    return new Slug(slug);
  }

  equals(other: Slug): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
