/**
 * Value Object: QA Checklist для публикации контента
 * Согласно Admin-Panel-Specification: минимум дисклеймер/alt/CTA
 */
export class QaChecklist {
  private constructor(
    private readonly hasDisclaimer: boolean,
    private readonly hasAltText: boolean,
    private readonly hasCta: boolean,
    private readonly additionalChecks: Record<string, boolean> = {},
  ) {}

  /**
   * Создать QA Checklist из объекта
   */
  static create(checks: {
    hasDisclaimer: boolean;
    hasAltText: boolean;
    hasCta: boolean;
    additionalChecks?: Record<string, boolean>;
  }): QaChecklist {
    return new QaChecklist(
      checks.hasDisclaimer,
      checks.hasAltText,
      checks.hasCta,
      checks.additionalChecks || {},
    );
  }

  /**
   * Проверить, что все обязательные пункты выполнены
   */
  isComplete(): boolean {
    return this.hasDisclaimer && this.hasAltText && this.hasCta;
  }

  /**
   * Получить список незавершённых обязательных пунктов
   */
  getMissingRequiredChecks(): string[] {
    const missing: string[] = [];

    if (!this.hasDisclaimer) {
      missing.push('disclaimer');
    }

    if (!this.hasAltText) {
      missing.push('alt_text');
    }

    if (!this.hasCta) {
      missing.push('cta');
    }

    return missing;
  }

  get hasDisclaimerValue(): boolean {
    return this.hasDisclaimer;
  }

  get hasAltTextValue(): boolean {
    return this.hasAltText;
  }

  get hasCtaValue(): boolean {
    return this.hasCta;
  }

  get additionalChecksValue(): Record<string, boolean> {
    return { ...this.additionalChecks };
  }
}
