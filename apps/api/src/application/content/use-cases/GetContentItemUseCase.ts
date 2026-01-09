import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { ContentItemResponseDto } from '../dto/ContentDtos';
import { NotFoundError } from '../../shared/errors/ApplicationError';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Получить контент-айтем по ID (для admin API)
 */
export class GetContentItemUseCase {
  constructor(private readonly contentItemRepository: IContentItemRepository) {}

  async execute(id: string): Promise<ContentItemResponseDto> {
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    // Получаем темы и теги
    const topicCodes = await this.contentItemRepository.getTopicCodes(contentItemId);
    const tagIds = await this.contentItemRepository.getTagIds(contentItemId);

    return ContentItemMapper.toDto(contentItem, topicCodes, tagIds);
  }
}
