import type { DomainEvent } from '../../domain/shared/events/DomainEvent.js';
import type { IEventBus } from '../../domain/shared/events/IEventBus.js';

type EventHandler = (event: DomainEvent) => Promise<void> | void;

/**
 * In-memory реализация EventBus для разработки и тестирования.
 * В production может быть заменена на Redis/RabbitMQ/etc.
 */
export class InMemoryEventBus implements IEventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? new Set();
    
    // Выполняем все обработчики параллельно
    await Promise.all(
      Array.from(handlers).map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          // В production здесь должен быть retry/dead letter queue
          console.error(`Error handling event ${event.eventName}:`, error);
        }
      })
    );
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.publish(event)));
  }

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: (event: T) => Promise<void> | void
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler as EventHandler);
  }

  unsubscribe(eventName: string, handler: Function): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  /**
   * Очищает все подписки (для тестов)
   */
  clear(): void {
    this.handlers.clear();
  }
}
