import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteMediaAssetUseCase } from './DeleteMediaAssetUseCase';
import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ValidationError, ApplicationError, AuthorizationError } from '../../shared/errors/ApplicationError';

describe('DeleteMediaAssetUseCase', () => {
  let useCase: DeleteMediaAssetUseCase;
  let mockRepository: IMediaAssetRepository;
  let mockStorageService: IStorageService;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByObjectKey: vi.fn(),
      save: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn(),
      isUsedInContent: vi.fn().mockResolvedValue(false),
    };

    mockStorageService = {
      generateUploadUrl: vi.fn(),
      generatePublicUrl: vi.fn(),
      objectExists: vi.fn(),
      deleteObject: vi.fn().mockResolvedValue(undefined),
    };

    mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    };

    useCase = new DeleteMediaAssetUseCase(
      mockRepository,
      mockStorageService,
      mockEventBus
    );
  });

  describe('валидация', () => {
    it('должен выбросить ошибку если mediaAssetId отсутствует', async () => {
      await expect(
        useCase.execute(
          {
            mediaAssetId: '',
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('удаление медиа-актива', () => {
    it('должен выбросить ошибку если медиа-актив не найден', async () => {
      mockRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(
        useCase.execute(
          {
            mediaAssetId: 'non-existent-id',
          },
          null
        )
      ).rejects.toThrow(ApplicationError);
    });

    it('должен выбросить ошибку если медиа используется в контенте', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://s3.example.com/test.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);
      mockRepository.isUsedInContent = vi.fn().mockResolvedValue(true);

      await expect(
        useCase.execute(
          {
            mediaAssetId: 'test-id',
          },
          null
        )
      ).rejects.toThrow(ApplicationError);
    });

    it('должен удалить медиа-актив если не используется', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://s3.example.com/test.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);

      await useCase.execute(
        {
          mediaAssetId: 'test-id',
        },
        null
      );

      expect(mockStorageService.deleteObject).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('должен удалить медиа-актив с force=true даже если используется', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://s3.example.com/test.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);
      mockRepository.isUsedInContent = vi.fn().mockResolvedValue(true);

      await useCase.execute(
        {
          mediaAssetId: 'test-id',
          force: true,
        },
        null
      );

      expect(mockStorageService.deleteObject).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('должен выбросить ошибку если пользователь не имеет прав на удаление', async () => {
      const userId = UserId.fromString('user-123');
      const otherUserId = UserId.fromString('other-user-456');

      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://s3.example.com/test.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: userId, // загружен другим пользователем
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);

      await expect(
        useCase.execute(
          {
            mediaAssetId: 'test-id',
          },
          otherUserId // пытается удалить другой пользователь
        )
      ).rejects.toThrow(AuthorizationError);
    });
  });
});
