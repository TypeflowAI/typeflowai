import { TJsState, TJsStateSync, TJsSyncParams } from "@typeflowai/types/js";

import { Config } from "./config";
import { NetworkError, Result, err, ok } from "./errors";
import { Logger } from "./logger";

const config = Config.getInstance();
const logger = Logger.getInstance();

let syncIntervalId: number | null = null;

const diffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const syncWithBackend = async ({
  apiHost,
  environmentId,
  userId,
}: TJsSyncParams): Promise<Result<TJsStateSync, NetworkError>> => {
  const url = `${apiHost}/api/v1/client/${environmentId}/in-app/sync/${userId}`;
  const publicUrl = `${apiHost}/api/v1/client/${environmentId}/in-app/sync`;

  // if user id is available

  if (!userId) {
    // public workflow
    const response = await fetch(publicUrl);

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

    return ok((await response.json()).data as TJsState);
  }

  // userId is available, call the api with the `userId` param

  const response = await fetch(url);

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

  const data = await response.json();
  const { data: state } = data;

  return ok(state as TJsStateSync);
};

export const sync = async (params: TJsSyncParams): Promise<void> => {
  try {
    const syncResult = await syncWithBackend(params);
    if (syncResult?.ok !== true) {
      logger.error(`Sync failed: ${JSON.stringify(syncResult.error)}`);
      throw syncResult.error;
    }

    let oldState: TJsState | undefined;
    try {
      oldState = config.get().state;
    } catch (e) {
      // ignore error
    }

    let state: TJsState = {
      workflows: syncResult.value.workflows,
      noCodeActionClasses: syncResult.value.noCodeActionClasses,
      product: syncResult.value.product,
      attributes: oldState?.attributes || {},
    };

    if (!params.userId) {
      // unidentified user
      // set the displays and filter out workflows
      state = {
        ...state,
        displays: oldState?.displays || [],
      };
      state = filterPublicWorkflows(state);

      const workflowNames = state.workflows.map((s) => s.name);
      logger.debug("Fetched " + workflowNames.length + " workflows during sync: " + workflowNames.join(", "));
    } else {
      const workflowNames = state.workflows.map((s) => s.name);
      logger.debug("Fetched " + workflowNames.length + " workflows during sync: " + workflowNames.join(", "));
    }

    config.update({
      apiHost: params.apiHost,
      environmentId: params.environmentId,
      userId: params.userId,
      state,
    });

    // before finding the workflows, check for public use
  } catch (error) {
    logger.error(`Error during sync: ${error}`);
    throw error;
  }
};

export const filterPublicWorkflows = (state: TJsState): TJsState => {
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
  const updateInterval = 1000 * 60; // every minute
  // add event listener to check sync with backend on regular interval
  if (typeof window !== "undefined" && syncIntervalId === null) {
    syncIntervalId = window.setInterval(async () => {
      // check if the config has not expired yet
      if (config.get().expiresAt && new Date(config.get().expiresAt) >= new Date()) {
        return;
      }
      logger.debug("Config has expired. Starting sync.");
      await sync({
        apiHost: config.get().apiHost,
        environmentId: config.get().environmentId,
        userId: config.get().userId,
        // personId: config.get().state?.person?.id,
      });
    }, updateInterval);
  }
};

export const removeExpiryCheckListener = (): void => {
  if (typeof window !== "undefined" && syncIntervalId !== null) {
    window.clearInterval(syncIntervalId);

    syncIntervalId = null;
  }
};
