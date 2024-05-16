import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { sendToPipeline } from "@/app/lib/pipelines";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

import { getPerson } from "@typeflowai/lib/person/service";
import { capturePosthogEnvironmentEvent } from "@typeflowai/lib/posthogServer";
import { createResponse } from "@typeflowai/lib/response/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { ZId } from "@typeflowai/types/environment";
import { InvalidInputError } from "@typeflowai/types/errors";
import { TResponse, TResponseInput, ZResponseInput } from "@typeflowai/types/responses";

interface Context {
  params: {
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function POST(request: Request, context: Context): Promise<Response> {
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

  // legacy workaround for typeflowai-js 1.2.0 & 1.2.1
  if (responseInput.personId && typeof responseInput.personId === "string") {
    const person = await getPerson(responseInput.personId);
    responseInput.userId = person?.userId;
    delete responseInput.personId;
  }

  const agent = UAParser(request.headers.get("user-agent"));
  const country =
    headers().get("CF-IPCountry") ||
    headers().get("X-Vercel-IP-Country") ||
    headers().get("CloudFront-Viewer-Country") ||
    undefined;
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

  let response: TResponse;
  try {
    const meta: TResponseInput["meta"] = {
      source: responseInput?.meta?.source,
      url: responseInput?.meta?.url,
      userAgent: {
        browser: agent?.browser.name,
        device: agent?.device.type,
        os: agent?.os.name,
      },
      country: country,
      action: responseInput?.meta?.action,
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

  await capturePosthogEnvironmentEvent(workflow.environmentId, "ResponseCreated", {
    workflowId: response.workflowId,
    workflowType: workflow.type,
  });

  return responses.successResponse({ id: response.id }, true);
}
