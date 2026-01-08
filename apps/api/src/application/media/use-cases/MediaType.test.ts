import { describe, it, expect } from 'vitest';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { DomainError } from '../../../domain/shared/errors/DomainError';

describe('MediaType', () => {
  describe('fromMimeType', () => {
    it('должен определить image из image/jpeg', () => {
      const type = MediaType.fromMimeType('image/jpeg');
      expect(type.isImage()).toBe(true);
    });

    it('должен определить image из image/png', () => {
      const type = MediaType.fromMimeType('image/png');
      expect(type.isImage()).toBe(true);
    });

    it('должен определить audio из audio/mpeg', () => {
      const type = MediaType.fromMimeType('audio/mpeg');
      expect(type.isAudio()).toBe(true);
    });

    it('должен определить pdf из application/pdf', () => {
      const type = MediaType.fromMimeType('application/pdf');
      expect(type.isPdf()).toBe(true);
    });

    it('должен выбросить ошибку для неподдерживаемого типа', () => {
      expect(() => MediaType.fromMimeType('text/plain')).toThrow(DomainError);
    });
  });

  describe('getMaxSizeBytes', () => {
    it('должен вернуть 10MB для изображений', () => {
      expect(MediaType.Image.getMaxSizeBytes()).toBe(10 * 1024 * 1024);
    });

    it('должен вернуть 50MB для аудио', () => {
      expect(MediaType.Audio.getMaxSizeBytes()).toBe(50 * 1024 * 1024);
    });

    it('должен вернуть 20MB для PDF', () => {
      expect(MediaType.Pdf.getMaxSizeBytes()).toBe(20 * 1024 * 1024);
    });
  });

  describe('getBucketName', () => {
    it('должен вернуть emotional-balance-media для изображений', () => {
      expect(MediaType.Image.getBucketName()).toBe('emotional-balance-media');
    });

    it('должен вернуть emotional-balance-media для PDF', () => {
      expect(MediaType.Pdf.getBucketName()).toBe('emotional-balance-media');
    });

    it('должен вернуть emotional-balance-audio для аудио', () => {
      expect(MediaType.Audio.getBucketName()).toBe('emotional-balance-audio');
    });
  });
});
