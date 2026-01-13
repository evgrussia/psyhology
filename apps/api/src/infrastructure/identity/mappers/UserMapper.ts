import { User } from '../../../domain/identity/aggregates/User';
import { UserId, ConsentId } from '../../../domain/identity/value-objects/Ids';
import { Email } from '../../../domain/identity/value-objects/Email';
import { PhoneNumber } from '../../../domain/identity/value-objects/PhoneNumber';
import { Role } from '../../../domain/identity/value-objects/Role';
import { UserStatus } from '../../../domain/identity/value-objects/UserStatus';
import { ConsentType } from '../../../domain/identity/value-objects/ConsentType';
import { Consent } from '../../../domain/identity/entities/Consent';

/**
 * Mapper для User aggregate
 * Преобразование между Domain Model и Prisma DB Model
 */
export class UserMapper {
  /**
   * Преобразование из Prisma модели в Domain Model
   */
  static toDomain(record: any): User {
    const userId = UserId.create(record.id);

    const email = record.email ? Email.create(record.email) : null;
    const phone = record.phone ? PhoneNumber.create(record.phone) : null;

    const status = UserStatus.fromString(record.status);

    // Маппим роли
    const roles = record.userRoles?.map((ur: any) => Role.fromCode(ur.roleCode)) || [];

    // Маппим согласия
    const consents =
      record.consents?.map((c: any) =>
        Consent.reconstitute({
          id: ConsentId.create(c.id),
          type: ConsentType.fromString(c.consentType),
          version: c.version,
          source: c.source,
          grantedAt: c.grantedAt,
          revokedAt: c.revokedAt,
        }),
      ) || [];

    return User.reconstitute({
      id: userId,
      email,
      phone,
      telegramUserId: record.telegramUserId,
      telegramUsername: record.telegramUsername,
      displayName: record.displayName,
      status,
      roles,
      consents,
      createdAt: record.createdAt,
    });
  }

  /**
   * Преобразование из Domain Model в Prisma данные
   */
  static toPersistence(user: User): any {
    return {
      id: user.userId.value,
      email: user.userEmail?.value || null,
      phone: user.userPhone?.value || null,
      telegramUserId: user.userTelegramUserId,
      telegramUsername: user.userTelegramUsername,
      displayName: user.userDisplayName,
      status: user.userStatus.toString(),
      createdAt: user.userCreatedAt,
      updatedAt: new Date(),
    };
  }

  /**
   * Данные ролей для сохранения
   */
  static rolesToPersistence(user: User): any[] {
    return user.userRoles.map((role) => ({
      userId: user.userId.value,
      roleCode: role.code,
      grantedAt: new Date(),
    }));
  }

  /**
   * Данные согласий для сохранения
   */
  static consentsToPersistence(user: User): any[] {
    return user.userConsents.map((consent) => ({
      id: consent.id.value,
      userId: user.userId.value,
      consentType: consent.type.toString(),
      granted: consent.isActive(),
      version: consent.version,
      source: consent.source,
      grantedAt: consent.grantedAt,
      revokedAt: consent.getRevokedAt(),
    }));
  }
}
