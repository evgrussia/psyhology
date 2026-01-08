/**
 * Интерфейс для сервиса шифрования.
 * Используется для шифрования P2 данных "в покое" (FEAT-SEC-02).
 */
export interface IEncryptionService {
  /**
   * Шифрует данные
   * @param plaintext открытый текст
   * @returns зашифрованный текст (base64)
   */
  encrypt(plaintext: string): Promise<string>;

  /**
   * Расшифровывает данные
   * @param ciphertext зашифрованный текст (base64)
   * @returns открытый текст
   */
  decrypt(ciphertext: string): Promise<string>;

  /**
   * Проверяет, зашифрованы ли данные
   * @param data данные для проверки
   * @returns true, если данные зашифрованы
   */
  isEncrypted(data: string): boolean;
}
