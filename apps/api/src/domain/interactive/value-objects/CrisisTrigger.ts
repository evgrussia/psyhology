/**
 * Тип кризисного триггера
 */
export enum CrisisTriggerType {
  SELF_HARM = 'self_harm',
  SUICIDAL_IDEATION = 'suicidal_ideation',
  VIOLENCE = 'violence',
  MINOR_RISK = 'minor_risk',
  PANIC_LIKE = 'panic_like',
}

// Экспортируем значения для удобства
export const CrisisTriggerTypeValues = Object.values(CrisisTriggerType);

/**
 * Value Object для кризисного триггера
 */
export class CrisisTrigger {
  private constructor(
    private readonly triggered: boolean,
    private readonly triggerType: CrisisTriggerType | null,
  ) {}

  static none(): CrisisTrigger {
    return new CrisisTrigger(false, null);
  }

  static create(triggerType: CrisisTriggerType): CrisisTrigger {
    return new CrisisTrigger(true, triggerType);
  }

  static fromString(triggerType: string | null): CrisisTrigger {
    if (!triggerType) {
      return CrisisTrigger.none();
    }

    const normalized = triggerType.toLowerCase().trim();
    if (!Object.values(CrisisTriggerType).includes(normalized as CrisisTriggerType)) {
      throw new Error(
        `Invalid crisis trigger type: ${triggerType}. Must be one of: ${Object.values(CrisisTriggerType).join(', ')}`,
      );
    }

    return new CrisisTrigger(true, normalized as CrisisTriggerType);
  }

  isTriggered(): boolean {
    return this.triggered;
  }

  getTriggerType(): CrisisTriggerType | null {
    return this.triggerType;
  }

  equals(other: CrisisTrigger): boolean {
    return this.triggered === other.triggered && this.triggerType === other.triggerType;
  }
}
