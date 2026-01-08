import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import {
  FinalizeMediaUploadRequestDto,
  FinalizeMediaUploadResponseDto,
} from '../dto/MediaDtos';
import {
  ValidationError,
  ApplicationError,
} from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';

/**
 * Use Case: Завершить загрузку медиа-файла (подтвердить, что файл загружен в S3)
 */
export class FinalizeMediaUploadUseCase {
  constructor(
    private readonly mediaAssetRepository: IMediaAssetRepository,
    private readonly storageService: IStorageService,
    private readonly eventBus: IEventBus
  ) {}

  async execute(
    dto: FinalizeMediaUploadRequestDto
  ): Promise<FinalizeMediaUploadResponseDto> {
    // 1. Валидация
    if (!dto.mediaAssetId || dto.mediaAssetId.trim().length === 0) {
      throw new ValidationError('Media asset ID is required');
    }

    // 2. Находим медиа-актив
    const mediaAssetId = MediaAssetId.fromString(dto.mediaAssetId);
    const mediaAsset = await this.mediaAssetRepository.findById(mediaAssetId);

    if (!mediaAsset) {
      throw new ApplicationError('Media asset not found');
    }

    // 3. Проверяем, не завершена ли уже загрузка
    if (mediaAsset.isUploaded()) {
      // Идемпотентность: если уже завершено, возвращаем существующий URL
      return {
        mediaAssetId: mediaAsset.mediaAssetId.value,
        publicUrl: mediaAsset.publicUrlValue,
      };
    }

    // 4. Проверяем, существует ли объект в S3
    const exists = await this.storageService.objectExists(
      mediaAsset.objectKeyValue,
      mediaAsset.mediaTypeValue
    );

    if (!exists) {
      throw new ApplicationError(
        'File not found in storage. Please upload the file first.'
      );
    }

    // 5. Генерируем публичный URL
    const publicUrl = this.storageService.generatePublicUrl(
      mediaAsset.objectKeyValue,
      mediaAsset.mediaTypeValue
    );

    // 6. Завершаем загрузку (устанавливаем публичный URL)
    mediaAsset.finalizeUpload(publicUrl);

    // 7. Сохраняем изменения
    await this.mediaAssetRepository.save(mediaAsset);

    // 8. Публикуем доменные события
    const events = mediaAsset.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
    mediaAsset.clearDomainEvents();

    return {
      mediaAssetId: mediaAsset.mediaAssetId.value,
      publicUrl,
    };
  }
}
