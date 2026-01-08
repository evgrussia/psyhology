import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinalizeMediaUploadUseCase } from './FinalizeMediaUploadUseCase';
import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { ValidationError, ApplicationError } from '../../shared/errors/ApplicationError';

describe('FinalizeMediaUploadUseCase', () => {
  let useCase: FinalizeMediaUploadUseCase;
  let mockRepository: IMediaAssetRepository;
  let mockStorageService: IStorageService;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByObjectKey: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      findAll: vi.fn(),
      isUsedInContent: vi.fn(),
    };

    mockStorageService = {
      generateUploadUrl: vi.fn(),
      generatePublicUrl: vi.fn().mockReturnValue('https://s3.example.com/public-url'),
      objectExists: vi.fn().mockResolvedValue(true),
      deleteObject: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    };

    useCase = new FinalizeMediaUploadUseCase(
      mockRepository,
      mockStorageService,
      mockEventBus
    );
  });

  describe('валидация', () => {
    it('должен выбросить ошибку если mediaAssetId отсутствует', async () => {
      await expect(
        useCase.execute({
          mediaAssetId: '',
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('завершение загрузки', () => {
    it('должен выбросить ошибку если медиа-актив не найден', async () => {
      mockRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(
        useCase.execute({
          mediaAssetId: 'non-existent-id',
        })
      ).rejects.toThrow(ApplicationError);
    });

    it('должен выбросить ошибку если файл не загружен в S3', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: '', // не загружен
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);
      mockStorageService.objectExists = vi.fn().mockResolvedValue(false);

      await expect(
        useCase.execute({
          mediaAssetId: 'test-id',
        })
      ).rejects.toThrow(ApplicationError);
    });

    it('должен завершить загрузку и вернуть public URL', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: '', // не загружен
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);

      const result = await useCase.execute({
        mediaAssetId: 'test-id',
      });

      expect(result).toBeDefined();
      expect(result.mediaAssetId).toBe('test-id');
      expect(result.publicUrl).toBe('https://s3.example.com/public-url');

      // Проверяем что репозиторий был вызван для сохранения
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockStorageService.objectExists).toHaveBeenCalledTimes(1);
    });

    it('должен быть идемпотентным - если уже завершено, вернуть существующий URL', async () => {
      const mediaAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://s3.example.com/existing-url', // уже загружен
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findById = vi.fn().mockResolvedValue(mediaAsset);

      const result = await useCase.execute({
        mediaAssetId: 'test-id',
      });

      expect(result.publicUrl).toBe('https://s3.example.com/existing-url');
      // Не должно быть вызова save, так как уже завершено
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
