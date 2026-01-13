import { EntityId } from '../../shared/value-objects/EntityId';

/**
 * Value Object: ID контент-айтема
 */
export class ContentItemId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static generate(): ContentItemId {
    return new ContentItemId(EntityId.generate());
  }

  static fromString(value: string): ContentItemId {
    return new ContentItemId(value);
  }
}
