import type { DomainEvent } from './DomainEvent.js';

/**
 * Интерфейс для шины событий.
 * Используется для публикации доменных событий и подписки на них.
 */
export interface IEventBus {
  /**
   * Публикует доменное событие
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Публикует несколько событий атомарно
   */
  publishAll(events: DomainEvent[]): Promise<void>;

  /**
   * Подписывается на события определённого типа
   * @param eventName имя события (например, 'PaymentSucceeded')
   * @param handler функция-обработчик
   */
  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: (event: T) => Promise<void> | void
  ): void;

  /**
   * Отписывается от событий
   */
  unsubscribe(eventName: string, handler: Function): void;
}
