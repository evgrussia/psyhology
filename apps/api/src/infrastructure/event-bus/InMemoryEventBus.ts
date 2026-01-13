import { IEventBus } from '../../domain/shared/events/IEventBus';
import { DomainEvent } from '../../domain/shared/events/DomainEvent';

/**
 * Простая реализация Event Bus в памяти
 * Для production можно заменить на RabbitMQ, Kafka и т.д.
 */
export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventHandlers = this.handlers.get(event.eventName) || [];

      // Выполняем обработчики параллельно
      await Promise.all(eventHandlers.map((handler) => handler(event)));
    }
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
