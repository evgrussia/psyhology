import { ContentItem } from '../../../domain/content/aggregates/ContentItem';
import {
  ContentItemResponseDto,
  PublicContentItemResponseDto,
  PublicContentListItemResponseDto,
} from '../dto/ContentDtos';

/**
 * Mapper для преобразования между domain объектами и DTOs
 */
export class ContentItemMapper {
  /**
   * Преобразовать ContentItem в ContentItemResponseDto (для admin API)
   */
  static toDto(
    contentItem: ContentItem,
    topicCodes: string[] = [],
    tagIds: string[] = [],
  ): ContentItemResponseDto {
    return {
      id: contentItem.contentItemId.value,
      contentType: contentItem.contentTypeValue.toString(),
      slug: contentItem.slugValue.getValue(),
      title: contentItem.titleValue,
      excerpt: contentItem.excerptValue,
      bodyMarkdown: contentItem.bodyMarkdownValue,
      status: contentItem.statusValue.toString(),
      publishedAt: contentItem.publishedAtValue?.toISOString() || null,
      authorUserId: contentItem.authorUserIdValue?.value || null,
      timeToBenefit: contentItem.timeToBenefitValue?.getValue() || null,
      format: contentItem.formatValue?.getValue() || null,
      supportLevel: contentItem.supportLevelValue?.getValue() || null,
      metaTitle: contentItem.metaTitleValue,
      metaDescription: contentItem.metaDescriptionValue,
      canonicalUrl: contentItem.canonicalUrlValue,
      topicCodes,
      tagIds,
      createdAt: contentItem.createdAtValue.toISOString(),
      updatedAt: contentItem.updatedAtValue.toISOString(),
    };
  }

  /**
   * Преобразовать ContentItem в PublicContentItemResponseDto (для public API)
   * Не включает bodyMarkdown, включает bodyHtml (рендеренный)
   */
  static toPublicDto(contentItem: ContentItem, bodyHtml?: string | null): PublicContentItemResponseDto {
    if (!contentItem.statusValue.isPublished()) {
      throw new Error('Cannot create public DTO for non-published content');
    }

    if (!contentItem.publishedAtValue) {
      throw new Error('Published content must have publishedAt');
    }

    return {
      id: contentItem.contentItemId.value,
      contentType: contentItem.contentTypeValue.toString(),
      slug: contentItem.slugValue.getValue(),
      title: contentItem.titleValue,
      excerpt: contentItem.excerptValue,
      bodyHtml: bodyHtml || null,
      publishedAt: contentItem.publishedAtValue.toISOString(),
      authorUserId: contentItem.authorUserIdValue?.value || null,
      timeToBenefit: contentItem.timeToBenefitValue?.getValue() || null,
      format: contentItem.formatValue?.getValue() || null,
      supportLevel: contentItem.supportLevelValue?.getValue() || null,
      metaTitle: contentItem.metaTitleValue,
      metaDescription: contentItem.metaDescriptionValue,
      canonicalUrl: contentItem.canonicalUrlValue,
      createdAt: contentItem.createdAtValue.toISOString(),
      updatedAt: contentItem.updatedAtValue.toISOString(),
    };
  }

  /**
   * Преобразовать ContentItem в PublicContentListItemResponseDto (для списка в public API)
   * Не включает bodyMarkdown/bodyHtml, но включает темы/теги.
   */
  static toPublicListItemDto(
    contentItem: ContentItem,
    topicCodes: string[] = [],
    tagIds: string[] = [],
  ): PublicContentListItemResponseDto {
    if (!contentItem.statusValue.isPublished()) {
      throw new Error('Cannot create public list DTO for non-published content');
    }

    if (!contentItem.publishedAtValue) {
      throw new Error('Published content must have publishedAt');
    }

    return {
      id: contentItem.contentItemId.value,
      contentType: contentItem.contentTypeValue.toString(),
      slug: contentItem.slugValue.getValue(),
      title: contentItem.titleValue,
      excerpt: contentItem.excerptValue,
      publishedAt: contentItem.publishedAtValue.toISOString(),
      authorUserId: contentItem.authorUserIdValue?.value || null,
      timeToBenefit: contentItem.timeToBenefitValue?.getValue() || null,
      format: contentItem.formatValue?.getValue() || null,
      supportLevel: contentItem.supportLevelValue?.getValue() || null,
      metaTitle: contentItem.metaTitleValue,
      metaDescription: contentItem.metaDescriptionValue,
      canonicalUrl: contentItem.canonicalUrlValue,
      topicCodes,
      tagIds,
      createdAt: contentItem.createdAtValue.toISOString(),
      updatedAt: contentItem.updatedAtValue.toISOString(),
    };
  }
}
