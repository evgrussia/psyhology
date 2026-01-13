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
    _amount: number;
    _currency: string;
    _description: string;
    _returnUrl: string;
    _idempotencyKey: string;
    metadata?: Record<string, string>;
  }): Promise<{
    _paymentId: string;
    confirmationUrl?: string;
    confirmationToken?: string;
  }>;

  /**
   * Проверяет статус платежа
   * @param paymentId ID платежа
   * @returns статус платежа
   */
  getPaymentStatus(_paymentId: string): Promise<{
    status: 'pending' | 'succeeded' | 'canceled' | 'failed';
    _amount: number;
    _currency: string;
  }>;

  /**
   * Обрабатывает webhook от провайдера
   * @param payload тело webhook
   * @param signature подпись для проверки
   * @returns обработанное событие
   */
  handleWebhook(
    _payload: unknown,
    _signature: string,
  ): Promise<{
    _event: string;
    _paymentId: string;
    _status: string;
  }>;
}
