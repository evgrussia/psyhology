/**
 * Интерфейс для отправки событий аналитики
 * Реализация должна отправлять события согласно Tracking Plan
 */
export interface IAnalyticsService {
  /**
   * Отправка события аналитики
   * @param eventName Название события (из Tracking Plan)
   * @param properties Свойства события (только P0, без PII/текстов)
   * @param context Контекст события (anonymousId, userId, source, etc.)
   */
  track(params: {
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
  }): Promise<void>;
}
