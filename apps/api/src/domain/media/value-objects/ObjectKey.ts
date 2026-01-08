import { DomainError } from '../../shared/errors/DomainError';
import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * Value Object: Ключ объекта в S3 хранилище
 * Генерируется сервером, не принимается от клиента
 */
export class ObjectKey {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainError('Object key cannot be empty');
    }

    // Валидация формата: должен быть безопасным для S3
    if (!/^[a-zA-Z0-9._/-]+$/.test(value)) {
      throw new DomainError('Invalid object key format');
    }

    // Максимальная длина ключа в S3
    if (value.length > 1024) {
      throw new DomainError('Object key is too long');
    }
  }

  /**
   * Создать ObjectKey из строки (для восстановления из БД)
   */
  static fromString(value: string): ObjectKey {
    return new ObjectKey(value);
  }

  /**
   * Сгенерировать новый ObjectKey для загрузки
   * Формат: {mediaType}/{year}/{month}/{uuid}-{originalFilename}
   */
  static generate(
    mediaType: string,
    originalFilename: string,
    mediaAssetId: EntityId | { value: string }
  ): ObjectKey {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Очищаем имя файла от небезопасных символов
    const safeFilename = originalFilename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 100); // ограничиваем длину

    const idValue = mediaAssetId instanceof EntityId ? mediaAssetId.value : mediaAssetId.value;
    const key = `${mediaType}/${year}/${month}/${idValue}-${safeFilename}`;

    return new ObjectKey(key);
  }

  equals(other: ObjectKey): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
