import { IStorageService } from '../../application/media/services/IStorageService';
import { ObjectKey } from '../../domain/media/value-objects/ObjectKey';
import { MediaType } from '../../domain/media/value-objects/MediaType';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Реализация IStorageService для S3-совместимого хранилища
 * Поддерживает Yandex Object Storage и другие S3-совместимые сервисы
 */
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;
  private readonly endpoint: string;
  private readonly region: string;

  constructor() {
    // Конфигурация из переменных окружения
    this.endpoint = process.env.S3_ENDPOINT || '';
    this.region = process.env.S3_REGION || 'ru-central1';

    // Создаём S3 клиент
    this.s3Client = new S3Client({
      endpoint: this.endpoint || undefined,
      region: this.region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: !!process.env.S3_FORCE_PATH_STYLE, // для MinIO
    });
  }

  async generateUploadUrl(
    objectKey: ObjectKey,
    mediaType: MediaType,
    mimeType: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    const bucketName = mediaType.getBucketName();
    const key = objectKey.getValue();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: mimeType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return url;
    } catch (error) {
      console.error('Failed to generate upload URL:', error);
      throw new Error(`Failed to generate upload URL: ${error}`);
    }
  }

  generatePublicUrl(objectKey: ObjectKey, mediaType: MediaType): string {
    const bucketName = mediaType.getBucketName();
    const key = objectKey.getValue();

    // Если указан кастомный CDN URL, используем его
    const cdnUrl = process.env.S3_CDN_URL;
    if (cdnUrl) {
      return `${cdnUrl}/${key}`;
    }

    // Иначе формируем стандартный S3 URL
    if (this.endpoint) {
      // Yandex Object Storage или другой кастомный endpoint
      return `${this.endpoint}/${bucketName}/${key}`;
    }

    // AWS S3 стандартный формат
    return `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async objectExists(objectKey: ObjectKey, mediaType: MediaType): Promise<boolean> {
    const bucketName = mediaType.getBucketName();
    const key = objectKey.getValue();

    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      // Другие ошибки пробрасываем дальше
      console.error('Failed to check object existence:', error);
      throw error;
    }
  }

  async deleteObject(objectKey: ObjectKey, mediaType: MediaType): Promise<void> {
    const bucketName = mediaType.getBucketName();
    const key = objectKey.getValue();

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Failed to delete object:', error);
      throw new Error(`Failed to delete object: ${error}`);
    }
  }
}
