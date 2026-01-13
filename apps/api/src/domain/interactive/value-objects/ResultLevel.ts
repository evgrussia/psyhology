/**
 * Уровень результата интерактива
 * Используется для квизов, термометра ресурса и других интерактивов
 */
export enum ResultLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

/**
 * Value Object для уровня результата
 */
export class ResultLevelVO {
  private constructor(private readonly value: ResultLevel) {}

  static create(value: string): ResultLevelVO {
    const normalized = value.toLowerCase().trim();
    if (!Object.values(ResultLevel).includes(normalized as ResultLevel)) {
      throw new Error(`Invalid result level: ${value}. Must be one of: low, moderate, high`);
    }
    return new ResultLevelVO(normalized as ResultLevel);
  }

  static low(): ResultLevelVO {
    return new ResultLevelVO(ResultLevel.LOW);
  }

  static moderate(): ResultLevelVO {
    return new ResultLevelVO(ResultLevel.MODERATE);
  }

  static high(): ResultLevelVO {
    return new ResultLevelVO(ResultLevel.HIGH);
  }

  getValue(): ResultLevel {
    return this.value;
  }

  equals(other: ResultLevelVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
