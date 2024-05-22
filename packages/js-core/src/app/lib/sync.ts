import { TAttributes } from "@typeflowai/types/attributes";
import { TJsAppState, TJsAppStateSync, TJsAppSyncParams } from "@typeflowai/types/js";
import { TWorkflow } from "@typeflowai/types/workflows";

import { NetworkError, Result, err, ok } from "../../shared/errors";
import { Logger } from "../../shared/logger";
import { getIsDebug } from "../../shared/utils";
import { AppConfig } from "./config";

const appConfig = AppConfig.getInstance();
const logger = Logger.getInstance();

let syncIntervalId: number | null = null;

const syncWithBackend = async (
  { apiHost, environmentId, userId }: TJsAppSyncParams,
  noCache: boolean
): Promise<Result<TJsAppStateSync, NetworkError>> => {
  try {
    let fetchOptions: RequestInit = {};

    if (noCache || getIsDebug()) {
      fetchOptions.cache = "no-cache";
      logger.debug("No cache option set for sync");
    }

    const url = `${apiHost}/api/v1/client/${environmentId}/app/sync/${userId}?version=${import.meta.env.VERSION}`;

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

    const data = await response.json();
    const { data: state } = data;

    return ok(state as TJsAppStateSync);
  } catch (e) {
    return err(e as NetworkError);
  }
};

export const sync = async (params: TJsAppSyncParams, noCache = false): Promise<void> => {
  try {
    const syncResult = await syncWithBackend(params, noCache);

    if (syncResult?.ok !== true) {
      throw syncResult.error;
    }

    let attributes: TAttributes = params.attributes || {};

    if (syncResult.value.language) {
      attributes.language = syncResult.value.language;
    }

    let state: TJsAppState = {
      workflows: syncResult.value.workflows as TWorkflow[],
      actionClasses: syncResult.value.actionClasses,
      product: syncResult.value.product,
      attributes,
    };

    const workflowNames = state.workflows.map((s) => s.name);
    logger.debug("Fetched " + workflowNames.length + " workflows during sync: " + workflowNames.join(", "));

    appConfig.update({
      apiHost: params.apiHost,
      environmentId: params.environmentId,
      userId: params.userId,
      state,
      expiresAt: new Date(new Date().getTime() + 2 * 60000), // 2 minutes in the future
    });
  } catch (error) {
    console.error(`Error during sync: ${error}`);
    throw error;
  }
};

export const addExpiryCheckListener = (): void => {
  const updateInterval = 1000 * 30; // every 30 seconds
  // add event listener to check sync with backend on regular interval
  if (typeof window !== "undefined" && syncIntervalId === null) {
    syncIntervalId = window.setInterval(async () => {
      try {
        // check if the config has not expired yet
        if (appConfig.get().expiresAt && new Date(appConfig.get().expiresAt) >= new Date()) {
          return;
        }
        logger.debug("Config has expired. Starting sync.");
        await sync({
          apiHost: appConfig.get().apiHost,
          environmentId: appConfig.get().environmentId,
          userId: appConfig.get().userId,
          attributes: appConfig.get().state.attributes,
        });
      } catch (e) {
        console.error(`Error during expiry check: ${e}`);
        logger.debug("Extending config and try again later.");
        const existingConfig = appConfig.get();
        appConfig.update(existingConfig);
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
