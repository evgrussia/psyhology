/**
 * Базовый класс для всех доменных событий
 * События неизменяемы и содержат минимум данных
 */
export abstract class DomainEvent {
  readonly occurredAt: Date;
  readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }

  abstract get aggregateId(): string;
  abstract get eventName(): string;
}
