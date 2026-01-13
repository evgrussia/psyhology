import { describe, it, expect } from 'vitest';
import { InteractiveRun } from './InteractiveRun';
import { InteractiveDefinitionId } from '../value-objects/Ids';
import { ResultLevelVO } from '../value-objects/ResultLevel';
import { ResultAggregate } from '../value-objects/ResultAggregate';
import { CrisisTrigger, CrisisTriggerType } from '../value-objects/CrisisTrigger';

describe('InteractiveRun', () => {
  const interactiveDefinitionId = InteractiveDefinitionId.create('def-123');
  const interactiveSlug = 'anxiety_gad7';
  const interactiveType = 'quiz';

  describe('start', () => {
    it('должен создать новый запуск интерактива с anonymousId', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      expect(run.getRunId()).toBeDefined();
      expect(run.getAnonymousId()).toBe('anon-123');
      expect(run.getUserId()).toBeNull();
      expect(run.getStatus().isStarted()).toBe(true);
      expect(run.getStatus().isCompleted()).toBe(false);
      expect(run.getDomainEvents()).toHaveLength(1);
      expect(run.getDomainEvents()[0].eventName).toBe('InteractiveRunStarted');
    });

    it('должен создать новый запуск интерактива с userId', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: null,
        userId: 'user-123',
      });

      expect(run.getAnonymousId()).toBeNull();
      expect(run.getUserId()).toBe('user-123');
    });

    it('должен выбросить ошибку, если нет ни anonymousId, ни userId', () => {
      expect(() => {
        InteractiveRun.start({
          interactiveDefinitionId,
          interactiveSlug,
          interactiveType,
          anonymousId: null,
          userId: null,
        });
      }).toThrow('Either anonymousId or userId must be provided');
    });
  });

  describe('complete', () => {
    it('должен завершить интерактив с результатом', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      const resultAggregate = ResultAggregate.create({
        resultLevel: ResultLevelVO.moderate(),
        durationMs: 5000,
      });

      run.complete(resultAggregate);

      expect(run.getStatus().isCompleted()).toBe(true);
      expect(run.getResultAggregate()).toBeDefined();
      expect(run.getCompletedAt()).toBeDefined();
      expect(run.getDomainEvents().length).toBeGreaterThanOrEqual(2); // Started + Completed
    });

    it('должен быть идемпотентным при повторном завершении', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      const resultAggregate = ResultAggregate.create({
        resultLevel: ResultLevelVO.low(),
        durationMs: 3000,
      });

      run.complete(resultAggregate);
      const eventsCount = run.getDomainEvents().length;

      // Повторное завершение
      run.complete(resultAggregate);

      // Количество событий не должно увеличиться
      expect(run.getDomainEvents().length).toBe(eventsCount);
    });

    it('должен выбросить ошибку, если результат пустой', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      const emptyResult = ResultAggregate.create({});

      expect(() => {
        run.complete(emptyResult);
      }).toThrow('Result aggregate must contain at least resultLevel or resultProfile');
    });

    it('должен генерировать событие кризиса при триггере', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      const resultAggregate = ResultAggregate.create({
        resultLevel: ResultLevelVO.high(),
        durationMs: 5000,
        crisisTrigger: CrisisTrigger.create(CrisisTriggerType.MINOR_RISK),
      });

      run.complete(resultAggregate);

      const events = run.getDomainEvents();
      const crisisEvent = events.find((e) => e.eventName === 'CrisisTriggered');
      expect(crisisEvent).toBeDefined();
    });
  });

  describe('linkDeepLink', () => {
    it('должен связать deep link с run', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      run.linkDeepLink('deep-link-123');

      expect(run.getDeepLinkId()).toBe('deep-link-123');
    });

    it('должен выбросить ошибку при пустом deep link ID', () => {
      const run = InteractiveRun.start({
        interactiveDefinitionId,
        interactiveSlug,
        interactiveType,
        anonymousId: 'anon-123',
        userId: null,
      });

      expect(() => {
        run.linkDeepLink('');
      }).toThrow('Deep link ID cannot be empty');
    });
  });
});
