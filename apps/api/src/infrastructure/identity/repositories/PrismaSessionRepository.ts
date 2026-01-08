import {
  ISessionRepository,
  Session,
} from '../../../domain/identity/repositories/ISessionRepository';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

/**
 * Реализация SessionRepository через Prisma (БД)
 * Альтернативно можно использовать Redis для лучшей производительности
 */
export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    userId: UserId,
    ttlSeconds: number,
    ipAddress: string | null,
    userAgent: string | null
  ): Promise<Session> {
    const sessionId = this.generateSessionId();
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: userId.value,
        createdAt,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return new Session(
      sessionId,
      userId,
      createdAt,
      expiresAt,
      ipAddress,
      userAgent
    );
  }

  async findById(sessionId: string): Promise<Session | null> {
    const record = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!record) {
      return null;
    }

    return new Session(
      record.id,
      UserId.create(record.userId),
      record.createdAt,
      record.expiresAt,
      record.ipAddress,
      record.userAgent
    );
  }

  async findByUserId(userId: UserId): Promise<Session[]> {
    const records = await this.prisma.session.findMany({
      where: {
        userId: userId.value,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return records.map(
      (record) =>
        new Session(
          record.id,
          UserId.create(record.userId),
          record.createdAt,
          record.expiresAt,
          record.ipAddress,
          record.userAgent
        )
    );
  }

  async delete(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async deleteAllByUserId(userId: UserId): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId: userId.value },
    });
  }

  async extendExpiration(sessionId: string, ttlSeconds: number): Promise<void> {
    const newExpiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt },
    });
  }

  /**
   * Генерация безопасного session ID
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
