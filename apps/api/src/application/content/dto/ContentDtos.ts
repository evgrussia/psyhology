/**
 * DTO для работы с контентом
 */

// ============================================
// Request DTOs
// ============================================

export interface CreateContentItemRequestDto {
  contentType: string;
  title: string;
  slug?: string; // опционально, генерируется из title если не указан
  excerpt?: string | null;
  bodyMarkdown?: string | null;
  timeToBenefit?: string | null;
  format?: string | null;
  supportLevel?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  topicCodes?: string[]; // коды тем (anxiety, burnout, etc.)
  tagIds?: string[]; // ID тегов
}

export interface UpdateContentItemRequestDto {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  bodyMarkdown?: string | null;
  timeToBenefit?: string | null;
  format?: string | null;
  supportLevel?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  topicCodes?: string[]; // коды тем (anxiety, burnout, etc.)
  tagIds?: string[]; // ID тегов
}

export interface ListContentItemsRequestDto {
  contentType?: string;
  status?: string;
  authorUserId?: string;
  topicCodes?: string[]; // фильтр по темам (все из списка должны совпасть? сейчас: any-of)
  tagIds?: string[]; // фильтр по тегам (any-of)
  limit?: number;
  offset?: number;
}

export interface ListPublicContentItemsRequestDto {
  limit?: number;
  offset?: number;
  topicCodes?: string[]; // фильтр по темам (any-of)
  tagIds?: string[]; // фильтр по тегам (any-of)
}

// ============================================
// Response DTOs
// ============================================

export interface ContentItemResponseDto {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMarkdown: string | null;
  status: string;
  publishedAt: string | null;
  authorUserId: string | null;
  timeToBenefit: string | null;
  format: string | null;
  supportLevel: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  topicCodes: string[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicContentItemResponseDto {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyHtml?: string | null; // рендеренный HTML (для публичного API)
  publishedAt: string;
  authorUserId: string | null;
  timeToBenefit: string | null;
  format: string | null;
  supportLevel: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListContentItemsResponseDto {
  items: ContentItemResponseDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface PublicContentListItemResponseDto {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  authorUserId: string | null;
  timeToBenefit: string | null;
  format: string | null;
  supportLevel: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  topicCodes: string[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListPublicContentItemsResponseDto {
  items: PublicContentListItemResponseDto[];
  total: number;
  limit: number;
  offset: number;
}

export interface PublishContentItemRequestDto {
  qaChecklist: {
    hasDisclaimer: boolean;
    hasAltText: boolean;
    hasCta: boolean;
    additionalChecks?: Record<string, boolean>;
  };
}

export interface RenderMarkdownPreviewRequestDto {
  markdown: string;
}

export interface RenderMarkdownPreviewResponseDto {
  html: string;
}
