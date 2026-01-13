/**
 * Интерфейс для сервиса Google Calendar.
 * Используется для синхронизации расписания (FEAT-BKG-02).
 */
export interface IGoogleCalendarService {
  /**
   * Получает занятые интервалы в календаре
   * @param calendarId ID календаря
   * @param startTime начало периода
   * @param endTime конец периода
   * @returns массив занятых интервалов
   */
  getBusyIntervals(
    _calendarId: string,
    _startTime: Date,
    _endTime: Date,
  ): Promise<Array<{ _start: Date; _end: Date }>>;

  /**
   * Создаёт событие в календаре
   * @param calendarId ID календаря
   * @param event данные события
   * @returns ID созданного события
   */
  createEvent(
    _calendarId: string,
    event: {
      _summary: string;
      description?: string;
      _start: Date;
      _end: Date;
      attendees?: Array<{ _email: string }>;
    },
  ): Promise<string>;

  /**
   * Удаляет событие из календаря
   * @param calendarId ID календаря
   * @param eventId ID события
   */
  deleteEvent(_calendarId: string, _eventId: string): Promise<void>;
}
