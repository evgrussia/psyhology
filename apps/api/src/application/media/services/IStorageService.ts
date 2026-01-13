import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { MediaType } from '../../../domain/media/value-objects/MediaType';

/**
 * Интерфейс для работы с S3-совместимым хранилищем
 */
export interface IStorageService {
  /**
   * Генерировать pre-signed URL для загрузки файла
   */
  generateUploadUrl(
    objectKey: ObjectKey,
    mediaType: MediaType,
    mimeType: string,
    expiresInSeconds?: number,
  ): Promise<string>;

  /**
   * Генерировать публичный URL для доступа к файлу
   */
  generatePublicUrl(objectKey: ObjectKey, mediaType: MediaType): string;

  /**
   * Проверить существование объекта
   */
  objectExists(objectKey: ObjectKey, mediaType: MediaType): Promise<boolean>;

  /**
   * Удалить объект из хранилища
   */
  deleteObject(objectKey: ObjectKey, mediaType: MediaType): Promise<void>;
}
