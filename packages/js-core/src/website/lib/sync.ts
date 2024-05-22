import { diffInDays } from "@typeflowai/lib/utils/datetime";
import { TJsWebsiteState, TJsWebsiteSyncParams } from "@typeflowai/types/js";
import { TWorkflow } from "@typeflowai/types/workflows";

import { NetworkError, Result, err, ok } from "../../shared/errors";
import { Logger } from "../../shared/logger";
import { getIsDebug } from "../../shared/utils";
import { WebsiteConfig } from "./config";

const websiteConfig = WebsiteConfig.getInstance();
const logger = Logger.getInstance();

let syncIntervalId: number | null = null;

const syncWithBackend = async (
  { apiHost, environmentId }: TJsWebsiteSyncParams,
  noCache: boolean
): Promise<Result<TJsWebsiteState, NetworkError>> => {
  try {
    const baseUrl = `${apiHost}/api/v1/client/${environmentId}/website/sync`;
    const urlSuffix = `?version=${import.meta.env.VERSION}`;

    let fetchOptions: RequestInit = {};

    if (noCache || getIsDebug()) {
      fetchOptions.cache = "no-cache";
      logger.debug("No cache option set for sync");
    }

    // if user id is not available
    const url = baseUrl + urlSuffix;
    // public workflow
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const jsonRes = await response.json();

      return err({
        code: "network_error",
        status: response.status,
        message: "Error syncing with backend",
        url,
        responseMessage: jsonRes.message,
      });
    }

    return ok((await response.json()).data as TJsWebsiteState);
  } catch (e) {
    return err(e as NetworkError);
  }
};

export const sync = async (params: TJsWebsiteSyncParams, noCache = false): Promise<void> => {
  try {
    const syncResult = await syncWithBackend(params, noCache);

    if (syncResult?.ok !== true) {
      throw syncResult.error;
    }

    let oldState: TJsWebsiteState | undefined;
    try {
      oldState = websiteConfig.get().state;
    } catch (e) {
      // ignore error
    }

    let state: TJsWebsiteState = {
      workflows: syncResult.value.workflows as TWorkflow[],
      actionClasses: syncResult.value.actionClasses,
      product: syncResult.value.product,
      displays: oldState?.displays || [],
    };

    state = filterPublicWorkflows(state);

    const workflowNames = state.workflows.map((s) => s.name);
    logger.debug("Fetched " + workflowNames.length + " workflows during sync: " + workflowNames.join(", "));

    websiteConfig.update({
      apiHost: params.apiHost,
      environmentId: params.environmentId,
      state,
      expiresAt: new Date(new Date().getTime() + 2 * 60000), // 2 minutes in the future
    });
  } catch (error) {
    console.error(`Error during sync: ${error}`);
    throw error;
  }
};

export const filterPublicWorkflows = (state: TJsWebsiteState): TJsWebsiteState => {
  const { displays, product } = state;

  let { workflows } = state;

  if (!displays) {
    return state;
  }

  // filter workflows that meet the displayOption criteria
  let filteredWorkflows = workflows.filter((workflow) => {
    if (workflow.displayOption === "respondMultiple") {
      return true;
    } else if (workflow.displayOption === "displayOnce") {
      return displays.filter((display) => display.workflowId === workflow.id).length === 0;
    } else if (workflow.displayOption === "displayMultiple") {
      return (
        displays.filter((display) => display.workflowId === workflow.id && display.responded).length === 0
      );
    } else {
      throw Error("Invalid displayOption");
    }
  });

  const latestDisplay = displays.length > 0 ? displays[displays.length - 1] : undefined;

  // filter workflows that meet the recontactDays criteria
  filteredWorkflows = filteredWorkflows.filter((workflow) => {
    if (!latestDisplay) {
      return true;
    } else if (workflow.recontactDays !== null) {
      const lastDisplayWorkflow = displays.filter((display) => display.workflowId === workflow.id)[0];
      if (!lastDisplayWorkflow) {
        return true;
      }
      return diffInDays(new Date(), new Date(lastDisplayWorkflow.createdAt)) >= workflow.recontactDays;
    } else if (product.recontactDays !== null) {
      return diffInDays(new Date(), new Date(latestDisplay.createdAt)) >= product.recontactDays;
    } else {
      return true;
    }
  });

  return {
    ...state,
    workflows: filteredWorkflows,
  };
};

export const addExpiryCheckListener = (): void => {
  const updateInterval = 1000 * 30; // every 30 seconds
  // add event listener to check sync with backend on regular interval
  if (typeof window !== "undefined" && syncIntervalId === null) {
    syncIntervalId = window.setInterval(async () => {
      try {
        // check if the config has not expired yet
        if (websiteConfig.get().expiresAt && new Date(websiteConfig.get().expiresAt) >= new Date()) {
          return;
        }
        logger.debug("Config has expired. Starting sync.");
        await sync({
          apiHost: websiteConfig.get().apiHost,
          environmentId: websiteConfig.get().environmentId,
        });
      } catch (e) {
        console.error(`Error during expiry check: ${e}`);
        logger.debug("Extending config and try again later.");
        const existingConfig = websiteConfig.get();
        websiteConfig.update(existingConfig);
      }
    }, updateInterval);
  }
};

export const removeExpiryCheckListener = (): void => {
  if (typeof window !== "undefined" && syncIntervalId !== null) {
    window.clearInterval(syncIntervalId);

    syncIntervalId = null;
  }
};
