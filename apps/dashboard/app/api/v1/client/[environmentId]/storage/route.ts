import { responses } from "@/app/lib/api/response";
import { NextRequest } from "next/server";

import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

import uploadPrivateFile from "./lib/uploadPrivateFile";

interface Context {
  params: {
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

// api endpoint for uploading private files
// uploaded files will be private, only the user who has access to the environment can access the file
// uploading private files requires no authentication
// use this to let users upload files to a workflow for example
// this api endpoint will return a signed url for uploading the file to s3 and another url for uploading file to the local storage

export async function POST(req: NextRequest, context: Context): Promise<Response> {
  const environmentId = context.params.environmentId;

  const { fileName, fileType, workflowId } = await req.json();

  if (!workflowId) {
    return responses.badRequestResponse("workflowId ID is required");
  }

  if (!fileName) {
    return responses.badRequestResponse("fileName is required");
  }

  if (!fileType) {
    return responses.badRequestResponse("contentType is required");
  }

  const [workflow, team] = await Promise.all([
    getWorkflow(workflowId),
    getTeamByEnvironmentId(environmentId),
  ]);

  if (!workflow) {
    return responses.notFoundResponse("Workflow", workflowId);
  }

  if (!team) {
    return responses.notFoundResponse("TeamByEnvironmentId", environmentId);
  }

  const plan = ["active", "canceled"].includes(team.billing.subscriptionStatus) ? "pro" : "free";

  return await uploadPrivateFile(fileName, environmentId, fileType, plan);
}
