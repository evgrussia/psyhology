-- CreateTable
CREATE TABLE "content_revisions" (
    "id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "body_markdown" TEXT,
    "meta" JSONB,
    "changed_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_revisions_content_item_id_created_at_idx" ON "content_revisions"("content_item_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
