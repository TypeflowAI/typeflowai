import { TypeflowAIAPI } from "@typeflowai/api";
import { ResponseQueue } from "@typeflowai/lib/responseQueue";
import WorkflowState from "@typeflowai/lib/workflowState";
import { TJSWebsiteStateDisplay } from "@typeflowai/types/js";
import { TResponseUpdate } from "@typeflowai/types/responses";
import { TWorkflow } from "@typeflowai/types/workflows";

import { Logger } from "../../shared/logger";
import { getDefaultLanguageCode, getLanguageCode } from "../../shared/utils";
import { WebsiteConfig } from "./config";
import { filterPublicWorkflows } from "./sync";

const containerId = "typeflowai-website-container";

const websiteConfig = WebsiteConfig.getInstance();
const logger = Logger.getInstance();

let isWorkflowRunning = false;
let setIsError = (_: boolean) => {};
let setIsResponseSendingFinished = (_: boolean) => {};

export const setIsWorkflowRunning = (value: boolean) => {
  isWorkflowRunning = value;
};

const shouldDisplayBasedOnPercentage = (displayPercentage: number) => {
  const randomNum = Math.floor(Math.random() * 100) + 1;
  return randomNum <= displayPercentage;
};

export const triggerWorkflow = async (workflow: TWorkflow, action?: string): Promise<void> => {
  // Check if the workflow should be displayed based on displayPercentage
  if (workflow.displayPercentage) {
    const shouldDisplayWorkflow = shouldDisplayBasedOnPercentage(workflow.displayPercentage);
    if (!shouldDisplayWorkflow) {
      logger.debug("Workflow display skipped based on displayPercentage.");
      return; // skip displaying the workflow
    }
  }
  await renderWidget(workflow, action);
};

