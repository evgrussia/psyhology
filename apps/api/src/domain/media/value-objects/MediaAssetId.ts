import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * Value Object: ID медиа-актива
 * Обёртка над EntityId для типобезопасности
 */
export class MediaAssetId {
  private constructor(private readonly id: EntityId) {}

  static generate(): MediaAssetId {
    const id = new (class extends EntityId {})(EntityId.generate());
    return new MediaAssetId(id);
  }

  static fromString(value: string): MediaAssetId {
    // EntityId не имеет fromString, создаём напрямую через наследование
    const id = new (class extends EntityId {})(value);
    return new MediaAssetId(id);
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
