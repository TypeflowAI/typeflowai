import "server-only";

import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { TTeam } from "@typeflowai/types/teams";

export const getIsBasicSubscription = async (team: TTeam): Promise<boolean> => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "basic";
  else if (!IS_TYPEFLOWAI_CLOUD) return true;
  else return false;
};

export const getIsProSubscription = async (team: TTeam): Promise<boolean> => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "pro";
  else if (!IS_TYPEFLOWAI_CLOUD) return false;
  else return false;
};

export const getIsEnterpriseSubscription = async (team: TTeam): Promise<boolean> => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "enterprise";
  else if (!IS_TYPEFLOWAI_CLOUD) return false;
  else return false;
};

export const getIsPaidSubscription = async (team: TTeam): Promise<boolean> => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionStatus !== "inactive";
  else if (!IS_TYPEFLOWAI_CLOUD) return true;
  else return false;
};

export const getSubscriptionType = async (team: TTeam): Promise<string> => {
  if (await getIsBasicSubscription(team)) {
    return "basic";
  } else if (await getIsProSubscription(team)) {
    return "pro";
  } else if (await getIsEnterpriseSubscription(team)) {
    return "enterprise";
  } else {
    return "free";
  }
};

// export const getIsEngineLimited = async (team: TTeam): Promise<boolean> => {
//   if (!IS_TYPEFLOWAI_CLOUD) {
//     return false;
//   } else {
//     if (!(await getIsProSubscription(team)) || !(await getIsEnterpriseSubscription(team))) {
//       return false;
//     } else return true;
//   }
// };

// Workarround for removing all engine limitations
export const getIsEngineLimited = async (team: TTeam): Promise<boolean> => {
  if (!IS_TYPEFLOWAI_CLOUD) {
    return false;
  } else {
    await getSubscriptionType(team);
    return false;
  }
};

export const getIsAIToolsLimited = async (team: TTeam): Promise<boolean> => {
  if (!IS_TYPEFLOWAI_CLOUD) {
    return false;
  } else {
    if ((await getIsProSubscription(team)) || (await getIsEnterpriseSubscription(team))) {
      return false;
    } else return true;
  }
};
