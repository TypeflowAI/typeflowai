import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { sendToPipeline } from "@/app/lib/pipelines";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

import { getPerson } from "@typeflowai/lib/person/service";
import { capturePosthogEvent } from "@typeflowai/lib/posthogServer";
import { createResponse } from "@typeflowai/lib/response/service";
import { getTeamDetails } from "@typeflowai/lib/teamDetail/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { ZId } from "@typeflowai/types/environment";
import { InvalidInputError } from "@typeflowai/types/errors";
import { TResponse, ZResponseInput } from "@typeflowai/types/responses";

interface Context {
  params: {
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const { environmentId } = context.params;
  const environmentIdValidation = ZId.safeParse(environmentId);

  if (!environmentIdValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(environmentIdValidation.error),
      true
    );
  }

  const responseInput = await request.json();

  if (responseInput.personId && typeof responseInput.personId === "string") {
    const person = await getPerson(responseInput.personId);
    responseInput.userId = person?.userId;
    delete responseInput.personId;
  }

  const agent = UAParser(request.headers.get("user-agent"));
  const inputValidation = ZResponseInput.safeParse({ ...responseInput, environmentId });

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  // get and check workflow
  const workflow = await getWorkflow(responseInput.workflowId);
  if (!workflow) {
    return responses.notFoundResponse("Workflow", responseInput.workflowId, true);
  }
  if (workflow.environmentId !== environmentId) {
    return responses.badRequestResponse(
      "Workflow is part of another environment",
      {
        "workflow.environmentId": workflow.environmentId,
        environmentId,
      },
      true
    );
  }

  const teamDetails = await getTeamDetails(workflow.environmentId);

  let response: TResponse;
  try {
    const meta = {
      source: responseInput?.meta?.source,
      url: responseInput?.meta?.url,
      userAgent: {
        browser: agent?.browser.name,
        device: agent?.device.type,
        os: agent?.os.name,
      },
    };

    response = await createResponse({
      ...inputValidation.data,
      meta,
    });
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    } else {
      console.error(error);
      return responses.internalServerErrorResponse(error.message);
    }
  }

  sendToPipeline({
    event: "responseCreated",
    environmentId: workflow.environmentId,
    workflowId: response.workflowId,
    response: response,
  });

  if (responseInput.finished) {
    sendToPipeline({
      event: "responseFinished",
      environmentId: workflow.environmentId,
      workflowId: response.workflowId,
      response: response,
    });
  }

  if (teamDetails?.teamOwnerId) {
    await capturePosthogEvent(teamDetails.teamOwnerId, "response created", teamDetails.teamId, {
      workflowId: response.workflowId,
      workflowType: workflow.type,
    });
  } else {
    console.warn("Posthog capture not possible. No team owner found");
  }

  return responses.successResponse({ id: response.id }, true);
}
