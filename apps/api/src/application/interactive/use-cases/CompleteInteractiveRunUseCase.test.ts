import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompleteInteractiveRunUseCase } from './CompleteInteractiveRunUseCase';
import { IInteractiveRunRepository } from '../../../domain/interactive/repositories/IInteractiveRunRepository';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { InteractiveRun } from '../../../domain/interactive/aggregates/InteractiveRun';
import { InteractiveRunId, InteractiveDefinitionId } from '../../../domain/interactive/value-objects/Ids';
import { NotFoundError, ValidationError } from '../../shared/errors/ApplicationError';

describe('CompleteInteractiveRunUseCase', () => {
  let useCase: CompleteInteractiveRunUseCase;
  let mockRunRepository: IInteractiveRunRepository;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockRunRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByAnonymousId: vi.fn(),
      findByUserId: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };

    useCase = new CompleteInteractiveRunUseCase(mockRunRepository, mockEventBus);
  });

  it('должен завершить run с результатом', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'anxiety_gad7',
      interactiveType: 'quiz',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    const result = await useCase.execute({
      runId: run.getRunId().value,
      resultLevel: 'moderate',
      durationMs: 5000,
    });

    expect(result.success).toBe(true);
    expect(mockRunRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(run.getStatus().isCompleted()).toBe(true);
  });

  it('должен выбросить ValidationError при отсутствии runId', async () => {
    await expect(
      useCase.execute({
        runId: '',
        resultLevel: 'low',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('должен выбросить ValidationError при отсутствии результата', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'anxiety_gad7',
      interactiveType: 'quiz',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    await expect(
      useCase.execute({
        runId: run.getRunId().value,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('должен выбросить NotFoundError при отсутствии run', async () => {
    mockRunRepository.findById = vi.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        runId: 'non-existent-id',
        resultLevel: 'low',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('должен завершить run с кризисным триггером', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'anxiety_gad7',
      interactiveType: 'quiz',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    const result = await useCase.execute({
      runId: run.getRunId().value,
      resultLevel: 'high',
      durationMs: 5000,
      crisisTriggered: true,
      crisisTriggerType: 'minor_risk',
    });

    expect(result.success).toBe(true);
    expect(mockRunRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
    
    const savedRun = (mockRunRepository.save as any).mock.calls[0][0];
    const resultAggregate = savedRun.getResultAggregate();
    expect(resultAggregate?.getCrisisTrigger().isTriggered()).toBe(true);
    expect(resultAggregate?.getCrisisTrigger().getTriggerType()).toBe('minor_risk');
  });

  it('должен быть идемпотентным при повторном завершении', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'anxiety_gad7',
      interactiveType: 'quiz',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    // Первое завершение
    await useCase.execute({
      runId: run.getRunId().value,
      resultLevel: 'moderate',
      durationMs: 5000,
    });

    const firstSaveCount = (mockRunRepository.save as any).mock.calls.length;

    // Повторное завершение
    await useCase.execute({
      runId: run.getRunId().value,
      resultLevel: 'moderate',
      durationMs: 5000,
    });

    // Должно быть ещё одно сохранение (идемпотентность на уровне use case)
    expect(mockRunRepository.save).toHaveBeenCalledTimes(firstSaveCount + 1);
    // Но статус не должен измениться (идемпотентность на уровне domain)
    expect(run.getStatus().isCompleted()).toBe(true);
  });

  it('должен завершить run с resultProfile (navigator)', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'state_navigator',
      interactiveType: 'navigator',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    const result = await useCase.execute({
      runId: run.getRunId().value,
      resultProfile: 'stabilize_now',
      durationMs: 120000,
    });

    expect(result.success).toBe(true);
    expect(run.getResultAggregate()?.getResultProfile()).toBe('stabilize_now');
  });

  it('должен завершить run с resource_level (thermometer)', async () => {
    const run = InteractiveRun.start({
      interactiveDefinitionId: InteractiveDefinitionId.create('def-123'),
      interactiveSlug: 'resource_thermometer',
      interactiveType: 'thermometer',
      anonymousId: 'anon-123',
      userId: null,
    });

    mockRunRepository.findById = vi.fn().mockResolvedValue(run);

    const result = await useCase.execute({
      runId: run.getRunId().value,
      resultLevel: 'low', // для термометра это resource_level
      durationMs: 60000,
    });

    expect(result.success).toBe(true);
    expect(run.getResultAggregate()?.getResultLevel()?.getValue()).toBe('low');
  });
});
