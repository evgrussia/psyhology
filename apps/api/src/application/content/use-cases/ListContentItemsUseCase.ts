import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { ContentStatus } from '../../../domain/content/value-objects/ContentStatus';
import { ListContentItemsRequestDto, ListContentItemsResponseDto } from '../dto/ContentDtos';
import { ValidationError } from '../../shared/errors/ApplicationError';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Получить список контент-айтемов (для admin API)
 */
export class ListContentItemsUseCase {
  constructor(private readonly contentItemRepository: IContentItemRepository) {}

  async execute(dto: ListContentItemsRequestDto): Promise<ListContentItemsResponseDto> {
    // Валидация
    const limit = dto.limit !== undefined ? dto.limit : 50;
    const offset = dto.offset !== undefined ? dto.offset : 0;

    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new ValidationError('Offset must be non-negative');
    }

    // Подготовка фильтров
    const contentType = dto.contentType ? ContentType.fromString(dto.contentType) : undefined;
    const status = dto.status ? ContentStatus.fromString(dto.status) : undefined;

    // Получение списка
    const items = await this.contentItemRepository.findMany({
      contentType,
      status,
      authorUserId: dto.authorUserId,
      topicCodes: dto.topicCodes,
      tagIds: dto.tagIds,
    });

    // Применение пагинации (упрощённая версия, в реальности нужно делать на уровне БД)
    const paginatedItems = items.slice(offset, offset + limit);

    // Получаем темы и теги для каждого элемента
    const itemsWithRelations = await Promise.all(
      paginatedItems.map(async (item) => {
        const topicCodes = await this.contentItemRepository.getTopicCodes(item.contentItemId);
        const tagIds = await this.contentItemRepository.getTagIds(item.contentItemId);
        return ContentItemMapper.toDto(item, topicCodes, tagIds);
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
