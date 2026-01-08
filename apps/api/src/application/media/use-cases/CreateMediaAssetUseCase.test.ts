import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateMediaAssetUseCase } from './CreateMediaAssetUseCase';
import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { IStorageService } from '../services/IStorageService';
import { IEventBus } from '../../../domain/shared/events/IEventBus';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { ValidationError, ApplicationError } from '../../shared/errors/ApplicationError';

describe('CreateMediaAssetUseCase', () => {
  let useCase: CreateMediaAssetUseCase;
  let mockRepository: IMediaAssetRepository;
  let mockStorageService: IStorageService;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByObjectKey: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      findAll: vi.fn(),
      isUsedInContent: vi.fn(),
    };

    mockStorageService = {
      generateUploadUrl: vi.fn().mockResolvedValue('https://s3.example.com/upload-url'),
      generatePublicUrl: vi.fn().mockReturnValue('https://s3.example.com/public-url'),
      objectExists: vi.fn(),
      deleteObject: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    };

    useCase = new CreateMediaAssetUseCase(
      mockRepository,
      mockStorageService,
      mockEventBus
    );
  });

  describe('валидация входных данных', () => {
    it('должен выбросить ошибку если filename отсутствует', async () => {
      await expect(
        useCase.execute(
          {
            filename: '',
            mimeType: 'image/jpeg',
            sizeBytes: 1024,
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если mimeType отсутствует', async () => {
      await expect(
        useCase.execute(
          {
            filename: 'test.jpg',
            mimeType: '',
            sizeBytes: 1024,
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если sizeBytes <= 0', async () => {
      await expect(
        useCase.execute(
          {
            filename: 'test.jpg',
            mimeType: 'image/jpeg',
            sizeBytes: 0,
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('валидация MIME типа', () => {
    it('должен выбросить ошибку для неподдерживаемого MIME типа', async () => {
      await expect(
        useCase.execute(
          {
            filename: 'test.txt',
            mimeType: 'text/plain',
            sizeBytes: 1024,
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });

    it('должен принять image/jpeg', async () => {
      const result = await useCase.execute(
        {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
        null
      );

      expect(result).toBeDefined();
      expect(result.mediaAssetId).toBeDefined();
      expect(result.uploadUrl).toBeDefined();
    });

    it('должен принять audio/mpeg', async () => {
      const result = await useCase.execute(
        {
          filename: 'test.mp3',
          mimeType: 'audio/mpeg',
          sizeBytes: 1024,
        },
        null
      );

      expect(result).toBeDefined();
    });

    it('должен принять application/pdf', async () => {
      const result = await useCase.execute(
        {
          filename: 'test.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1024,
        },
        null
      );

      expect(result).toBeDefined();
    });
  });

  describe('валидация размера файла', () => {
    it('должен выбросить ошибку если размер превышает лимит для изображения', async () => {
      await expect(
        useCase.execute(
          {
            filename: 'test.jpg',
            mimeType: 'image/jpeg',
            sizeBytes: 11 * 1024 * 1024, // 11 MB > 10 MB лимит
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если размер превышает лимит для аудио', async () => {
      await expect(
        useCase.execute(
          {
            filename: 'test.mp3',
            mimeType: 'audio/mpeg',
            sizeBytes: 51 * 1024 * 1024, // 51 MB > 50 MB лимит
          },
          null
        )
      ).rejects.toThrow(ValidationError);
    });

    it('должен принять файл в пределах лимита', async () => {
      const result = await useCase.execute(
        {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 5 * 1024 * 1024, // 5 MB < 10 MB лимит
        },
        null
      );

      expect(result).toBeDefined();
    });
  });

  describe('создание медиа-актива', () => {
    it('должен создать медиа-актив и вернуть upload URL', async () => {
      const result = await useCase.execute(
        {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
          title: 'Test Image',
          altText: 'Test alt text',
        },
        null
      );

      expect(result).toBeDefined();
      expect(result.mediaAssetId).toBeDefined();
      expect(result.uploadUrl).toBe('https://s3.example.com/upload-url');
      expect(result.expiresAt).toBeInstanceOf(Date);

      // Проверяем что репозиторий был вызван
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockStorageService.generateUploadUrl).toHaveBeenCalledTimes(1);
    });

    it('должен выбросить ошибку если объект с таким ключом уже существует', async () => {
      // Мокаем что объект уже существует
      const existingAsset = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('test-id'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/test-key'),
        publicUrl: 'https://example.com/test.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: null,
        altText: null,
        uploadedByUserId: null,
        createdAt: new Date(),
      });

      mockRepository.findByObjectKey = vi.fn().mockResolvedValue(existingAsset);

      await expect(
        useCase.execute(
          {
            filename: 'test.jpg',
            mimeType: 'image/jpeg',
            sizeBytes: 1024,
          },
          null
        )
      ).rejects.toThrow(ApplicationError);
    });
  });

  describe('с userId', () => {
    it('должен создать медиа-актив с userId', async () => {
      const userId = UserId.fromString('user-123');

      const result = await useCase.execute(
        {
          filename: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
        },
        userId
      );

      expect(result).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
