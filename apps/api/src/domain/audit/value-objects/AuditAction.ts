/**
 * AuditAction Value Object
 * Определяет тип действия, которое было залогировано
 */
export class AuditAction {
  private constructor(readonly value: string) {}

  // Критичные действия из техспеки
  static readonly AdminPriceChanged = new AuditAction('admin_price_changed');
  static readonly AdminDataExported = new AuditAction('admin_data_exported');
  static readonly AdminContentDeleted = new AuditAction('admin_content_deleted');
  static readonly AdminContentPublished = new AuditAction('admin_content_published');
  static readonly AdminUserBlocked = new AuditAction('admin_user_blocked');
  static readonly AdminUserUnblocked = new AuditAction('admin_user_unblocked');
  static readonly AdminRoleAssigned = new AuditAction('admin_role_assigned');
  static readonly AdminRoleRemoved = new AuditAction('admin_role_removed');

  static create(value: string): AuditAction {
    if (!value || value.trim().length === 0) {
      throw new Error('AuditAction cannot be empty');
    }

    // Валидация формата: должен быть в формате "admin_*" или другой валидный формат
    if (!/^[a-z][a-z0-9_]*$/.test(value)) {
      throw new Error(`Invalid audit action format: ${value}`);
    }

    return new AuditAction(value);
  }

  static fromString(value: string): AuditAction {
    return AuditAction.create(value);
  }

  equals(other: AuditAction): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
