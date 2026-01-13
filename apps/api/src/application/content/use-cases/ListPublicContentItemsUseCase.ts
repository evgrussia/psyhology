import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { ContentStatus } from '../../../domain/content/value-objects/ContentStatus';
import {
  ListPublicContentItemsRequestDto,
  ListPublicContentItemsResponseDto,
  PublicContentListItemResponseDto,
} from '../dto/ContentDtos';
import { ValidationError } from '../../shared/errors/ApplicationError';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Получить список опубликованного контента по типу (для public API)
 */
export class ListPublicContentItemsUseCase {
  constructor(private readonly contentItemRepository: IContentItemRepository) {}

  async execute(
    contentType: string,
    dto: ListPublicContentItemsRequestDto,
  ): Promise<ListPublicContentItemsResponseDto> {
    const limit = dto.limit !== undefined ? dto.limit : 50;
    const offset = dto.offset !== undefined ? dto.offset : 0;

    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative');
    }

    const type = ContentType.fromString(contentType);

    const items = await this.contentItemRepository.findMany({
      contentType: type,
      status: ContentStatus.Published,
      topicCodes: dto.topicCodes,
      tagIds: dto.tagIds,
    });

    const paginated = items.slice(offset, offset + limit);

    const itemsWithRelations: PublicContentListItemResponseDto[] = await Promise.all(
      paginated.map(async (item) => {
        const topicCodes = await this.contentItemRepository.getTopicCodes(item.contentItemId);
        const tagIds = await this.contentItemRepository.getTagIds(item.contentItemId);
        return ContentItemMapper.toPublicListItemDto(item, topicCodes, tagIds);
      }),
    );

    return {
      items: itemsWithRelations,
      total: items.length,
      limit,
      offset,
    };
  }
}

