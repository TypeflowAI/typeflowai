"use server";

import { TWorkflowPinValidationResponseError } from "@/app/s/[workflowId]/types";

import { LinkWorkflowEmailData, sendLinkWorkflowToVerifiedEmail } from "@typeflowai/lib/emails/emails";
import { verifyTokenForLinkWorkflow } from "@typeflowai/lib/jwt";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { TWorkflow } from "@typeflowai/types/workflows";

interface TWorkflowPinValidationResponse {
  error?: TWorkflowPinValidationResponseError;
  workflow?: TWorkflow;
}

export async function sendLinkWorkflowEmailAction(data: LinkWorkflowEmailData) {
  if (!data.workflowData) {
    throw new Error("No workflow data provided");
  }
  return await sendLinkWorkflowToVerifiedEmail(data);
}
export async function verifyTokenAction(token: string, workflowId: string): Promise<boolean> {
  return await verifyTokenForLinkWorkflow(token, workflowId);
}

export async function validateWorkflowPinAction(
  workflowId: string,
  pin: string
): Promise<TWorkflowPinValidationResponse> {
  try {
    const workflow = await getWorkflow(workflowId);
    if (!workflow) return { error: TWorkflowPinValidationResponseError.NOT_FOUND };

    const originalPin = workflow.pin?.toString();

    if (!originalPin) return { workflow };

    if (originalPin !== pin) return { error: TWorkflowPinValidationResponseError.INCORRECT_PIN };

    return { workflow };
  } catch (error) {
    return { error: TWorkflowPinValidationResponseError.INTERNAL_SERVER_ERROR };
  }
}
