import { UserId } from '../value-objects/Ids';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { Role } from '../value-objects/Role';
import { UserStatus } from '../value-objects/UserStatus';
import { ConsentType } from '../value-objects/ConsentType';
import { Consent } from '../entities/Consent';
import { DomainError, UnauthorizedError } from '../../shared/errors/DomainError';
import { DomainEvent } from '../../shared/events/DomainEvent';
import {
  UserCreatedEvent,
  ConsentGrantedEvent,
  ConsentRevokedEvent,
  RoleAssignedEvent,
  UserBlockedEvent,
} from '../events/IdentityEvents';

/**
 * User Aggregate Root
 * Представляет пользователя системы (клиент или админ)
 */
export class User {
  private constructor(
    private readonly id: UserId,
    private email: Email | null,
    private phone: PhoneNumber | null,
    private telegramUserId: string | null,
    private telegramUsername: string | null,
    private displayName: string | null,
    private status: UserStatus,
    private roles: Role[],
    private consents: Consent[],
    private readonly createdAt: Date,
    private domainEvents: DomainEvent[] = []
  ) {}

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Создание нового пользователя
   */
  static create(
    email: Email | null,
    phone: PhoneNumber | null,
    telegramUserId: string | null
  ): User {
    // Валидация: хотя бы один способ контакта
    if (!email && !phone && !telegramUserId) {
      throw new DomainError('At least one contact method is required');
    }

    const user = new User(
      UserId.generate(),
      email,
      phone,
      telegramUserId,
      null, // telegramUsername
      null, // displayName
      UserStatus.Active,
      [Role.Client], // по умолчанию роль Client
      [],
      new Date()
    );

    user.addDomainEvent(
      new UserCreatedEvent(user.id, email, phone, telegramUserId)
    );

    return user;
  }

  /**
   * Восстановление из БД (reconstitute)
   */
  static reconstitute(data: {
    id: UserId;
    email: Email | null;
    phone: PhoneNumber | null;
    telegramUserId: string | null;
    telegramUsername: string | null;
    displayName: string | null;
    status: UserStatus;
    roles: Role[];
    consents: Consent[];
    createdAt: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.phone,
      data.telegramUserId,
      data.telegramUsername,
      data.displayName,
      data.status,
      data.roles,
      data.consents,
      data.createdAt,
      [] // события не восстанавливаем из БД
    );
  }

  // ============================================
  // Business Methods
  // ============================================

  /**
   * Предоставить согласие на обработку данных
   */
  grantConsent(consentType: ConsentType, version: string, source: string): void {
    // Проверяем, нет ли уже активного согласия
    const existingConsent = this.consents.find(
      (c) => c.type.equals(consentType) && c.isActive()
    );

    if (existingConsent) {
      // Согласие уже есть - идемпотентность
      return;
    }

    const consent = Consent.create(consentType, version, source);
    this.consents.push(consent);

    this.addDomainEvent(
      new ConsentGrantedEvent(this.id, consentType, version)
    );
  }

  /**
   * Отозвать согласие
   */
  revokeConsent(consentType: ConsentType): void {
    const consent = this.consents.find(
      (c) => c.type.equals(consentType) && c.isActive()
    );

    if (!consent) {
      throw new DomainError(
        `Active consent of type ${consentType.value} not found`
      );
    }

    consent.revoke();

    this.addDomainEvent(new ConsentRevokedEvent(this.id, consentType));
  }

  /**
   * Назначить роль пользователю
   */
  assignRole(role: Role): void {
    if (this.roles.some((r) => r.equals(role))) {
      // Роль уже назначена - идемпотентность
      return;
    }

    this.roles.push(role);

    this.addDomainEvent(new RoleAssignedEvent(this.id, role));
  }

  /**
   * Удалить роль у пользователя
   */
  removeRole(role: Role): void {
    const index = this.roles.findIndex((r) => r.equals(role));

    if (index === -1) {
      throw new DomainError(`Role ${role.code} not found`);
    }

    // Нельзя удалить последнюю роль
    if (this.roles.length === 1) {
      throw new DomainError('Cannot remove the last role');
    }

    this.roles.splice(index, 1);
  }

  /**
   * Заблокировать пользователя
   */
  block(reason: string): void {
    if (!this.status.isActive()) {
      throw new DomainError('User is not active');
    }

    if (!reason || reason.trim().length === 0) {
      throw new DomainError('Block reason cannot be empty');
    }

    this.status = UserStatus.Blocked;

    this.addDomainEvent(new UserBlockedEvent(this.id, reason));
  }

  /**
   * Разблокировать пользователя
   */
  unblock(): void {
    if (!this.status.isBlocked()) {
      throw new DomainError('User is not blocked');
    }

    this.status = UserStatus.Active;
  }

  /**
   * Обновить отображаемое имя
   */
  updateDisplayName(displayName: string | null): void {
    this.displayName = displayName;
  }

  /**
   * Обновить Telegram данные
   */
  updateTelegramData(userId: string, username: string | null): void {
    this.telegramUserId = userId;
    this.telegramUsername = username;
  }

  // ============================================
  // Business Rules (проверки)
  // ============================================

  /**
   * Проверить наличие активного согласия
   */
  hasActiveConsent(consentType: ConsentType): boolean {
    return this.consents.some(
      (c) => c.type.equals(consentType) && c.isActive()
    );
  }

  /**
   * Проверить наличие роли
   */
  hasRole(role: Role): boolean {
    return this.roles.some((r) => r.equals(role));
  }

  /**
   * Проверить, является ли пользователь админом
   */
  isAdmin(): boolean {
    return this.roles.some((r) => r.isAdmin());
  }

  /**
   * Проверить, может ли пользователь выполнить действие
   */
  canPerformAction(requiredRole: Role): boolean {
    if (this.status.isBlocked()) {
      return false;
    }

    return this.hasRole(requiredRole);
  }

  /**
   * Проверить авторизацию (выбросить ошибку если нет прав)
   */
  ensureCanPerformAction(requiredRole: Role): void {
    if (this.status.isBlocked()) {
      throw new UnauthorizedError('User is blocked');
    }

    if (!this.hasRole(requiredRole)) {
      throw new UnauthorizedError(
        `User does not have required role: ${requiredRole.code}`
      );
    }
  }

  /**
   * Получить все роли админа
   */
  getAdminRoles(): Role[] {
    return this.roles.filter((r) => r.isAdmin());
  }

  // ============================================
  // Getters
  // ============================================

  get userId(): UserId {
    return this.id;
  }

  get userEmail(): Email | null {
    return this.email;
  }

  get userPhone(): PhoneNumber | null {
    return this.phone;
  }

  get userTelegramUserId(): string | null {
    return this.telegramUserId;
  }

  get userTelegramUsername(): string | null {
    return this.telegramUsername;
  }

  get userDisplayName(): string | null {
    return this.displayName;
  }

  get userStatus(): UserStatus {
    return this.status;
  }

  get userRoles(): Role[] {
    return [...this.roles]; // immutable copy
  }

  get userConsents(): Consent[] {
    return [...this.consents]; // immutable copy
  }

  get userCreatedAt(): Date {
    return this.createdAt;
  }

  // ============================================
  // Domain Events
  // ============================================

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
