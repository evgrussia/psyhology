import { IEventBus } from '../../domain/shared/events/IEventBus';
import { IAnalyticsService } from './IAnalyticsService';
import {
  InteractiveRunStartedEvent,
  InteractiveRunCompletedEvent,
  CrisisTriggeredEvent,
} from '../../domain/interactive/events/InteractiveEvents';
import { ContentPublishedEvent } from '../../domain/content/events/ContentEvents';

/**
 * Подписчик на доменные события для отправки в аналитику
 * Преобразует доменные события в события аналитики согласно Tracking Plan
 */
export class AnalyticsEventSubscriber {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly analyticsService: IAnalyticsService,
  ) {
    this.subscribe();
  }

  private subscribe(): void {
    // Подписываемся на события интерактивов
    this.eventBus.subscribe('InteractiveRunStarted', async (event) => {
      if (event instanceof InteractiveRunStartedEvent) {
        await this.handleInteractiveRunStarted(event);
      }
    });

    this.eventBus.subscribe('InteractiveRunCompleted', async (event) => {
      if (event instanceof InteractiveRunCompletedEvent) {
        await this.handleInteractiveRunCompleted(event);
      }
    });

    this.eventBus.subscribe('CrisisTriggered', async (event) => {
      if (event instanceof CrisisTriggeredEvent) {
        await this.handleCrisisTriggered(event);
      }
    });

    // Подписываемся на события контента
    this.eventBus.subscribe('ContentPublished', async (event) => {
      if (event instanceof ContentPublishedEvent) {
        await this.handleContentPublished(event);
      }
    });
  }

  private async handleInteractiveRunStarted(event: InteractiveRunStartedEvent): Promise<void> {
    // Определяем тип события аналитики по типу интерактива
    const analyticsEventName = this.mapInteractiveTypeToEventName(event.interactiveType, 'start');

    // Формируем свойства в зависимости от типа интерактива (Privacy by Design - только нужные поля)
    const properties: Record<string, unknown> = {};
    
    if (event.interactiveType === 'quiz') {
      properties.quiz_slug = event.interactiveSlug;
      if (event.topic) {
        properties.topic = event.topic;
      }
    } else if (event.interactiveType === 'navigator') {
      properties.navigator_slug = event.interactiveSlug;
      if (event.topic) {
        properties.topic = event.topic;
      }
    } else if (event.interactiveType === 'thermometer') {
      if (event.topic) {
        properties.topic = event.topic;
      }
    } else if (event.interactiveType === 'boundaries') {
      properties.topic = 'boundaries';
    }

    await this.analyticsService.track({
      eventName: analyticsEventName,
      properties: properties,
      context: {
        anonymousId: event.anonymousId,
        userId: event.userId,
        source: 'backend',
        entryPoint: event.entryPoint,
        topic: event.topic,
      },
    });
  }

  private async handleInteractiveRunCompleted(event: InteractiveRunCompletedEvent): Promise<void> {
    // Определяем тип события аналитики по типу интерактива
    const analyticsEventName = this.mapInteractiveTypeToEventName(event.interactiveType, 'complete');

    // Формируем свойства в зависимости от типа интерактива (Privacy by Design - только нужные поля)
    const properties: Record<string, unknown> = {};
    
    if (event.interactiveType === 'quiz') {
      properties.quiz_slug = event.interactiveSlug;
      if (event.resultLevel) {
        properties.result_level = event.resultLevel.getValue();
      }
      if (event.durationMs !== null) {
        properties.duration_ms = event.durationMs;
      }
    } else if (event.interactiveType === 'navigator') {
      properties.navigator_slug = event.interactiveSlug;
      if (event.resultProfile) {
        properties.result_profile = event.resultProfile;
      }
      if (event.durationMs !== null) {
        properties.duration_ms = event.durationMs;
      }
    } else if (event.interactiveType === 'thermometer') {
      // Для термометра ресурса используется resource_level вместо result_level
      if (event.resultLevel) {
        properties.resource_level = event.resultLevel.getValue();
      }
      if (event.durationMs !== null) {
        properties.duration_ms = event.durationMs;
      }
    } else if (event.interactiveType === 'boundaries') {
      // Для скриптов границ отправляем только variant_id (в свойствах, если есть)
      if (event.resultProfile) {
        properties.variant_id = event.resultProfile;
      }
    } else if (event.interactiveType === 'prep' || event.interactiveType === 'ritual') {
      // Для подготовки и ритуалов отправляем только длительность
      if (event.durationMs !== null) {
        properties.duration_ms = event.durationMs;
      }
    }

    await this.analyticsService.track({
      eventName: analyticsEventName,
      properties: properties,
      context: {
        anonymousId: event.anonymousId,
        userId: event.userId,
        source: 'backend',
      },
    });
  }

  private async handleCrisisTriggered(event: CrisisTriggeredEvent): Promise<void> {
    await this.analyticsService.track({
      eventName: 'crisis_banner_shown',
      properties: {
        trigger_type: event.triggerType,
        surface: event.surface,
      },
      context: {
        anonymousId: event.anonymousId,
        userId: event.userId,
        source: 'backend',
      },
    });
  }

  private async handleContentPublished(event: ContentPublishedEvent): Promise<void> {
    // Согласно Tracking Plan / FEAT-CNT-01: admin_content_published (без текста)
    await this.analyticsService.track({
      eventName: 'admin_content_published',
      properties: {
        content_type: event.contentType.toString(),
        content_slug: event.slug,
      },
      context: {
        userId: event.publishedBy?.value || null,
        source: 'admin',
      },
    });
  }

  /**
   * Преобразует тип интерактива в название события аналитики
   */
  private mapInteractiveTypeToEventName(
    interactiveType: string,
    action: 'start' | 'complete',
  ): string {
    const mapping: Record<string, Record<string, string>> = {
      quiz: {
        start: 'start_quiz',
        complete: 'complete_quiz',
      },
      navigator: {
        start: 'navigator_start',
        complete: 'navigator_complete',
      },
      thermometer: {
        start: 'resource_thermometer_start',
        complete: 'resource_thermometer_complete',
      },
      boundaries: {
        start: 'boundaries_script_start',
        complete: 'boundaries_script_complete',
      },
      prep: {
        start: 'consultation_prep_start',
        complete: 'consultation_prep_complete',
      },
      ritual: {
        start: 'ritual_started',
        complete: 'ritual_completed',
      },
    };

    const typeMapping = mapping[interactiveType.toLowerCase()] || mapping.quiz;
    return typeMapping[action] || 'interactive_start';
  }
}
