import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";

import { translateWorkflow } from "@typeflowai/lib/i18n/utils";
import { createWorkflow, getWorkflows } from "@typeflowai/lib/workflow/service";
import { DatabaseError } from "@typeflowai/types/errors";
import { ZWorkflowInput } from "@typeflowai/types/workflows";

export async function GET(request: Request) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();

    const searchParams = new URL(request.url).searchParams;
    const limit = searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined;

    const workflows = await getWorkflows(authentication.environmentId!, limit, offset);
    return responses.successResponse(workflows);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();

    let workflowInput;
    try {
      workflowInput = await request.json();
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`);
      return responses.badRequestResponse("Malformed JSON input, please check your request body");
    }

    if (workflowInput?.questions && workflowInput.questions[0].headline) {
      const questionHeadline = workflowInput.questions[0].headline;
      if (typeof questionHeadline === "string") {
        // its a legacy workflow
        workflowInput = translateWorkflow(workflowInput, []);
      }
    }
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
