import { IAnalyticsService } from './IAnalyticsService';

/**
 * Простая реализация Analytics Service через логирование
 * Для production можно заменить на реальную систему аналитики (PostHog, Mixpanel, etc.)
 */
export class LoggingAnalyticsService implements IAnalyticsService {
  async track(params: {
    eventName: string;
    properties: Record<string, unknown>;
    context: {
      anonymousId?: string | null;
      userId?: string | null;
      source: 'web' | 'backend' | 'telegram' | 'admin';
      sessionId?: string;
      pagePath?: string;
      entryPoint?: string;
      topic?: string | null;
    };
  }): Promise<void> {
    // Валидация: проверяем, что нет запрещённых полей (PII/тексты)
    this.validateProperties(params.properties);

    // Логируем событие (в production это будет отправка в аналитику)
    console.log('[Analytics]', {
      event_name: params.eventName,
      occurred_at: new Date().toISOString(),
      source: params.context.source,
      anonymous_id: params.context.anonymousId,
      user_id: params.context.userId,
      session_id: params.context.sessionId,
      page_path: params.context.pagePath,
      entry_point: params.context.entryPoint,
      topic: params.context.topic,
      properties: params.properties,
    });

    // TODO: В будущем здесь будет реальная отправка в систему аналитики
    // await this.analyticsClient.track(...)
  }

  /**
   * Валидация свойств события: запрет PII/текстов
   */
  private validateProperties(properties: Record<string, unknown>): void {
    // Важно: мы запрещаем любые PII/тексты. При этом некоторые безопасные ключи
    // (например, content_type/content_slug) нужны для аналитики контента.
    const allowedContentKeys = new Set(['content_type', 'content_slug', 'content_id']);

    const forbiddenKeys = ['email', 'phone', 'text', 'answer', 'question', 'diary'];
    const keys = Object.keys(properties);

    for (const key of keys) {
      const lowerKey = key.toLowerCase();

      // Специальное правило для "content*": запрещаем текстовые payload'ы, но разрешаем тип/slug/id
      if (lowerKey.includes('content') && !allowedContentKeys.has(lowerKey)) {
        throw new Error(
          `Forbidden property in analytics event: ${key}. Analytics events must not contain PII or text content.`,
        );
      }

      if (forbiddenKeys.some((forbidden) => lowerKey.includes(forbidden))) {
        throw new Error(
          `Forbidden property in analytics event: ${key}. Analytics events must not contain PII or text content.`,
        );
      }
    }
  }
}
