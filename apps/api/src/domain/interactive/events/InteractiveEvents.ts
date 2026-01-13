import { DomainEvent } from '../../shared/events/DomainEvent';
import { InteractiveRunId } from '../value-objects/Ids';
import { ResultLevelVO } from '../value-objects/ResultLevel';
import { CrisisTrigger } from '../value-objects/CrisisTrigger';

/**
 * Событие: Интерактив запущен
 */
export class InteractiveRunStartedEvent extends DomainEvent {
  constructor(
    public readonly runId: InteractiveRunId,
    public readonly interactiveDefinitionId: string,
    public readonly interactiveSlug: string,
    public readonly interactiveType: string,
    public readonly anonymousId: string | null,
    public readonly userId: string | null,
    public readonly topic: string | null,
    public readonly entryPoint: string | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.runId.value;
  }

  get eventName(): string {
    return 'InteractiveRunStarted';
  }
}

/**
 * Событие: Интерактив завершён
 */
export class InteractiveRunCompletedEvent extends DomainEvent {
  constructor(
    public readonly runId: InteractiveRunId,
    public readonly interactiveDefinitionId: string,
    public readonly interactiveSlug: string,
    public readonly interactiveType: string,
    public readonly resultLevel: ResultLevelVO | null,
    public readonly resultProfile: string | null,
    public readonly durationMs: number | null,
    public readonly anonymousId: string | null,
    public readonly userId: string | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.runId.value;
  }

  get eventName(): string {
    return 'InteractiveRunCompleted';
  }
}

/**
 * Событие: Сработал кризисный триггер
 */
export class CrisisTriggeredEvent extends DomainEvent {
  constructor(
    public readonly runId: InteractiveRunId,
    public readonly triggerType: string,
    public readonly surface: string, // quiz|question|agent|other
    public readonly anonymousId: string | null,
    public readonly userId: string | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.runId.value;
  }

  get eventName(): string {
    return 'CrisisTriggered';
  }
}
