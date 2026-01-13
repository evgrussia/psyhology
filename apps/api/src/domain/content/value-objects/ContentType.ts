/**
 * Value Object: Тип контента
 */
export class ContentType {
  private constructor(private readonly value: string) {}

  static readonly Article = new ContentType('article');
  static readonly Note = new ContentType('note');
  static readonly Resource = new ContentType('resource');
  static readonly Landing = new ContentType('landing');
  static readonly Page = new ContentType('page');

  static fromString(value: string): ContentType {
    const validTypes = [
      ContentType.Article.value,
      ContentType.Note.value,
      ContentType.Resource.value,
      ContentType.Landing.value,
      ContentType.Page.value,
    ];

    if (!validTypes.includes(value)) {
      throw new Error(`Invalid content type: ${value}. Valid types: ${validTypes.join(', ')}`);
    }

    switch (value) {
      case 'article':
        return ContentType.Article;
      case 'note':
        return ContentType.Note;
      case 'resource':
        return ContentType.Resource;
      case 'landing':
        return ContentType.Landing;
      case 'page':
        return ContentType.Page;
      default:
        throw new Error(`Unknown content type: ${value}`);
    }
  }

  equals(other: ContentType): boolean {
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
