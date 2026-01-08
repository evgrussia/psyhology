/**
 * ConsentType Value Object
 */
export class ConsentType {
  private constructor(readonly value: string) {}

  static readonly PersonalData = new ConsentType('personal_data');
  static readonly Communications = new ConsentType('communications');
  static readonly Telegram = new ConsentType('telegram');
  static readonly ReviewPublication = new ConsentType('review_publication');

  static fromString(value: string): ConsentType {
    switch (value) {
      case 'personal_data':
        return ConsentType.PersonalData;
      case 'communications':
        return ConsentType.Communications;
      case 'telegram':
        return ConsentType.Telegram;
      case 'review_publication':
        return ConsentType.ReviewPublication;
      default:
        throw new Error(`Unknown consent type: ${value}`);
    }
  }

  equals(other: ConsentType): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
