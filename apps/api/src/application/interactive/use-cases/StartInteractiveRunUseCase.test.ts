import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StartInteractiveRunUseCase } from './StartInteractiveRunUseCase';
import { IInteractiveRunRepository } from '../../../domain/interactive/repositories/IInteractiveRunRepository';
import { IInteractiveDefinitionRepository } from '../../../domain/interactive/repositories/IInteractiveDefinitionRepository';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { InteractiveDefinitionId } from '../../../domain/interactive/value-objects/Ids';
import { NotFoundError, ValidationError } from '../../shared/errors/ApplicationError';

describe('StartInteractiveRunUseCase', () => {
  let useCase: StartInteractiveRunUseCase;
  let mockRunRepository: IInteractiveRunRepository;
  let mockDefinitionRepository: IInteractiveDefinitionRepository;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockRunRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByAnonymousId: vi.fn(),
      findByUserId: vi.fn(),
    };

    mockDefinitionRepository = {
      findBySlugAndType: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };

    useCase = new StartInteractiveRunUseCase(
      mockRunRepository,
      mockDefinitionRepository,
      mockEventBus,
    );
  });

  it('должен создать новый run для анонимного пользователя', async () => {
    const definitionId = InteractiveDefinitionId.create('def-123');
    mockDefinitionRepository.findBySlugAndType = vi.fn().mockResolvedValue({
      id: definitionId,
      slug: 'anxiety_gad7',
      type: 'quiz',
    });

    const result = await useCase.execute({
      interactiveSlug: 'anxiety_gad7',
      anonymousId: 'anon-123',
      userId: null,
    });

    expect(result.runId).toBeDefined();
    expect(mockDefinitionRepository.findBySlugAndType).toHaveBeenCalledWith('anxiety_gad7', 'quiz');
    expect(mockRunRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
  });

  it('должен выбросить ValidationError при отсутствии slug', async () => {
    await expect(
      useCase.execute({
        interactiveSlug: '',
        anonymousId: 'anon-123',
        userId: null,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('должен выбросить ValidationError при отсутствии идентификаторов', async () => {
    await expect(
      useCase.execute({
        interactiveSlug: 'anxiety_gad7',
        anonymousId: null,
        userId: null,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('должен выбросить NotFoundError при отсутствии определения', async () => {
    mockDefinitionRepository.findBySlugAndType = vi.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        interactiveSlug: 'unknown_quiz',
        anonymousId: 'anon-123',
        userId: null,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
