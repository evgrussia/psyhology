import { DomainEvent } from './DomainEvent';

/**
 * Интерфейс для публикации доменных событий
 * Реализация находится в Infrastructure Layer
 */
export interface IEventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
}
