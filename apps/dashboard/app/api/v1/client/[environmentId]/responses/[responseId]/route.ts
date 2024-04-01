import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { sendToPipeline } from "@/app/lib/pipelines";
import { NextResponse } from "next/server";

import { getPerson } from "@typeflowai/lib/person/service";
import { updateResponse } from "@typeflowai/lib/response/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { DatabaseError, InvalidInputError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { ZResponseUpdateInput } from "@typeflowai/types/responses";

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function PUT(
  request: Request,
  { params }: { params: { responseId: string } }
): Promise<NextResponse> {
  const { responseId } = params;

  if (!responseId) {
    return responses.badRequestResponse("Response ID is missing", undefined, true);
  }

  const responseUpdate = await request.json();

  if (responseUpdate.personId && typeof responseUpdate.personId === "string") {
    const person = await getPerson(responseUpdate.personId);
    responseUpdate.userId = person?.userId;
    delete responseUpdate.personId;
  }

  const inputValidation = ZResponseUpdateInput.safeParse(responseUpdate);

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  // update response
  let response;
  try {
    response = await updateResponse(responseId, inputValidation.data);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return responses.notFoundResponse("Response", responseId, true);
    }
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    }
    if (error instanceof DatabaseError) {
      console.error(error);
      return responses.internalServerErrorResponse(error.message);
    }
  }

  // get workflow to get environmentId
  let workflow;
  try {
    workflow = await getWorkflow(response.workflowId);
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    }
    if (error instanceof DatabaseError) {
      console.error(error);
      return responses.internalServerErrorResponse(error.message);
    }
  }

  // send response update to pipeline
  // don't await to not block the response
  sendToPipeline({
    event: "responseUpdated",
    environmentId: workflow.environmentId,
    workflowId: workflow.id,
    response,
  });

  if (response.finished) {
    // send response to pipeline
    // don't await to not block the response
    sendToPipeline({
      event: "responseFinished",
      environmentId: workflow.environmentId,
      workflowId: workflow.id,
      response: response,
    });
  }
  return responses.successResponse({}, true);
}
