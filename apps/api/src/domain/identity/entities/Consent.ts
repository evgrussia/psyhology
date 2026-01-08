import { ConsentId } from '../value-objects/Ids';
import { ConsentType } from '../value-objects/ConsentType';
import { DomainError } from '../../shared/errors/DomainError';

/**
 * Consent Entity (внутри User aggregate)
 * Представляет согласие пользователя на обработку данных или коммуникации
 */
export class Consent {
  private constructor(
    readonly id: ConsentId,
    readonly type: ConsentType,
    readonly version: string,
    readonly source: string,
    readonly grantedAt: Date,
    private revokedAt: Date | null,
  ) {}

  static create(type: ConsentType, version: string, source: string): Consent {
    if (!version || version.trim().length === 0) {
      throw new DomainError('Consent version cannot be empty');
    }

    if (!source || source.trim().length === 0) {
      throw new DomainError('Consent source cannot be empty');
    }

    return new Consent(ConsentId.generate(), type, version, source, new Date(), null);
  }

  /**
   * Восстановление из БД
   */
  static reconstitute(data: {
    id: ConsentId;
    type: ConsentType;
    version: string;
    source: string;
    grantedAt: Date;
    revokedAt: Date | null;
  }): Consent {
    return new Consent(
      data.id,
      data.type,
      data.version,
      data.source,
      data.grantedAt,
      data.revokedAt,
    );
  }

  revoke(): void {
    if (this.revokedAt) {
      throw new DomainError('Consent is already revoked');
    }

    this.revokedAt = new Date();
  }

  isActive(): boolean {
    return this.revokedAt === null;
  }

  getRevokedAt(): Date | null {
    return this.revokedAt;
  }
}
