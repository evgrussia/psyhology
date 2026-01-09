import { InteractiveRun } from '../aggregates/InteractiveRun';
import { InteractiveRunId } from '../value-objects/Ids';

/**
 * Интерфейс репозитория для InteractiveRun
 * Реализация находится в Infrastructure Layer
 */
export interface IInteractiveRunRepository {
  /**
   * Сохранение или обновление InteractiveRun
   */
  save(run: InteractiveRun): Promise<void>;

  /**
   * Поиск по ID
   */
  findById(id: InteractiveRunId): Promise<InteractiveRun | null>;

  /**
   * Поиск по anonymousId (для гостей)
   */
  findByAnonymousId(anonymousId: string): Promise<InteractiveRun[]>;

  /**
   * Поиск по userId (для авторизованных пользователей)
   */
  findByUserId(userId: string): Promise<InteractiveRun[]>;
}
