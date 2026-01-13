import { MediaAssetId } from '../value-objects/MediaAssetId';
import { MediaType } from '../value-objects/MediaType';
import { ObjectKey } from '../value-objects/ObjectKey';
import { UserId } from '../../identity/value-objects/Ids';
import { DomainError } from '../../shared/errors/DomainError';
import { DomainEvent } from '../../shared/events/DomainEvent';
import { MediaAssetUploadedEvent, MediaAssetDeletedEvent } from '../events/MediaEvents';

/**
 * MediaAsset Aggregate Root
 * Представляет медиа-файл (изображение, аудио, PDF)
 */
export class MediaAsset {
  private constructor(
    private readonly id: MediaAssetId,
    private readonly storageProvider: string,
    private readonly objectKey: ObjectKey,
    private publicUrl: string,
    private readonly mediaType: MediaType,
    private readonly mimeType: string,
    private readonly sizeBytes: bigint,
    private title: string | null,
    private altText: string | null,
    private readonly uploadedByUserId: UserId | null,
    private readonly createdAt: Date,
    private domainEvents: DomainEvent[] = [],
  ) {}

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Создание нового MediaAsset (до загрузки в S3)
   */
  static create(
    mediaType: MediaType,
    mimeType: string,
    sizeBytes: number,
    objectKey: ObjectKey,
    uploadedByUserId: UserId | null,
    title?: string | null,
    altText?: string | null,
  ): MediaAsset {
    // Валидация размера
    if (sizeBytes <= 0) {
      throw new DomainError('File size must be greater than 0');
    }

    if (sizeBytes > mediaType.getMaxSizeBytes()) {
      throw new DomainError(
        `File size exceeds maximum allowed size for ${mediaType.toString()}: ${mediaType.getMaxSizeBytes()} bytes`,
      );
    }

    // Валидация MIME типа
    try {
      const detectedType = MediaType.fromMimeType(mimeType);
      if (!detectedType.equals(mediaType)) {
        throw new DomainError(
          `MIME type ${mimeType} does not match media type ${mediaType.toString()}`,
        );
      }
    } catch (_error) {
      throw new DomainError(`Unsupported MIME type: ${mimeType}`);
    }

    // Для изображений alt_text рекомендуется (A11y)
    if (mediaType.isImage() && (!altText || altText.trim().length === 0)) {
      // Не блокируем, но предупреждаем - можно сделать обязательным позже
      // throw new DomainError('Alt text is required for images');
    }

    const asset = new MediaAsset(
      MediaAssetId.generate(),
      's3',
      objectKey,
      '', // publicUrl будет установлен после загрузки
      mediaType,
      mimeType,
      BigInt(sizeBytes),
      title || null,
      altText || null,
      uploadedByUserId,
      new Date(),
    );

    return asset;
  }

  /**
   * Восстановление из БД (reconstitute)
   */
  static reconstitute(data: {
    id: MediaAssetId;
    storageProvider: string;
    objectKey: ObjectKey;
    publicUrl: string;
    mediaType: MediaType;
    mimeType: string;
    sizeBytes: bigint;
    title: string | null;
    altText: string | null;
    uploadedByUserId: UserId | null;
    createdAt: Date;
  }): MediaAsset {
    return new MediaAsset(
      data.id,
      data.storageProvider,
      data.objectKey,
      data.publicUrl,
      data.mediaType,
      data.mimeType,
      data.sizeBytes,
      data.title,
      data.altText,
      data.uploadedByUserId,
      data.createdAt,
      [], // события не восстанавливаем из БД
    );
  }

  // ============================================
  // Business Methods
  // ============================================

  /**
   * Завершить загрузку (установить публичный URL)
   */
  finalizeUpload(publicUrl: string): void {
    if (!publicUrl || publicUrl.trim().length === 0) {
      throw new DomainError('Public URL cannot be empty');
    }

    if (this.publicUrl && this.publicUrl.length > 0) {
      throw new DomainError('Media asset already finalized');
    }

    this.publicUrl = publicUrl;

    this.addDomainEvent(
      new MediaAssetUploadedEvent(
        this.id,
        this.mediaType,
        Number(this.sizeBytes),
        this.uploadedByUserId,
      ),
    );
  }

  /**
   * Обновить метаданные
   */
  updateMetadata(title: string | null, altText: string | null): void {
    this.title = title;
    this.altText = altText;

    // Для изображений alt_text рекомендуется
    if (this.mediaType.isImage() && (!altText || altText.trim().length === 0)) {
      // Можно добавить предупреждение или сделать обязательным
    }
  }

  /**
   * Пометить для удаления
   */
  markForDeletion(): void {
    this.addDomainEvent(new MediaAssetDeletedEvent(this.id, this.mediaType, this.uploadedByUserId));
  }

  // ============================================
  // Business Rules (проверки)
  // ============================================

  /**
   * Проверить, завершена ли загрузка
   */
  isUploaded(): boolean {
    return this.publicUrl && this.publicUrl.length > 0;
  }

  /**
   * Проверить, может ли пользователь удалить медиа
   */
  canBeDeletedBy(userId: UserId | null): boolean {
    // Только загрузивший пользователь или админ может удалить
    if (!this.uploadedByUserId) {
      return true; // Если нет информации о загрузившем, разрешаем (для миграций)
    }

    if (!userId) {
      return false;
    }

    return this.uploadedByUserId.equals(userId);
  }

  // ============================================
  // Getters
  // ============================================

  get mediaAssetId(): MediaAssetId {
    return this.id;
  }

  get storageProviderValue(): string {
    return this.storageProvider;
  }

  get objectKeyValue(): ObjectKey {
    return this.objectKey;
  }

  get publicUrlValue(): string {
    return this.publicUrl;
  }

  get mediaTypeValue(): MediaType {
    return this.mediaType;
  }

  get mimeTypeValue(): string {
    return this.mimeType;
  }

  get sizeBytesValue(): bigint {
    return this.sizeBytes;
  }

  get titleValue(): string | null {
    return this.title;
  }

  get altTextValue(): string | null {
    return this.altText;
  }

  get uploadedByUserIdValue(): UserId | null {
    return this.uploadedByUserId;
  }

  get createdAtValue(): Date {
    return this.createdAt;
  }

  // ============================================
  // Domain Events
  // ============================================

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
