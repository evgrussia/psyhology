import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItem } from '../../../domain/content/aggregates/ContentItem';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { Slug } from '../../../domain/content/value-objects/Slug';
import { TimeToBenefit } from '../../../domain/content/value-objects/TimeToBenefit';
import { ContentFormat } from '../../../domain/content/value-objects/ContentFormat';
import { SupportLevel } from '../../../domain/content/value-objects/SupportLevel';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { CreateContentItemRequestDto, ContentItemResponseDto } from '../dto/ContentDtos';
import { ValidationError, ApplicationError } from '../../shared/errors/ApplicationError';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { ContentItemMapper } from '../mappers/ContentItemMapper';

/**
 * Use Case: Создать новый контент-айтем
 */
export class CreateContentItemUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    dto: CreateContentItemRequestDto,
    authorUserId: UserId | null,
  ): Promise<ContentItemResponseDto> {
    // 1. Валидация входных данных
    this.validateInput(dto);

    // 2. Парсинг типов
    const contentType = ContentType.fromString(dto.contentType);
    const timeToBenefit = dto.timeToBenefit ? TimeToBenefit.fromString(dto.timeToBenefit) : null;
    const format = dto.format ? ContentFormat.fromString(dto.format) : null;
    const supportLevel = dto.supportLevel ? SupportLevel.fromString(dto.supportLevel) : null;

    // 3. Генерация или валидация slug
    let slug: Slug;
    if (dto.slug) {
      slug = Slug.fromString(dto.slug);
    } else {
      slug = Slug.fromTitle(dto.title);
    }

    // 4. Проверка уникальности slug
    const exists = await this.contentItemRepository.existsBySlug(contentType, slug);
    if (exists) {
      throw new ValidationError(
        `Content item with type "${contentType.toString()}" and slug "${slug.getValue()}" already exists`,
      );
    }

    // 5. Создание контент-айтема
    const contentItem = ContentItem.create(contentType, dto.title, slug, authorUserId, {
      excerpt: dto.excerpt || null,
      bodyMarkdown: dto.bodyMarkdown || null,
      timeToBenefit,
      format,
      supportLevel,
      metaTitle: dto.metaTitle || null,
      metaDescription: dto.metaDescription || null,
      canonicalUrl: dto.canonicalUrl || null,
    });

    // 6. Сохранение
    await this.contentItemRepository.save(contentItem);

    // 6.1. Сохранение тем и тегов
    if (dto.topicCodes && dto.topicCodes.length > 0) {
      await this.contentItemRepository.saveTopics(contentItem.contentItemId, dto.topicCodes);
    }

    if (dto.tagIds && dto.tagIds.length > 0) {
      await this.contentItemRepository.saveTags(contentItem.contentItemId, dto.tagIds);
    }

    // 7. Публикация доменных событий
    const events = contentItem.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
    }
    contentItem.clearDomainEvents();

    // 8. Получение тем и тегов для ответа
    const topicCodes = await this.contentItemRepository.getTopicCodes(contentItem.contentItemId);
    const tagIds = await this.contentItemRepository.getTagIds(contentItem.contentItemId);

    // 9. Возврат результата
    return ContentItemMapper.toDto(contentItem, topicCodes, tagIds);
  }

  private validateInput(dto: CreateContentItemRequestDto): void {
    if (!dto.contentType || dto.contentType.trim().length === 0) {
      throw new ValidationError('Content type is required');
    }

    if (!dto.title || dto.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }

    if (dto.title.length > 500) {
      throw new ValidationError('Title must be at most 500 characters long');
    }

    if (dto.excerpt && dto.excerpt.length > 1000) {
      throw new ValidationError('Excerpt must be at most 1000 characters long');
    }
  }
}
