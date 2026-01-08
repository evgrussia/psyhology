/**
 * Интерфейс для сервиса отправки email.
 * Используется для уведомлений (FEAT-PLT-01, FEAT-BKG-03).
 */
export interface IEmailService {
  /**
   * Отправляет email
   * @param params параметры письма
   * @returns ID отправленного письма (если поддерживается)
   */
  sendEmail(params: {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    from?: string;
  }): Promise<string | void>;

  /**
   * Отправляет шаблонное письмо
   * @param templateId ID шаблона
   * @param to получатель
   * @param variables переменные для шаблона
   * @returns ID отправленного письма
   */
  sendTemplate(
    templateId: string,
    to: string | string[],
    variables: Record<string, string>
  ): Promise<string | void>;
}
