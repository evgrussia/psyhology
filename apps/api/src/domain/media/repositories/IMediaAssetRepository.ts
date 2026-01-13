import { MediaAsset } from '../aggregates/MediaAsset';
import { MediaAssetId } from '../value-objects/MediaAssetId';
import { ObjectKey } from '../value-objects/ObjectKey';

/**
 * Repository интерфейс для MediaAsset aggregate
 * Реализация находится в Infrastructure Layer
 */
export interface IMediaAssetRepository {
  /**
   * Найти медиа-актив по ID
   */
  findById(id: MediaAssetId): Promise<MediaAsset | null>;

  /**
   * Найти медиа-актив по object key
   */
  findByObjectKey(objectKey: ObjectKey): Promise<MediaAsset | null>;

  /**
   * Сохранить медиа-актив (create или update)
   */
  save(mediaAsset: MediaAsset): Promise<void>;

  /**
   * Удалить медиа-актив
   */
  delete(id: MediaAssetId): Promise<void>;

  /**
   * Найти все медиа-активы с фильтрацией
   */
  findAll(params: {
    mediaType?: string;
    uploadedByUserId?: string;
    limit?: number;
    offset?: number;
  }): Promise<MediaAsset[]>;

  /**
   * Проверить, используется ли медиа-актив в контенте
   */
  isUsedInContent(id: MediaAssetId): Promise<boolean>;
}
