import type { IGoogleCalendarService } from './IGoogleCalendarService.js';

/**
 * Anti-Corruption Layer для Google Calendar API.
 * Заглушка для разработки. Реальная реализация будет в FEAT-BKG-02.
 */
export class GoogleCalendarAdapter implements IGoogleCalendarService {
  async getBusyIntervals(
    calendarId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Array<{ start: Date; end: Date }>> {
    // Заглушка: возвращает пустой массив
    // В production будет вызывать Google Calendar FreeBusy API
    console.warn(
      'GoogleCalendarAdapter.getBusyIntervals is a stub. ' +
        'Will be implemented in FEAT-BKG-02.'
    );
    return [];
  }

  async createEvent(
    calendarId: string,
    event: {
      summary: string;
      description?: string;
      start: Date;
      end: Date;
      attendees?: Array<{ email: string }>;
    }
  ): Promise<string> {
    // Заглушка: возвращает случайный ID
    // В production будет вызывать Google Calendar API
    console.warn(
      'GoogleCalendarAdapter.createEvent is a stub. ' +
        'Will be implemented in FEAT-BKG-02.'
    );
    return `stub_event_${crypto.randomUUID()}`;
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    // Заглушка
    console.warn(
      'GoogleCalendarAdapter.deleteEvent is a stub. ' +
        'Will be implemented in FEAT-BKG-02.'
    );
  }
}
