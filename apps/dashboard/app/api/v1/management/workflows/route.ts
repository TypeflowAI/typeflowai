import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextResponse } from "next/server";

import { createWorkflow, getWorkflows } from "@typeflowai/lib/workflow/service";
import { DatabaseError } from "@typeflowai/types/errors";
import { ZWorkflowInput } from "@typeflowai/types/workflows";

export async function GET(request: Request) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const workflows = await getWorkflows(authentication.environmentId!);
    return responses.successResponse(workflows);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const workflowInput = await request.json();
    const inputValidation = ZWorkflowInput.safeParse(workflowInput);

    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error),
        true
      );
    }

    const environmentId = authentication.environmentId;
    const workflowData = { ...inputValidation.data, environmentId: undefined };

    const workflow = await createWorkflow(environmentId, workflowData);
    return responses.successResponse(workflow);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}
