import { IInteractiveRunRepository } from '../../../domain/interactive/repositories/IInteractiveRunRepository';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { InteractiveRunId } from '../../../domain/interactive/value-objects/Ids';
import { ResultLevelVO } from '../../../domain/interactive/value-objects/ResultLevel';
import { CrisisTrigger, CrisisTriggerType } from '../../../domain/interactive/value-objects/CrisisTrigger';
import { ResultAggregate } from '../../../domain/interactive/value-objects/ResultAggregate';
import { CompleteInteractiveRunRequestDto, CompleteInteractiveRunResponseDto } from '../dto/InteractiveDtos';
import { ValidationError, NotFoundError } from '../../shared/errors/ApplicationError';

/**
 * Use Case: Завершение интерактива
 */
export class CompleteInteractiveRunUseCase {
  constructor(
    private readonly interactiveRunRepository: IInteractiveRunRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(dto: CompleteInteractiveRunRequestDto): Promise<CompleteInteractiveRunResponseDto> {
    // 1. Валидация входных данных
    if (!dto.runId || dto.runId.trim().length === 0) {
      throw new ValidationError('Run ID is required');
    }

    // 2. Получаем run
    const runId = InteractiveRunId.create(dto.runId);
    const run = await this.interactiveRunRepository.findById(runId);

    if (!run) {
      throw new NotFoundError(`Interactive run not found: ${dto.runId}`);
    }

    // 3. Валидация: должен быть хотя бы resultLevel или resultProfile
    if (!dto.resultLevel && !dto.resultProfile) {
      throw new ValidationError('Either resultLevel or resultProfile must be provided');
    }

    // 4. Создаём Value Objects
    let resultLevel: ResultLevelVO | null = null;
    if (dto.resultLevel) {
      resultLevel = ResultLevelVO.create(dto.resultLevel);
    }

    let crisisTrigger: CrisisTrigger = CrisisTrigger.none();
    if (dto.crisisTriggered && dto.crisisTriggerType) {
      crisisTrigger = CrisisTrigger.fromString(dto.crisisTriggerType);
    } else if (dto.crisisTriggered) {
      // Если указано crisisTriggered=true, но тип не указан, используем дефолтный
      crisisTrigger = CrisisTrigger.create(CrisisTriggerType.MINOR_RISK);
    }

    // 5. Создаём ResultAggregate
    const resultAggregate = ResultAggregate.create({
      resultLevel: resultLevel,
      resultProfile: dto.resultProfile ?? null,
      durationMs: dto.durationMs ?? null,
      crisisTrigger: crisisTrigger,
    });

    // 6. Завершаем run (идемпотентно)
    run.complete(resultAggregate);

    // 7. Сохраняем run
    await this.interactiveRunRepository.save(run);

    // 8. Публикуем доменные события
    const events = run.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publish(events);
      run.clearDomainEvents();
    }

    // 9. Возвращаем результат
    return {
      success: true,
    };
  }
}
