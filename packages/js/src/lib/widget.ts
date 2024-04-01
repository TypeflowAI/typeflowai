import { TypeflowAIAPI } from "@typeflowai/api";
import { ResponseQueue } from "@typeflowai/lib/responseQueue";
import WorkflowState from "@typeflowai/lib/workflowState";
import { TJSStateDisplay } from "@typeflowai/types/js";
import { TResponseUpdate } from "@typeflowai/types/responses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { renderWorkflowModal } from "@typeflowai/workflows";

import { Config } from "./config";
import { ErrorHandler } from "./errors";
import { Logger } from "./logger";
import { filterPublicWorkflows, sync } from "./sync";

const containerId = "typeflowai-web-container";
const config = Config.getInstance();
const logger = Logger.getInstance();
const errorHandler = ErrorHandler.getInstance();
let workflowRunning = false;

export const renderWidget = (workflow: TWorkflow) => {
  if (workflowRunning) {
    logger.debug("A workflow is already running. Skipping.");
    return;
  }
  workflowRunning = true;

  if (workflow.delay) {
    logger.debug(`Delaying workflow by ${workflow.delay} seconds.`);
  }

  const product = config.get().state.product;

  const workflowState = new WorkflowState(workflow.id, null, null, config.get().userId);

  const responseQueue = new ResponseQueue(
    {
      apiHost: config.get().apiHost,
      environmentId: config.get().environmentId,
      retryAttempts: 2,
      onResponseSendingFailed: (response) => {
        alert(`Failed to send response: ${JSON.stringify(response, null, 2)}`);
      },
    },
    workflowState
  );

  const productOverwrites = workflow.productOverwrites ?? {};
  const brandColor = productOverwrites.brandColor ?? product.brandColor;
  const highlightBorderColor = productOverwrites.highlightBorderColor ?? product.highlightBorderColor;
  const clickOutside = productOverwrites.clickOutsideClose ?? product.clickOutsideClose;
  const darkOverlay = productOverwrites.darkOverlay ?? product.darkOverlay;
  const placement = productOverwrites.placement ?? product.placement;
  const isBrandingEnabled = product.inAppWorkflowBranding;

  setTimeout(() => {
    renderWorkflowModal({
      workflow: workflow,
      webAppUrl: config.get().apiHost,
      brandColor,
      isBrandingEnabled: isBrandingEnabled,
      clickOutside,
      darkOverlay,
      highlightBorderColor,
      placement,
      onDisplay: async () => {
        const { userId } = config.get();
        // if config does not have a person, we store the displays in local storage
        if (!userId) {
          const localDisplay: TJSStateDisplay = {
            createdAt: new Date(),
            workflowId: workflow.id,
            responded: false,
          };

          const existingDisplays = config.get().state.displays;
          const displays = existingDisplays ? [...existingDisplays, localDisplay] : [localDisplay];
          const previousConfig = config.get();
          let state = filterPublicWorkflows({
            ...previousConfig.state,
            displays,
          });
          config.update({
            ...previousConfig,
            state,
          });
        }

        const api = new TypeflowAIAPI({
          apiHost: config.get().apiHost,
          environmentId: config.get().environmentId,
        });
        const res = await api.client.display.create({
          workflowId: workflow.id,
          userId,
        });
        if (!res.ok) {
          throw new Error("Could not create display");
        }
        const { id } = res.data;

        workflowState.updateDisplayId(id);
        responseQueue.updateWorkflowState(workflowState);
      },
      onResponse: (responseUpdate: TResponseUpdate) => {
        const { userId } = config.get();
        // if user is unidentified, update the display in local storage if not already updated
        if (!userId) {
          const displays = config.get().state.displays;
          const lastDisplay = displays && displays[displays.length - 1];
          if (!lastDisplay) {
            throw new Error("No lastDisplay found");
          }
          if (!lastDisplay.responded) {
            lastDisplay.responded = true;
            const previousConfig = config.get();
            let state = filterPublicWorkflows({
              ...previousConfig.state,
              displays,
            });
            config.update({
              ...previousConfig,
              state,
            });
          }
        }

        if (userId) {
          workflowState.updateUserId(userId);
        }
        responseQueue.updateWorkflowState(workflowState);
        responseQueue.add({
          data: responseUpdate.data,
          ttc: responseUpdate.ttc,
          finished: responseUpdate.finished,
        });
      },
      onClose: closeWorkflow,
      onFileUpload: async (file: File, params) => {
        const api = new TypeflowAIAPI({
          apiHost: config.get().apiHost,
          environmentId: config.get().environmentId,
        });

        return await api.client.storage.uploadFile(file, params);
      },
    });
  }, workflow.delay * 1000);
};

export const closeWorkflow = async (): Promise<void> => {
  // remove container element from DOM
  document.getElementById(containerId)?.remove();
  addWidgetContainer();

  // if unidentified user, refilter the workflows
  if (!config.get().userId) {
    const state = config.get().state;
    const updatedState = filterPublicWorkflows(state);
    config.update({
      ...config.get(),
      state: updatedState,
    });
    workflowRunning = false;
    return;
  }

  // for identified users we sync to get the latest workflows
  try {
    await sync({
      apiHost: config.get().apiHost,
      environmentId: config.get().environmentId,
      userId: config.get().userId,
    });
    workflowRunning = false;
  } catch (e) {
    errorHandler.handle(e);
  }
};

export const addWidgetContainer = (): void => {
  const containerElement = document.createElement("div");
  containerElement.id = containerId;
  document.body.appendChild(containerElement);
};
