import { ContentItem } from '../aggregates/ContentItem';
import { ContentItemId } from '../value-objects/ContentItemId';
import { ContentType } from '../value-objects/ContentType';
import { Slug } from '../value-objects/Slug';
import { ContentStatus } from '../value-objects/ContentStatus';
import { ContentRevision } from '../entities/ContentRevision';

/**
 * Repository Interface для ContentItem
 * Определяет операции для работы с контент-айтемами
 */
export interface IContentItemRepository {
  /**
   * Сохранить контент-айтем (create или update)
   */
  save(contentItem: ContentItem): Promise<void>;

  /**
   * Найти контент-айтем по ID
   */
  findById(id: ContentItemId): Promise<ContentItem | null>;

  /**
   * Найти контент-айтем по типу и slug
   * Используется для публичной выдачи
   */
  findBySlug(contentType: ContentType, slug: Slug): Promise<ContentItem | null>;

  /**
   * Проверить, существует ли контент-айтем с данным типом и slug
   * Используется для валидации уникальности перед созданием/обновлением
   */
  existsBySlug(contentType: ContentType, slug: Slug, excludeId?: ContentItemId): Promise<boolean>;

  /**
   * Получить список контент-айтемов
   * @param filters Фильтры (тип, статус, автор и т.д.)
   * @param pagination Пагинация (offset, limit)
   */
  findMany(filters?: {
    contentType?: ContentType;
    status?: ContentStatus;
    authorUserId?: string;
    topicCodes?: string[];
    tagIds?: string[];
  }): Promise<ContentItem[]>;

  /**
   * Удалить контент-айтем
   */
  delete(id: ContentItemId): Promise<void>;

  /**
   * Сохранить связи контент-айтема с темами
   */
  saveTopics(contentItemId: ContentItemId, topicCodes: string[]): Promise<void>;

  /**
   * Сохранить связи контент-айтема с тегами
   */
  saveTags(contentItemId: ContentItemId, tagIds: string[]): Promise<void>;

  /**
   * Получить коды тем для контент-айтема
   */
  getTopicCodes(contentItemId: ContentItemId): Promise<string[]>;

  /**
   * Получить ID тегов для контент-айтема
   */
  getTagIds(contentItemId: ContentItemId): Promise<string[]>;

  /**
   * Сохранить ревизию контент-айтема
   */
  saveRevision(revision: ContentRevision): Promise<void>;

  /**
   * Получить список ревизий контент-айтема
   */
  getRevisions(contentItemId: ContentItemId): Promise<ContentRevision[]>;

  /**
   * Получить ревизию по ID
   */
  getRevisionById(revisionId: string): Promise<ContentRevision | null>;
}
