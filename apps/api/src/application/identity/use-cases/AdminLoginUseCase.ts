import { IUserRepository } from '../../../domain/identity/repositories/IUserRepository';
import { ISessionRepository } from '../../../domain/identity/repositories/ISessionRepository';
import { IPasswordHasher } from '../services/IPasswordHasher';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { Email } from '../../../domain/identity/value-objects/Email';
import { Role } from '../../../domain/identity/value-objects/Role';
import {
  AdminLoginRequestDto,
  AuthResponseDto,
  UserDto,
} from '../dto/AuthDtos';
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../../shared/errors/ApplicationError';
import { AdminLoggedInEvent } from '../../../domain/identity/events/IdentityEvents';

/**
 * Use Case: Вход админа в систему
 */
export class AdminLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventBus: IEventBus
  ) {}

  async execute(dto: AdminLoginRequestDto): Promise<AuthResponseDto> {
    // 1. Валидация входных данных
    if (!dto.email || dto.email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    if (!dto.password || dto.password.trim().length === 0) {
      throw new ValidationError('Password is required');
    }

    // 2. Создаём Email Value Object
    let email: Email;
    try {
      email = Email.create(dto.email);
    } catch (error) {
      throw new ValidationError('Invalid email format');
    }

    // 3. Ищем пользователя по email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 4. Проверяем, что пользователь - админ
    if (!user.isAdmin()) {
      throw new AuthorizationError('Access denied: admin role required');
    }

    // 5. Проверяем статус пользователя
    if (user.userStatus.isBlocked()) {
      throw new AuthorizationError('User is blocked');
    }

    // 6. Получаем password hash из репозитория
    const passwordHash = await this.userRepository.getPasswordHash(user.userId);

    if (!passwordHash) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 7. Проверяем пароль
    const isPasswordValid = await this.passwordHasher.verify(
      dto.password,
      passwordHash
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // 8. Создаём сессию (TTL = 24 часа)
    const session = await this.sessionRepository.create(
      user.userId,
      24 * 60 * 60, // 24 hours in seconds
      dto.ipAddress || null,
      dto.userAgent || null
    );

    // 9. Публикуем событие входа админа
    const adminRole = user.getAdminRoles()[0]; // первая админская роль
    const event = new AdminLoggedInEvent(user.userId, adminRole);
    await this.eventBus.publish([event]);

    // 10. Возвращаем результат
    return {
      user: this.mapUserToDto(user),
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
    };
  }

  private mapUserToDto(user: any): UserDto {
    return {
      id: user.userId.value,
      email: user.userEmail?.value || null,
      displayName: user.userDisplayName,
      roles: user.userRoles.map((r: Role) => r.code),
      isAdmin: user.isAdmin(),
    };
  }
}
