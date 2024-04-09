-- CreateEnum
CREATE TYPE "PipelineTriggers" AS ENUM ('responseCreated', 'responseUpdated', 'responseFinished');

-- CreateEnum
CREATE TYPE "WebhookSource" AS ENUM ('user', 'zapier', 'make', 'n8n');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('code', 'noCode', 'automatic');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('draft', 'inProgress', 'paused', 'completed');

-- CreateEnum
CREATE TYPE "DisplayStatus" AS ENUM ('seen', 'responded');

-- CreateEnum
CREATE TYPE "WorkflowAttributeFilterCondition" AS ENUM ('equals', 'notEquals');

-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('email', 'link', 'mobile', 'web');

-- CreateEnum
CREATE TYPE "displayOptions" AS ENUM ('displayOnce', 'displayMultiple', 'respondMultiple');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('code', 'noCode', 'automatic');

-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('production', 'development');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('googleSheets', 'notion', 'airtable');

-- CreateEnum
CREATE TYPE "WidgetPlacement" AS ENUM ('bottomLeft', 'bottomRight', 'topLeft', 'topRight', 'center');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('owner', 'admin', 'editor', 'developer', 'viewer');

-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('email', 'github', 'google', 'azuread');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('marketing_specialist', 'sales_manager', 'startup_founder', 'customer_support_specialist', 'virtual_assistant', 'agency_coordinator', 'human_resources_manager', 'other');

-- CreateEnum
CREATE TYPE "Objective" AS ENUM ('enhance_online_presence', 'boost_engagement_and_conversion', 'optimize_content_and_seo_strategy', 'improve_business_strategy', 'innovate_and_develop', 'improve_customer_and_employee_experience', 'streamline_operations_and_sales', 'other');

-- CreateEnum
CREATE TYPE "Intention" AS ENUM ('workflow_user_segments', 'workflow_at_specific_point_in_user_journey', 'enrich_customer_profiles', 'collect_all_user_feedback_on_one_platform', 'other');

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "source" "WebhookSource" NOT NULL DEFAULT 'user',
    "environmentId" TEXT NOT NULL,
    "triggers" "PipelineTriggers"[],
    "workflowIds" TEXT[],

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attributeClassId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeClass" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "type" "AttributeType" NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "AttributeClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "workflowId" TEXT NOT NULL,
    "personId" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "ttc" JSONB NOT NULL DEFAULT '{}',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "personAttributes" JSONB,
    "singleUseId" TEXT,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseNote" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "responseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResponseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnResponses" (
    "responseId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TagsOnResponses_pkey" PRIMARY KEY ("responseId","tagId")
);

-- CreateTable
CREATE TABLE "Display" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "personId" TEXT,
    "responseId" TEXT,
    "status" "DisplayStatus",

    CONSTRAINT "Display_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTrigger" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "actionClassId" TEXT NOT NULL,

    CONSTRAINT "WorkflowTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowAttributeFilter" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attributeClassId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "condition" "WorkflowAttributeFilterCondition" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WorkflowAttributeFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "redirectUrl" TEXT,
    "type" "WorkflowType" NOT NULL DEFAULT 'web',
    "environmentId" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'draft',
    "welcomeCard" JSONB NOT NULL DEFAULT '{"enabled": false}',
    "questions" JSONB NOT NULL DEFAULT '[]',
    "prompt" JSONB NOT NULL DEFAULT '{"enabled": false}',
    "thankYouCard" JSONB NOT NULL DEFAULT '{"enabled": false}',
    "hiddenFields" JSONB NOT NULL DEFAULT '{"enabled": false}',
    "displayOption" "displayOptions" NOT NULL DEFAULT 'displayOnce',
    "recontactDays" INTEGER,
    "autoClose" INTEGER,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "autoComplete" INTEGER,
    "closeOnDate" TIMESTAMP(3),
    "workflowClosedMessage" JSONB,
    "productOverwrites" JSONB,
    "styling" JSONB,
    "singleUse" JSONB DEFAULT '{"enabled": false, "isEncrypted": true}',
    "verifyEmail" JSONB,
    "pin" TEXT,
    "resultShareKey" TEXT,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionClass" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ActionType" NOT NULL,
    "noCodeConfig" JSONB,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "ActionClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionClassId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "properties" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "environmentId" TEXT NOT NULL,
    "config" JSONB NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "EnvironmentType" NOT NULL,
    "productId" TEXT NOT NULL,
    "widgetSetupCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "brandColor" TEXT NOT NULL DEFAULT '#64748b',
    "highlightBorderColor" TEXT,
    "recontactDays" INTEGER NOT NULL DEFAULT 7,
    "linkWorkflowBranding" BOOLEAN NOT NULL DEFAULT true,
    "inAppWorkflowBranding" BOOLEAN NOT NULL DEFAULT true,
    "placement" "WidgetPlacement" NOT NULL DEFAULT 'bottomRight',
    "clickOutsideClose" BOOLEAN NOT NULL DEFAULT true,
    "darkOverlay" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "billing" JSONB NOT NULL DEFAULT '{"stripeCustomerId": null, "subscriptionType": null, "subscriptionStatus": "inactive", "nextRenewalDate": null, "features": {"ai": {"status": "inactive", "responses": null, "unlimited": false, "openaiApiKey": null}}}',

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "role" "MembershipRole" NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "teamId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "acceptorId" TEXT,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'admin',

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "label" TEXT,
    "hashedKey" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" INTEGER,
    "ext_expires_in" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "imageUrl" TEXT,
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "backupCodes" TEXT,
    "password" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "identityProvider" "IdentityProvider" NOT NULL DEFAULT 'email',
    "identityProviderAccountId" TEXT,
    "groupId" TEXT,
    "role" "Role",
    "objective" "Objective",
    "notificationSettings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortUrl" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Webhook_environmentId_idx" ON "Webhook"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_attributeClassId_personId_key" ON "Attribute"("attributeClassId", "personId");

