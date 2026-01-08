/**
 * Интерфейс для провайдера платежей.
 * Используется для интеграции с ЮKassa (FEAT-PAY-01).
 */
export interface IPaymentProviderService {
  /**
   * Создаёт платёжное намерение (payment intent)
   * @param params параметры платежа
   * @returns данные для оплаты (redirect URL, confirmation token, etc.)
   */
  createPaymentIntent(params: {
    amount: number;
    currency: string;
    description: string;
    returnUrl: string;
    idempotencyKey: string;
    metadata?: Record<string, string>;
  }): Promise<{
    paymentId: string;
    confirmationUrl?: string;
    confirmationToken?: string;
  }>;

  /**
   * Проверяет статус платежа
   * @param paymentId ID платежа
   * @returns статус платежа
   */
  getPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'succeeded' | 'canceled' | 'failed';
    amount: number;
    currency: string;
  }>;

  /**
   * Обрабатывает webhook от провайдера
   * @param payload тело webhook
   * @param signature подпись для проверки
   * @returns обработанное событие
   */
  handleWebhook(
    payload: unknown,
    signature: string,
  ): Promise<{
    event: string;
    paymentId: string;
    status: string;
  }>;
}
