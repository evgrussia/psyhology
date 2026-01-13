/**
 * Value Object: Время до получения пользы
 */
export class TimeToBenefit {
  private constructor(private readonly value: string) {}

  static readonly OneToThreeMin = new TimeToBenefit('1_3_min');
  static readonly SevenToTenMin = new TimeToBenefit('7_10_min');
  static readonly TwentyToThirtyMin = new TimeToBenefit('20_30_min');
  static readonly Series = new TimeToBenefit('series');

  static fromString(value: string): TimeToBenefit | null {
    if (!value) {
      return null;
    }

    switch (value) {
      case '1_3_min':
        return TimeToBenefit.OneToThreeMin;
      case '7_10_min':
        return TimeToBenefit.SevenToTenMin;
      case '20_30_min':
        return TimeToBenefit.TwentyToThirtyMin;
      case 'series':
        return TimeToBenefit.Series;
      default:
        throw new Error(`Invalid time to benefit: ${value}`);
    }
  }

  equals(other: TimeToBenefit | null): boolean {
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
