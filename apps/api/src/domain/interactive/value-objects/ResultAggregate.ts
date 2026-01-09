import { ResultLevelVO } from './ResultLevel';
import { CrisisTrigger } from './CrisisTrigger';

/**
 * Value Object для агрегированного результата интерактива
 * Содержит только агрегаты, без сырых ответов/текстов (Privacy by Design)
 */
export class ResultAggregate {
  private constructor(
    private readonly resultLevel: ResultLevelVO | null,
    private readonly resultProfile: string | null, // для навигатора: stabilize_now, restore_energy, etc.
    private readonly durationMs: number | null,
    private readonly crisisTrigger: CrisisTrigger,
  ) {
    // Валидация: если есть resultLevel, он должен быть валидным
    if (resultLevel && !(resultLevel instanceof ResultLevelVO)) {
      throw new Error('resultLevel must be a ResultLevelVO instance');
    }

    // Валидация: durationMs должен быть положительным числом, если указан
    if (durationMs !== null && durationMs < 0) {
      throw new Error('durationMs must be a non-negative number');
    }
  }

  static create(params: {
    resultLevel?: ResultLevelVO | null;
    resultProfile?: string | null;
    durationMs?: number | null;
    crisisTrigger?: CrisisTrigger;
  }): ResultAggregate {
    return new ResultAggregate(
      params.resultLevel ?? null,
      params.resultProfile ?? null,
      params.durationMs ?? null,
      params.crisisTrigger ?? CrisisTrigger.none(),
    );
  }

  getResultLevel(): ResultLevelVO | null {
    return this.resultLevel;
  }

  getResultProfile(): string | null {
    return this.resultProfile;
  }

  getDurationMs(): number | null {
    return this.durationMs;
  }

  getCrisisTrigger(): CrisisTrigger {
    return this.crisisTrigger;
  }

  hasResult(): boolean {
    return this.resultLevel !== null || this.resultProfile !== null;
  }

  equals(other: ResultAggregate): boolean {
    // Сравниваем resultLevel
    const levelEqual =
      (this.resultLevel === null && other.resultLevel === null) ||
      (this.resultLevel !== null &&
        other.resultLevel !== null &&
        this.resultLevel.equals(other.resultLevel));

    return (
      levelEqual &&
      this.resultProfile === other.resultProfile &&
      this.durationMs === other.durationMs &&
      this.crisisTrigger.equals(other.crisisTrigger)
    );
  }
}
