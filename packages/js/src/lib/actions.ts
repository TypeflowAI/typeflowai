import { TypeflowAIAPI } from "@typeflowai/api";
import { TJsActionInput } from "@typeflowai/types/js";
import { TWorkflow } from "@typeflowai/types/workflows";

import { Config } from "./config";
import { NetworkError, Result, err, okVoid } from "./errors";
import { Logger } from "./logger";
import { renderWidget } from "./widget";

const logger = Logger.getInstance();
const config = Config.getInstance();

const intentsToNotCreateOnApp = ["Exit Intent (Desktop)", "50% Scroll"];

export const trackAction = async (
  name: string,
  properties: TJsActionInput["properties"] = {}
): Promise<Result<void, NetworkError>> => {
  const { userId } = config.get();
  const input: TJsActionInput = {
    environmentId: config.get().environmentId,
    userId,
    name,
    properties: properties || {},
  };

  // don't send actions to the backend if the person is not identified
  if (userId && !intentsToNotCreateOnApp.includes(name)) {
    logger.debug(`Sending action "${name}" to backend`);

    const api = new TypeflowAIAPI({
      apiHost: config.get().apiHost,
      environmentId: config.get().environmentId,
    });
    const res = await api.client.action.create({
      ...input,
      userId,
    });

    if (!res.ok) {
      return err({
        code: "network_error",
        message: `Error tracking action ${name}`,
        status: 500,
        url: `${config.get().apiHost}/api/v1/client/${config.get().environmentId}/actions`,
        responseMessage: res.error.message,
      });
    }
  }

  logger.debug(`TypeflowAI: Action "${name}" tracked`);

  // get a list of workflows that are collecting insights
  const activeWorkflows = config.get().state?.workflows;

  if (!!activeWorkflows && activeWorkflows.length > 0) {
    triggerWorkflow(name, activeWorkflows);
  } else {
    logger.debug("No active workflows to display");
  }

  return okVoid();
};

export const triggerWorkflow = (actionName: string, activeWorkflows: TWorkflow[]): void => {
  for (const workflow of activeWorkflows) {
    for (const trigger of workflow.triggers) {
      if (trigger === actionName) {
        logger.debug(`TypeflowAI: workflow ${workflow.id} triggered by action "${actionName}"`);
        renderWidget(workflow);
        return;
      }
    }
  }
};
