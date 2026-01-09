import type { ITelegramBotService } from './ITelegramBotService.js';

/**
 * Anti-Corruption Layer для Telegram Bot API.
 * Заглушка для разработки. Реальная реализация будет в FEAT-TG-01.
 */
export class TelegramAdapter implements ITelegramBotService {
  async sendMessage(
    _chatId: string | number,
    _text: string,
    _options?: {
      parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      replyMarkup?: unknown;
    },
  ): Promise<number> {
    // Заглушка: возвращает случайный ID
    // В production будет вызывать Telegram Bot API
    console.warn('TelegramAdapter.sendMessage is a stub. ' + 'Will be implemented in FEAT-TG-01.');
    return Math.floor(Math.random() * 1000000);
  }

  async sendChannelMessage(
    _channelId: string,
    _text: string,
    _options?: {
      parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    },
  ): Promise<number> {
    // Заглушка
    console.warn(
      'TelegramAdapter.sendChannelMessage is a stub. ' + 'Will be implemented in FEAT-TG-01.',
    );
    return Math.floor(Math.random() * 1000000);
  }

  async editMessage(_chatId: string | number, _messageId: number, _text: string): Promise<void> {
    // Заглушка
    console.warn('TelegramAdapter.editMessage is a stub. ' + 'Will be implemented in FEAT-TG-01.');
  }

  async getUserInfo(UserId: number): Promise<{
    _id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
  }> {
    // Заглушка
    console.warn('TelegramAdapter.getUserInfo is a stub. ' + 'Will be implemented in FEAT-TG-01.');
    return {
      id: userId,
    };
  }
}
