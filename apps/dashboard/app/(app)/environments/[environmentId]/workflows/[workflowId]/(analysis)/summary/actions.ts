"use server";

import { getEmailTemplateHtml } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/lib/emailTemplate";
import { customAlphabet } from "nanoid";
import { getServerSession } from "next-auth";

import { sendEmbedWorkflowPreviewEmail } from "@typeflowai/email";
import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthenticationError, AuthorizationError, ResourceNotFoundError } from "@typeflowai/types/errors";

export const sendEmbedWorkflowPreviewEmailAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  const isUserAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isUserAuthorized) {
    throw new AuthorizationError("Not authorized");
  }
  const rawEmailHtml = await getEmailTemplateHtml(workflowId);
  const emailHtml = rawEmailHtml
    .replaceAll("?preview=true&amp;", "?")
    .replaceAll("?preview=true&;", "?")
    .replaceAll("?preview=true", "");

  return await sendEmbedWorkflowPreviewEmail(
    session.user.email,
    "TypeflowAI Email Workflow Preview",
    emailHtml,
    workflow.environmentId
  );
};

export async function generateResultShareUrlAction(workflowId: string): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);
  if (!workflow?.id) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  const resultShareKey = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    20
  )();

  await updateWorkflow({ ...workflow, resultShareKey });

  return resultShareKey;
}

export async function getResultShareUrlAction(workflowId: string): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);
  if (!workflow?.id) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  return workflow.resultShareKey;
}

export async function deleteResultShareUrlAction(workflowId: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);
  if (!workflow?.id) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  await updateWorkflow({ ...workflow, resultShareKey: null });
}

export const getEmailHtmlAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  return await getEmailTemplateHtml(workflowId);
};
