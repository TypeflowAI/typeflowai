import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextResponse } from "next/server";

import { getLatestActionByPersonId } from "@typeflowai/lib/action/service";
import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import {
  IS_TYPEFLOWAI_CLOUD,
  PRICING_APPWORKFLOWS_FREE_RESPONSES,
  PRICING_USERTARGETING_FREE_MTU,
} from "@typeflowai/lib/constants";
import { getEnvironment, updateEnvironment } from "@typeflowai/lib/environment/service";
import { createPerson, getPersonByUserId } from "@typeflowai/lib/person/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import {
  getMonthlyActiveTeamPeopleCount,
  getMonthlyTeamResponseCount,
  getTeamByEnvironmentId,
} from "@typeflowai/lib/team/service";
import { getSyncWorkflows } from "@typeflowai/lib/workflow/service";
import { TEnvironment } from "@typeflowai/types/environment";
import { TJsStateSync, ZJsPeopleUserIdInput } from "@typeflowai/types/js";

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function GET(
  _: Request,
  {
    params,
  }: {
    params: {
      environmentId: string;
      userId: string;
    };
  }
): Promise<NextResponse> {
  try {
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
    if (!environment?.widgetSetupCompleted) {
      await updateEnvironment(environment.id, { widgetSetupCompleted: true });
    }

    // check if MAU limit is reached
    let isMauLimitReached = false;
    let isInAppWorkflowLimitReached = false;
    if (IS_TYPEFLOWAI_CLOUD) {
      // check team subscriptons
      const team = await getTeamByEnvironmentId(environmentId);

      if (!team) {
        throw new Error("Team does not exist");
      }

      const hasSubscription = ["active", "canceled"].includes(team.billing.subscriptionStatus);
      // check userTargeting subscription
      const currentMau = await getMonthlyActiveTeamPeopleCount(team.id);
      isMauLimitReached = !hasSubscription && currentMau >= PRICING_USERTARGETING_FREE_MTU;
      // check inAppSurvey subscription
      const currentResponseCount = await getMonthlyTeamResponseCount(team.id);
      isInAppWorkflowLimitReached =
        !hasSubscription && currentResponseCount >= PRICING_APPWORKFLOWS_FREE_RESPONSES;
    }

    let person = await getPersonByUserId(environmentId, userId);
    if (!isMauLimitReached) {
      if (!person) {
        person = await createPerson(environmentId, userId);
      }
    } else {
      const errorMessage = `Monthly Active Users limit in the current plan is reached in ${environmentId}`;
      if (!person) {
        // if it's a new person and MAU limit is reached, throw an error
        throw new Error(errorMessage);
      } else {
        // check if person has been active this month
        const latestAction = await getLatestActionByPersonId(person.id);
        if (!latestAction || new Date(latestAction.createdAt).getMonth() !== new Date().getMonth()) {
          throw new Error(errorMessage);
        }
      }
    }

    const [workflows, noCodeActionClasses, product] = await Promise.all([
      getSyncWorkflows(environmentId, person),
      getActionClasses(environmentId),
      getProductByEnvironmentId(environmentId),
    ]);

    if (!product) {
      throw new Error("Product not found");
    }

    // return state
    const state: TJsStateSync = {
      person: { id: person.id, userId: person.userId },
      workflows: !isInAppWorkflowLimitReached ? workflows : [],
      noCodeActionClasses: noCodeActionClasses.filter((actionClass) => actionClass.type === "noCode"),
      product,
    };

    return responses.successResponse({ ...state }, true);
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse("Unable to handle the request: " + error.message, true);
  }
}
