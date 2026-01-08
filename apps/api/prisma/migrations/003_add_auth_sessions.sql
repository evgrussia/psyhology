-- Migration: Add sessions table and password hash field
-- Generated: 2026-01-08

-- 1. Добавляем поле password_hash в таблицу users (для админов)
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;

-- 2. Создаём таблицу сессий
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  
  CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Индексы для производительности
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- 4. Создаём первого owner пользователя (для тестирования)
-- Пароль будет установлен через seed скрипт
INSERT INTO users (id, email, status, created_at, updated_at)
VALUES (
  'owner-001',
  'owner@example.com',
  'active',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 5. Назначаем роль owner
INSERT INTO user_roles (user_id, role_code, granted_at)
VALUES ('owner-001', 'owner', NOW())
ON CONFLICT DO NOTHING;

-- 6. Предоставляем consent на обработку персональных данных
INSERT INTO consents (id, user_id, consent_type, granted, version, source, granted_at)
VALUES (
  gen_random_uuid(),
  'owner-001',
  'personal_data',
  true,
  '2026-01-08',
  'system',
  NOW()
) ON CONFLICT DO NOTHING;
