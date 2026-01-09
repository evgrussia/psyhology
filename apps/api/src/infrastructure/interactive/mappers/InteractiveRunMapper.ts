import { InteractiveRun } from '../../../domain/interactive/aggregates/InteractiveRun';
import { InteractiveRunId, InteractiveDefinitionId } from '../../../domain/interactive/value-objects/Ids';
import { RunStatusVO } from '../../../domain/interactive/value-objects/RunStatus';
import { ResultLevelVO } from '../../../domain/interactive/value-objects/ResultLevel';
import { ResultAggregate } from '../../../domain/interactive/value-objects/ResultAggregate';
import { CrisisTrigger, CrisisTriggerType } from '../../../domain/interactive/value-objects/CrisisTrigger';

/**
 * Mapper для InteractiveRun aggregate
 * Преобразование между Domain Model и Prisma DB Model
 */
export class InteractiveRunMapper {
  /**
   * Преобразование из Prisma модели в Domain Model
   */
  static toDomain(record: any): InteractiveRun {
    const runId = InteractiveRunId.create(record.id);
    const definitionId = InteractiveDefinitionId.create(record.interactiveDefinitionId);

    const status = record.completedAt
      ? RunStatusVO.completed()
      : RunStatusVO.started();

    // Создаём ResultAggregate, если есть результат
    let resultAggregate: ResultAggregate | null = null;
    if (record.resultLevel || record.resultProfile) {
      const resultLevel = record.resultLevel
        ? ResultLevelVO.create(record.resultLevel)
        : null;

      // Кризисный триггер
      let crisisTrigger = CrisisTrigger.none();
      if (record.crisisTriggered && record.crisisTriggerType) {
        crisisTrigger = CrisisTrigger.fromString(record.crisisTriggerType);
      } else if (record.crisisTriggered) {
        // Если указано crisisTriggered=true, но тип не указан, используем дефолтный
        crisisTrigger = CrisisTrigger.create(CrisisTriggerType.MINOR_RISK);
      }

      resultAggregate = ResultAggregate.create({
        resultLevel: resultLevel,
        resultProfile: record.resultProfile ?? null,
        durationMs: record.durationMs ?? null,
        crisisTrigger: crisisTrigger,
      });
    }

    return InteractiveRun.reconstitute({
      id: runId,
      interactiveDefinitionId: definitionId,
      interactiveSlug: record.interactiveDefinition?.slug ?? 'unknown',
      interactiveType: record.interactiveDefinition?.interactiveType ?? 'quiz',
      anonymousId: record.anonymousId,
      userId: record.userId,
      startedAt: record.startedAt,
      status: status,
      resultAggregate: resultAggregate,
      completedAt: record.completedAt,
      deepLinkId: record.deepLinkId,
    });
  }

  /**
   * Преобразование из Domain Model в Prisma модель
   */
  static toPersistence(run: InteractiveRun): any {
    const resultAggregate = run.getResultAggregate();
    const crisisTrigger = resultAggregate?.getCrisisTrigger();

    return {
      id: run.getRunId().value,
      interactiveDefinitionId: run.getInteractiveDefinitionId().value,
      userId: run.getUserId(),
      anonymousId: run.getAnonymousId(),
      startedAt: run.getStartedAt(),
      completedAt: run.getCompletedAt(),
      resultLevel: resultAggregate?.getResultLevel()?.getValue() ?? null,
      resultProfile: resultAggregate?.getResultProfile() ?? null,
      durationMs: resultAggregate?.getDurationMs() ?? null,
      crisisTriggered: crisisTrigger?.isTriggered() ?? false,
      crisisTriggerType: crisisTrigger?.getTriggerType() ?? null,
      deepLinkId: run.getDeepLinkId(),
    };
  }
}
