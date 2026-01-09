import { IInteractiveRunRepository } from '../../../domain/interactive/repositories/IInteractiveRunRepository';
import { InteractiveRun } from '../../../domain/interactive/aggregates/InteractiveRun';
import { InteractiveRunId } from '../../../domain/interactive/value-objects/Ids';
import { InteractiveRunMapper } from '../mappers/InteractiveRunMapper';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация InteractiveRunRepository через Prisma
 */
export class PrismaInteractiveRunRepository implements IInteractiveRunRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(run: InteractiveRun): Promise<void> {
    const data = InteractiveRunMapper.toPersistence(run);

    await this.prisma.interactiveRun.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findById(id: InteractiveRunId): Promise<InteractiveRun | null> {
    const record = await this.prisma.interactiveRun.findUnique({
      where: { id: id.value },
      include: {
        interactiveDefinition: true,
      },
    });

    if (!record) {
      return null;
    }

    return InteractiveRunMapper.toDomain(record);
  }

  async findByAnonymousId(anonymousId: string): Promise<InteractiveRun[]> {
    const records = await this.prisma.interactiveRun.findMany({
      where: { anonymousId },
      include: {
        interactiveDefinition: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    return records.map((record) => InteractiveRunMapper.toDomain(record));
  }

  async findByUserId(userId: string): Promise<InteractiveRun[]> {
    const records = await this.prisma.interactiveRun.findMany({
      where: { userId },
      include: {
        interactiveDefinition: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    return records.map((record) => InteractiveRunMapper.toDomain(record));
  }
}
