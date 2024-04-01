import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextRequest, NextResponse } from "next/server";

import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getEnvironment, updateEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TJsStateSync, ZJsPublicSyncInput } from "@typeflowai/types/js";

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function GET(
  _: NextRequest,
  { params }: { params: { environmentId: string } }
): Promise<NextResponse> {
  try {
    // validate using zod
    const environmentIdValidation = ZJsPublicSyncInput.safeParse({
      environmentId: params.environmentId,
    });

    if (!environmentIdValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(environmentIdValidation.error),
        true
      );
    }

    const { environmentId } = environmentIdValidation.data;

    const environment = await getEnvironment(environmentId);

    if (!environment) {
      throw new Error("Environment does not exist");
    }

    // check if MAU limit is reached
    let isInAppWorkflowLimitReached = false;
    if (IS_TYPEFLOWAI_CLOUD) {
      // check team subscriptons
      const team = await getTeamByEnvironmentId(environmentId);

      if (!team) {
        throw new Error("Team does not exist");
      }
    }

    if (!environment?.widgetSetupCompleted) {
      await updateEnvironment(environment.id, { widgetSetupCompleted: true });
    }

    const [workflows, noCodeActionClasses, product] = await Promise.all([
      getWorkflows(environmentId),
      getActionClasses(environmentId),
      getProductByEnvironmentId(environmentId),
    ]);
    if (!product) {
      throw new Error("Product not found");
    }

    const state: TJsStateSync = {
      workflows: !isInAppWorkflowLimitReached
        ? workflows.filter((workflow) => workflow.status === "inProgress" && workflow.type === "web")
        : [],
      noCodeActionClasses: noCodeActionClasses.filter((actionClass) => actionClass.type === "noCode"),
      product,
      person: null,
    };

    return responses.successResponse({ ...state }, true);
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse(`Unable to complete response: ${error.message}`, true);
  }
}
