import { TJsTrackProperties } from "@typeflowai/types/js";

import { InvalidCodeError, NetworkError, Result, err, okVoid } from "../../shared/errors";
import { Logger } from "../../shared/logger";
import { WebsiteConfig } from "./config";
import { triggerWorkflow } from "./widget";

const logger = Logger.getInstance();
const websiteConfig = WebsiteConfig.getInstance();

export const trackAction = async (
  name: string,
  alias?: string,
  properties?: TJsTrackProperties
): Promise<Result<void, NetworkError>> => {
  const aliasName = alias || name;
  logger.debug(`TypeflowAI: Action "${aliasName}" tracked`);

  // get a list of workflows that are collecting insights
  const activeWorkflows = websiteConfig.get().state?.workflows;

  if (!!activeWorkflows && activeWorkflows.length > 0) {
    for (const workflow of activeWorkflows) {
      for (const trigger of workflow.triggers) {
        if (trigger.actionClass.name === name) {
          await triggerWorkflow(workflow, name, properties);
        }
      }
    }
  } else {
    logger.debug("No active workflows to display");
  }

  return okVoid();
};

export const trackCodeAction = (
  code: string,
  properties?: TJsTrackProperties
): Promise<Result<void, NetworkError>> | Result<void, InvalidCodeError> => {
  const {
    state: { actionClasses = [] },
  } = websiteConfig.get();

  const codeActionClasses = actionClasses.filter((action) => action.type === "code");
  const action = codeActionClasses.find((action) => action.key === code);

  if (!action) {
    return err({
      code: "invalid_code",
      message: `${code} action unknown. Please add this action in TypeflowAI first in order to use it in your code.`,
    });
  }

  return trackAction(action.name, code, properties);
};

export const trackNoCodeAction = (name: string): Promise<Result<void, NetworkError>> => {
  return trackAction(name);
};
