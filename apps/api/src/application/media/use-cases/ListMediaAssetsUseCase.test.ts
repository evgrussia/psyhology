import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListMediaAssetsUseCase } from './ListMediaAssetsUseCase';
import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { ValidationError } from '../../shared/errors/ApplicationError';

describe('ListMediaAssetsUseCase', () => {
  let useCase: ListMediaAssetsUseCase;
  let mockRepository: IMediaAssetRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByObjectKey: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      isUsedInContent: vi.fn(),
    };

    useCase = new ListMediaAssetsUseCase(mockRepository);
  });

  describe('валидация', () => {
    it('должен выбросить ошибку если limit < 1', async () => {
      await expect(
        useCase.execute({
          limit: 0,
        })
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если limit > 100', async () => {
      await expect(
        useCase.execute({
          limit: 101,
        })
      ).rejects.toThrow(ValidationError);
    });

    it('должен выбросить ошибку если offset < 0', async () => {
      await expect(
        useCase.execute({
          offset: -1,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('получение списка', () => {
    it('должен вернуть пустой список если нет медиа-активов', async () => {
      const result = await useCase.execute({});

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.limit).toBe(50); // дефолтный лимит
      expect(result.offset).toBe(0);
    });

    it('должен вернуть список медиа-активов', async () => {
      const mediaAsset1 = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('id-1'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/key-1'),
        publicUrl: 'https://s3.example.com/image1.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/jpeg',
        sizeBytes: BigInt(1024),
        title: 'Image 1',
        altText: 'Alt text 1',
        uploadedByUserId: null,
        createdAt: new Date('2026-01-01'),
      });

      const mediaAsset2 = MediaAsset.reconstitute({
        id: MediaAssetId.fromString('id-2'),
        storageProvider: 's3',
        objectKey: ObjectKey.fromString('image/2026/01/key-2'),
        publicUrl: 'https://s3.example.com/image2.jpg',
        mediaType: MediaType.Image,
        mimeType: 'image/png',
        sizeBytes: BigInt(2048),
        title: 'Image 2',
        altText: 'Alt text 2',
        uploadedByUserId: null,
        createdAt: new Date('2026-01-02'),
      });

      mockRepository.findAll = vi.fn().mockResolvedValue([mediaAsset1, mediaAsset2]);

      const result = await useCase.execute({});

      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('id-1');
      expect(result.items[0].publicUrl).toBe('https://s3.example.com/image1.jpg');
      expect(result.items[0].mediaType).toBe('image');
      expect(result.items[0].mimeType).toBe('image/jpeg');
      expect(result.items[0].sizeBytes).toBe(1024);
      expect(result.items[0].title).toBe('Image 1');
      expect(result.items[0].altText).toBe('Alt text 1');
    });

    it('должен фильтровать по mediaType', async () => {
      await useCase.execute({
        mediaType: 'image',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: 'image',
        })
      );
    });

    it('должен фильтровать по uploadedByUserId', async () => {
      await useCase.execute({
        uploadedByUserId: 'user-123',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          uploadedByUserId: 'user-123',
        })
      );
    });

    it('должен использовать кастомные limit и offset', async () => {
      await useCase.execute({
        limit: 20,
        offset: 10,
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 10,
        })
      );
    });
  });
});
