import { IUserRepository } from '../../../domain/identity/repositories/IUserRepository';
import { ISessionRepository } from '../../../domain/identity/repositories/ISessionRepository';
import { CurrentUserRequestDto, UserDto } from '../dto/AuthDtos';
import {
  AuthenticationError,
  ValidationError,
} from '../../shared/errors/ApplicationError';
import { Role } from '../../../domain/identity/value-objects/Role';

/**
 * Use Case: Получить информацию о текущем пользователе
 */
export class GetCurrentUserUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CurrentUserRequestDto): Promise<UserDto> {
    // 1. Валидация
    if (!dto.sessionId || dto.sessionId.trim().length === 0) {
      throw new ValidationError('Session ID is required');
    }

    // 2. Проверяем сессию
    const session = await this.sessionRepository.findById(dto.sessionId);

    if (!session) {
      throw new AuthenticationError('Invalid or expired session');
    }

    if (session.isExpired()) {
      // Удаляем истёкшую сессию
      await this.sessionRepository.delete(dto.sessionId);
      throw new AuthenticationError('Session expired');
    }

    // 3. Получаем пользователя
    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // 4. Проверяем статус
    if (user.userStatus.isBlocked()) {
      throw new AuthenticationError('User is blocked');
    }

    // 5. Возвращаем данные пользователя
    return {
      id: user.userId.value,
      email: user.userEmail?.value || null,
      displayName: user.userDisplayName,
      roles: user.userRoles.map((r: Role) => r.code),
      isAdmin: user.isAdmin(),
    };
  }
}
