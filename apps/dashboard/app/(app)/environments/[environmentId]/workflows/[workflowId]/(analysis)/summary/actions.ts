"use server";

import { getEmailTemplateHtml } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/lib/emailTemplate";
import { generateWorkflowSingleUseId } from "@/app/lib/singleUseWorkflows";
import { customAlphabet } from "nanoid";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { sendEmbedWorkflowPreviewEmail } from "@typeflowai/lib/emails/emails";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthenticationError, AuthorizationError, ResourceNotFoundError } from "@typeflowai/types/errors";

type TSendEmailActionArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function generateSingleUseIdAction(workflowId: string, isEncrypted: boolean): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);

  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  return generateWorkflowSingleUseId(isEncrypted);
}

export const sendEmailAction = async ({ html, subject, to }: TSendEmailActionArgs) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }
  return await sendEmbedWorkflowPreviewEmail(to, subject, html);
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
