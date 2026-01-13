/**
 * DTOs для работы с медиа-активами
 */

export interface CreateMediaAssetRequestDto {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  title?: string | null;
  altText?: string | null;
}

export interface CreateMediaAssetResponseDto {
  mediaAssetId: string;
  uploadUrl: string;
  expiresAt: Date;
}

export interface FinalizeMediaUploadRequestDto {
  mediaAssetId: string;
  checksum?: string;
}

export interface FinalizeMediaUploadResponseDto {
  mediaAssetId: string;
  publicUrl: string;
}

export interface DeleteMediaAssetRequestDto {
  mediaAssetId: string;
  force?: boolean;
}

export interface ListMediaAssetsRequestDto {
  mediaType?: string;
  uploadedByUserId?: string;
  limit?: number;
  offset?: number;
}

export interface MediaAssetDto {
  id: string;
  publicUrl: string;
  mediaType: string;
  mimeType: string;
  sizeBytes: number;
  title: string | null;
  altText: string | null;
  uploadedByUserId: string | null;
  createdAt: Date;
}

export interface ListMediaAssetsResponseDto {
  items: MediaAssetDto[];
  total: number;
  limit: number;
  offset: number;
}
