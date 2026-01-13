import { FastifyRequest, FastifyReply } from 'fastify';
import { StartInteractiveRunUseCase } from '../../application/interactive/use-cases/StartInteractiveRunUseCase';
import { CompleteInteractiveRunUseCase } from '../../application/interactive/use-cases/CompleteInteractiveRunUseCase';
import {
  StartInteractiveRunRequestDto,
  CompleteInteractiveRunRequestDto,
} from '../../application/interactive/dto/InteractiveDtos';
import {
  ValidationError,
  NotFoundError,
} from '../../application/shared/errors/ApplicationError';
import { DomainError } from '../../domain/shared/errors/DomainError';

/**
 * Controller для интерактивов (Fastify version)
 */
export class InteractiveController {
  constructor(
    private readonly startInteractiveRunUseCase: StartInteractiveRunUseCase,
    private readonly completeInteractiveRunUseCase: CompleteInteractiveRunUseCase,
  ) {}

  /**
   * POST /api/public/interactive/runs
   * Запуск интерактива
   */
  async startRun(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as StartInteractiveRunRequestDto;

      // Извлекаем anonymousId из заголовков или body
      const anonymousId = body.anonymousId || (request.headers['x-anonymous-id'] as string) || null;
      const userId = (request as any).currentUser?.userId?.value || body.userId || null;

      const dto: StartInteractiveRunRequestDto = {
        interactiveSlug: body.interactiveSlug,
        anonymousId: anonymousId,
        userId: userId,
        topic: body.topic || null,
        entryPoint: body.entryPoint || null,
      };

      const result = await this.startInteractiveRunUseCase.execute(dto);

      reply.status(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/public/interactive/runs/:runId/complete
   * Завершение интерактива
   */
  async completeRun(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const params = request.params as { runId: string };
      const body = request.body as Omit<CompleteInteractiveRunRequestDto, 'runId'>;

      // Валидация: запрет на сырые ответы/тексты (Privacy by Design)
      if ((body as any).answers || (body as any).rawAnswers || (body as any).text) {
        reply.status(400).send({
          success: false,
          error: 'ValidationError',
          message: 'Raw answers or text are not allowed. Only aggregated results are accepted.',
        });
        return;
      }

      const dto: CompleteInteractiveRunRequestDto = {
        runId: params.runId,
        resultLevel: body.resultLevel || null,
        resultProfile: body.resultProfile || null,
        durationMs: body.durationMs || null,
        crisisTriggered: body.crisisTriggered || false,
        crisisTriggerType: body.crisisTriggerType || null,
      };

      await this.completeInteractiveRunUseCase.execute(dto);

      reply.status(204).send();
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('Interactive error:', error);

    if (error instanceof ValidationError) {
      reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error instanceof NotFoundError) {
      reply.status(404).send({
        success: false,
        error: 'NotFoundError',
        message: error.message,
      });
      return;
    }

    if (error instanceof DomainError) {
      reply.status(400).send({
        success: false,
        error: 'DomainError',
        message: error.message,
      });
      return;
    }

    // Неизвестная ошибка
    reply.status(500).send({
      success: false,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    });
  }
}
