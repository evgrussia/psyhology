import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import {
  ListMediaAssetsRequestDto,
  ListMediaAssetsResponseDto,
  MediaAssetDto,
} from '../dto/MediaDtos';
import { ValidationError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Получить список медиа-активов
 */
export class ListMediaAssetsUseCase {
  constructor(
    private readonly mediaAssetRepository: IMediaAssetRepository
  ) {}

  async execute(
    dto: ListMediaAssetsRequestDto
  ): Promise<ListMediaAssetsResponseDto> {
    // 1. Валидация
    const limit = dto.limit || 50;
    const offset = dto.offset || 0;

    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative');
    }

    // 2. Получаем медиа-активы
    const mediaAssets = await this.mediaAssetRepository.findAll({
      mediaType: dto.mediaType,
      uploadedByUserId: dto.uploadedByUserId,
      limit,
      offset,
    });

    // 3. Преобразуем в DTO
    const items: MediaAssetDto[] = mediaAssets.map((asset) => ({
      id: asset.mediaAssetId.value,
      publicUrl: asset.publicUrlValue,
      mediaType: asset.mediaTypeValue.toString(),
      mimeType: asset.mimeTypeValue,
      sizeBytes: Number(asset.sizeBytesValue),
      title: asset.titleValue,
      altText: asset.altTextValue,
      uploadedByUserId: asset.uploadedByUserIdValue?.value || null,
      createdAt: asset.createdAtValue,
    }));

    // TODO: Получить общее количество для пагинации
    // Пока возвращаем только загруженные элементы
    const total = items.length;

    return {
      items,
      total,
      limit,
      offset,
    };
  }
}
