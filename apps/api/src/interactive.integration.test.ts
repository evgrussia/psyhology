import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { StartInteractiveRunUseCase } from './application/interactive/use-cases/StartInteractiveRunUseCase';
import { CompleteInteractiveRunUseCase } from './application/interactive/use-cases/CompleteInteractiveRunUseCase';
import { PrismaInteractiveRunRepository } from './infrastructure/interactive/repositories/PrismaInteractiveRunRepository';
import { PrismaInteractiveDefinitionRepository } from './infrastructure/interactive/repositories/PrismaInteractiveDefinitionRepository';
import { InMemoryEventBus } from './infrastructure/event-bus/InMemoryEventBus';
import {
  InteractiveRunStartedEvent,
  InteractiveRunCompletedEvent,
  CrisisTriggeredEvent,
} from './domain/interactive/events/InteractiveEvents';

/**
 * Integration тесты для Interactive Platform (FEAT-INT-01)
 *
 * Проверяют:
 * - Полный цикл: start → complete → БД
 * - Сохранение только агрегатов (без сырых ответов)
 * - Идемпотентность complete
 * - Кризисные триггеры
 * - Доменные события
 * - Privacy by Design (нет сырых ответов в БД)
 */
describe('Interactive Platform Integration Tests (FEAT-INT-01)', () => {
  let prisma: PrismaClient;
  let interactiveRunRepository: PrismaInteractiveRunRepository;
  let interactiveDefinitionRepository: PrismaInteractiveDefinitionRepository;
  let eventBus: InMemoryEventBus;
  let startInteractiveRunUseCase: StartInteractiveRunUseCase;
  let completeInteractiveRunUseCase: CompleteInteractiveRunUseCase;

  let testInteractiveDefinitionId: string;
  let publishedEvents: Array<InteractiveRunStartedEvent | InteractiveRunCompletedEvent | CrisisTriggeredEvent> = [];

  beforeAll(async () => {
    // Подключаемся к тестовой БД
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/psychology_test',
        },
      },
    });

    // Создаём репозитории и use cases
    interactiveRunRepository = new PrismaInteractiveRunRepository(prisma);
    interactiveDefinitionRepository = new PrismaInteractiveDefinitionRepository(prisma);
    eventBus = new InMemoryEventBus();

    // Подписываемся на события для проверки
    eventBus.subscribe('InteractiveRunStarted', async (event) => {
      if (event instanceof InteractiveRunStartedEvent) {
        publishedEvents.push(event);
      }
    });

    eventBus.subscribe('InteractiveRunCompleted', async (event) => {
      if (event instanceof InteractiveRunCompletedEvent) {
        publishedEvents.push(event);
      }
    });

    eventBus.subscribe('CrisisTriggered', async (event) => {
      if (event instanceof CrisisTriggeredEvent) {
        publishedEvents.push(event);
      }
    });

    startInteractiveRunUseCase = new StartInteractiveRunUseCase(
      interactiveRunRepository,
      interactiveDefinitionRepository,
      eventBus,
    );

    completeInteractiveRunUseCase = new CompleteInteractiveRunUseCase(
      interactiveRunRepository,
      eventBus,
    );

    // Создаём тестовое определение интерактива (quiz)
    const testDefinition = await prisma.interactiveDefinition.create({
      data: {
        interactiveType: 'quiz',
        slug: 'anxiety_gad7_test',
        title: 'Test Anxiety Quiz (GAD-7)',
        status: 'published',
        publishedAt: new Date(),
      },
    });

    testInteractiveDefinitionId = testDefinition.id;

    // Создаём тестовое определение для навигатора
    await prisma.interactiveDefinition.create({
      data: {
        interactiveType: 'navigator',
        slug: 'state_navigator_test',
        title: 'Test State Navigator',
        status: 'published',
        publishedAt: new Date(),
      },
    });

    // Создаём тестовое определение для термометра
    await prisma.interactiveDefinition.create({
      data: {
        interactiveType: 'thermometer',
        slug: 'resource_thermometer_test',
        title: 'Test Resource Thermometer',
        status: 'published',
        publishedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    // Очищаем тестовые данные
    await prisma.interactiveRun.deleteMany({
      where: {
        interactiveDefinitionId: {
          in: await prisma.interactiveDefinition
            .findMany({
              where: {
                slug: {
                  endsWith: '_test',
                },
              },
              select: { id: true },
            })
            .then((defs) => defs.map((d) => d.id)),
        },
      },
    });

    await prisma.interactiveDefinition.deleteMany({
      where: {
        slug: {
          endsWith: '_test',
        },
      },
    });

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Очищаем события перед каждым тестом
    publishedEvents = [];

    // Очищаем runs перед каждым тестом
    await prisma.interactiveRun.deleteMany({
      where: {
        interactiveDefinitionId: {
          in: await prisma.interactiveDefinition
            .findMany({
              where: {
                slug: {
                  endsWith: '_test',
                },
              },
              select: { id: true },
            })
            .then((defs) => defs.map((d) => d.id)),
        },
      },
    });
  });

  describe('AC-1: Сохранение только агрегатов в БД (без сырых ответов)', () => {
    it('должен сохранить только агрегаты для quiz (result_level, duration_ms)', async () => {
      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: 'anon-test-1',
      });

      expect(startResult.runId).toBeDefined();

      // 2. Завершаем интерактив с результатом
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'moderate',
        durationMs: 5000,
      });

      // 3. Проверяем запись в БД
      const dbRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(dbRecord).toBeDefined();
      expect(dbRecord?.resultLevel).toBe('moderate');
      expect(dbRecord?.durationMs).toBe(5000);
      expect(dbRecord?.resultProfile).toBeNull();

      // 4. Проверяем Privacy by Design: НЕТ полей для сырых ответов
      // В схеме БД не должно быть полей: answers, rawAnswers, text, question_text, answer_text
      const recordKeys = Object.keys(dbRecord || {});
      expect(recordKeys).not.toContain('answers');
      expect(recordKeys).not.toContain('rawAnswers');
      expect(recordKeys).not.toContain('text');
      expect(recordKeys).not.toContain('question_text');
      expect(recordKeys).not.toContain('answer_text');
    });

    it('должен сохранить только агрегаты для navigator (result_profile, duration_ms)', async () => {
      // 1. Запускаем навигатор
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'state_navigator_test',
        anonymousId: 'anon-test-2',
      });

      expect(startResult.runId).toBeDefined();

      // 2. Завершаем навигатор с результатом
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultProfile: 'stabilize_now',
        durationMs: 120000,
      });

      // 3. Проверяем запись в БД
      const dbRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(dbRecord).toBeDefined();
      expect(dbRecord?.resultProfile).toBe('stabilize_now');
      expect(dbRecord?.durationMs).toBe(120000);
      expect(dbRecord?.resultLevel).toBeNull(); // для навигатора resultLevel может быть null

      // 4. Проверяем Privacy by Design: НЕТ полей для сырого текста
      const recordKeys = Object.keys(dbRecord || {});
      expect(recordKeys).not.toContain('text');
      expect(recordKeys).not.toContain('rawText');
      expect(recordKeys).not.toContain('userInput');
    });

    it('должен сохранить только агрегаты для thermometer (resource_level как result_level, duration_ms)', async () => {
      // 1. Запускаем термометр
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'resource_thermometer_test',
        anonymousId: 'anon-test-3',
      });

      expect(startResult.runId).toBeDefined();

      // 2. Завершаем термометр с результатом
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'low', // для термометра это resource_level
        durationMs: 60000,
      });

      // 3. Проверяем запись в БД
      const dbRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(dbRecord).toBeDefined();
      expect(dbRecord?.resultLevel).toBe('low'); // используется как resource_level
      expect(dbRecord?.durationMs).toBe(60000);
    });
  });

  describe('AC-2: Отправка событий start_*, complete_*, crisis_banner_shown', () => {
    it('должен отправить события start_quiz и complete_quiz', async () => {
      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: 'anon-test-events-1',
        topic: 'anxiety',
      });

      // 2. Проверяем событие InteractiveRunStarted
      expect(publishedEvents.length).toBeGreaterThan(0);
      const startEvent = publishedEvents.find(
        (e) => e instanceof InteractiveRunStartedEvent,
      ) as InteractiveRunStartedEvent;

      expect(startEvent).toBeDefined();
      expect(startEvent.interactiveSlug).toBe('anxiety_gad7_test');
      expect(startEvent.interactiveType).toBe('quiz');
      expect(startEvent.topic).toBe('anxiety');
      expect(startEvent.anonymousId).toBe('anon-test-events-1');

      // Очищаем события для проверки complete
      publishedEvents = [];

      // 3. Завершаем интерактив
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'moderate',
        durationMs: 5000,
      });

      // 4. Проверяем событие InteractiveRunCompleted
      const completeEvent = publishedEvents.find(
        (e) => e instanceof InteractiveRunCompletedEvent,
      ) as InteractiveRunCompletedEvent;

      expect(completeEvent).toBeDefined();
      expect(completeEvent.interactiveSlug).toBe('anxiety_gad7_test');
      expect(completeEvent.interactiveType).toBe('quiz');
      expect(completeEvent.resultLevel?.getValue()).toBe('moderate');
      expect(completeEvent.durationMs).toBe(5000);

      // События не содержат сырых ответов
      expect(startEvent).not.toHaveProperty('answers');
      expect(completeEvent).not.toHaveProperty('answers');
    });

    it('должен отправить событие crisis_banner_shown при кризисном триггере', async () => {
      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: 'anon-test-crisis-1',
      });

      // Очищаем события
      publishedEvents = [];

      // 2. Завершаем с кризисным триггером
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'high',
        durationMs: 5000,
        crisisTriggered: true,
        crisisTriggerType: 'minor_risk',
      });

      // 3. Проверяем событие CrisisTriggered
      const crisisEvent = publishedEvents.find(
        (e) => e instanceof CrisisTriggeredEvent,
      ) as CrisisTriggeredEvent;

      expect(crisisEvent).toBeDefined();
      expect(crisisEvent.triggerType).toBe('minor_risk');
      expect(crisisEvent.surface).toBe('quiz'); // тип интерактива

      // Событие не содержит деталей текста
      expect(crisisEvent).not.toHaveProperty('text');
      expect(crisisEvent).not.toHaveProperty('details');
    });
  });

  describe('Idempotency: повторное завершение не создаёт дубли', () => {
    it('должен быть идемпотентным при повторном complete', async () => {
      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: 'anon-test-idempotency-1',
      });

      // 2. Первое завершение
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'moderate',
        durationMs: 5000,
      });

      const firstRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(firstRecord?.completedAt).toBeDefined();
      const firstCompletedAt = firstRecord?.completedAt;

      // 3. Повторное завершение
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'moderate',
        durationMs: 5000,
      });

      const secondRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      // 4. Проверяем, что completedAt не изменился (идемпотентность на уровне domain)
      expect(secondRecord?.completedAt).toEqual(firstCompletedAt);

      // 5. Проверяем, что не создалось дублей
      const allRuns = await prisma.interactiveRun.findMany({
        where: { id: startResult.runId },
      });

      expect(allRuns.length).toBe(1); // только один run
    });
  });

  describe('Полный цикл: start → complete → БД', () => {
    it('должен выполнить полный цикл для анонимного пользователя', async () => {
      const anonymousId = 'anon-full-cycle-1';

      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: anonymousId,
        topic: 'anxiety',
        entryPoint: 'homepage',
      });

      expect(startResult.runId).toBeDefined();

      // 2. Проверяем запись в БД (начало)
      const startedRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
        include: {
          interactiveDefinition: true,
        },
      });

      expect(startedRecord).toBeDefined();
      expect(startedRecord?.anonymousId).toBe(anonymousId);
      expect(startedRecord?.userId).toBeNull(); // анонимный пользователь
      expect(startedRecord?.completedAt).toBeNull(); // ещё не завершён
      expect(startedRecord?.interactiveDefinition.slug).toBe('anxiety_gad7_test');

      // 3. Завершаем интерактив
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'moderate',
        durationMs: 5000,
      });

      // 4. Проверяем запись в БД (завершение)
      const completedRecord = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(completedRecord).toBeDefined();
      expect(completedRecord?.completedAt).toBeDefined();
      expect(completedRecord?.resultLevel).toBe('moderate');
      expect(completedRecord?.durationMs).toBe(5000);
      expect(completedRecord?.crisisTriggered).toBe(false);
    });

    it('должен выполнить полный цикл с кризисным триггером', async () => {
      const anonymousId = 'anon-full-cycle-crisis-1';

      // 1. Запускаем интерактив
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'anxiety_gad7_test',
        anonymousId: anonymousId,
      });

      // 2. Завершаем с кризисным триггером
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultLevel: 'high',
        durationMs: 5000,
        crisisTriggered: true,
        crisisTriggerType: 'suicidal_ideation',
      });

      // 3. Проверяем запись в БД
      const record = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(record?.crisisTriggered).toBe(true);
      expect(record?.crisisTriggerType).toBe('suicidal_ideation');

      // Проверяем событие
      const crisisEvent = publishedEvents.find(
        (e) => e instanceof CrisisTriggeredEvent,
      ) as CrisisTriggeredEvent;

      expect(crisisEvent).toBeDefined();
      expect(crisisEvent.triggerType).toBe('suicidal_ideation');
    });

    it('должен выполнить полный цикл для навигатора с result_profile', async () => {
      const anonymousId = 'anon-full-cycle-nav-1';

      // 1. Запускаем навигатор
      const startResult = await startInteractiveRunUseCase.execute({
        interactiveSlug: 'state_navigator_test',
        anonymousId: anonymousId,
      });

      // 2. Завершаем навигатор
      await completeInteractiveRunUseCase.execute({
        runId: startResult.runId,
        resultProfile: 'restore_energy',
        durationMs: 120000,
      });

      // 3. Проверяем запись в БД
      const record = await prisma.interactiveRun.findUnique({
        where: { id: startResult.runId },
      });

      expect(record?.resultProfile).toBe('restore_energy');
      expect(record?.durationMs).toBe(120000);
      expect(record?.resultLevel).toBeNull(); // для навигатора может быть null
    });
  });

  describe('Валидация: Privacy by Design', () => {
    it('не должен сохранять сырые ответы в БД', async () => {
      // Проверяем структуру БД: нет полей для сырых ответов
      const dbSchema = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'interactive_runs'
      `;

      const columnNames = (dbSchema as Array<{ column_name: string }>).map(
        (col) => col.column_name,
      );

      // Проверяем, что нет полей для сырых ответов
      expect(columnNames).not.toContain('answers');
      expect(columnNames).not.toContain('raw_answers');
      expect(columnNames).not.toContain('text');
      expect(columnNames).not.toContain('question_text');
      expect(columnNames).not.toContain('answer_text');
      expect(columnNames).not.toContain('user_input');

      // Проверяем, что есть только агрегаты
      expect(columnNames).toContain('result_level');
      expect(columnNames).toContain('result_profile');
      expect(columnNames).toContain('duration_ms');
      expect(columnNames).toContain('crisis_triggered');
      expect(columnNames).toContain('crisis_trigger_type');
    });
  });
});
