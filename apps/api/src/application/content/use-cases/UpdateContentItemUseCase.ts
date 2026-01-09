import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { Slug } from '../../../domain/content/value-objects/Slug';
import { TimeToBenefit } from '../../../domain/content/value-objects/TimeToBenefit';
import { ContentFormat } from '../../../domain/content/value-objects/ContentFormat';
import { SupportLevel } from '../../../domain/content/value-objects/SupportLevel';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ContentRevision } from '../../../domain/content/entities/ContentRevision';
import { UpdateContentItemRequestDto, ContentItemResponseDto } from '../dto/ContentDtos';
import { ValidationError, NotFoundError } from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Обновить контент-айтем
 */
export class UpdateContentItemUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    id: string,
    dto: UpdateContentItemRequestDto,
    updatedByUserId: UserId | null,
  ): Promise<ContentItemResponseDto> {
    // 1. Получить контент-айтем
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    // 2. Валидация входных данных
    this.validateInput(dto);

    // 3. Подготовка обновлений
    const updates: {
      title?: string;
      slug?: Slug;
      excerpt?: string | null;
      bodyMarkdown?: string | null;
      timeToBenefit?: TimeToBenefit | null;
      format?: ContentFormat | null;
      supportLevel?: SupportLevel | null;
      metaTitle?: string | null;
      metaDescription?: string | null;
      canonicalUrl?: string | null;
    } = {};

    if (dto.title !== undefined) {
      updates.title = dto.title;
    }

    if (dto.slug !== undefined) {
      const newSlug = Slug.fromString(dto.slug);
      // Проверка уникальности slug (исключая текущий айтем)
      const exists = await this.contentItemRepository.existsBySlug(
        contentItem.contentTypeValue,
        newSlug,
        contentItemId,
      );
      if (exists) {
        throw new ValidationError(
          `Content item with type "${contentItem.contentTypeValue.toString()}" and slug "${newSlug.getValue()}" already exists`,
        );
      }
      updates.slug = newSlug;
    }

    if (dto.excerpt !== undefined) {
      updates.excerpt = dto.excerpt;
    }

    if (dto.bodyMarkdown !== undefined) {
      updates.bodyMarkdown = dto.bodyMarkdown;
    }

    if (dto.timeToBenefit !== undefined) {
      updates.timeToBenefit = dto.timeToBenefit ? TimeToBenefit.fromString(dto.timeToBenefit) : null;
    }

    if (dto.format !== undefined) {
      updates.format = dto.format ? ContentFormat.fromString(dto.format) : null;
    }

    if (dto.supportLevel !== undefined) {
      updates.supportLevel = dto.supportLevel ? SupportLevel.fromString(dto.supportLevel) : null;
    }

    if (dto.metaTitle !== undefined) {
      updates.metaTitle = dto.metaTitle;
    }

    if (dto.metaDescription !== undefined) {
      updates.metaDescription = dto.metaDescription;
    }

    if (dto.canonicalUrl !== undefined) {
      updates.canonicalUrl = dto.canonicalUrl;
    }

    // 4. Сохранить текущую версию как ревизию перед обновлением
    const revision = ContentRevision.create(
      contentItemId,
      contentItem.bodyMarkdownValue,
      {
        title: contentItem.titleValue,
        excerpt: contentItem.excerptValue,
        metaTitle: contentItem.metaTitleValue,
        metaDescription: contentItem.metaDescriptionValue,
      },
      updatedByUserId,
    );
    await this.contentItemRepository.saveRevision(revision);

    // 5. Применить обновления
    contentItem.update(updates);

    // 6. Сохранение
    await this.contentItemRepository.save(contentItem);

    // 6.1. Обновление тем и тегов (если указаны)
    if (dto.topicCodes !== undefined) {
      await this.contentItemRepository.saveTopics(contentItemId, dto.topicCodes);
    }

    if (dto.tagIds !== undefined) {
      await this.contentItemRepository.saveTags(contentItemId, dto.tagIds);
    }

    // 7. Публикация доменных событий
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

  private validateInput(dto: UpdateContentItemRequestDto): void {
    if (dto.title !== undefined) {
      if (!dto.title || dto.title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }

      if (dto.title.length > 500) {
        throw new ValidationError('Title must be at most 500 characters long');
      }
    }

    if (dto.excerpt !== undefined && dto.excerpt !== null) {
      if (dto.excerpt.length > 1000) {
        throw new ValidationError('Excerpt must be at most 1000 characters long');
      }
    }
  }
}
