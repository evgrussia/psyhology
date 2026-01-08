import { IUserRepository } from '../../../domain/identity/repositories/IUserRepository';
import { User } from '../../../domain/identity/aggregates/User';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { Email } from '../../../domain/identity/value-objects/Email';
import { PhoneNumber } from '../../../domain/identity/value-objects/PhoneNumber';
import { UserMapper } from '../mappers/UserMapper';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация UserRepository через Prisma
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id: id.value },
      include: {
        userRoles: true,
        consents: true,
      },
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.value },
      include: {
        userRoles: true,
        consents: true,
      },
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record);
  }

  async findByPhone(phone: PhoneNumber): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { phone: phone.value },
      include: {
        userRoles: true,
        consents: true,
      },
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record);
  }

  async findByTelegramUserId(telegramUserId: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { telegramUserId },
      include: {
        userRoles: true,
        consents: true,
      },
    });

    if (!record) {
      return null;
    }

    return UserMapper.toDomain(record);
  }

  async save(user: User): Promise<void> {
    const userData = UserMapper.toPersistence(user);

    // Используем транзакцию для атомарности
    await this.prisma.$transaction(async (tx) => {
      // 1. Upsert user
      await tx.user.upsert({
        where: { id: user.userId.value },
        create: userData,
        update: userData,
      });

      // 2. Удаляем старые роли и создаём новые
      await tx.userRole.deleteMany({
        where: { userId: user.userId.value },
      });

      const roles = UserMapper.rolesToPersistence(user);
      if (roles.length > 0) {
        await tx.userRole.createMany({
          data: roles,
          skipDuplicates: true,
        });
      }

      // 3. Upsert согласий
      const consents = UserMapper.consentsToPersistence(user);
      for (const consent of consents) {
        await tx.consent.upsert({
          where: { id: consent.id },
          create: consent,
          update: consent,
        });
      }
    });
  }

  async findByRole(roleCode: string): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            roleCode: roleCode as any,
          },
        },
      },
      include: {
        userRoles: true,
        consents: true,
      },
    });

    return records.map((r) => UserMapper.toDomain(r));
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value },
    });

    return count > 0;
  }

  async getPasswordHash(userId: UserId): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.value },
      select: { passwordHash: true },
    });

    return user?.passwordHash || null;
  }
}
