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
    calendarId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Array<{ start: Date; end: Date }>>;

  /**
   * Создаёт событие в календаре
   * @param calendarId ID календаря
   * @param event данные события
   * @returns ID созданного события
   */
  createEvent(
    calendarId: string,
    event: {
      summary: string;
      description?: string;
      start: Date;
      end: Date;
      attendees?: Array<{ email: string }>;
    },
  ): Promise<string>;

  /**
   * Удаляет событие из календаря
   * @param calendarId ID календаря
   * @param eventId ID события
   */
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
}
