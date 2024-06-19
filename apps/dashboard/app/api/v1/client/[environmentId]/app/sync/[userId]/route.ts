import { sendFreeLimitReachedEventToPosthogBiWeekly } from "@/app/api/v1/client/[environmentId]/app/sync/lib/posthog";
import {
  replaceAttributeRecall,
  replaceAttributeRecallInLegacyWorkflows,
} from "@/app/api/v1/client/[environmentId]/app/sync/lib/utils";
import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextRequest, userAgent } from "next/server";

import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import { getAttributes } from "@typeflowai/lib/attribute/service";
import {
  IS_TYPEFLOWAI_CLOUD,
  PRICING_APPWORKFLOWS_FREE_RESPONSES,
  PRICING_USERTARGETING_FREE_MTU,
} from "@typeflowai/lib/constants";
import { getEnvironment, updateEnvironment } from "@typeflowai/lib/environment/service";
import { createPerson, getIsPersonMonthlyActive, getPersonByUserId } from "@typeflowai/lib/person/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { COLOR_DEFAULTS } from "@typeflowai/lib/styling/constants";
import {
  getMonthlyActiveTeamPeopleCount,
  getMonthlyTeamResponseCount,
  getTeamByEnvironmentId,
} from "@typeflowai/lib/team/service";
import { isVersionGreaterThanOrEqualTo } from "@typeflowai/lib/utils/version";
import { getSyncWorkflows, transformToLegacyWorkflow } from "@typeflowai/lib/workflow/service";
import { TEnvironment } from "@typeflowai/types/environment";
import { TJsAppLegacyStateSync, TJsAppStateSync, ZJsPeopleUserIdInput } from "@typeflowai/types/js";
import { TLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      environmentId: string;
      userId: string;
    };
  }
): Promise<Response> {
  try {
    const { device } = userAgent(request);
    const version = request.nextUrl.searchParams.get("version");

    // validate using zod

    const inputValidation = ZJsPeopleUserIdInput.safeParse({
      environmentId: params.environmentId,
      userId: params.userId,
    });

    if (!inputValidation.success) {
      return responses.badRequestResponse(
        "Fields are missing or incorrectly formatted",
        transformErrorToDetails(inputValidation.error),
        true
      );
    }

    const { environmentId, userId } = inputValidation.data;

    let environment: TEnvironment | null;

    // check if environment exists
    environment = await getEnvironment(environmentId);
    if (!environment) {
      throw new Error("Environment does not exist");
    }

    if (!environment.widgetSetupCompleted) {
      await updateEnvironment(environment.id, { widgetSetupCompleted: true });
    }

    // check team subscriptions
    const team = await getTeamByEnvironmentId(environmentId);

    if (!team) {
      throw new Error("Team does not exist");
    }

    // check if MAU limit is reached
    let isMauLimitReached = false;
    let isInAppWorkflowLimitReached = false;
    if (IS_TYPEFLOWAI_CLOUD) {
      // check userTargeting subscription
      const hasUserTargetingSubscription =
        team.billing.subscriptionStatus && ["active", "canceled"].includes(team.billing.subscriptionStatus);
      const currentMau = await getMonthlyActiveTeamPeopleCount(team.id);
      isMauLimitReached = !hasUserTargetingSubscription && currentMau >= PRICING_USERTARGETING_FREE_MTU;
      // check inAppWorkflow subscription
      const hasInAppWorkflowSubscription =
        team.billing.subscriptionStatus && ["active", "canceled"].includes(team.billing.subscriptionStatus);
      const currentResponseCount = await getMonthlyTeamResponseCount(team.id);
      isInAppWorkflowLimitReached =
        !hasInAppWorkflowSubscription && currentResponseCount >= PRICING_APPWORKFLOWS_FREE_RESPONSES;
    }

    let person = await getPersonByUserId(environmentId, userId);
    if (!isMauLimitReached) {
      // MAU limit not reached: create person if not exists
      if (!person) {
        person = await createPerson(environmentId, userId);
      }
    } else {
      // MAU limit reached: check if person has been active this month; only continue if person has been active
      await sendFreeLimitReachedEventToPosthogBiWeekly(environmentId, "userTargeting");
      const errorMessage = `Monthly Active Users limit in the current plan is reached in ${environmentId}`;
      if (!person) {
        // if it's a new person and MAU limit is reached, throw an error
        return responses.tooManyRequestsResponse(
          errorMessage,
          true,
          "public, s-maxage=600, max-age=840, stale-while-revalidate=600, stale-if-error=600"
        );
      } else {
        // check if person has been active this month
        const isPersonMonthlyActive = await getIsPersonMonthlyActive(person.id);
        if (!isPersonMonthlyActive) {
          return responses.tooManyRequestsResponse(
            errorMessage,
            true,
            "public, s-maxage=600, max-age=840, stale-while-revalidate=600, stale-if-error=600"
          );
        }
      }
    }

    if (isInAppWorkflowLimitReached) {
      await sendFreeLimitReachedEventToPosthogBiWeekly(environmentId, "inAppWorkflow");
    }

    const [workflows, actionClasses, product] = await Promise.all([
      getSyncWorkflows(environmentId, person.id, device.type === "mobile" ? "phone" : "desktop", {
        version: version ?? undefined,
      }),
      getActionClasses(environmentId),
      getProductByEnvironmentId(environmentId),
    ]);

    if (!product) {
      throw new Error("Product not found");
    }

    const updatedProduct: TProduct = {
      ...product,
      brandColor: product.styling.brandColor?.light ?? COLOR_DEFAULTS.brandColor,
      ...(product.styling.highlightBorderColor?.light && {
        highlightBorderColor: product.styling.highlightBorderColor.light,
      }),
    };
    const attributes = await getAttributes(person.id);
    const language = attributes["language"];
    const noCodeActionClasses = actionClasses.filter((actionClass) => actionClass.type === "noCode");

    // Scenario 1: Multi language and updated trigger action classes supported.
    // Use the workflows as they are.
    let transformedWorkflows: TLegacyWorkflow[] | TWorkflow[] = workflows;

    // creating state object
    let state: TJsAppStateSync | TJsAppLegacyStateSync = {
      workflows: !isInAppWorkflowLimitReached
        ? transformedWorkflows.map((workflow) => replaceAttributeRecall(workflow, attributes))
        : [],
      actionClasses,
      language,
      product: updatedProduct,
    };

    // Backwards compatibility for versions less than 2.0.0 (no multi-language support and updated trigger action classes).
    if (!isVersionGreaterThanOrEqualTo(version ?? "", "2.0.0")) {
      // Scenario 2: Multi language and updated trigger action classes not supported
      // Convert to legacy workflows with default language
      // convert triggers to array of actionClasses Names
      transformedWorkflows = await Promise.all(
        workflows.map((workflow: TWorkflow | TLegacyWorkflow) => {
          const languageCode = "default";
          return transformToLegacyWorkflow(workflow as TWorkflow, languageCode);
        })
      );

      state = {
        workflows: !isInAppWorkflowLimitReached
          ? transformedWorkflows.map((workflow) =>
              replaceAttributeRecallInLegacyWorkflows(workflow, attributes)
            )
          : [],
        person,
        noCodeActionClasses,
        language,
        product: updatedProduct,
      };
    }

    return responses.successResponse({ ...state }, true);
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse("Unable to handle the request: " + error.message, true);
  }
}
