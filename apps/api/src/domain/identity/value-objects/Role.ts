/**
 * Role Value Object
 * Определяет роль пользователя и область её применения
 */
export class Role {
  private constructor(
    readonly code: string,
    readonly scope: string,
  ) {}

  static readonly Owner = new Role('owner', 'admin');
  static readonly Assistant = new Role('assistant', 'admin');
  static readonly Editor = new Role('editor', 'admin');
  static readonly Client = new Role('client', 'product');

  static fromCode(code: string): Role {
    switch (code) {
      case 'owner':
        return Role.Owner;
      case 'assistant':
        return Role.Assistant;
      case 'editor':
        return Role.Editor;
      case 'client':
        return Role.Client;
      default:
        throw new Error(`Unknown role code: ${code}`);
    }
  }

  equals(other: Role): boolean {
    if (!other) {
      return false;
    }
    return this.code === other.code && this.scope === other.scope;
  }

  isAdmin(): boolean {
    return this.scope === 'admin';
  }

  toString(): string {
    return this.code;
  }
}
