import { describe, it, expect } from 'vitest';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';

describe('MediaAssetId', () => {
  it('должен генерировать новый ID', () => {
    const id1 = MediaAssetId.generate();
    const id2 = MediaAssetId.generate();

    expect(id1.value).toBeDefined();
    expect(id2.value).toBeDefined();
    expect(id1.value).not.toBe(id2.value);
  });

  it('должен создавать из строки', () => {
    const id = MediaAssetId.fromString('test-id-123');

    expect(id.value).toBe('test-id-123');
  });

  it('должен сравнивать ID', () => {
    const id1 = MediaAssetId.fromString('test-id');
    const id2 = MediaAssetId.fromString('test-id');
    const id3 = MediaAssetId.fromString('other-id');

    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });
});
