import { getExampleWorkflowTemplate } from "@/app/(app)/environments/[environmentId]/workflows/templates/templates";
import { sendFreeLimitReachedEventToPosthogBiWeekly } from "@/app/api/v1/client/[environmentId]/app/sync/lib/posthog";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextRequest } from "next/server";

import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import {
  IS_TYPEFLOWAI_CLOUD,
  PRICING_APPWORKFLOWS_FREE_RESPONSES,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { getEnvironment, updateEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { COLOR_DEFAULTS } from "@typeflowai/lib/styling/constants";
import { getMonthlyTeamResponseCount, getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { isVersionGreaterThanOrEqualTo } from "@typeflowai/lib/utils/version";
import { createWorkflow, getWorkflows, transformToLegacyWorkflow } from "@typeflowai/lib/workflow/service";
import { TJsWebsiteStateSync, ZJsWebsiteSyncInput } from "@typeflowai/types/js";
import { TLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { environmentId: string } }
): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const version =
      searchParams.get("version") === "undefined" || searchParams.get("version") === null
        ? undefined
        : searchParams.get("version");
    const syncInputValidation = ZJsWebsiteSyncInput.safeParse({
      environmentId: params.environmentId,
    });

    if (!syncInputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(syncInputValidation.error),
        true
      );
    }

    const { environmentId } = syncInputValidation.data;

    const environment = await getEnvironment(environmentId);
    const team = await getTeamByEnvironmentId(environmentId);
    if (!team) {
      throw new Error("Team does not exist");
    }

    if (!environment) {
      throw new Error("Environment does not exist");
    }

    // check if MAU limit is reached
    let isInAppWorkflowLimitReached = false;
    if (IS_TYPEFLOWAI_CLOUD) {
      // check team subscriptons

      // check inAppWorkflow subscription
      const hasInAppWorkflowSubscription =
        team.billing.subscriptionStatus && ["active", "canceled"].includes(team.billing.subscriptionStatus);
      const currentResponseCount = await getMonthlyTeamResponseCount(team.id);
      isInAppWorkflowLimitReached =
        !hasInAppWorkflowSubscription && currentResponseCount >= PRICING_APPWORKFLOWS_FREE_RESPONSES;
      if (isInAppWorkflowLimitReached) {
        await sendFreeLimitReachedEventToPosthogBiWeekly(environmentId, "inAppWorkflow");
      }
    }

    if (!environment?.widgetSetupCompleted) {
      const firstWorkflow = getExampleWorkflowTemplate(WEBAPP_URL);
      await createWorkflow(environmentId, firstWorkflow);
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

    // Common filter condition for selecting workflows that are in progress, are of type 'website' and have no active segment filtering.
    const filteredWorkflows = workflows.filter(
      (workflow) => workflow.status === "inProgress" && workflow.type === "website"
      // TODO: Find out if this required anymore. Most likely not.
      // && (!workflow.segment || workflow.segment.filters.length === 0)
    );

    // Define 'transformedWorkflows' which can be an array of either TLegacyWorkflow or TWorkflow.
    let transformedWorkflows: TLegacyWorkflow[] | TWorkflow[];

    // Backwards compatibility for versions less than 1.7.0 (no multi-language support).
    if (version && isVersionGreaterThanOrEqualTo(version, "1.7.0")) {
      // Scenario 1: Multi language supported
      // Use the workflows as they are.
      transformedWorkflows = filteredWorkflows;
    } else {
      // Scenario 2: Multi language not supported
      // Convert to legacy workflows with default language.
      transformedWorkflows = await Promise.all(
        filteredWorkflows.map((workflow) => {
          const languageCode = "default";
          return transformToLegacyWorkflow(workflow, languageCode);
        })
      );
    }

    const updatedProduct: TProduct = {
      ...product,
      brandColor: product.styling.brandColor?.light ?? COLOR_DEFAULTS.brandColor,
      ...(product.styling.highlightBorderColor?.light && {
        highlightBorderColor: product.styling.highlightBorderColor.light,
      }),
    };

    // Create the 'state' object with workflows, noCodeActionClasses, product, and person.
    const state: TJsWebsiteStateSync = {
      workflows: isInAppWorkflowLimitReached ? [] : transformedWorkflows,
      noCodeActionClasses: noCodeActionClasses.filter((actionClass) => actionClass.type === "noCode"),
      product: updatedProduct,
    };

    return responses.successResponse(
      { ...state },
      true,
      "public, s-maxage=600, max-age=840, stale-while-revalidate=600, stale-if-error=600"
    );
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse(`Unable to complete response: ${error.message}`, true);
  }
}
