import { WriteAuditLogUseCase } from '../use-cases/WriteAuditLogUseCase';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { Role } from '../../../domain/identity/value-objects/Role';

/**
 * Сервис для удобной записи в аудит-лог
 * Обёртка над WriteAuditLogUseCase с упрощённым API
 */
export class AuditLogWriter {
  constructor(private readonly writeAuditLogUseCase: WriteAuditLogUseCase) {}

  /**
   * Записать событие в аудит-лог
   *
   * @param params Параметры записи
   */
  async write(params: {
    actorUserId: UserId;
    actorRole: Role;
    action: string;
    entityType: string;
    entityId?: string | null;
    oldValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    // Преобразуем Role в строку для ActorRole
    const actorRoleString = params.actorRole.code;

    await this.writeAuditLogUseCase.execute({
      actorUserId: params.actorUserId.value,
      actorRole: actorRoleString,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      oldValue: params.oldValue ?? null,
      newValue: params.newValue ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    });
  }

  /**
   * Записать событие изменения цены услуги
   */
  async logPriceChange(params: {
    actorUserId: UserId;
    actorRole: Role;
    serviceId: string;
    oldPrice: number | null;
    newPrice: number;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.write({
      actorUserId: params.actorUserId,
      actorRole: params.actorRole,
      action: 'admin_price_changed',
      entityType: 'service',
      entityId: params.serviceId,
      oldValue: params.oldPrice !== null ? { price: params.oldPrice } : null,
      newValue: { price: params.newPrice },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Записать событие экспорта данных
   */
  async logDataExport(params: {
    actorUserId: UserId;
    actorRole: Role;
    exportType: string;
    entityType?: string;
    entityId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.write({
      actorUserId: params.actorUserId,
      actorRole: params.actorRole,
      action: 'admin_data_exported',
      entityType: params.entityType || 'lead',
      entityId: params.entityId,
      oldValue: null,
      newValue: { exportType: params.exportType },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Записать событие удаления контента
   */
  async logContentDeletion(params: {
    actorUserId: UserId;
    actorRole: Role;
    entityType: string;
    entityId: string;
    deletedContent: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.write({
      actorUserId: params.actorUserId,
      actorRole: params.actorRole,
      action: 'admin_content_deleted',
      entityType: params.entityType,
      entityId: params.entityId,
      oldValue: params.deletedContent,
      newValue: null,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }
}
