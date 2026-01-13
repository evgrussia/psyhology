import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ContentItemResponseDto } from '../dto/ContentDtos';
import { NotFoundError } from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Заархивировать контент-айтем
 */
export class ArchiveContentItemUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(id: string, archivedBy: UserId | null): Promise<ContentItemResponseDto> {
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    contentItem.archive();
    await this.contentItemRepository.save(contentItem);

    const events = contentItem.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
    }
    contentItem.clearDomainEvents();

    const topicCodes = await this.contentItemRepository.getTopicCodes(contentItemId);
    const tagIds = await this.contentItemRepository.getTagIds(contentItemId);
    return ContentItemMapper.toDto(contentItem, topicCodes, tagIds);
  }
}

