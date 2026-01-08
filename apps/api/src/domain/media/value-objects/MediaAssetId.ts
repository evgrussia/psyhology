import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * Value Object: ID медиа-актива
 * Обёртка над EntityId для типобезопасности
 */
export class MediaAssetId {
  private constructor(private readonly id: EntityId) {}

  static generate(): MediaAssetId {
    return new MediaAssetId(EntityId.generate());
  }

  static fromString(value: string): MediaAssetId {
    return new MediaAssetId(EntityId.fromString(value));
  }

  equals(other: MediaAssetId): boolean {
    return this.id.equals(other.id);
  }

  toString(): string {
    return this.id.value;
  }

  get value(): string {
    return this.id.value;
  }
}
