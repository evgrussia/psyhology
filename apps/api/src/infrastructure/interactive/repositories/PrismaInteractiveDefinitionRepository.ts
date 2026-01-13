import { IInteractiveDefinitionRepository } from '../../../domain/interactive/repositories/IInteractiveDefinitionRepository';
import { InteractiveDefinitionId } from '../../../domain/interactive/value-objects/Ids';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация InteractiveDefinitionRepository через Prisma
 */
export class PrismaInteractiveDefinitionRepository implements IInteractiveDefinitionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findBySlugAndType(slug: string, type: string): Promise<{
    id: InteractiveDefinitionId;
    slug: string;
    type: string;
  } | null> {
    // Преобразуем строковый тип в enum
    const interactiveType = this.mapStringToInteractiveType(type);

    const record = await this.prisma.interactiveDefinition.findFirst({
      where: {
        slug: slug,
        interactiveType: interactiveType,
        status: 'published', // только опубликованные
      },
    });

    if (!record) {
      return null;
    }

    return {
      id: InteractiveDefinitionId.create(record.id),
      slug: record.slug,
      type: record.interactiveType,
    };
  }

  /**
   * Преобразует строковый тип в Prisma enum
   */
  private mapStringToInteractiveType(type: string): string {
    const mapping: Record<string, string> = {
      quiz: 'quiz',
      navigator: 'navigator',
      thermometer: 'thermometer',
      boundaries: 'boundaries',
      prep: 'prep',
      ritual: 'ritual',
    };

    return mapping[type.toLowerCase()] || 'quiz';
  }
}
