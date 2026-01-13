import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ContentItemResponseDto, PublishContentItemRequestDto } from '../dto/ContentDtos';
import { NotFoundError, ValidationError } from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Опубликовать контент-айтем
 * Требует прохождения QA checklist
 */
export class PublishContentItemUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    id: string,
    dto: PublishContentItemRequestDto,
    publishedBy: UserId | null,
  ): Promise<ContentItemResponseDto> {
    // 1. Валидация QA checklist
    if (!dto.qaChecklist) {
      throw new ValidationError('QA checklist is required for publication');
    }

    // 2. Получить контент-айтем
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    // 3. Публикация (с проверкой QA checklist)
    contentItem.publish(dto.qaChecklist);

    // 4. Сохранение
    await this.contentItemRepository.save(contentItem);

    // 5. Публикация доменных событий
    const events = contentItem.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
    }
    contentItem.clearDomainEvents();

    // 6. Получение тем и тегов для ответа
    const topicCodes = await this.contentItemRepository.getTopicCodes(contentItemId);
    const tagIds = await this.contentItemRepository.getTagIds(contentItemId);

    // 7. Возврат результата
    return ContentItemMapper.toDto(contentItem, topicCodes, tagIds);
  }
}
