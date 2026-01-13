import { IMediaAssetRepository } from '../../../domain/media/repositories/IMediaAssetRepository';
import { MediaAsset } from '../../../domain/media/aggregates/MediaAsset';
import { MediaAssetId } from '../../../domain/media/value-objects/MediaAssetId';
import { ObjectKey } from '../../../domain/media/value-objects/ObjectKey';
import { MediaAssetMapper } from '../mappers/MediaAssetMapper';
import { PrismaClient } from '@prisma/client';

/**
 * Реализация MediaAssetRepository через Prisma
 */
export class PrismaMediaAssetRepository implements IMediaAssetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: MediaAssetId): Promise<MediaAsset | null> {
    const record = await this.prisma.mediaAsset.findUnique({
      where: { id: id.value },
      include: {
        contentItems: true,
      },
    });

    if (!record) {
      return null;
    }

    return MediaAssetMapper.toDomain(record);
  }

  async findByObjectKey(objectKey: ObjectKey): Promise<MediaAsset | null> {
    const record = await this.prisma.mediaAsset.findUnique({
      where: { objectKey: objectKey.getValue() },
      include: {
        contentItems: true,
      },
    });

    if (!record) {
      return null;
    }

    return MediaAssetMapper.toDomain(record);
  }

  async save(mediaAsset: MediaAsset): Promise<void> {
    const data = MediaAssetMapper.toPrisma(mediaAsset);

    await this.prisma.mediaAsset.upsert({
      where: { id: data.id },
      create: data,
      update: {
        publicUrl: data.publicUrl,
        title: data.title,
        altText: data.altText,
      },
    });
  }

  async delete(id: MediaAssetId): Promise<void> {
    await this.prisma.mediaAsset.delete({
      where: { id: id.value },
    });
  }

  async findAll(params: {
    mediaType?: string;
    uploadedByUserId?: string;
    limit?: number;
    offset?: number;
  }): Promise<MediaAsset[]> {
    const where: any = {};

    if (params.mediaType) {
      where.mediaType = params.mediaType;
    }

    if (params.uploadedByUserId) {
      where.uploadedByUserId = params.uploadedByUserId;
    }

    const records = await this.prisma.mediaAsset.findMany({
      where,
      take: params.limit || 50,
      skip: params.offset || 0,
      orderBy: { createdAt: 'desc' },
      include: {
        contentItems: true,
      },
    });

    return records.map((record) => MediaAssetMapper.toDomain(record));
  }

  async isUsedInContent(id: MediaAssetId): Promise<boolean> {
    const count = await this.prisma.contentMedia.count({
      where: {
        mediaAssetId: id.value,
      },
    });

    return count > 0;
  }
}
