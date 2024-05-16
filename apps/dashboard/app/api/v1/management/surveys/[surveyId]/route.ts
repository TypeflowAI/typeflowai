import { authenticateRequest, handleErrorResponse } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";

import { deleteWorkflow, getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { TWorkflow, ZWorkflow } from "@typeflowai/types/workflows";

async function fetchAndAuthorizeWorkflow(authentication: any, workflowId: string): Promise<TWorkflow | null> {
  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    return null;
  }
  if (workflow.environmentId !== authentication.environmentId) {
    throw new Error("Unauthorized");
  }
  return workflow;
}

export async function GET(
  request: Request,
  { params }: { params: { workflowId: string } }
): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const workflow = await fetchAndAuthorizeWorkflow(authentication, params.workflowId);
    if (workflow) {
      return responses.successResponse(workflow);
    }
    return responses.notFoundResponse("Workflow", params.workflowId);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { workflowId: string } }
): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const workflow = await fetchAndAuthorizeWorkflow(authentication, params.workflowId);
    if (!workflow) {
      return responses.notFoundResponse("Workflow", params.workflowId);
    }
    const deletedWorkflow = await deleteWorkflow(params.workflowId);
    return responses.successResponse(deletedWorkflow);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { workflowId: string } }
): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const workflow = await fetchAndAuthorizeWorkflow(authentication, params.workflowId);
    if (!workflow) {
      return responses.notFoundResponse("Workflow", params.workflowId);
    }
    const workflowUpdate = await request.json();
    const inputValidation = ZWorkflow.safeParse({
      ...workflow,
      ...workflowUpdate,
    });
    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error)
      );
    }
    return responses.successResponse(
      await updateWorkflow({ ...inputValidation.data, id: params.workflowId })
    );
  } catch (error) {
    return handleErrorResponse(error);
  }
}
