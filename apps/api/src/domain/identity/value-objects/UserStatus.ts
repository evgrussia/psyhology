/**
 * UserStatus Value Object
 */
export class UserStatus {
  private constructor(readonly value: string) {}

  static readonly Active = new UserStatus('active');
  static readonly Blocked = new UserStatus('blocked');
  static readonly Deleted = new UserStatus('deleted');

  static fromString(value: string): UserStatus {
    switch (value) {
      case 'active':
        return UserStatus.Active;
      case 'blocked':
        return UserStatus.Blocked;
      case 'deleted':
        return UserStatus.Deleted;
      default:
        throw new Error(`Unknown user status: ${value}`);
    }
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isBlocked(): boolean {
    return this.value === 'blocked';
  }

  equals(other: UserStatus): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
