import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { EntityId } from '../../../domain/shared/value-objects/EntityId';
import {
  CreateMediaAssetRequestDto,
  CreateMediaAssetResponseDto,
} from '../dto/MediaDtos';
import {
  ValidationError,
  ApplicationError,
} from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';

/**
 * Use Case: Создать медиа-актив и получить pre-signed URL для загрузки
 */
export class CreateMediaAssetUseCase {
  constructor(
    private readonly mediaAssetRepository: IMediaAssetRepository,
    private readonly storageService: IStorageService,
    private readonly eventBus: IEventBus
  ) {}

  async execute(
    dto: CreateMediaAssetRequestDto,
    uploadedByUserId: UserId | null
  ): Promise<CreateMediaAssetResponseDto> {
    // 1. Валидация входных данных
    this.validateInput(dto);

    // 2. Определяем тип медиа из MIME типа
    let mediaType: MediaType;
    try {
      mediaType = MediaType.fromMimeType(dto.mimeType);
    } catch (error) {
      throw new ValidationError(
        `Unsupported MIME type: ${dto.mimeType}. Supported types: image/*, audio/*, application/pdf`
      );
    }

    // 3. Валидация размера файла
    if (dto.sizeBytes <= 0) {
      throw new ValidationError('File size must be greater than 0');
    }

    if (dto.sizeBytes > mediaType.getMaxSizeBytes()) {
      throw new ValidationError(
        `File size exceeds maximum allowed size for ${mediaType.toString()}: ${mediaType.getMaxSizeBytes()} bytes`
      );
    }

    // 4. Создаём MediaAsset (он сам генерирует ID)
    // Используем временный objectKey, затем обновим его
    const tempKey = ObjectKey.fromString(
      `temp/${EntityId.generate()}-${dto.filename}`
    );
    const mediaAsset = MediaAsset.create(
      mediaType,
      dto.mimeType,
      dto.sizeBytes,
      tempKey,
      uploadedByUserId,
      dto.title,
      dto.altText
    );

    // 5. Генерируем правильный objectKey с ID медиа-актива
    const objectKey = ObjectKey.generate(
      mediaType.toString(),
      dto.filename,
      { value: mediaAsset.mediaAssetId.value }
    );

    // 6. Проверяем, не существует ли уже объект с таким ключом
    const existing = await this.mediaAssetRepository.findByObjectKey(objectKey);
    if (existing) {
      throw new ApplicationError('Media asset with this key already exists');
    }

    // 7. Обновляем objectKey в MediaAsset (через reconstitute с новым ключом)
    // Для этого нужно пересоздать MediaAsset с правильным ключом
    const mediaAssetWithKey = MediaAsset.reconstitute({
      id: mediaAsset.mediaAssetId,
      storageProvider: mediaAsset.storageProviderValue,
      objectKey: objectKey,
      publicUrl: mediaAsset.publicUrlValue,
      mediaType: mediaAsset.mediaTypeValue,
      mimeType: mediaAsset.mimeTypeValue,
      sizeBytes: mediaAsset.sizeBytesValue,
      title: mediaAsset.titleValue,
      altText: mediaAsset.altTextValue,
      uploadedByUserId: mediaAsset.uploadedByUserIdValue,
      createdAt: mediaAsset.createdAtValue,
    });

    // 8. Сохраняем в БД
    await this.mediaAssetRepository.save(mediaAssetWithKey);

    // 9. Генерируем pre-signed URL для загрузки (TTL = 1 час)
    const uploadUrl = await this.storageService.generateUploadUrl(
      objectKey,
      mediaType,
      dto.mimeType,
      3600 // 1 час
    );

    // 10. Публикуем доменные события
    const events = mediaAssetWithKey.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    mediaAssetWithKey.clearDomainEvents();

    return {
      mediaAssetId: mediaAssetWithKey.mediaAssetId.value,
      uploadUrl,
      expiresAt: new Date(Date.now() + 3600 * 1000), // через 1 час
    };
  }

  private validateInput(dto: CreateMediaAssetRequestDto): void {
    if (!dto.filename || dto.filename.trim().length === 0) {
      throw new ValidationError('Filename is required');
    }

    if (!dto.mimeType || dto.mimeType.trim().length === 0) {
      throw new ValidationError('MIME type is required');
    }

    if (!dto.sizeBytes || dto.sizeBytes <= 0) {
      throw new ValidationError('File size is required and must be greater than 0');
    }
  }
}
