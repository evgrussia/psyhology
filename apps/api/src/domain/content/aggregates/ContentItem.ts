import { ContentItemId } from '../value-objects/ContentItemId';
import { ContentType } from '../value-objects/ContentType';
import { ContentStatus } from '../value-objects/ContentStatus';
import { Slug } from '../value-objects/Slug';
import { TimeToBenefit } from '../value-objects/TimeToBenefit';
import { ContentFormat } from '../value-objects/ContentFormat';
import { SupportLevel } from '../value-objects/SupportLevel';
import { UserId } from '../../identity/value-objects/Ids';
import { DomainError } from '../../shared/errors/DomainError';
import { DomainEvent } from '../../shared/events/DomainEvent';
import {
  ContentCreatedEvent,
  ContentUpdatedEvent,
  ContentPublishedEvent,
  ContentArchivedEvent,
} from '../events/ContentEvents';

/**
 * ContentItem Aggregate Root
 * Представляет единицу контента (статья, ресурс, лендинг, страница)
 */
export class ContentItem {
  private constructor(
    private readonly id: ContentItemId,
    private readonly contentType: ContentType,
    private slug: Slug,
    private title: string,
    private excerpt: string | null,
    private bodyMarkdown: string | null,
    private status: ContentStatus,
    private publishedAt: Date | null,
    private readonly authorUserId: UserId | null,
    private timeToBenefit: TimeToBenefit | null,
    private format: ContentFormat | null,
    private supportLevel: SupportLevel | null,
    private metaTitle: string | null,
    private metaDescription: string | null,
    private canonicalUrl: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private domainEvents: DomainEvent[] = [],
  ) {
    // Валидация бизнес-правил
    if (!title || title.trim().length === 0) {
      throw new DomainError('Title cannot be empty');
    }

    if (title.length > 500) {
      throw new DomainError('Title must be at most 500 characters long');
    }

    if (excerpt && excerpt.length > 1000) {
      throw new DomainError('Excerpt must be at most 1000 characters long');
    }

    if (metaTitle && metaTitle.length > 70) {
      throw new DomainError('Meta title must be at most 70 characters long (SEO best practice)');
    }

    if (metaDescription && metaDescription.length > 160) {
      throw new DomainError('Meta description must be at most 160 characters long (SEO best practice)');
    }

    if (canonicalUrl && canonicalUrl.length > 2048) {
      throw new DomainError('Canonical URL must be at most 2048 characters long');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Создание нового контент-айтема
   */
  static create(
    contentType: ContentType,
    title: string,
    slug: Slug,
    authorUserId: UserId | null,
    options?: {
      excerpt?: string | null;
      bodyMarkdown?: string | null;
      timeToBenefit?: TimeToBenefit | null;
      format?: ContentFormat | null;
      supportLevel?: SupportLevel | null;
      metaTitle?: string | null;
      metaDescription?: string | null;
      canonicalUrl?: string | null;
    },
  ): ContentItem {
    const now = new Date();

    const item = new ContentItem(
      ContentItemId.generate(),
      contentType,
      slug,
      title,
      options?.excerpt || null,
      options?.bodyMarkdown || null,
      ContentStatus.Draft,
      null,
      authorUserId,
      options?.timeToBenefit || null,
      options?.format || null,
      options?.supportLevel || null,
      options?.metaTitle || null,
      options?.metaDescription || null,
      options?.canonicalUrl || null,
      now,
      now,
    );

    item.addDomainEvent(new ContentCreatedEvent(item.id, contentType, authorUserId));

    return item;
  }

  /**
   * Восстановление из БД (reconstitute)
   */
  static reconstitute(data: {
    id: ContentItemId;
    contentType: ContentType;
    slug: Slug;
    title: string;
    excerpt: string | null;
    bodyMarkdown: string | null;
    status: ContentStatus;
    publishedAt: Date | null;
    authorUserId: UserId | null;
    timeToBenefit: TimeToBenefit | null;
    format: ContentFormat | null;
    supportLevel: SupportLevel | null;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): ContentItem {
    return new ContentItem(
      data.id,
      data.contentType,
      data.slug,
      data.title,
      data.excerpt,
      data.bodyMarkdown,
      data.status,
      data.publishedAt,
      data.authorUserId,
      data.timeToBenefit,
      data.format,
      data.supportLevel,
      data.metaTitle,
      data.metaDescription,
      data.canonicalUrl,
      data.createdAt,
      data.updatedAt,
      [], // события не восстанавливаем из БД
    );
  }

  // ============================================
  // Business Methods
  // ============================================

  /**
   * Обновить контент
   */
  update(
    updates: {
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
    },
  ): void {
    // Нельзя обновлять опубликованный контент напрямую (нужно через версионирование или статус review)
    // Для релиза 1 упрощаем: разрешаем обновление draft/review
    if (this.status.isPublished() || this.status.isArchived()) {
      // В будущем можно требовать снятие с публикации перед обновлением
      // throw new DomainError('Cannot update published or archived content without unpublishing first');
    }

    if (updates.title !== undefined) {
      this.title = updates.title;
    }

    if (updates.slug !== undefined) {
      // Проверка уникальности slug должна быть на уровне репозитория
      this.slug = updates.slug;
    }

    if (updates.excerpt !== undefined) {
      this.excerpt = updates.excerpt;
    }

    if (updates.bodyMarkdown !== undefined) {
      this.bodyMarkdown = updates.bodyMarkdown;
    }

    if (updates.timeToBenefit !== undefined) {
      this.timeToBenefit = updates.timeToBenefit;
    }

    if (updates.format !== undefined) {
      this.format = updates.format;
    }

    if (updates.supportLevel !== undefined) {
      this.supportLevel = updates.supportLevel;
    }

    if (updates.metaTitle !== undefined) {
      this.metaTitle = updates.metaTitle;
    }

    if (updates.metaDescription !== undefined) {
      this.metaDescription = updates.metaDescription;
    }

    if (updates.canonicalUrl !== undefined) {
      this.canonicalUrl = updates.canonicalUrl;
    }

    this.updatedAt = new Date();
    this.addDomainEvent(new ContentUpdatedEvent(this.id, this.authorUserId));
  }

  /**
   * Опубликовать контент
   * Требует прохождения QA checklist (минимум: дисклеймер, alt для изображений, CTA)
   */
  publish(qaChecklist: {
    hasDisclaimer: boolean;
    hasAltText: boolean;
    hasCta: boolean;
    additionalChecks?: Record<string, boolean>;
  }): void {
    if (!this.status.canBePublished()) {
      throw new DomainError(`Cannot publish content with status: ${this.status.toString()}`);
    }

    // Минимальная проверка перед публикацией
    if (!this.bodyMarkdown || this.bodyMarkdown.trim().length === 0) {
      throw new DomainError('Cannot publish content without body');
    }

    // Проверка QA checklist
    const missingChecks: string[] = [];

    if (!qaChecklist.hasDisclaimer) {
      missingChecks.push('disclaimer');
    }

    if (!qaChecklist.hasAltText) {
      missingChecks.push('alt_text');
    }

    if (!qaChecklist.hasCta) {
      missingChecks.push('cta');
    }

    if (missingChecks.length > 0) {
      throw new DomainError(
        `Cannot publish content without completing QA checklist. Missing required checks: ${missingChecks.join(', ')}`,
      );
    }

    this.status = ContentStatus.Published;
    this.publishedAt = new Date();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ContentPublishedEvent(this.id, this.contentType, this.slug.getValue(), this.authorUserId),
    );
  }

  /**
   * Отправить на ревью
   */
  sendToReview(): void {
    if (!this.status.isDraft()) {
      throw new DomainError('Only draft content can be sent to review');
    }

    this.status = ContentStatus.Review;
    this.updatedAt = new Date();
  }

  /**
   * Вернуть в draft из review
   */
  revertToDraft(): void {
    if (!this.status.equals(ContentStatus.Review)) {
      throw new DomainError('Only content in review can be reverted to draft');
    }

    this.status = ContentStatus.Draft;
    this.updatedAt = new Date();
  }

  /**
   * Заархивировать контент
   */
  archive(): void {
    if (!this.status.canBeArchived()) {
      throw new DomainError(`Cannot archive content with status: ${this.status.toString()}`);
    }

    this.status = ContentStatus.Archived;
    this.updatedAt = new Date();

    this.addDomainEvent(new ContentArchivedEvent(this.id, this.authorUserId));
  }

  /**
   * Разархивировать контент
   */
  unarchive(): void {
    if (!this.status.isArchived()) {
      throw new DomainError('Only archived content can be unarchived');
    }

    // Возвращаем в draft
    this.status = ContentStatus.Draft;
    this.updatedAt = new Date();
  }

  // ============================================
  // Getters
  // ============================================

  get contentItemId(): ContentItemId {
    return this.id;
  }

  get contentTypeValue(): ContentType {
    return this.contentType;
  }

  get slugValue(): Slug {
    return this.slug;
  }

  get titleValue(): string {
    return this.title;
  }

  get excerptValue(): string | null {
    return this.excerpt;
  }

  get bodyMarkdownValue(): string | null {
    return this.bodyMarkdown;
  }

  get statusValue(): ContentStatus {
    return this.status;
  }

  get publishedAtValue(): Date | null {
    return this.publishedAt;
  }

  get authorUserIdValue(): UserId | null {
    return this.authorUserId;
  }

  get timeToBenefitValue(): TimeToBenefit | null {
    return this.timeToBenefit;
  }

  get formatValue(): ContentFormat | null {
    return this.format;
  }

  get supportLevelValue(): SupportLevel | null {
    return this.supportLevel;
  }

  get metaTitleValue(): string | null {
    return this.metaTitle;
  }

  get metaDescriptionValue(): string | null {
    return this.metaDescription;
  }

  get canonicalUrlValue(): string | null {
    return this.canonicalUrl;
  }

  get createdAtValue(): Date {
    return this.createdAt;
  }

  get updatedAtValue(): Date {
    return this.updatedAt;
  }

  // ============================================
  // Domain Events
  // ============================================

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
