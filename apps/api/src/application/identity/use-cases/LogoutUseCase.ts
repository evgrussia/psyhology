import { ISessionRepository } from '../../../domain/identity/repositories/ISessionRepository';
import { LogoutRequestDto } from '../dto/AuthDtos';
import { ValidationError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Выход из системы
 */
export class LogoutUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(dto: LogoutRequestDto): Promise<void> {
    // 1. Валидация
    if (!dto.sessionId || dto.sessionId.trim().length === 0) {
      throw new ValidationError('Session ID is required');
    }

    // 2. Удаляем сессию
    await this.sessionRepository.delete(dto.sessionId);

    // 3. Всё - сессия инвалидирована
    // Можно добавить событие UserLoggedOut если нужно для аудита
  }
}
