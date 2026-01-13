import { InteractiveDefinitionId } from '../value-objects/Ids';

/**
 * Интерфейс для получения информации об определении интерактива
 * Реализация находится в Infrastructure Layer
 */
export interface IInteractiveDefinitionRepository {
  /**
   * Поиск по slug и типу
   */
  findBySlugAndType(slug: string, type: string): Promise<{
    id: InteractiveDefinitionId;
    slug: string;
    type: string;
  } | null>;
}
