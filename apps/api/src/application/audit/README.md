# Audit Log Module

Модуль аудит-лога для записи критичных действий администраторов.

## Использование

### В Use Cases

Для записи событий в аудит-лог используйте `AuditLogWriter`:

```typescript
import { AuditLogWriter } from '../audit/services/AuditLogWriter';
import { UserId } from '../../../domain/identity/value-objects/Ids';
import { Role } from '../../../domain/identity/value-objects/Role';

export class UpdateServicePriceUseCase {
  constructor(
    private readonly serviceRepository: IServiceRepository,
    private readonly auditLogWriter: AuditLogWriter,
  ) {}

  async execute(params: {
    serviceId: string;
    newPrice: number;
    actorUserId: UserId;
    actorRole: Role;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    // 1. Получаем текущую цену
    const service = await this.serviceRepository.findById(params.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    const oldPrice = service.price;

    // 2. Обновляем цену
    service.updatePrice(params.newPrice);
    await this.serviceRepository.save(service);

    // 3. Записываем в аудит-лог
    await this.auditLogWriter.logPriceChange({
      actorUserId: params.actorUserId,
      actorRole: params.actorRole,
      serviceId: params.serviceId,
      oldPrice,
      newPrice: params.newPrice,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }
}
```

### Доступные методы AuditLogWriter

- `write()` - универсальный метод для записи любого события
- `logPriceChange()` - запись изменения цены услуги
- `logDataExport()` - запись экспорта данных
- `logContentDeletion()` - запись удаления контента

### Критичные действия для логирования

Согласно техспецификации, следующие действия должны логироваться:

1. **Изменение цены услуги** (`admin_price_changed`)
2. **Экспорт данных** (`admin_data_exported`)
3. **Удаление контента** (`admin_content_deleted`)
4. **Публикация контента** (`admin_content_published`)
5. **Блокировка пользователя** (`admin_user_blocked`)
6. **Разблокировка пользователя** (`admin_user_unblocked`)
7. **Назначение роли** (`admin_role_assigned`)
8. **Удаление роли** (`admin_role_removed`)

## API Endpoints

### GET /api/admin/audit-log

Получить список записей аудит-лога с фильтрами и пагинацией.

**Права доступа:**

- `owner` - видит все записи
- `assistant` - видит только свои записи
- `editor` - не имеет доступа

**Query параметры:**

- `actorUserId` - фильтр по ID пользователя
- `action` - фильтр по действию (например, `admin_price_changed`)
- `entityType` - фильтр по типу сущности (например, `service`)
- `entityId` - фильтр по ID сущности
- `actorRole` - фильтр по роли (owner, assistant, editor)
- `fromDate` - начальная дата (ISO string)
- `toDate` - конечная дата (ISO string)
- `page` - номер страницы (по умолчанию 1)
- `pageSize` - размер страницы (по умолчанию 20, максимум 100)

**Пример запроса:**

```
GET /api/admin/audit-log?action=admin_price_changed&page=1&pageSize=20
```

**Пример ответа:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "actorUserId": "uuid",
        "actorRole": "owner",
        "action": "admin_price_changed",
        "entityType": "service",
        "entityId": "uuid",
        "oldValue": { "price": 1000 },
        "newValue": { "price": 1500 },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "occurredAt": "2026-01-08T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

## Санитизация данных

Все данные автоматически санитизируются перед записью:

- P2 данные (email, phone, тексты) удаляются
- Остаются только структурные данные (ID, категории, метаданные)

## Best Practices

1. **Best Effort**: Запись в аудит-лог не должна ломать основную операцию
2. **Для критичных действий** (экспорт): можно пробросить ошибку, если запись не удалась
3. **IP и User-Agent**: передавайте из request в use case
4. **Транзакции**: Для критичных действий запись должна быть в той же транзакции
