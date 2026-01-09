import type { IGoogleCalendarService } from './IGoogleCalendarService.js';

/**
 * Anti-Corruption Layer для Google Calendar API.
 * Заглушка для разработки. Реальная реализация будет в FEAT-BKG-02.
 */
export class GoogleCalendarAdapter implements IGoogleCalendarService {
  async getBusyIntervals(
    _calendarId: string,
    _startTime: Date,
    _endTime: Date,
  ): Promise<Array<{ _start: Date; _end: Date }>> {
    // Заглушка: возвращает пустой массив
    // В production будет вызывать Google Calendar FreeBusy API
    console.warn(
      'GoogleCalendarAdapter.getBusyIntervals is a stub. ' +
        'Will be implemented in FEAT-BKG-02.',
    );
    return [];
  }

  async createEvent(
    _calendarId: string,
    _event: {
      _summary: string;
      description?: string;
      _start: Date;
      _end: Date;
      attendees?: Array<{ _email: string }>;
    },
  ): Promise<string> {
    // Заглушка: возвращает случайный ID
    // В production будет вызывать Google Calendar API
    console.warn(
      'GoogleCalendarAdapter.createEvent is a stub. ' +
        'Will be implemented in FEAT-BKG-02.',
    );
    return `stub_event_${crypto.randomUUID()}`;
  }

  async deleteEvent(_calendarId: string, _eventId: string): Promise<void> {
    // Заглушка
    console.warn(
      'GoogleCalendarAdapter.deleteEvent is a stub. ' +
        'Will be implemented in FEAT-BKG-02.',
    );
  }
}
