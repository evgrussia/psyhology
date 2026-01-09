import { IInteractiveRunRepository } from '../../../domain/interactive/repositories/IInteractiveRunRepository';
import { IInteractiveDefinitionRepository } from '../../../domain/interactive/repositories/IInteractiveDefinitionRepository';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { InteractiveDefinitionId } from '../../../domain/interactive/value-objects/Ids';
import { StartInteractiveRunRequestDto, StartInteractiveRunResponseDto } from '../dto/InteractiveDtos';
import { ValidationError, NotFoundError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Запуск интерактива
 */
export class StartInteractiveRunUseCase {
  constructor(
    private readonly interactiveRunRepository: IInteractiveRunRepository,
    private readonly interactiveDefinitionRepository: IInteractiveDefinitionRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(dto: StartInteractiveRunRequestDto): Promise<StartInteractiveRunResponseDto> {
    // 1. Валидация входных данных
    if (!dto.interactiveSlug || dto.interactiveSlug.trim().length === 0) {
      throw new ValidationError('Interactive slug is required');
    }

    if (!dto.anonymousId && !dto.userId) {
      throw new ValidationError('Either anonymousId or userId must be provided');
    }

    // 2. Определяем тип интерактива из slug (quiz, navigator, thermometer, etc.)
    // Для MVP: определяем тип по паттерну slug или передаём явно
    // В будущем можно добавить поле interactiveType в DTO
    const interactiveType = this.inferInteractiveType(dto.interactiveSlug);

    // 3. Получаем определение интерактива
    const definition = await this.interactiveDefinitionRepository.findBySlugAndType(
      dto.interactiveSlug,
      interactiveType,
    );

    if (!definition) {
      throw new NotFoundError(`Interactive definition not found: ${dto.interactiveSlug}`);
    }

    // 4. Создаём InteractiveRun
    const { InteractiveRun } = await import('../../../domain/interactive/aggregates/InteractiveRun');
    const run = InteractiveRun.start({
      interactiveDefinitionId: definition.id,
      interactiveSlug: dto.interactiveSlug,
      interactiveType: definition.type,
      anonymousId: dto.anonymousId ?? null,
      userId: dto.userId ?? null,
      topic: dto.topic ?? null,
      entryPoint: dto.entryPoint ?? null,
    });

    // 5. Сохраняем run
    await this.interactiveRunRepository.save(run);

    // 6. Публикуем доменные события
    const events = run.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
      run.clearDomainEvents();
    }

    // 7. Возвращаем результат
    return {
      runId: run.getRunId().value,
    };
  }

  /**
   * Определяет тип интерактива по slug
   * В будущем это можно вынести в отдельный сервис или получать из БД
   */
  private inferInteractiveType(slug: string): string {
    // Простая эвристика: если slug начинается с известных префиксов
    if (slug.startsWith('quiz-') || slug.includes('_gad7') || slug.includes('_mbi')) {
      return 'quiz';
    }
    if (slug.startsWith('navigator-') || slug.includes('nav-')) {
      return 'navigator';
    }
    if (slug.startsWith('thermometer-') || slug.includes('trm-')) {
      return 'thermometer';
    }
    if (slug.startsWith('boundaries-') || slug.includes('bnd-')) {
      return 'boundaries';
    }
    if (slug.startsWith('prep-') || slug.includes('prp-')) {
      return 'prep';
    }
    if (slug.startsWith('ritual-') || slug.includes('rit-')) {
      return 'ritual';
    }

    // По умолчанию считаем quiz
    return 'quiz';
  }
}
