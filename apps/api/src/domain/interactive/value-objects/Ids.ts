import { EntityId } from '../../shared/value-objects/EntityId';

export class InteractiveRunId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): InteractiveRunId {
    return new InteractiveRunId(value);
  }

  static generate(): InteractiveRunId {
    return new InteractiveRunId(EntityId.generate());
  }
}

export class InteractiveDefinitionId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): InteractiveDefinitionId {
    return new InteractiveDefinitionId(value);
  }
}
