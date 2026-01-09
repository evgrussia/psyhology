import { ContentItem } from '../../../domain/content/aggregates/ContentItem';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { ContentStatus } from '../../../domain/content/value-objects/ContentStatus';
import { Slug } from '../../../domain/content/value-objects/Slug';
import { TimeToBenefit } from '../../../domain/content/value-objects/TimeToBenefit';
import { ContentFormat } from '../../../domain/content/value-objects/ContentFormat';
import { SupportLevel } from '../../../domain/content/value-objects/SupportLevel';
import { UserId } from '../../../domain/identity/value-objects/Ids';
/**
 * Mapper для преобразования между Prisma и Domain моделями
 */
export class ContentItemMapper {
  static toDomain(record: any): ContentItem {
    return ContentItem.reconstitute({
      id: ContentItemId.fromString(record.id),
      contentType: ContentType.fromString(record.contentType),
      slug: Slug.fromString(record.slug),
      title: record.title,
      excerpt: record.excerpt,
      bodyMarkdown: record.bodyMarkdown,
      status: ContentStatus.fromString(record.status),
      publishedAt: record.publishedAt,
      authorUserId: record.authorUserId ? UserId.create(record.authorUserId) : null,
      timeToBenefit: record.timeToBenefit ? TimeToBenefit.fromString(record.timeToBenefit) : null,
      format: record.format ? ContentFormat.fromString(record.format) : null,
      supportLevel: record.supportLevel ? SupportLevel.fromString(record.supportLevel) : null,
      metaTitle: record.metaTitle || null,
      metaDescription: record.metaDescription || null,
      canonicalUrl: record.canonicalUrl || null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPrisma(contentItem: ContentItem): {
    id: string;
    contentType: string;
    slug: string;
    title: string;
    excerpt: string | null;
    bodyMarkdown: string | null;
    status: string;
    publishedAt: Date | null;
    authorUserId: string | null;
    timeToBenefit: string | null;
    format: string | null;
    supportLevel: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: contentItem.contentItemId.value,
      contentType: contentItem.contentTypeValue.toString(),
      slug: contentItem.slugValue.getValue(),
      title: contentItem.titleValue,
      excerpt: contentItem.excerptValue,
      bodyMarkdown: contentItem.bodyMarkdownValue,
      status: contentItem.statusValue.toString(),
      publishedAt: contentItem.publishedAtValue,
      authorUserId: contentItem.authorUserIdValue?.value || null,
      timeToBenefit: contentItem.timeToBenefitValue?.getValue() || null,
      format: contentItem.formatValue?.getValue() || null,
      supportLevel: contentItem.supportLevelValue?.getValue() || null,
      metaTitle: contentItem.metaTitleValue,
      metaDescription: contentItem.metaDescriptionValue,
      canonicalUrl: contentItem.canonicalUrlValue,
      createdAt: contentItem.createdAtValue,
      updatedAt: contentItem.updatedAtValue,
    };
  }
}
