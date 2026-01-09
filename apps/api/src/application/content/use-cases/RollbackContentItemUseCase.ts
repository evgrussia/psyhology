import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ContentItemResponseDto } from '../dto/ContentDtos';
import { NotFoundError } from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { ContentItemMapper } from '../mappers/ContentItemMapper';
import { ContentRevision } from '../../../domain/content/entities/ContentRevision';

/**
 * Use Case: Откатить контент-айтем к предыдущей ревизии
 */
export class RollbackContentItemUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    id: string,
    revisionId: string,
    rolledBackBy: UserId | null,
  ): Promise<ContentItemResponseDto> {
    // 1. Получить контент-айтем
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    // 2. Получить ревизию
    const revision = await this.contentItemRepository.getRevisionById(revisionId);

    if (!revision) {
      throw new NotFoundError(`Revision with id "${revisionId}" not found`);
    }

    // 3. Проверка, что ревизия принадлежит этому контент-айтему
    if (!revision.contentItemIdValue.equals(contentItemId)) {
      throw new NotFoundError(`Revision does not belong to content item`);
    }

    // 4. Откат: обновляем контент данными из ревизии
    const updates: {
      bodyMarkdown?: string | null;
      title?: string;
      excerpt?: string | null;
      metaTitle?: string | null;
      metaDescription?: string | null;
    } = {};

    if (revision.bodyMarkdownValue !== null) {
      updates.bodyMarkdown = revision.bodyMarkdownValue;
    }

    // Восстанавливаем метаданные из meta
    if (revision.metaValue) {
      if (revision.metaValue.title) {
        updates.title = revision.metaValue.title as string;
      }

      if (revision.metaValue.excerpt !== undefined) {
        updates.excerpt = revision.metaValue.excerpt as string | null;
      }

      if (revision.metaValue.metaTitle !== undefined) {
        updates.metaTitle = revision.metaValue.metaTitle as string | null;
      }

      if (revision.metaValue.metaDescription !== undefined) {
        updates.metaDescription = revision.metaValue.metaDescription as string | null;
      }
    }

    contentItem.update(updates);

    // 5. Сохранение
    await this.contentItemRepository.save(contentItem);

    // 6. Публикация доменных событий
    const events = contentItem.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
    }
    contentItem.clearDomainEvents();

    // 7. Получение тем и тегов для ответа
    const topicCodes = await this.contentItemRepository.getTopicCodes(contentItemId);
    const tagIds = await this.contentItemRepository.getTagIds(contentItemId);

    // 8. Возврат результата
    return ContentItemMapper.toDto(contentItem, topicCodes, tagIds);
  }
}
