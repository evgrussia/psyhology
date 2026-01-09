import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateContentItemUseCase } from '../../application/content/use-cases/CreateContentItemUseCase';
import { UpdateContentItemUseCase } from '../../application/content/use-cases/UpdateContentItemUseCase';
import { GetContentItemUseCase } from '../../application/content/use-cases/GetContentItemUseCase';
import { ListContentItemsUseCase } from '../../application/content/use-cases/ListContentItemsUseCase';
import { PublishContentItemUseCase } from '../../application/content/use-cases/PublishContentItemUseCase';
import { GetContentItemBySlugUseCase } from '../../application/content/use-cases/GetContentItemBySlugUseCase';
import { RollbackContentItemUseCase } from '../../application/content/use-cases/RollbackContentItemUseCase';
import { ListContentRevisionsUseCase } from '../../application/content/use-cases/ListContentRevisionsUseCase';
import { ArchiveContentItemUseCase } from '../../application/content/use-cases/ArchiveContentItemUseCase';
import { ListPublicContentItemsUseCase } from '../../application/content/use-cases/ListPublicContentItemsUseCase';
import { RenderMarkdownPreviewUseCase } from '../../application/content/use-cases/RenderMarkdownPreviewUseCase';
import {
  ValidationError,
  ApplicationError,
  NotFoundError,
} from '../../application/shared/errors/ApplicationError';
import { DomainError } from '../../domain/shared/errors/DomainError';
import { UserId } from '../../domain/identity/value-objects/Ids';

/**
 * Controller для работы с контентом (Fastify version)
 */
export class ContentController {
  constructor(
    private readonly createContentItemUseCase: CreateContentItemUseCase,
    private readonly updateContentItemUseCase: UpdateContentItemUseCase,
    private readonly getContentItemUseCase: GetContentItemUseCase,
    private readonly listContentItemsUseCase: ListContentItemsUseCase,
    private readonly publishContentItemUseCase: PublishContentItemUseCase,
    private readonly getContentItemBySlugUseCase: GetContentItemBySlugUseCase,
    private readonly rollbackContentItemUseCase: RollbackContentItemUseCase,
    private readonly listContentRevisionsUseCase: ListContentRevisionsUseCase,
    private readonly archiveContentItemUseCase: ArchiveContentItemUseCase,
    private readonly listPublicContentItemsUseCase: ListPublicContentItemsUseCase,
    private readonly renderMarkdownPreviewUseCase: RenderMarkdownPreviewUseCase,
  ) {}

  /**
   * POST /api/admin/content
   * Создать новый контент-айтем
   */
  async createContent(
    request: FastifyRequest<{ Body: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const body = request.body as any;
      const authorUserId = request.currentUser
        ? UserId.create(request.currentUser.userId.value)
        : null;

      const result = await this.createContentItemUseCase.execute(body, authorUserId);

      reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * PUT /api/admin/content/:id
   * Обновить контент-айтем
   */
  async updateContent(
    request: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;
      const body = request.body as any;
      const updatedByUserId = request.currentUser
        ? UserId.create(request.currentUser.userId.value)
        : null;

      const result = await this.updateContentItemUseCase.execute(id, body, updatedByUserId);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/admin/content/:id
   * Получить контент-айтем по ID
   */
  async getContent(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;

      const result = await this.getContentItemUseCase.execute(id);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/admin/content
   * Получить список контент-айтемов
   */
  async listContent(
    request: FastifyRequest<{ Querystring: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const query = request.query as any;

      const result = await this.listContentItemsUseCase.execute(query);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/admin/content/:id/publish
   * Опубликовать контент-айтем
   */
  async publishContent(
    request: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;
      const body = request.body as any;
      const publishedBy = request.currentUser
        ? UserId.create(request.currentUser.userId.value)
        : null;

      const result = await this.publishContentItemUseCase.execute(id, body, publishedBy);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/public/content/:type/:slug
   * Получить опубликованный контент-айтем по типу и slug (публичный API)
   */
  async getPublicContent(
    request: FastifyRequest<{ Params: { type: string; slug: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { type, slug } = request.params;

      const result = await this.getContentItemBySlugUseCase.execute(type, slug);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/public/content/:type
   * Получить список опубликованных контент-айтемов по типу (публичный API)
   */
  async listPublicContent(
    request: FastifyRequest<{ Params: { type: string }; Querystring: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { type } = request.params;
      const query = request.query as any;

      const result = await this.listPublicContentItemsUseCase.execute(type, {
        limit: query.limit !== undefined ? Number(query.limit) : undefined,
        offset: query.offset !== undefined ? Number(query.offset) : undefined,
        topicCodes: query.topicCodes,
        tagIds: query.tagIds,
      });

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/admin/content/:id/archive
   * Заархивировать контент-айтем
   */
  async archiveContent(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;
      const archivedBy = request.currentUser ? UserId.create(request.currentUser.userId.value) : null;

      const result = await this.archiveContentItemUseCase.execute(id, archivedBy);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/admin/content/preview
   * Рендер markdown в HTML для live preview (админка)
   */
  async renderPreview(
    request: FastifyRequest<{ Body: any }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const body = request.body as any;
      const result = await this.renderMarkdownPreviewUseCase.execute({
        markdown: body?.markdown ?? '',
      });

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/admin/content/:id/revisions
   * Получить список ревизий контент-айтема
   */
  async listRevisions(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;

      const result = await this.listContentRevisionsUseCase.execute(id);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/admin/content/:id/rollback/:revisionId
   * Откатить контент-айтем к предыдущей ревизии
   */
  async rollbackContent(
    request: FastifyRequest<{ Params: { id: string; revisionId: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id, revisionId } = request.params;
      const rolledBackBy = request.currentUser
        ? UserId.create(request.currentUser.userId.value)
        : null;

      const result = await this.rollbackContentItemUseCase.execute(id, revisionId, rolledBackBy);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * Обработка ошибок
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('Content error:', error);

    if (error instanceof ValidationError) {
      reply.code(400).send({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error instanceof NotFoundError) {
      reply.code(404).send({
        success: false,
        error: 'NotFoundError',
        message: error.message,
      });
      return;
    }

    if (error instanceof DomainError) {
      reply.code(400).send({
        success: false,
        error: 'DomainError',
        message: error.message,
      });
      return;
    }

    // Неизвестная ошибка
    reply.code(500).send({
      success: false,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    });
  }
}
