import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { DeleteMediaAssetRequestDto } from '../dto/MediaDtos';
import {
  ValidationError,
  ApplicationError,
  AuthorizationError,
} from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';

/**
 * Use Case: Удалить медиа-актив
 */
export class DeleteMediaAssetUseCase {
  constructor(
    private readonly mediaAssetRepository: IMediaAssetRepository,
    private readonly storageService: IStorageService,
    private readonly eventBus: IEventBus
  ) {}

  async execute(
    dto: DeleteMediaAssetRequestDto,
    deletedByUserId: UserId | null
  ): Promise<void> {
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

    // 3. Проверяем права доступа
    if (!dto.force && !mediaAsset.canBeDeletedBy(deletedByUserId)) {
      throw new AuthorizationError(
        'You do not have permission to delete this media asset'
      );
    }

    // 4. Проверяем, используется ли медиа в контенте
    if (!dto.force) {
      const isUsed = await this.mediaAssetRepository.isUsedInContent(
        mediaAssetId
      );
      if (isUsed) {
        throw new ApplicationError(
          'Cannot delete media asset: it is used in content. Use force=true to delete anyway.'
        );
      }
    }

    // 5. Удаляем объект из S3
    try {
      await this.storageService.deleteObject(
        mediaAsset.objectKeyValue,
        mediaAsset.mediaTypeValue
      );
    } catch (error) {
      // Логируем ошибку, но продолжаем удаление записи из БД
      console.error('Failed to delete object from storage:', error);
      // Можно добавить retry логику или пометить для фонового удаления
    }

    // 6. Помечаем для удаления (публикуем событие)
    mediaAsset.markForDeletion();

    // 7. Удаляем из БД
    await this.mediaAssetRepository.delete(mediaAssetId);

    // 8. Публикуем доменные события
    const events = mediaAsset.getDomainEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }
}
