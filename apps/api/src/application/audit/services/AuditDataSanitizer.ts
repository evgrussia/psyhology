/**
 * Сервис для санитизации данных перед записью в аудит-лог
 * Удаляет P2 данные (персональные данные, чувствительный текст)
 *
 * Правила санитизации:
 * - P0: action, entity_type, entity_id, timestamps, role - храним
 * - P1: IP, user-agent - храним, но ограничиваем доступ
 * - P2: email, phone, тексты анкет/дневников, UGC тексты - НЕ храним
 */
export class AuditDataSanitizer {
  /**
   * Санитизирует объект, удаляя P2 данные
   * Оставляет только структурную информацию (ID, категории, метаданные)
   */
  static sanitize(data: unknown): Record<string, unknown> | null {
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data !== 'object') {
      return null;
    }

    const sanitized: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const [key, value] of Object.entries(obj)) {
      // Пропускаем P2 поля
      if (this.isP2Field(key)) {
        continue;
      }

      // Обрабатываем вложенные объекты
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        const sanitizedNested = this.sanitize(value);
        if (sanitizedNested && Object.keys(sanitizedNested).length > 0) {
          sanitized[key] = sanitizedNested;
        }
      } else if (Array.isArray(value)) {
        // Для массивов санитизируем каждый элемент
        const sanitizedArray = value
          .map((item) => this.sanitize(item))
          .filter((item) => item !== null);
        if (sanitizedArray.length > 0) {
          sanitized[key] = sanitizedArray;
        }
      } else {
        // Примитивные значения - проверяем на P2
        if (!this.isP2Value(value)) {
          sanitized[key] = value;
        }
      }
    }

    return Object.keys(sanitized).length > 0 ? sanitized : null;
  }

  /**
   * Проверяет, является ли поле P2 (персональные данные)
   */
  private static isP2Field(key: string): boolean {
    const p2Fields = [
      'email',
      'phone',
      'telegramUserId',
      'telegramUsername',
      'password',
      'passwordHash',
      'text',
      'content',
      'body',
      'message',
      'description',
      'notes',
      'comment',
      'feedback',
      'answer',
      'response',
      'question',
      'diary',
      'journal',
      'intakeForm',
      'outcomeRecord',
      'reviewText',
      'reviewBody',
    ];

    const lowerKey = key.toLowerCase();
    return p2Fields.some((field) => lowerKey.includes(field));
  }

  /**
   * Проверяет, является ли значение P2
   */
  private static isP2Value(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    // Если строка слишком длинная (вероятно текст), считаем P2
    if (value.length > 200) {
      return true;
    }

    // Проверяем на email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return true;
    }

    // Проверяем на телефон (российский формат)
    if (/^\+?[78]\d{10}$/.test(value.replace(/[\s\-()]/g, ''))) {
      return true;
    }

    return false;
  }

  /**
   * Создаёт diff между старым и новым значением
   * Возвращает только изменённые поля (без P2)
   */
  static createDiff(
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null,
  ): {
    oldValue: Record<string, unknown> | null;
    newValue: Record<string, unknown> | null;
  } {
    const sanitizedOld = oldValue ? this.sanitize(oldValue) : null;
    const sanitizedNew = newValue ? this.sanitize(newValue) : null;

    // Если оба значения есть, создаём diff только изменённых полей
    if (sanitizedOld && sanitizedNew) {
      const diffOld: Record<string, unknown> = {};
      const diffNew: Record<string, unknown> = {};

      const allKeys = new Set([...Object.keys(sanitizedOld), ...Object.keys(sanitizedNew)]);

      for (const key of allKeys) {
        const oldVal = sanitizedOld[key];
        const newVal = sanitizedNew[key];

        // Добавляем только если значение изменилось
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          if (oldVal !== undefined) {
            diffOld[key] = oldVal;
          }
          if (newVal !== undefined) {
            diffNew[key] = newVal;
          }
        }
      }

      return {
        oldValue: Object.keys(diffOld).length > 0 ? diffOld : null,
        newValue: Object.keys(diffNew).length > 0 ? diffNew : null,
      };
    }

    return {
      oldValue: sanitizedOld,
      newValue: sanitizedNew,
    };
  }
}
