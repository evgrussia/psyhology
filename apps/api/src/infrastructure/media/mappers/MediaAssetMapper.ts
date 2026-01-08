import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { MediaType } from '../../../domain/media/value-objects/MediaType';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { Prisma } from '@prisma/client';

type MediaAssetWithRelations = Prisma.MediaAssetGetPayload<{
  include: {
    contentItems: true;
  };
}>;

/**
 * Mapper для преобразования между Prisma и Domain моделями
 */
export class MediaAssetMapper {
  static toDomain(record: MediaAssetWithRelations): MediaAsset {
    return MediaAsset.reconstitute({
      id: MediaAssetId.fromString(record.id),
      storageProvider: record.storageProvider,
      objectKey: ObjectKey.fromString(record.objectKey),
      publicUrl: record.publicUrl,
      mediaType: MediaType.fromString(record.mediaType),
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      title: record.title,
      altText: record.altText,
      uploadedByUserId: record.uploadedByUserId ? UserId.fromString(record.uploadedByUserId) : null,
      createdAt: record.createdAt,
    });
  }

  static toPrisma(mediaAsset: MediaAsset): {
    id: string;
    storageProvider: string;
    objectKey: string;
    publicUrl: string;
    mediaType: string;
    mimeType: string;
    sizeBytes: bigint;
    title: string | null;
    altText: string | null;
    uploadedByUserId: string | null;
    createdAt: Date;
  } {
    return {
      id: mediaAsset.mediaAssetId.value,
      storageProvider: mediaAsset.storageProviderValue,
      objectKey: mediaAsset.objectKeyValue.getValue(),
      publicUrl: mediaAsset.publicUrlValue,
      mediaType: mediaAsset.mediaTypeValue.toString(),
      mimeType: mediaAsset.mimeTypeValue,
      sizeBytes: mediaAsset.sizeBytesValue,
      title: mediaAsset.titleValue,
      altText: mediaAsset.altTextValue,
      uploadedByUserId: mediaAsset.uploadedByUserIdValue?.value || null,
      createdAt: mediaAsset.createdAtValue,
    };
  }
}
