/*
  Warnings:

  - The values [email,mobile] on the enum `WorkflowType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[personId,attributeClassId]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "IdentityProvider" ADD VALUE 'openid';

-- AlterEnum
ALTER TYPE "IntegrationType" ADD VALUE 'slack';

-- AlterEnum
ALTER TYPE "WorkflowStatus" ADD VALUE 'scheduled';

-- AlterEnum
BEGIN;
CREATE TYPE "WorkflowType_new" AS ENUM ('link', 'web', 'website', 'app');
ALTER TABLE "Workflow" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Workflow" ALTER COLUMN "type" TYPE "WorkflowType_new" USING ("type"::text::"WorkflowType_new");
ALTER TYPE "WorkflowType" RENAME TO "WorkflowType_old";
ALTER TYPE "WorkflowType_new" RENAME TO "WorkflowType";
DROP TYPE "WorkflowType_old";
ALTER TABLE "Workflow" ALTER COLUMN "type" SET DEFAULT 'web';
COMMIT;

-- DropIndex
DROP INDEX "Action_actionClassId_idx";

-- DropIndex
DROP INDEX "Action_personId_idx";

-- DropIndex
DROP INDEX "Attribute_attributeClassId_personId_key";

-- DropIndex
DROP INDEX "AttributeClass_environmentId_idx";

-- DropIndex
DROP INDEX "AttributeClass_name_environmentId_key";

-- DropIndex
DROP INDEX "Display_personId_idx";

-- DropIndex
DROP INDEX "Workflow_environmentId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "logo" JSONB,
ADD COLUMN     "styling" JSONB NOT NULL DEFAULT '{"allowStyleOverwrite":true}',
ALTER COLUMN "brandColor" DROP NOT NULL,
ALTER COLUMN "brandColor" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "language" TEXT;

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "displayPercentage" INTEGER,
ADD COLUMN     "inlineTriggers" JSONB,
ADD COLUMN     "runOnDate" TIMESTAMP(3),
ADD COLUMN     "segmentId" TEXT;

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "filters" JSONB NOT NULL DEFAULT '[]',
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "alias" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowLanguage" (
    "languageId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkflowLanguage_pkey" PRIMARY KEY ("languageId","workflowId")
);

-- CreateIndex
CREATE INDEX "Segment_environmentId_idx" ON "Segment"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_environmentId_title_key" ON "Segment"("environmentId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Language_productId_code_key" ON "Language"("productId", "code");

-- CreateIndex
CREATE INDEX "WorkflowLanguage_workflowId_idx" ON "WorkflowLanguage"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowLanguage_languageId_idx" ON "WorkflowLanguage"("languageId");

-- CreateIndex
CREATE INDEX "Action_personId_actionClassId_created_at_idx" ON "Action"("personId", "actionClassId", "created_at");

-- CreateIndex
CREATE INDEX "Action_actionClassId_created_at_idx" ON "Action"("actionClassId", "created_at");

-- CreateIndex
CREATE INDEX "Action_personId_created_at_idx" ON "Action"("personId", "created_at");

-- CreateIndex
CREATE INDEX "ActionClass_environmentId_created_at_idx" ON "ActionClass"("environmentId", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_personId_attributeClassId_key" ON "Attribute"("personId", "attributeClassId");

-- CreateIndex
CREATE INDEX "AttributeClass_environmentId_created_at_idx" ON "AttributeClass"("environmentId", "created_at");

-- CreateIndex
CREATE INDEX "AttributeClass_environmentId_archived_idx" ON "AttributeClass"("environmentId", "archived");

-- CreateIndex
CREATE INDEX "Display_personId_created_at_idx" ON "Display"("personId", "created_at");

-- CreateIndex
CREATE INDEX "Workflow_environmentId_updated_at_idx" ON "Workflow"("environmentId", "updated_at");

-- CreateIndex
CREATE INDEX "Workflow_segmentId_idx" ON "Workflow"("segmentId");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLanguage" ADD CONSTRAINT "WorkflowLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowLanguage" ADD CONSTRAINT "WorkflowLanguage_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
