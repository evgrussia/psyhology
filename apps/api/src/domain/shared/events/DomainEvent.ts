/**
 * Базовый класс для доменных событий.
 * Все доменные события должны наследоваться от этого класса.
 */
export abstract class DomainEvent {
  readonly occurredAt: Date;
  readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }

  /**
   * ID агрегата, к которому относится событие
   */
  abstract get aggregateId(): string;

  /**
   * Имя события (для логирования и маршрутизации)
   */
  abstract get eventName(): string;
}
