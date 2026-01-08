-- Добавление индексов для оптимизации запросов к audit_log_entries

-- Индекс по actor_user_id для фильтрации по пользователю (assistant видит только свои)
CREATE INDEX IF NOT EXISTS "idx_audit_log_actor_user_id" ON "audit_log_entries"("actor_user_id");

-- Индекс по created_at для сортировки по времени (DESC для новых записей первыми)
CREATE INDEX IF NOT EXISTS "idx_audit_log_created_at" ON "audit_log_entries"("created_at" DESC);

-- Индекс по action для фильтрации по типу действия
CREATE INDEX IF NOT EXISTS "idx_audit_log_action" ON "audit_log_entries"("action");

-- Составной индекс по entity_type и entity_id для фильтрации по сущности
CREATE INDEX IF NOT EXISTS "idx_audit_log_entity" ON "audit_log_entries"("entity_type", "entity_id");

-- Составной индекс для частого запроса: пользователь + время
CREATE INDEX IF NOT EXISTS "idx_audit_log_user_time" ON "audit_log_entries"("actor_user_id", "created_at" DESC);
