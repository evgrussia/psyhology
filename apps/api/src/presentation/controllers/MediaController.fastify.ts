import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateMediaAssetUseCase } from '../../application/media/use-cases/CreateMediaAssetUseCase';
import { FinalizeMediaUploadUseCase } from '../../application/media/use-cases/FinalizeMediaUploadUseCase';
import { DeleteMediaAssetUseCase } from '../../application/media/use-cases/DeleteMediaAssetUseCase';
import { ListMediaAssetsUseCase } from '../../application/media/use-cases/ListMediaAssetsUseCase';
import {
  ValidationError,
  ApplicationError,
  AuthorizationError,
} from '../../application/shared/errors/ApplicationError';
import { DomainError } from '../../domain/shared/errors/DomainError';
import { UserId } from '../../domain/identity/value-objects/Ids';

/**
 * Controller для работы с медиа-активами (Fastify version)
 */
export class MediaController {
  constructor(
    private readonly createMediaAssetUseCase: CreateMediaAssetUseCase,
    private readonly finalizeMediaUploadUseCase: FinalizeMediaUploadUseCase,
    private readonly deleteMediaAssetUseCase: DeleteMediaAssetUseCase,
    private readonly listMediaAssetsUseCase: ListMediaAssetsUseCase,
  ) {}

  /**
   * POST /api/admin/media/init
   * Создать медиа-актив и получить pre-signed URL для загрузки
   */
  async initUpload(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as {
        filename?: string;
        mimeType?: string;
        sizeBytes?: number;
        title?: string | null;
        altText?: string | null;
      };

      const uploadedByUserId = request.currentUser
        ? UserId.fromString(request.currentUser.userId.value)
        : null;

      const result = await this.createMediaAssetUseCase.execute(
        {
          filename: body.filename || '',
          mimeType: body.mimeType || '',
          sizeBytes: body.sizeBytes || 0,
          title: body.title,
          altText: body.altText,
        },
        uploadedByUserId,
      );

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * POST /api/admin/media/:id/finalize
   * Завершить загрузку медиа-файла
   */
  async finalizeUpload(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;

      const result = await this.finalizeMediaUploadUseCase.execute({
        mediaAssetId: id,
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
   * DELETE /api/admin/media/:id
   * Удалить медиа-актив
   */
  async deleteMedia(
    request: FastifyRequest<{ Params: { id: string }; Querystring: { force?: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params;
      const force = request.query.force === 'true';

      const deletedByUserId = request.currentUser
        ? UserId.fromString(request.currentUser.userId.value)
        : null;

      const deletedByUserRole = request.currentUser?.userRoles[0] || null;

      // Получаем IP и User-Agent для audit log
      const ipAddress = request.ip || null;
      const userAgent = request.headers['user-agent'] || null;

      await this.deleteMediaAssetUseCase.execute(
        {
          mediaAssetId: id,
          force,
        },
        deletedByUserId,
        deletedByUserRole,
        ipAddress,
        userAgent,
      );

      reply.code(204).send();
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  /**
   * GET /api/admin/media
   * Получить список медиа-активов
   */
  async listMedia(
    request: FastifyRequest<{
      Querystring: {
        mediaType?: string;
        uploadedByUserId?: string;
        limit?: string;
        offset?: string;
      };
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const query = request.query;

      const result = await this.listMediaAssetsUseCase.execute({
        mediaType: query.mediaType,
        uploadedByUserId: query.uploadedByUserId,
        limit: query.limit ? parseInt(query.limit, 10) : undefined,
        offset: query.offset ? parseInt(query.offset, 10) : undefined,
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
   * Обработка ошибок
   */
  private handleError(error: unknown, reply: FastifyReply): void {
    console.error('Media error:', error);

    if (error instanceof ValidationError) {
      reply.code(400).send({
        success: false,
        error: 'ValidationError',
        message: error.message,
        errors: error.errors,
      });
      return;
    }

    if (error instanceof AuthorizationError) {
      reply.code(403).send({
        success: false,
        error: 'AuthorizationError',
        message: error.message,
      });
      return;
    }

    if (error instanceof ApplicationError) {
      reply.code(400).send({
        success: false,
        error: 'ApplicationError',
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