const renderWidget = async (workflow: TWorkflow, action?: string) => {
  if (isWorkflowRunning) {
    logger.debug("A workflow is already running. Skipping.");
    return;
  }
  setIsWorkflowRunning(true);

  if (workflow.delay) {
    logger.debug(`Delaying workflow by ${workflow.delay} seconds.`);
  }

  const product = websiteConfig.get().state.product;
  const attributes = websiteConfig.get().state.attributes;

  const isMultiLanguageWorkflow = workflow.languages.length > 1;
  let languageCode = "default";

  if (isMultiLanguageWorkflow && attributes) {
    const displayLanguage = getLanguageCode(workflow, attributes);
    //if workflow is not available in selected language, workflow wont be shown
    if (!displayLanguage) {
      logger.debug("Workflow not available in specified language.");
      setIsWorkflowRunning(true);
      return;
    }
    languageCode = displayLanguage;
  }

  const workflowState = new WorkflowState(workflow.id, null, null);

  const responseQueue = new ResponseQueue(
    {
      apiHost: websiteConfig.get().apiHost,
      environmentId: websiteConfig.get().environmentId,
      retryAttempts: 2,
      onResponseSendingFailed: () => {
        setIsError(true);
      },
      onResponseSendingFinished: () => {
        setIsResponseSendingFinished(true);
      },
    },
    workflowState
  );
  const productOverwrites = workflow.productOverwrites ?? {};
  const clickOutside = productOverwrites.clickOutsideClose ?? product.clickOutsideClose;
  const darkOverlay = productOverwrites.darkOverlay ?? product.darkOverlay;
  const placement = productOverwrites.placement ?? product.placement;
  const isBrandingEnabled = product.inAppWorkflowBranding;
  const typeflowAIWorkflows = await loadTypeflowAIWorkflowsExternally();

  const getStyling = () => {
    // allow style overwrite is disabled from the product
    if (!product.styling.allowStyleOverwrite) {
      return product.styling;
    }

    // allow style overwrite is enabled from the product
    if (product.styling.allowStyleOverwrite) {
      // workflow style overwrite is disabled
      if (!workflow.styling?.overwriteThemeStyling) {
        return product.styling;
      }

      // workflow style overwrite is enabled
      return workflow.styling;
    }

    return product.styling;
  };

  setTimeout(() => {
    typeflowAIWorkflows.renderWorkflowModal({
      workflow: workflow,
      webAppUrl: websiteConfig.get().apiHost,
      isBrandingEnabled: isBrandingEnabled,
      clickOutside,
      darkOverlay,
      languageCode,
      placement,
      styling: getStyling(),
      getSetIsError: (f: (value: boolean) => void) => {
        setIsError = f;
      },
      getSetIsResponseSendingFinished: (f: (value: boolean) => void) => {
        setIsResponseSendingFinished = f;
      },
      onDisplay: async () => {
        const localDisplay: TJSWebsiteStateDisplay = {
          createdAt: new Date(),
          workflowId: workflow.id,
          responded: false,
        };

        const existingDisplays = websiteConfig.get().state.displays;
        const displays = existingDisplays ? [...existingDisplays, localDisplay] : [localDisplay];
        const previousConfig = websiteConfig.get();

        let state = filterPublicWorkflows({
          ...previousConfig.state,
          displays,
        });

        websiteConfig.update({
          ...previousConfig,
          state,
        });

        const api = new TypeflowAIAPI({
          apiHost: websiteConfig.get().apiHost,
          environmentId: websiteConfig.get().environmentId,
        });
        const res = await api.client.display.create({
          workflowId: workflow.id,
        });

        if (!res.ok) {
          throw new Error("Could not create display");
        }

        const { id } = res.data;

        workflowState.updateDisplayId(id);
        responseQueue.updateWorkflowState(workflowState);
      },
      onResponse: (responseUpdate: TResponseUpdate) => {
        const displays = websiteConfig.get().state.displays;
        const lastDisplay = displays && displays[displays.length - 1];
        if (!lastDisplay) {
          throw new Error("No lastDisplay found");
        }
        if (!lastDisplay.responded) {
          lastDisplay.responded = true;
          const previousConfig = websiteConfig.get();
          let state = filterPublicWorkflows({
            ...previousConfig.state,
            displays,
          });
          websiteConfig.update({
            ...previousConfig,
            state,
          });
        }

        responseQueue.updateWorkflowState(workflowState);

        responseQueue.add({
          data: responseUpdate.data,
          ttc: responseUpdate.ttc,
          finished: responseUpdate.finished,
          language: languageCode === "default" ? getDefaultLanguageCode(workflow) : languageCode,
          meta: {
            url: window.location.href,
            action,
          },
        });
      },
      onClose: closeWorkflow,
      onFileUpload: async (file: File, params) => {
        const api = new TypeflowAIAPI({
          apiHost: websiteConfig.get().apiHost,
          environmentId: websiteConfig.get().environmentId,
        });

        return await api.client.storage.uploadFile(file, params);
      },
      onRetry: () => {
        setIsError(false);
        responseQueue.processQueue();
      },
    });
  }, workflow.delay * 1000);
};

export const closeWorkflow = async (): Promise<void> => {
  // remove container element from DOM
  removeWidgetContainer();
  addWidgetContainer();

  const state = websiteConfig.get().state;
  const updatedState = filterPublicWorkflows(state);
  websiteConfig.update({
    ...websiteConfig.get(),
    state: updatedState,
  });
  setIsWorkflowRunning(false);
  return;
};

export const addWidgetContainer = (): void => {
  const containerElement = document.createElement("div");
  containerElement.id = containerId;
  document.body.appendChild(containerElement);
};

export const removeWidgetContainer = (): void => {
  document.getElementById(containerId)?.remove();
};

const loadTypeflowAIWorkflowsExternally = (): Promise<typeof window.typeflowAIWorkflows> => {
  return new Promise((resolve, reject) => {
    if (window.typeflowAIWorkflows) {
      resolve(window.typeflowAIWorkflows);
    } else {
      const script = document.createElement("script");
      script.src = `${websiteConfig.get().apiHost}/api/packages/workflows`;
      script.async = true;
      script.onload = () => resolve(window.typeflowAIWorkflows);
      script.onerror = (error) => {
        console.error("Failed to load TypeflowAI Workflows library:", error);
        reject(error);
      };
      document.head.appendChild(script);
    }
  });
};
