import { ContentItemId } from '../value-objects/ContentItemId';
import { UserId } from '../../identity/value-objects/Ids';
import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * ContentRevision Entity
 * Представляет версию контент-айтема для версионирования и отката
 */
export class ContentRevision {
  private constructor(
    private readonly id: string,
    private readonly contentItemId: ContentItemId,
    private readonly bodyMarkdown: string | null,
    private readonly meta: Record<string, unknown> | null,
    private readonly changedByUserId: UserId | null,
    private readonly createdAt: Date,
  ) {}

  static create(
    contentItemId: ContentItemId,
    bodyMarkdown: string | null,
    meta: Record<string, unknown> | null,
    changedByUserId: UserId | null,
  ): ContentRevision {
    return new ContentRevision(
      EntityId.generate(),
      contentItemId,
      bodyMarkdown,
      meta,
      changedByUserId,
      new Date(),
    );
  }

  static reconstitute(data: {
    id: string;
    contentItemId: ContentItemId;
    bodyMarkdown: string | null;
    meta: Record<string, unknown> | null;
    changedByUserId: UserId | null;
    createdAt: Date;
  }): ContentRevision {
    return new ContentRevision(
      data.id,
      data.contentItemId,
      data.bodyMarkdown,
      data.meta,
      data.changedByUserId,
      data.createdAt,
    );
  }

  get revisionId(): string {
    return this.id;
  }

  get contentItemIdValue(): ContentItemId {
    return this.contentItemId;
  }

  get bodyMarkdownValue(): string | null {
    return this.bodyMarkdown;
  }

  get metaValue(): Record<string, unknown> | null {
    return this.meta ? { ...this.meta } : null;
  }

  get changedByUserIdValue(): UserId | null {
    return this.changedByUserId;
  }

  get createdAtValue(): Date {
    return this.createdAt;
  }
}
