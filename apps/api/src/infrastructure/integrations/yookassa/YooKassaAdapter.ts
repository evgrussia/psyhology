import type { IPaymentProviderService } from './IPaymentProviderService.js';

/**
 * Anti-Corruption Layer для ЮKassa API.
 * Заглушка для разработки. Реальная реализация будет в FEAT-PAY-01.
 */
export class YooKassaAdapter implements IPaymentProviderService {
  async createPaymentIntent(params: {
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
  }> {
    // Заглушка: возвращает тестовые данные
    // В production будет вызывать ЮKassa API
    console.warn(
      'YooKassaAdapter.createPaymentIntent is a stub. ' + 'Will be implemented in FEAT-PAY-01.',
    );
    return {
      _paymentId: `stub_payment_${crypto.randomUUID()}`,
      confirmationUrl: `https://yookassa.test/checkout?token=stub_${params.idempotencyKey}`,
    };
  }

  async getPaymentStatus(_paymentId: string): Promise<{
    status: 'pending' | 'succeeded' | 'canceled' | 'failed';
    _amount: number;
    _currency: string;
  }> {
    // Заглушка
    console.warn(
      'YooKassaAdapter.getPaymentStatus is a stub. ' + 'Will be implemented in FEAT-PAY-01.',
    );
    return {
      status: 'pending',
      amount: 0,
      currency: 'RUB',
    };
  }

  async handleWebhook(
    _payload: unknown,
    _signature: string,
  ): Promise<{
    _event: string;
    _paymentId: string;
    _status: string;
  }> {
    // Заглушка
    console.warn(
      'YooKassaAdapter.handleWebhook is a stub. ' + 'Will be implemented in FEAT-PAY-01.',
    );
    throw new Error('Webhook handling not implemented');
  }
}
