import { InteractiveRunId, InteractiveDefinitionId } from '../value-objects/Ids';
import { ResultLevelVO } from '../value-objects/ResultLevel';
import { RunStatusVO } from '../value-objects/RunStatus';
import { ResultAggregate } from '../value-objects/ResultAggregate';
import { CrisisTrigger } from '../value-objects/CrisisTrigger';
import { DomainEvent } from '../../shared/events/DomainEvent';
import {
  InteractiveRunStartedEvent,
  InteractiveRunCompletedEvent,
  CrisisTriggeredEvent,
} from '../events/InteractiveEvents';

/**
 * InteractiveRun Aggregate Root
 * Представляет выполнение интерактива (квиз, навигатор, термометр и т.д.)
 * 
 * Правила:
 * - Хранит только агрегаты результатов (без сырых ответов/текстов)
 * - Поддерживает анонимные запуски (без user_id)
 * - Генерирует доменные события для аналитики
 */
export class InteractiveRun {
  private constructor(
    private readonly id: InteractiveRunId,
    private readonly interactiveDefinitionId: InteractiveDefinitionId,
    private readonly interactiveSlug: string,
    private readonly interactiveType: string,
    private readonly anonymousId: string | null,
    private readonly userId: string | null,
    private readonly startedAt: Date,
    private status: RunStatusVO,
    private resultAggregate: ResultAggregate | null,
    private completedAt: Date | null,
    private deepLinkId: string | null,
    private domainEvents: DomainEvent[] = [],
  ) {
    // Валидация: хотя бы один идентификатор (anonymousId или userId)
    if (!anonymousId && !userId) {
      throw new Error('Either anonymousId or userId must be provided');
    }
  }

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Создание нового запуска интерактива
   */
  static start(params: {
    interactiveDefinitionId: InteractiveDefinitionId;
    interactiveSlug: string;
    interactiveType: string;
    anonymousId: string | null;
    userId: string | null;
    topic?: string | null;
    entryPoint?: string | null;
  }): InteractiveRun {
    const run = new InteractiveRun(
      InteractiveRunId.generate(),
      params.interactiveDefinitionId,
      params.interactiveSlug,
      params.interactiveType,
      params.anonymousId,
      params.userId,
      new Date(),
      RunStatusVO.started(),
      null,
      null,
      null,
    );

    // Генерируем событие старта
    const event = new InteractiveRunStartedEvent(
      run.getRunId(),
      params.interactiveDefinitionId.value,
      params.interactiveSlug,
      params.interactiveType,
      params.anonymousId,
      params.userId,
      params.topic ?? null,
      params.entryPoint ?? null,
    );
    run.addDomainEvent(event);

    return run;
  }

  /**
   * Восстановление из БД (reconstitute)
   */
  static reconstitute(data: {
    id: InteractiveRunId;
    interactiveDefinitionId: InteractiveDefinitionId;
    interactiveSlug: string;
    interactiveType: string;
    anonymousId: string | null;
    userId: string | null;
    startedAt: Date;
    status: RunStatusVO;
    resultAggregate: ResultAggregate | null;
    completedAt: Date | null;
    deepLinkId: string | null;
  }): InteractiveRun {
    return new InteractiveRun(
      data.id,
      data.interactiveDefinitionId,
      data.interactiveSlug,
      data.interactiveType,
      data.anonymousId,
      data.userId,
      data.startedAt,
      data.status,
      data.resultAggregate,
      data.completedAt,
      data.deepLinkId,
      [], // события не восстанавливаем из БД
    );
  }

  // ============================================
  // Business Logic
  // ============================================

  /**
   * Завершение интерактива с результатом
   */
  complete(resultAggregate: ResultAggregate): void {
    if (this.status.isCompleted()) {
      // Идемпотентность: повторное завершение не создаёт дубли
      return;
    }

    if (!resultAggregate.hasResult()) {
      throw new Error('Result aggregate must contain at least resultLevel or resultProfile');
    }

    this.status = RunStatusVO.completed();
    this.resultAggregate = resultAggregate;
    this.completedAt = new Date();

    // Генерируем событие завершения
    const event = new InteractiveRunCompletedEvent(
      this.id,
      this.interactiveDefinitionId.value,
      this.interactiveSlug,
      this.interactiveType,
      resultAggregate.getResultLevel(),
      resultAggregate.getResultProfile(),
      resultAggregate.getDurationMs(),
      this.anonymousId,
      this.userId,
    );
    this.addDomainEvent(event);

    // Если сработал кризисный триггер, генерируем отдельное событие
    if (resultAggregate.getCrisisTrigger().isTriggered()) {
      const triggerType = resultAggregate.getCrisisTrigger().getTriggerType();
      if (triggerType) {
        const crisisEvent = new CrisisTriggeredEvent(
          this.id,
          triggerType,
          this.interactiveType, // surface = тип интерактива
          this.anonymousId,
          this.userId,
        );
        this.addDomainEvent(crisisEvent);
      }
    }
  }

  /**
   * Связывание с deep link для Telegram
   */
  linkDeepLink(deepLinkId: string): void {
    if (!deepLinkId || deepLinkId.trim().length === 0) {
      throw new Error('Deep link ID cannot be empty');
    }
    this.deepLinkId = deepLinkId;
  }

  // ============================================
  // Getters
  // ============================================

  getRunId(): InteractiveRunId {
    return this.id;
  }

  getInteractiveDefinitionId(): InteractiveDefinitionId {
    return this.interactiveDefinitionId;
  }

  getInteractiveSlug(): string {
    return this.interactiveSlug;
  }

  getInteractiveType(): string {
    return this.interactiveType;
  }

  getAnonymousId(): string | null {
    return this.anonymousId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getStartedAt(): Date {
    return this.startedAt;
  }

  getStatus(): RunStatusVO {
    return this.status;
  }

  getResultAggregate(): ResultAggregate | null {
    return this.resultAggregate;
  }

  getCompletedAt(): Date | null {
    return this.completedAt;
  }

  getDeepLinkId(): string | null {
    return this.deepLinkId;
  }

  // ============================================
  // Domain Events
  // ============================================

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
