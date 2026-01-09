import { DomainEvent } from '../../shared/events/DomainEvent';
import { ContentItemId } from '../value-objects/ContentItemId';
import { UserId } from '../../identity/value-objects/Ids';
import { ContentType } from '../value-objects/ContentType';

/**
 * Domain Event: Контент опубликован
 */
export class ContentPublishedEvent extends DomainEvent {
  constructor(
    public readonly contentItemId: ContentItemId,
    public readonly contentType: ContentType,
    public readonly slug: string,
    public readonly publishedBy: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.contentItemId.value;
  }

  get eventName(): string {
    return 'ContentPublished';
  }
}

/**
 * Domain Event: Контент создан
 */
export class ContentCreatedEvent extends DomainEvent {
  constructor(
    public readonly contentItemId: ContentItemId,
    public readonly contentType: ContentType,
    public readonly createdBy: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.contentItemId.value;
  }

  get eventName(): string {
    return 'ContentCreated';
  }
}

/**
 * Domain Event: Контент обновлён
 */
export class ContentUpdatedEvent extends DomainEvent {
  constructor(
    public readonly contentItemId: ContentItemId,
    public readonly updatedBy: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.contentItemId.value;
  }

  get eventName(): string {
    return 'ContentUpdated';
  }
}

/**
 * Domain Event: Контент заархивирован
 */
export class ContentArchivedEvent extends DomainEvent {
  constructor(
    public readonly contentItemId: ContentItemId,
    public readonly archivedBy: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.contentItemId.value;
  }

  get eventName(): string {
    return 'ContentArchived';
  }
}
