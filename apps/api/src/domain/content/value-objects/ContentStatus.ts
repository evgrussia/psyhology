/**
 * Value Object: Статус контента
 */
export class ContentStatus {
  private constructor(private readonly value: string) {}

  static readonly Draft = new ContentStatus('draft');
  static readonly Review = new ContentStatus('review');
  static readonly Published = new ContentStatus('published');
  static readonly Archived = new ContentStatus('archived');

  static fromString(value: string): ContentStatus {
    const validStatuses = [
      ContentStatus.Draft.value,
      ContentStatus.Review.value,
      ContentStatus.Published.value,
      ContentStatus.Archived.value,
    ];

    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid content status: ${value}. Valid statuses: ${validStatuses.join(', ')}`);
    }

    switch (value) {
      case 'draft':
        return ContentStatus.Draft;
      case 'review':
        return ContentStatus.Review;
      case 'published':
        return ContentStatus.Published;
      case 'archived':
        return ContentStatus.Archived;
      default:
        throw new Error(`Unknown content status: ${value}`);
    }
  }

  equals(other: ContentStatus): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }

  isDraft(): boolean {
    return this.equals(ContentStatus.Draft);
  }

  isPublished(): boolean {
    return this.equals(ContentStatus.Published);
  }

  isArchived(): boolean {
    return this.equals(ContentStatus.Archived);
  }

  canBePublished(): boolean {
    return this.isDraft() || this.equals(ContentStatus.Review);
  }

  canBeArchived(): boolean {
    return this.isPublished() || this.equals(ContentStatus.Review);
  }
}
