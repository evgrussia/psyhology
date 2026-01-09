-- AlterTable
ALTER TABLE "interactive_runs" ADD COLUMN     "crisis_trigger_type" TEXT,
ADD COLUMN     "crisis_triggered" BOOLEAN NOT NULL DEFAULT false;