-- CreateIndex
CREATE INDEX "AttributeClass_environmentId_idx" ON "AttributeClass"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeClass_name_environmentId_key" ON "AttributeClass"("name", "environmentId");

-- CreateIndex
CREATE INDEX "Person_environmentId_idx" ON "Person"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Person_environmentId_userId_key" ON "Person"("environmentId", "userId");

-- CreateIndex
CREATE INDEX "Response_workflowId_created_at_idx" ON "Response"("workflowId", "created_at");

-- CreateIndex
CREATE INDEX "Response_workflowId_idx" ON "Response"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_workflowId_singleUseId_key" ON "Response"("workflowId", "singleUseId");

-- CreateIndex
CREATE INDEX "ResponseNote_responseId_idx" ON "ResponseNote"("responseId");

-- CreateIndex
CREATE INDEX "Tag_environmentId_idx" ON "Tag"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_environmentId_name_key" ON "Tag"("environmentId", "name");

-- CreateIndex
CREATE INDEX "TagsOnResponses_responseId_idx" ON "TagsOnResponses"("responseId");

-- CreateIndex
CREATE UNIQUE INDEX "Display_responseId_key" ON "Display"("responseId");

-- CreateIndex
CREATE INDEX "Display_workflowId_idx" ON "Display"("workflowId");

-- CreateIndex
CREATE INDEX "Display_personId_idx" ON "Display"("personId");

-- CreateIndex
CREATE INDEX "WorkflowTrigger_workflowId_idx" ON "WorkflowTrigger"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTrigger_workflowId_actionClassId_key" ON "WorkflowTrigger"("workflowId", "actionClassId");

-- CreateIndex
CREATE INDEX "WorkflowAttributeFilter_workflowId_idx" ON "WorkflowAttributeFilter"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowAttributeFilter_attributeClassId_idx" ON "WorkflowAttributeFilter"("attributeClassId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowAttributeFilter_workflowId_attributeClassId_key" ON "WorkflowAttributeFilter"("workflowId", "attributeClassId");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_resultShareKey_key" ON "Workflow"("resultShareKey");

-- CreateIndex
CREATE INDEX "Workflow_environmentId_idx" ON "Workflow"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionClass_name_environmentId_key" ON "ActionClass"("name", "environmentId");

-- CreateIndex
CREATE INDEX "Action_personId_idx" ON "Action"("personId");

-- CreateIndex
CREATE INDEX "Action_actionClassId_idx" ON "Action"("actionClassId");

-- CreateIndex
CREATE INDEX "Integration_environmentId_idx" ON "Integration"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_type_environmentId_key" ON "Integration"("type", "environmentId");

-- CreateIndex
CREATE INDEX "Environment_productId_idx" ON "Environment"("productId");

-- CreateIndex
CREATE INDEX "Product_teamId_idx" ON "Product"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_teamId_name_key" ON "Product"("teamId", "name");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_teamId_idx" ON "Membership"("teamId");

-- CreateIndex
CREATE INDEX "Invite_email_teamId_idx" ON "Invite"("email", "teamId");

-- CreateIndex
CREATE INDEX "Invite_teamId_idx" ON "Invite"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_id_key" ON "ApiKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON "ApiKey"("hashedKey");

-- CreateIndex
CREATE INDEX "ApiKey_environmentId_idx" ON "ApiKey"("environmentId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_url_key" ON "ShortUrl"("url");

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_attributeClassId_fkey" FOREIGN KEY ("attributeClassId") REFERENCES "AttributeClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeClass" ADD CONSTRAINT "AttributeClass_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseNote" ADD CONSTRAINT "ResponseNote_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseNote" ADD CONSTRAINT "ResponseNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnResponses" ADD CONSTRAINT "TagsOnResponses_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnResponses" ADD CONSTRAINT "TagsOnResponses_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Display" ADD CONSTRAINT "Display_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Display" ADD CONSTRAINT "Display_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTrigger" ADD CONSTRAINT "WorkflowTrigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTrigger" ADD CONSTRAINT "WorkflowTrigger_actionClassId_fkey" FOREIGN KEY ("actionClassId") REFERENCES "ActionClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAttributeFilter" ADD CONSTRAINT "WorkflowAttributeFilter_attributeClassId_fkey" FOREIGN KEY ("attributeClassId") REFERENCES "AttributeClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowAttributeFilter" ADD CONSTRAINT "WorkflowAttributeFilter_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionClass" ADD CONSTRAINT "ActionClass_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionClassId_fkey" FOREIGN KEY ("actionClassId") REFERENCES "ActionClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_acceptorId_fkey" FOREIGN KEY ("acceptorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
