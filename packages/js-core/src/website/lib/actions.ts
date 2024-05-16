import { NetworkError, Result, okVoid } from "../../shared/errors";
import { Logger } from "../../shared/logger";
import { WebsiteConfig } from "./config";
import { triggerWorkflow } from "./widget";

const logger = Logger.getInstance();
const websiteConfig = WebsiteConfig.getInstance();

export const trackAction = async (name: string): Promise<Result<void, NetworkError>> => {
  const {
    state: { workflows = [] },
  } = websiteConfig.get();

  // if workflows have a inline triggers, we need to check the name of the action in the code action config
  workflows.forEach(async (workflow) => {
    const { inlineTriggers } = workflow;
    const { codeConfig } = inlineTriggers ?? {};

    if (name === codeConfig?.identifier) {
      await triggerWorkflow(workflow);
      return;
    }
  });

  logger.debug(`TypeflowAI: Action "${name}" tracked`);

  // get a list of workflows that are collecting insights
  const activeWorkflows = websiteConfig.get().state?.workflows;

  if (!!activeWorkflows && activeWorkflows.length > 0) {
    for (const workflow of activeWorkflows) {
      for (const trigger of workflow.triggers) {
        if (trigger === name) {
          await triggerWorkflow(workflow, name);
        }
      }
    }
  } else {
    logger.debug("No active workflows to display");
  }

  return okVoid();
};
