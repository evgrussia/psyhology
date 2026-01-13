/**
 * Статус выполнения интерактива
 */
export enum RunStatus {
  STARTED = 'started',
  COMPLETED = 'completed',
}

/**
 * Value Object для статуса выполнения
 */
export class RunStatusVO {
  private constructor(private readonly value: RunStatus) {}

  static create(value: string): RunStatusVO {
    const normalized = value.toLowerCase().trim();
    if (!Object.values(RunStatus).includes(normalized as RunStatus)) {
      throw new Error(`Invalid run status: ${value}. Must be one of: started, completed`);
    }
    return new RunStatusVO(normalized as RunStatus);
  }

  static started(): RunStatusVO {
    return new RunStatusVO(RunStatus.STARTED);
  }

  static completed(): RunStatusVO {
    return new RunStatusVO(RunStatus.COMPLETED);
  }

  getValue(): RunStatus {
    return this.value;
  }

  isStarted(): boolean {
    return this.value === RunStatus.STARTED;
  }

  isCompleted(): boolean {
    return this.value === RunStatus.COMPLETED;
  }

  equals(other: RunStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
