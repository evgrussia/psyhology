import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { Slug } from '../../../domain/content/value-objects/Slug';
import { PublicContentItemResponseDto } from '../dto/ContentDtos';
import { NotFoundError } from '../../shared/errors/ApplicationError';
import { ContentItemMapper } from '../mappers/ContentItemMapper';
import { IMarkdownRenderer } from '../services/IMarkdownRenderer';

/**
 * Use Case: Получить опубликованный контент-айтем по типу и slug (для public API)
 */
export class GetContentItemBySlugUseCase {
  constructor(
    private readonly contentItemRepository: IContentItemRepository,
    private readonly markdownRenderer: IMarkdownRenderer,
  ) {}

  async execute(contentType: string, slug: string): Promise<PublicContentItemResponseDto> {
    const type = ContentType.fromString(contentType);
    const slugValue = Slug.fromString(slug);

    const contentItem = await this.contentItemRepository.findBySlug(type, slugValue);

    if (!contentItem) {
      throw new NotFoundError(`Content item with type "${contentType}" and slug "${slug}" not found`);
    }

    // Проверяем, что контент опубликован
    if (!contentItem.statusValue.isPublished()) {
      throw new NotFoundError(`Content item with type "${contentType}" and slug "${slug}" not found`);
    }

    // Рендерим markdown в HTML
    const bodyHtml = contentItem.bodyMarkdownValue
      ? await this.markdownRenderer.render(contentItem.bodyMarkdownValue)
      : null;

    return ContentItemMapper.toPublicDto(contentItem, bodyHtml);
  }
}
