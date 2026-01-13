-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked', 'deleted');

-- CreateEnum
CREATE TYPE "RoleCode" AS ENUM ('owner', 'assistant', 'editor', 'client');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('admin', 'product');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('personal_data', 'communications', 'telegram', 'review_publication');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('article', 'note', 'resource', 'landing', 'page');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'review', 'published', 'archived');

-- CreateEnum
CREATE TYPE "TimeToBenefit" AS ENUM ('_1_3_min', '_7_10_min', '_20_30_min', 'series');

-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('article', 'note', 'resource', 'audio', 'checklist');

-- CreateEnum
CREATE TYPE "SupportLevel" AS ENUM ('self_help', 'micro_support', 'consultation');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('problem', 'format', 'goal', 'context');

-- CreateEnum
CREATE TYPE "GlossaryCategory" AS ENUM ('approach', 'state', 'concept');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('mentioned_in', 'recommended');

-- CreateEnum
CREATE TYPE "InteractiveType" AS ENUM ('quiz', 'navigator', 'thermometer', 'boundaries', 'prep', 'ritual');

-- CreateEnum
CREATE TYPE "ResultLevel" AS ENUM ('low', 'moderate', 'high');

-- CreateEnum
CREATE TYPE "ServiceFormat" AS ENUM ('online', 'offline', 'hybrid');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending_payment', 'paid', 'confirmed', 'canceled', 'rescheduled', 'completed');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('yookassa');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeeded', 'canceled', 'failed');

-- CreateEnum
CREATE TYPE "IntakeFormStatus" AS ENUM ('draft', 'submitted');

-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('new', 'contacted', 'closed');

-- CreateEnum
CREATE TYPE "DiaryType" AS ENUM ('emotions', 'abc', 'sleep_energy', 'gratitude');

-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('user_data', 'diary_pdf');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('requested', 'processing', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "DeepLinkFlow" AS ENUM ('plan_7d', 'save_resource', 'challenge_7d', 'concierge', 'question', 'prep', 'ritual', 'boundaries', 'favorites');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'engaged', 'booking_started', 'booked_confirmed', 'paid', 'completed_session', 'follow_up_needed', 'inactive');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('quiz', 'telegram', 'waitlist', 'question', 'booking');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('pending', 'flagged', 'approved', 'answered', 'rejected');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('draft', 'pending', 'published', 'unpublished');

-- CreateEnum
CREATE TYPE "AnonymityLevel" AS ENUM ('full', 'initials', 'named');

-- CreateEnum
CREATE TYPE "ModerationActionType" AS ENUM ('approve', 'reject', 'flag', 'mask_pii', 'publish', 'unpublish', 'escalate');

-- CreateEnum
CREATE TYPE "ModerationReasonCategory" AS ENUM ('crisis', 'medical', 'out_of_scope', 'therapy_request', 'spam', 'pii', 'other');

-- CreateEnum
CREATE TYPE "UgcType" AS ENUM ('anonymous_question', 'review', 'comment');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('email', 'telegram');

