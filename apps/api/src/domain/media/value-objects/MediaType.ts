import { DomainError } from '../../shared/errors/DomainError';

/**
 * Value Object: Тип медиа-файла
 */
export enum MediaTypeEnum {
  Image = 'image',
  Audio = 'audio',
  Pdf = 'pdf',
}

export class MediaType {
  private constructor(private readonly value: MediaTypeEnum) {}

  static Image = new MediaType(MediaTypeEnum.Image);
  static Audio = new MediaType(MediaTypeEnum.Audio);
  static Pdf = new MediaType(MediaTypeEnum.Pdf);

  /**
   * Создать MediaType из строки
   */
  static fromString(value: string): MediaType {
    switch (value.toLowerCase()) {
      case 'image':
        return MediaType.Image;
      case 'audio':
        return MediaType.Audio;
      case 'pdf':
        return MediaType.Pdf;
      default:
        throw new DomainError(`Invalid media type: ${value}`);
    }
  }

  /**
   * Определить тип медиа из MIME типа
   */
  static fromMimeType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.Image;
    }
    if (mimeType.startsWith('audio/')) {
      return MediaType.Audio;
    }
    if (mimeType === 'application/pdf') {
      return MediaType.Pdf;
    }
    throw new DomainError(`Unsupported MIME type: ${mimeType}`);
  }

  /**
   * Проверить, является ли тип изображением
   */
  isImage(): boolean {
    return this.value === MediaTypeEnum.Image;
  }

  /**
   * Проверить, является ли тип аудио
   */
  isAudio(): boolean {
    return this.value === MediaTypeEnum.Audio;
  }

  /**
   * Проверить, является ли тип PDF
   */
  isPdf(): boolean {
    return this.value === MediaTypeEnum.Pdf;
  }

  /**
   * Получить максимальный размер файла в байтах
   */
  getMaxSizeBytes(): number {
    switch (this.value) {
      case MediaTypeEnum.Image:
        return 10 * 1024 * 1024; // 10 MB
      case MediaTypeEnum.Audio:
        return 50 * 1024 * 1024; // 50 MB
      case MediaTypeEnum.Pdf:
        return 20 * 1024 * 1024; // 20 MB
      default:
        return 10 * 1024 * 1024;
    }
  }

  /**
   * Получить название бакета для хранения
   */
  getBucketName(): string {
    switch (this.value) {
      case MediaTypeEnum.Image:
      case MediaTypeEnum.Pdf:
        return 'emotional-balance-media';
      case MediaTypeEnum.Audio:
        return 'emotional-balance-audio';
      default:
        return 'emotional-balance-media';
    }
  }

  equals(other: MediaType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): MediaTypeEnum {
    return this.value;
  }
}
