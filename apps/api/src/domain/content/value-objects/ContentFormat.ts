/**
 * Value Object: Формат контента
 */
export class ContentFormat {
  private constructor(private readonly value: string) {}

  static readonly Article = new ContentFormat('article');
  static readonly Note = new ContentFormat('note');
  static readonly Resource = new ContentFormat('resource');
  static readonly Audio = new ContentFormat('audio');
  static readonly Checklist = new ContentFormat('checklist');

  static fromString(value: string): ContentFormat | null {
    if (!value) {
      return null;
    }

    switch (value) {
      case 'article':
        return ContentFormat.Article;
      case 'note':
        return ContentFormat.Note;
      case 'resource':
        return ContentFormat.Resource;
      case 'audio':
        return ContentFormat.Audio;
      case 'checklist':
        return ContentFormat.Checklist;
      default:
        throw new Error(`Invalid content format: ${value}`);
    }
  }

  equals(other: ContentFormat | null): boolean {
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
}
