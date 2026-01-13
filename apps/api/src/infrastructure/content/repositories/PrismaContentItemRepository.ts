import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItem } from '../../../domain/content/aggregates/ContentItem';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { ContentType } from '../../../domain/content/value-objects/ContentType';
import { Slug } from '../../../domain/content/value-objects/Slug';
import { ContentStatus } from '../../../domain/content/value-objects/ContentStatus';
import { ContentRevision } from '../../../domain/content/entities/ContentRevision';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ContentItemMapper } from '../mappers/ContentItemMapper';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация ContentItemRepository через Prisma
 */
export class PrismaContentItemRepository implements IContentItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(contentItem: ContentItem): Promise<void> {
    const data = ContentItemMapper.toPrisma(contentItem);

    await this.prisma.contentItem.upsert({
      where: { id: data.id },
      create: data,
      update: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        bodyMarkdown: data.bodyMarkdown,
        status: data.status,
        publishedAt: data.publishedAt,
        timeToBenefit: data.timeToBenefit,
        format: data.format,
        supportLevel: data.supportLevel,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonicalUrl: data.canonicalUrl,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: ContentItemId): Promise<ContentItem | null> {
    const record = await this.prisma.contentItem.findUnique({
      where: { id: id.value },
      include: {
        topics: true,
        tags: true,
        media: true,
      },
    });

    if (!record) {
      return null;
    }

    return ContentItemMapper.toDomain(record);
  }

  async findBySlug(contentType: ContentType, slug: Slug): Promise<ContentItem | null> {
    const record = await this.prisma.contentItem.findUnique({
      where: {
        contentType_slug: {
          contentType: contentType.toString(),
          slug: slug.getValue(),
        },
      },
      include: {
        topics: true,
        tags: true,
        media: true,
      },
    });

    if (!record) {
      return null;
    }

    return ContentItemMapper.toDomain(record);
  }

  async existsBySlug(
    contentType: ContentType,
    slug: Slug,
    excludeId?: ContentItemId,
  ): Promise<boolean> {
    const record = await this.prisma.contentItem.findUnique({
      where: {
        contentType_slug: {
          contentType: contentType.toString(),
          slug: slug.getValue(),
        },
      },
    });

    if (!record) {
      return false;
    }

    // Если есть excludeId и это тот же айтем, то считаем что не существует
    if (excludeId && record.id === excludeId.value) {
      return false;
    }

    return true;
  }

  async findMany(filters?: {
    contentType?: ContentType;
    status?: ContentStatus;
    authorUserId?: string;
    topicCodes?: string[];
    tagIds?: string[];
  }): Promise<ContentItem[]> {
    const where: any = {};

    if (filters?.contentType) {
      where.contentType = filters.contentType.toString();
    }

    if (filters?.status) {
      where.status = filters.status.toString();
    }

    if (filters?.authorUserId) {
      where.authorUserId = filters.authorUserId;
    }

    if (filters?.topicCodes && filters.topicCodes.length > 0) {
      where.topics = {
        some: {
          topicCode: {
            in: filters.topicCodes,
          },
        },
      };
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: filters.tagIds,
          },
        },
      };
    }

    const records = await this.prisma.contentItem.findMany({
      where,
      include: {
        topics: true,
        tags: true,
        media: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => ContentItemMapper.toDomain(record));
  }

  async delete(id: ContentItemId): Promise<void> {
    await this.prisma.contentItem.delete({
      where: { id: id.value },
    });
  }

  async saveTopics(contentItemId: ContentItemId, topicCodes: string[]): Promise<void> {
    // Удаляем все существующие связи
    await this.prisma.contentItemTopic.deleteMany({
      where: { contentItemId: contentItemId.value },
    });

    // Создаём новые связи
    if (topicCodes.length > 0) {
      await this.prisma.contentItemTopic.createMany({
        data: topicCodes.map((topicCode) => ({
          contentItemId: contentItemId.value,
          topicCode,
        })),
        skipDuplicates: true,
      });
    }
  }

  async saveTags(contentItemId: ContentItemId, tagIds: string[]): Promise<void> {
    // Удаляем все существующие связи
    await this.prisma.contentItemTag.deleteMany({
      where: { contentItemId: contentItemId.value },
    });

    // Создаём новые связи
    if (tagIds.length > 0) {
      await this.prisma.contentItemTag.createMany({
        data: tagIds.map((tagId) => ({
          contentItemId: contentItemId.value,
          tagId,
        })),
        skipDuplicates: true,
      });
    }
  }

  async getTopicCodes(contentItemId: ContentItemId): Promise<string[]> {
    const relations = await this.prisma.contentItemTopic.findMany({
      where: { contentItemId: contentItemId.value },
      select: { topicCode: true },
    });

    return relations.map((r) => r.topicCode);
  }

  async getTagIds(contentItemId: ContentItemId): Promise<string[]> {
    const relations = await this.prisma.contentItemTag.findMany({
      where: { contentItemId: contentItemId.value },
      select: { tagId: true },
    });

    return relations.map((r) => r.tagId);
  }

  async saveRevision(revision: ContentRevision): Promise<void> {
    await this.prisma.contentRevision.create({
      data: {
        id: revision.revisionId,
        contentItemId: revision.contentItemIdValue.value,
        bodyMarkdown: revision.bodyMarkdownValue,
        meta: revision.metaValue ? (revision.metaValue as any) : null,
        changedByUserId: revision.changedByUserIdValue?.value || null,
        createdAt: revision.createdAtValue,
      },
    });
  }

  async getRevisions(contentItemId: ContentItemId): Promise<ContentRevision[]> {
    const records = await this.prisma.contentRevision.findMany({
      where: { contentItemId: contentItemId.value },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) =>
      ContentRevision.reconstitute({
        id: record.id,
        contentItemId: ContentItemId.fromString(record.contentItemId),
        bodyMarkdown: record.bodyMarkdown,
        meta: record.meta as Record<string, unknown> | null,
        changedByUserId: record.changedByUserId
          ? UserId.create(record.changedByUserId)
          : null,
        createdAt: record.createdAt,
      }),
    );
  }

  async getRevisionById(revisionId: string): Promise<ContentRevision | null> {
    const record = await this.prisma.contentRevision.findUnique({
      where: { id: revisionId },
    });

    if (!record) {
      return null;
    }

    return ContentRevision.reconstitute({
      id: record.id,
      contentItemId: ContentItemId.fromString(record.contentItemId),
      bodyMarkdown: record.bodyMarkdown,
      meta: record.meta as Record<string, unknown> | null,
      changedByUserId: record.changedByUserId ? UserId.create(record.changedByUserId) : null,
      createdAt: record.createdAt,
    });
  }
}
