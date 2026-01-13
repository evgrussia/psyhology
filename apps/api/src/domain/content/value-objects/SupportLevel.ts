/**
 * Value Object: Уровень поддержки
 */
export class SupportLevel {
  private constructor(private readonly value: string) {}

  static readonly SelfHelp = new SupportLevel('self_help');
  static readonly MicroSupport = new SupportLevel('micro_support');
  static readonly Consultation = new SupportLevel('consultation');

  static fromString(value: string): SupportLevel | null {
    if (!value) {
      return null;
    }

    switch (value) {
      case 'self_help':
        return SupportLevel.SelfHelp;
      case 'micro_support':
        return SupportLevel.MicroSupport;
      case 'consultation':
        return SupportLevel.Consultation;
      default:
        throw new Error(`Invalid support level: ${value}`);
    }
  }

  equals(other: SupportLevel | null): boolean {
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
