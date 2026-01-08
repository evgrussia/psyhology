import type { IEncryptionService } from './IEncryptionService.js';

/**
 * Заглушка для EncryptionService.
 * Реальная реализация будет добавлена в FEAT-SEC-02.
 * 
 * В production должна использовать AES-256-GCM или аналогичный алгоритм.
 */
export class EncryptionService implements IEncryptionService {
  /**
   * @throws Error - заглушка, не должна использоваться в production
   */
  async encrypt(plaintext: string): Promise<string> {
    throw new Error(
      'EncryptionService is not implemented yet. ' +
        'Will be implemented in FEAT-SEC-02.'
    );
  }

  /**
   * @throws Error - заглушка, не должна использоваться в production
   */
  async decrypt(ciphertext: string): Promise<string> {
    throw new Error(
      'EncryptionService is not implemented yet. ' +
        'Will be implemented in FEAT-SEC-02.'
    );
  }

  isEncrypted(data: string): boolean {
    // Простая проверка: зашифрованные данные обычно начинаются с префикса
    // Реальная реализация будет проверять формат зашифрованных данных
    return data.startsWith('enc:');
  }
}
