/**
 * Интерфейс для Telegram Bot API.
 * Используется для интеграции с Telegram ботом (FEAT-TG-01).
 */
export interface ITelegramBotService {
  /**
   * Отправляет сообщение пользователю
   * @param chatId ID чата
   * @param text текст сообщения
   * @param options дополнительные опции (кнопки, форматирование)
   * @returns ID отправленного сообщения
   */
  sendMessage(
    chatId: string | number,
    text: string,
    options?: {
      parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      replyMarkup?: unknown;
    }
  ): Promise<number>;

  /**
   * Отправляет сообщение в канал
   * @param channelId ID канала (например, @channel_name)
   * @param text текст сообщения
   * @param options дополнительные опции
   * @returns ID отправленного сообщения
   */
  sendChannelMessage(
    channelId: string,
    text: string,
    options?: {
      parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    }
  ): Promise<number>;

  /**
   * Редактирует сообщение
   * @param chatId ID чата
   * @param messageId ID сообщения
   * @param text новый текст
   */
  editMessage(
    chatId: string | number,
    messageId: number,
    text: string
  ): Promise<void>;

  /**
   * Получает информацию о пользователе
   * @param userId ID пользователя
   * @returns информация о пользователе
   */
  getUserInfo(userId: number): Promise<{
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
  }>;
}
