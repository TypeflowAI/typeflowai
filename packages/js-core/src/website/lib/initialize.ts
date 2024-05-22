import type { TJSAppConfig, TJsWebsiteConfig, TJsWebsiteConfigInput } from "@typeflowai/types/js";

import {
  ErrorHandler,
  MissingFieldError,
  MissingPersonError,
  NetworkError,
  NotInitializedError,
  Result,
  err,
  okVoid,
  wrapThrows,
} from "../../shared/errors";
import { Logger } from "../../shared/logger";
import { getIsDebug } from "../../shared/utils";
import { trackNoCodeAction } from "./actions";
import { WEBSITE_LOCAL_STORAGE_KEY, WebsiteConfig } from "./config";
import { addCleanupEventListeners, addEventListeners, removeAllEventListeners } from "./eventListeners";
import { checkPageUrl } from "./noCodeActions";
import { sync } from "./sync";
import { addWidgetContainer, removeWidgetContainer, setIsWorkflowRunning } from "./widget";

const websiteConfig = WebsiteConfig.getInstance();
const logger = Logger.getInstance();

let isInitialized = false;

export const setIsInitialized = (value: boolean) => {
  isInitialized = value;
};

export const initialize = async (
  configInput: TJsWebsiteConfigInput
): Promise<Result<void, MissingFieldError | NetworkError | MissingPersonError>> => {
  if (getIsDebug()) {
    logger.configure({ logLevel: "debug" });
  }

  if (isInitialized) {
    logger.debug("Already initialized, skipping initialization.");
    return okVoid();
  }

  let existingConfig: TJsWebsiteConfig | undefined;
  try {
    existingConfig = websiteConfig.get();
    logger.debug("Found existing configuration.");
  } catch (e) {
    logger.debug("No existing configuration found.");
  }

  // typeflowai is in error state, skip initialization
  if (existingConfig?.status === "error") {
    logger.debug("TypeflowAI was set to an error state.");
    if (existingConfig?.expiresAt && new Date(existingConfig.expiresAt) > new Date()) {
      logger.debug("Error state is not expired, skipping initialization");
      return okVoid();
    } else {
      logger.debug("Error state is expired. Continue with initialization.");
    }
  }

  ErrorHandler.getInstance().printStatus();

  logger.debug("Start initialize");

  if (!configInput.environmentId) {
    logger.debug("No environmentId provided");
    return err({
      code: "missing_field",
      field: "environmentId",
    });
  }

  if (!configInput.apiHost) {
    logger.debug("No apiHost provided");

    return err({
      code: "missing_field",
      field: "apiHost",
    });
  }

  logger.debug("Adding widget container to DOM");
  addWidgetContainer();

  // let updatedAttributes: TPersonAttributes | null = null;
  // if (configInput.attributes) {
  //   updatedAttributes = { ...configInput.attributes };
  // }

  if (
    existingConfig &&
    existingConfig.state &&
    existingConfig.environmentId === configInput.environmentId &&
    existingConfig.apiHost === configInput.apiHost &&
    existingConfig.expiresAt
  ) {
    logger.debug("Configuration fits init parameters.");
    if (existingConfig.expiresAt < new Date()) {
      logger.debug("Configuration expired.");

      try {
        await sync({
          apiHost: configInput.apiHost,
          environmentId: configInput.environmentId,
        });
      } catch (e) {
        putTypeflowAIInErrorState();
      }
    } else {
      logger.debug("Configuration not expired. Extending expiration.");
      websiteConfig.update(existingConfig);
    }
  } else {
    logger.debug(
      "No valid configuration found or it has been expired. Resetting config and creating new one."
    );
    websiteConfig.resetConfig();
    logger.debug("Syncing.");

    try {
      await sync({
        apiHost: configInput.apiHost,
        environmentId: configInput.environmentId,
      });
    } catch (e) {
      handleErrorOnFirstInit();
    }

    if (configInput.attributes) {
      const currentWebsiteConfig = websiteConfig.get();

      websiteConfig.update({
        environmentId: currentWebsiteConfig.environmentId,
        apiHost: currentWebsiteConfig.apiHost,
        state: {
          ...websiteConfig.get().state,
          attributes: { ...websiteConfig.get().state.attributes, ...configInput.attributes },
        },
        expiresAt: websiteConfig.get().expiresAt,
      });
    }

    // and track the new session event
    await trackNoCodeAction("New Session");
  }

  logger.debug("Adding event listeners");
  addEventListeners();
  addCleanupEventListeners();

  setIsInitialized(true);
  logger.debug("Initialized");

  // check page url if initialized after page load

  checkPageUrl();
  return okVoid();
};

const handleErrorOnFirstInit = () => {
  // put typeflowai in error state (by creating a new config) and throw error
  const initialErrorConfig: Partial<TJSAppConfig> = {
    status: "error",
    expiresAt: new Date(new Date().getTime() + 10 * 60000), // 10 minutes in the future
  };
  // can't use config.update here because the config is not yet initialized
  wrapThrows(() => localStorage.setItem(WEBSITE_LOCAL_STORAGE_KEY, JSON.stringify(initialErrorConfig)))();
  throw new Error("Could not initialize typeflowai");
};

export const checkInitialized = (): Result<void, NotInitializedError> => {
  logger.debug("Check if initialized");
  if (!isInitialized || !ErrorHandler.initialized) {
    return err({
      code: "not_initialized",
      message: "TypeflowAI not initialized. Call initialize() first.",
    });
  }

  return okVoid();
};

export const deinitalize = (): void => {
  logger.debug("Deinitializing");
  removeWidgetContainer();
  setIsWorkflowRunning(false);
  removeAllEventListeners();
  setIsInitialized(false);
};

export const putTypeflowAIInErrorState = (): void => {
  logger.debug("Putting typeflowai in error state");
  // change typeflowai status to error
  websiteConfig.update({
    ...websiteConfig.get(),
    status: "error",
    expiresAt: new Date(new Date().getTime() + 10 * 60000), // 10 minutes in the future
  });
  deinitalize();
};
