import { IContentItemRepository } from '../../../domain/content/repositories/IContentItemRepository';
import { ContentItemId } from '../../../domain/content/value-objects/ContentItemId';
import { NotFoundError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Получить список ревизий контент-айтема
 */
export class ListContentRevisionsUseCase {
  constructor(private readonly contentItemRepository: IContentItemRepository) {}

  async execute(id: string): Promise<
    Array<{
      id: string;
      contentItemId: string;
      bodyMarkdown: string | null;
      meta: Record<string, unknown> | null;
      changedByUserId: string | null;
      createdAt: string;
    }>
  > {
    // 1. Проверка существования контент-айтема
    const contentItemId = ContentItemId.fromString(id);
    const contentItem = await this.contentItemRepository.findById(contentItemId);

    if (!contentItem) {
      throw new NotFoundError(`Content item with id "${id}" not found`);
    }

    // 2. Получение ревизий
    const revisions = await this.contentItemRepository.getRevisions(contentItemId);

    // 3. Преобразование в DTO
    return revisions.map((revision) => ({
      id: revision.revisionId,
      contentItemId: revision.contentItemIdValue.value,
      bodyMarkdown: revision.bodyMarkdownValue,
      meta: revision.metaValue,
      changedByUserId: revision.changedByUserIdValue?.value || null,
      createdAt: revision.createdAtValue.toISOString(),
    }));
  }
}
