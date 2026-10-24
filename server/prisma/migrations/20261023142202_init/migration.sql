-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OFFICER', 'VIEWER');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('ENGINEERING', 'PHARMACY', 'MBA', 'MCA', 'ARCHITECTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('APPROVED', 'REVOKED', 'PENDING', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'INVESTIGATION', 'AWAITING_RESPONSE', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ComplaintPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('STATUS_CHANGE', 'ASSIGNMENT', 'REASSIGNMENT', 'NOTE_ADDED', 'DOCUMENT_ATTACHED', 'ESCALATION', 'RESPONSE_RECEIVED', 'DEADLINE_EXTENDED', 'CLOSURE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('DUPLICATE', 'RELATED', 'FOLLOW_UP', 'APPEAL');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OverlapAlertStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'DISMISSED', 'LINKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DEADLINE_WARNING', 'OVERLAP_DETECTED', 'ASSIGNMENT', 'ESCALATION', 'STATUS_CHANGE');

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "aicte_permanent_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "type" "InstitutionType" NOT NULL DEFAULT 'OTHER',
    "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OFFICER',
    "bureau_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bureaus" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bureaus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaint_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "tracking_number" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "bureau_id" TEXT NOT NULL,
    "assigned_to_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "received_date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "complainant_name" TEXT,
    "complainant_contact" TEXT,
    "next_action" TEXT,
    "next_action_due_date" TIMESTAMP(3),
    "expected_disposal_date" TIMESTAMP(3),
    "last_action_at" TIMESTAMP(3),
    "disposal_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_actions" (
    "id" TEXT NOT NULL,
    "complaint_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "action_type" "ActionType" NOT NULL,
    "previous_status" "ComplaintStatus",
    "new_status" "ComplaintStatus",
    "remarks" TEXT,
    "next_action" TEXT,
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_relationships" (
    "id" TEXT NOT NULL,
    "source_complaint_id" TEXT NOT NULL,
    "target_complaint_id" TEXT NOT NULL,
    "relationship_type" "RelationshipType" NOT NULL,
    "matching_score" DOUBLE PRECISION,
    "match_reasons" JSONB,
    "review_status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewer_id" TEXT,
    "review_remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overlap_alerts" (
    "id" TEXT NOT NULL,
    "complaint_a_id" TEXT NOT NULL,
    "complaint_b_id" TEXT NOT NULL,
    "institution_id" TEXT,
    "similarity_score" DOUBLE PRECISION NOT NULL,
    "match_reasons" JSONB NOT NULL,
    "status" "OverlapAlertStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" TEXT,
    "review_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "overlap_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_assignment_history" (
    "id" TEXT NOT NULL,
    "complaint_id" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,
    "assigned_by_id" TEXT NOT NULL,
    "reason" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMP(3),

    CONSTRAINT "complaint_assignment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "complaint_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size_bytes" INTEGER,
    "storage_path" TEXT NOT NULL,
    "uploaded_by_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reference_id" TEXT,
    "reference_type" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institutions_aicte_permanent_id_key" ON "institutions"("aicte_permanent_id");

-- CreateIndex
CREATE INDEX "institutions_state_idx" ON "institutions"("state");

-- CreateIndex
CREATE INDEX "institutions_district_idx" ON "institutions"("district");

-- CreateIndex
CREATE INDEX "institutions_region_idx" ON "institutions"("region");

-- CreateIndex
CREATE INDEX "institutions_approval_status_idx" ON "institutions"("approval_status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_bureau_id_idx" ON "users"("bureau_id");

-- CreateIndex
CREATE UNIQUE INDEX "bureaus_code_key" ON "bureaus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_categories_code_key" ON "complaint_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_tracking_number_key" ON "complaints"("tracking_number");

-- CreateIndex
CREATE INDEX "complaints_status_idx" ON "complaints"("status");

-- CreateIndex
CREATE INDEX "complaints_priority_idx" ON "complaints"("priority");

-- CreateIndex
CREATE INDEX "complaints_bureau_id_idx" ON "complaints"("bureau_id");

-- CreateIndex
CREATE INDEX "complaints_assigned_to_id_idx" ON "complaints"("assigned_to_id");

-- CreateIndex
CREATE INDEX "complaints_institution_id_idx" ON "complaints"("institution_id");

-- CreateIndex
CREATE INDEX "complaints_category_id_idx" ON "complaints"("category_id");

-- CreateIndex
CREATE INDEX "complaints_received_date_idx" ON "complaints"("received_date");

-- CreateIndex
CREATE INDEX "complaints_next_action_due_date_idx" ON "complaints"("next_action_due_date");

-- CreateIndex
CREATE INDEX "case_actions_complaint_id_idx" ON "case_actions"("complaint_id");

-- CreateIndex
CREATE INDEX "case_actions_actor_id_idx" ON "case_actions"("actor_id");

-- CreateIndex
CREATE INDEX "case_actions_action_type_idx" ON "case_actions"("action_type");

-- CreateIndex
CREATE INDEX "case_relationships_source_complaint_id_idx" ON "case_relationships"("source_complaint_id");

-- CreateIndex
CREATE INDEX "case_relationships_target_complaint_id_idx" ON "case_relationships"("target_complaint_id");

-- CreateIndex
CREATE INDEX "case_relationships_review_status_idx" ON "case_relationships"("review_status");

-- CreateIndex
CREATE UNIQUE INDEX "case_relationships_source_complaint_id_target_complaint_id_key" ON "case_relationships"("source_complaint_id", "target_complaint_id");

-- CreateIndex
CREATE INDEX "overlap_alerts_status_idx" ON "overlap_alerts"("status");

-- CreateIndex
CREATE INDEX "overlap_alerts_institution_id_idx" ON "overlap_alerts"("institution_id");

-- CreateIndex
CREATE UNIQUE INDEX "overlap_alerts_complaint_a_id_complaint_b_id_key" ON "overlap_alerts"("complaint_a_id", "complaint_b_id");

-- CreateIndex
CREATE INDEX "complaint_assignment_history_complaint_id_idx" ON "complaint_assignment_history"("complaint_id");

-- CreateIndex
CREATE INDEX "complaint_assignment_history_assigned_to_id_idx" ON "complaint_assignment_history"("assigned_to_id");

-- CreateIndex
CREATE INDEX "documents_complaint_id_idx" ON "documents"("complaint_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bureau_id_fkey" FOREIGN KEY ("bureau_id") REFERENCES "bureaus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "complaint_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_bureau_id_fkey" FOREIGN KEY ("bureau_id") REFERENCES "bureaus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_actions" ADD CONSTRAINT "case_actions_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_actions" ADD CONSTRAINT "case_actions_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_relationships" ADD CONSTRAINT "case_relationships_source_complaint_id_fkey" FOREIGN KEY ("source_complaint_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_relationships" ADD CONSTRAINT "case_relationships_target_complaint_id_fkey" FOREIGN KEY ("target_complaint_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_relationships" ADD CONSTRAINT "case_relationships_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlap_alerts" ADD CONSTRAINT "overlap_alerts_complaint_a_id_fkey" FOREIGN KEY ("complaint_a_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlap_alerts" ADD CONSTRAINT "overlap_alerts_complaint_b_id_fkey" FOREIGN KEY ("complaint_b_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlap_alerts" ADD CONSTRAINT "overlap_alerts_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlap_alerts" ADD CONSTRAINT "overlap_alerts_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_assignment_history" ADD CONSTRAINT "complaint_assignment_history_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_assignment_history" ADD CONSTRAINT "complaint_assignment_history_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_assignment_history" ADD CONSTRAINT "complaint_assignment_history_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
