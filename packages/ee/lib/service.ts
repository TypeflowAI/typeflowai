import "server-only";

import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { TTeam } from "@typeflowai/types/teams";

export const getIsBasicSubscription = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "basic";
  else if (!IS_TYPEFLOWAI_CLOUD) return true;
  else return false;
};

export const getIsProSubscription = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "pro";
  else if (!IS_TYPEFLOWAI_CLOUD) return false;
  else return false;
};

export const getIsEnterpriseSubscription = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionType === "enterprise";
  else if (!IS_TYPEFLOWAI_CLOUD) return false;
  else return false;
};

export const getSubscriptionType = (team: TTeam): string => {
  if (getIsBasicSubscription(team)) {
    return "basic";
  } else if (getIsProSubscription(team)) {
    return "pro";
  } else if (getIsEnterpriseSubscription(team)) {
    return "enterprise";
  } else {
    return "free";
  }
};

export const getIsEngineLimited = (team: TTeam): boolean => {
  if (!IS_TYPEFLOWAI_CLOUD) {
    return false;
  } else {
    if (!getIsProSubscription(team) || !getIsEnterpriseSubscription(team)) {
      return false;
    } else return true;
  }
};

export const getRemoveInAppBrandingPermission = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionStatus !== "inactive";
  else if (!IS_TYPEFLOWAI_CLOUD) return true;
  else return false;
};

export const getRemoveLinkBrandingPermission = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionStatus !== "inactive";
  else if (!IS_TYPEFLOWAI_CLOUD) return true;
  else return false;
};

export const getRoleManagementPermission = (team: TTeam): boolean => {
  if (IS_TYPEFLOWAI_CLOUD) return team.billing.subscriptionStatus !== "inactive";
  else return false;
};