-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('booking', 'waitlist', 'event', 'moderation');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "telegram_user_id" TEXT,
    "telegram_username" TEXT,
    "display_name" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "code" "RoleCode" NOT NULL,
    "scope" "RoleScope" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_code" "RoleCode" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_code")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "consent_type" "ConsentType" NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" TEXT NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body_markdown" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "author_user_id" TEXT,
    "time_to_benefit" "TimeToBenefit",
    "format" "ContentFormat",
    "support_level" "SupportLevel",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "content_item_topics" (
    "content_item_id" TEXT NOT NULL,
    "topic_code" TEXT NOT NULL,

    CONSTRAINT "content_item_topics_pkey" PRIMARY KEY ("content_item_id","topic_code")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_item_tags" (
    "content_item_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "content_item_tags_pkey" PRIMARY KEY ("content_item_id","tag_id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "storage_provider" TEXT NOT NULL DEFAULT 's3',
    "object_key" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "title" TEXT,
    "alt_text" TEXT,
    "uploaded_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_media" (
    "content_item_id" TEXT NOT NULL,
    "media_asset_id" TEXT NOT NULL,
    "usage" TEXT NOT NULL,

    CONSTRAINT "content_media_pkey" PRIMARY KEY ("content_item_id","media_asset_id")
);

-- CreateTable
CREATE TABLE "curated_collections" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "collection_type" "CollectionType" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "topic_code" TEXT,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "curated_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curated_items" (
    "id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "content_item_id" TEXT,
    "interactive_definition_id" TEXT,
    "position" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "curated_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_terms" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "GlossaryCategory" NOT NULL,
    "short_definition" TEXT NOT NULL,
    "body_markdown" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),

    CONSTRAINT "glossary_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_term_synonyms" (
    "id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "synonym" TEXT NOT NULL,

    CONSTRAINT "glossary_term_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary_term_links" (
    "id" TEXT NOT NULL,
    "term_id" TEXT NOT NULL,
    "content_item_id" TEXT NOT NULL,
    "link_type" "LinkType" NOT NULL,

    CONSTRAINT "glossary_term_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactive_definitions" (
    "id" TEXT NOT NULL,
    "interactive_type" "InteractiveType" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic_code" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),

    CONSTRAINT "interactive_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactive_runs" (
    "id" TEXT NOT NULL,
    "interactive_definition_id" TEXT NOT NULL,
    "user_id" TEXT,
    "anonymous_id" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "result_level" "ResultLevel",
    "result_profile" TEXT,
    "duration_ms" INTEGER,
    "deep_link_id" TEXT,

    CONSTRAINT "interactive_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description_markdown" TEXT,
    "format" "ServiceFormat" NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "price_amount" INTEGER NOT NULL,
    "deposit_amount" INTEGER,
    "cancel_free_hours" INTEGER,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "service_id" TEXT,
    "start_at_utc" TIMESTAMP(3) NOT NULL,
    "end_at_utc" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "external_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "client_user_id" TEXT,
    "lead_id" TEXT,
    "start_at_utc" TIMESTAMP(3) NOT NULL,
    "end_at_utc" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "format" "ServiceFormat" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending_payment',
    "meeting_url" TEXT,
    "location_text" TEXT,
    "slot_id" TEXT,
    "external_calendar_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'yookassa',
    "provider_payment_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "failure_category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intake_forms" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "status" "IntakeFormStatus" NOT NULL DEFAULT 'draft',
    "payload_encrypted" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "intake_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "service_id" TEXT NOT NULL,
    "preferred_contact" TEXT NOT NULL,
    "contact_value_encrypted" TEXT,
    "preferred_time_window" TEXT,
    "status" "WaitlistStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diary_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "diary_type" "DiaryType" NOT NULL,
    "entry_date" DATE NOT NULL,
    "payload_encrypted" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "diary_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_export_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "export_type" "ExportType" NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'requested',
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "data_export_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deep_links" (
    "id" VARCHAR(255) NOT NULL,
    "flow" "DeepLinkFlow" NOT NULL,
    "topic_code" TEXT,
    "entity_ref" TEXT,
    "source_page" TEXT,
    "anonymous_id" TEXT,
    "lead_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "deep_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "source" "LeadSource" NOT NULL,
    "topic_code" TEXT,
    "utm" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_identities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT,
    "anonymous_id" TEXT,
    "email_encrypted" TEXT,
    "phone_encrypted" TEXT,
    "telegram_user_id" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_timeline_events" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "deep_link_id" TEXT,
    "properties" JSONB,

    CONSTRAINT "lead_timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymous_questions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "status" "QuestionStatus" NOT NULL DEFAULT 'pending',
    "trigger_flags" TEXT,
    "question_text_encrypted" TEXT NOT NULL,
    "contact_value_encrypted" TEXT,
    "publish_allowed" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answered_at" TIMESTAMP(3),

    CONSTRAINT "anonymous_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_answers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answered_by_user_id" TEXT NOT NULL,
    "answer_text_encrypted" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'draft',
    "review_text_encrypted" TEXT NOT NULL,
    "anonymity_level" "AnonymityLevel" NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_publication_consents" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "user_id" TEXT,
    "granted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "review_publication_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ugc_moderation_actions" (
    "id" TEXT NOT NULL,
    "ugc_type" "UgcType" NOT NULL,
    "ugc_id" TEXT NOT NULL,
    "moderator_user_id" TEXT NOT NULL,
    "action" "ModerationActionType" NOT NULL,
    "reason_category" "ModerationReasonCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ugc_moderation_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_entries" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT NOT NULL,
    "actor_role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "category" "MessageCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_template_versions" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "subject" TEXT,
    "body_markdown" TEXT NOT NULL,
    "updated_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_template_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "category" TEXT,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_content_type_slug_key" ON "content_items"("content_type", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_object_key_key" ON "media_assets"("object_key");

-- CreateIndex
CREATE UNIQUE INDEX "curated_collections_slug_key" ON "curated_collections"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_terms_slug_key" ON "glossary_terms"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "interactive_definitions_interactive_type_slug_key" ON "interactive_definitions"("interactive_type", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "availability_slots_start_at_utc_status_idx" ON "availability_slots"("start_at_utc", "status");

-- CreateIndex
CREATE INDEX "availability_slots_source_idx" ON "availability_slots"("source");

-- CreateIndex
CREATE INDEX "appointments_start_at_utc_idx" ON "appointments"("start_at_utc");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments"("provider_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_provider_payment_id_key" ON "payments"("provider", "provider_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "intake_forms_appointment_id_key" ON "intake_forms"("appointment_id");

-- CreateIndex
CREATE INDEX "deep_links_created_at_idx" ON "deep_links"("created_at");

-- CreateIndex
CREATE INDEX "lead_timeline_events_lead_id_occurred_at_idx" ON "lead_timeline_events"("lead_id", "occurred_at");

-- CreateIndex
CREATE INDEX "anonymous_questions_status_submitted_at_idx" ON "anonymous_questions"("status", "submitted_at");

-- CreateIndex
CREATE INDEX "ugc_moderation_actions_ugc_type_ugc_id_created_at_idx" ON "ugc_moderation_actions"("ugc_type", "ugc_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "roles"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_topics" ADD CONSTRAINT "content_item_topics_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_topics" ADD CONSTRAINT "content_item_topics_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "topics"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_tags" ADD CONSTRAINT "content_item_tags_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_tags" ADD CONSTRAINT "content_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_collections" ADD CONSTRAINT "curated_collections_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "topics"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_items" ADD CONSTRAINT "curated_items_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "curated_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_items" ADD CONSTRAINT "curated_items_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_items" ADD CONSTRAINT "curated_items_interactive_definition_id_fkey" FOREIGN KEY ("interactive_definition_id") REFERENCES "interactive_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary_term_synonyms" ADD CONSTRAINT "glossary_term_synonyms_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "glossary_terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary_term_links" ADD CONSTRAINT "glossary_term_links_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "glossary_terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary_term_links" ADD CONSTRAINT "glossary_term_links_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_definitions" ADD CONSTRAINT "interactive_definitions_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "topics"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_runs" ADD CONSTRAINT "interactive_runs_interactive_definition_id_fkey" FOREIGN KEY ("interactive_definition_id") REFERENCES "interactive_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_runs" ADD CONSTRAINT "interactive_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactive_runs" ADD CONSTRAINT "interactive_runs_deep_link_id_fkey" FOREIGN KEY ("deep_link_id") REFERENCES "deep_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "availability_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intake_forms" ADD CONSTRAINT "intake_forms_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_requests" ADD CONSTRAINT "waitlist_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_requests" ADD CONSTRAINT "waitlist_requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary_entries" ADD CONSTRAINT "diary_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_export_requests" ADD CONSTRAINT "data_export_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deep_links" ADD CONSTRAINT "deep_links_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "topics"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deep_links" ADD CONSTRAINT "deep_links_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "topics"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_identities" ADD CONSTRAINT "lead_identities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_identities" ADD CONSTRAINT "lead_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_timeline_events" ADD CONSTRAINT "lead_timeline_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_timeline_events" ADD CONSTRAINT "lead_timeline_events_deep_link_id_fkey" FOREIGN KEY ("deep_link_id") REFERENCES "deep_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anonymous_questions" ADD CONSTRAINT "anonymous_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "anonymous_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_answered_by_user_id_fkey" FOREIGN KEY ("answered_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_publication_consents" ADD CONSTRAINT "review_publication_consents_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ugc_moderation_actions" ADD CONSTRAINT "ugc_moderation_actions_moderator_user_id_fkey" FOREIGN KEY ("moderator_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_entries" ADD CONSTRAINT "audit_log_entries_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_versions" ADD CONSTRAINT "message_template_versions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "message_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_template_versions" ADD CONSTRAINT "message_template_versions_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
