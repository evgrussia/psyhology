import { describe, it, expect } from 'vitest';
import { QaChecklist } from './QaChecklist';

describe('QaChecklist (Value Object)', () => {
  it('должен быть complete, когда выполнены обязательные пункты', () => {
    const checklist = QaChecklist.create({ hasDisclaimer: true, hasAltText: true, hasCta: true });
    expect(checklist.isComplete()).toBe(true);
    expect(checklist.getMissingRequiredChecks()).toEqual([]);
  });

  it('должен возвращать список недостающих обязательных пунктов', () => {
    const checklist = QaChecklist.create({ hasDisclaimer: false, hasAltText: true, hasCta: false });
    expect(checklist.isComplete()).toBe(false);
    expect(checklist.getMissingRequiredChecks()).toEqual(['disclaimer', 'cta']);
  });
});

