-- AlterTable: Добавление полей для кризисных триггеров в interactive_runs
-- FEAT-INT-01: базовая платформа интерактивов без логина

ALTER TABLE "public"."interactive_runs" 
ADD COLUMN IF NOT EXISTS "crisis_triggered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "crisis_trigger_type" TEXT;
