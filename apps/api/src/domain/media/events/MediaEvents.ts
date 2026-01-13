import { DomainEvent } from '../../shared/events/DomainEvent';
import { MediaAssetId } from '../value-objects/MediaAssetId';
import { MediaType } from '../value-objects/MediaType';
import { UserId } from '../../identity/value-objects/Ids';

/**
 * Событие: Медиа-файл загружен
 */
export class MediaAssetUploadedEvent extends DomainEvent {
  constructor(
    public readonly mediaAssetId: MediaAssetId,
    public readonly mediaType: MediaType,
    public readonly sizeBytes: number,
    public readonly uploadedByUserId: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.mediaAssetId.value;
  }

  get eventName(): string {
    return 'MediaAssetUploaded';
  }
}

/**
 * Событие: Медиа-файл удалён
 */
export class MediaAssetDeletedEvent extends DomainEvent {
  constructor(
    public readonly mediaAssetId: MediaAssetId,
    public readonly mediaType: MediaType,
    public readonly deletedByUserId: UserId | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.mediaAssetId.value;
  }

  get eventName(): string {
    return 'MediaAssetDeleted';
  }
}
