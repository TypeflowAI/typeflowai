import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/app/lib/api/response";
import { NextRequest } from "next/server";

import { getResponsesByEnvironmentId } from "@typeflowai/lib/response/service";
import { DatabaseError } from "@typeflowai/types/errors";

export async function GET(request: NextRequest) {
  const workflowId = request.nextUrl.searchParams.get("workflowId");
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    let environmentResponses = await getResponsesByEnvironmentId(authentication.environmentId!);
    if (workflowId) {
      environmentResponses = environmentResponses.filter((response) => response.workflowId === workflowId);
    }
    return responses.successResponse(environmentResponses);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return responses.badRequestResponse(error.message);
    }
    throw error;
  }
}

// Please use the client API to create a new response
