import { EntityId } from '../../shared/value-objects/EntityId';

export class UserId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(EntityId.generate());
  }
}

export class ConsentId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): ConsentId {
    return new ConsentId(value);
  }

  static generate(): ConsentId {
    return new ConsentId(EntityId.generate());
  }
}
