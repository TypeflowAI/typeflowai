import { authenticateRequest } from "@/app/api/v1/auth";
import { handleErrorResponse } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextResponse } from "next/server";

import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { deleteResponse, getResponse, updateResponse } from "@typeflowai/lib/response/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { TResponse, ZResponseUpdateInput } from "@typeflowai/types/responses";

async function fetchAndValidateResponse(authentication: any, responseId: string): Promise<TResponse> {
  const response = await getResponse(responseId);
  if (!response || !(await canUserAccessResponse(authentication, response))) {
    throw new Error("Unauthorized");
  }
  return response;
}

const canUserAccessResponse = async (authentication: any, response: TResponse): Promise<boolean> => {
  const workflow = await getWorkflow(response.workflowId);
  if (!workflow) return false;

  if (authentication.type === "session") {
    return await hasUserEnvironmentAccess(authentication.session.user.id, workflow.environmentId);
  } else if (authentication.type === "apiKey") {
    return workflow.environmentId === authentication.environmentId;
  } else {
    throw Error("Unknown authentication type");
  }
};

export async function GET(
  request: Request,
  { params }: { params: { responseId: string } }
): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    await fetchAndValidateResponse(authentication, params.responseId);
    const response = await fetchAndValidateResponse(authentication, params.responseId);
    if (response) {
      return responses.successResponse(response);
    }
    return responses.notFoundResponse("Response", params.responseId);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { responseId: string } }
): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const response = await fetchAndValidateResponse(authentication, params.responseId);
    if (!response) {
      return responses.notFoundResponse("Response", params.responseId);
    }
    const deletedResponse = await deleteResponse(params.responseId);
    return responses.successResponse(deletedResponse);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { responseId: string } }
): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    await fetchAndValidateResponse(authentication, params.responseId);
    const responseUpdate = await request.json();
    const inputValidation = ZResponseUpdateInput.safeParse(responseUpdate);
    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error)
      );
    }
    return responses.successResponse(await updateResponse(params.responseId, inputValidation.data));
  } catch (error) {
    return handleErrorResponse(error);
  }
}
