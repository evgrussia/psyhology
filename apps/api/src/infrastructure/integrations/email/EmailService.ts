import type { IEmailService } from './IEmailService.js';

/**
 * Заглушка для Email Service.
 * Реальная реализация будет использовать SMTP или API провайдера (SendGrid/Mailgun/etc).
 */
export class EmailService implements IEmailService {
  async sendEmail(params: {
    _to: string | string[];
    _subject: string;
    html?: string;
    text?: string;
    from?: string;
  }): Promise<string | void> {
    // Заглушка: логирует вместо отправки
    // В production будет отправлять через SMTP/API
    console.warn(
      'EmailService.sendEmail is a stub. ' + 'Will be implemented in FEAT-BKG-03 or similar.',
    );
    console.log('Email stub:', {
      to: params.to,
      subject: params.subject,
      html: params.html?.substring(0, 100),
      text: params.text?.substring(0, 100),
    });
    return `stub_email_${crypto.randomUUID()}`;
  }

  async sendTemplate(
    _templateId: string,
    _to: string | string[],
    variables: Record<string, string>,
  ): Promise<string | void> {
    // Заглушка
    console.warn(
      'EmailService.sendTemplate is a stub. ' + 'Will be implemented in FEAT-BKG-03 or similar.',
    );
    console.log('Email template stub:', {
      templateId,
      to,
      variables,
    });
    return `stub_email_${crypto.randomUUID()}`;
  }
}
