import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextResponse } from "next/server";

import { createDisplay } from "@typeflowai/lib/display/service";
import { capturePosthogEvent } from "@typeflowai/lib/posthogServer";
import { getTeamDetails } from "@typeflowai/lib/teamDetail/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { TDisplay, ZDisplayCreateInput } from "@typeflowai/types/displays";
import { InvalidInputError } from "@typeflowai/types/errors";

interface Context {
  params: {
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const jsonInput = await request.json();
  const inputValidation = ZDisplayCreateInput.safeParse({
    ...jsonInput,
    environmentId: context.params.environmentId,
  });

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  // find teamId & teamOwnerId from environmentId
  const teamDetails = await getTeamDetails(inputValidation.data.environmentId);
  let response: TDisplay;

  // create display
  try {
    response = await createDisplay(inputValidation.data);
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    } else {
      console.error(error);
      return responses.internalServerErrorResponse(error.message);
    }
  }

  const workflow = await getWorkflow(response.workflowId);

  if (teamDetails?.teamOwnerId) {
    await capturePosthogEvent(teamDetails.teamOwnerId, "DisplayCreated", teamDetails.teamId, {
      workflowId: response.workflowId,
      workflowType: workflow?.type,
    });
  } else {
    console.warn("Posthog capture not possible. No team owner found");
  }

  return responses.successResponse(response, true);
}
