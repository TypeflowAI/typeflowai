import { TypeflowAIAPI } from "@typeflowai/api";
import { TResponseUpdate } from "@typeflowai/types/responses";

import { delay } from "./utils";
import WorkflowState from "./workflowState";

interface QueueConfig {
  apiHost: string;
  environmentId: string;
  retryAttempts: number;
  onResponseSendingFailed?: (responseUpdate: TResponseUpdate) => void;
  onResponseSendingFinished?: () => void;
  setWorkflowState?: (state: WorkflowState) => void;
}

export class ResponseQueue {
  private queue: TResponseUpdate[] = [];
  private config: QueueConfig;
  private workflowState: WorkflowState;
  private isRequestInProgress = false;
  private api: TypeflowAIAPI;

  constructor(config: QueueConfig, workflowState: WorkflowState) {
    this.config = config;
    this.workflowState = workflowState;
    this.api = new TypeflowAIAPI({
      apiHost: config.apiHost,
      environmentId: config.environmentId,
    });
  }

  add(responseUpdate: TResponseUpdate) {
    // update workflow state
    this.workflowState.accumulateResponse(responseUpdate);
    if (this.config.setWorkflowState) {
      this.config.setWorkflowState(this.workflowState);
    }
    // add response to queue
    this.queue.push(responseUpdate);
    this.processQueue();
  }

  async processQueue() {
    if (this.isRequestInProgress) return;
    if (this.queue.length === 0) return;

    this.isRequestInProgress = true;

    const responseUpdate = this.queue[0];
    let attempts = 0;

    while (attempts < this.config.retryAttempts) {
      const success = await this.sendResponse(responseUpdate);
      if (success) {
        this.queue.shift(); // remove the successfully sent response from the queue
        break; // exit the retry loop
      }
      console.error(`TypeflowAI: Failed to send response. Retrying... ${attempts}`);
      await delay(1000); // wait for 1 second before retrying
      attempts++;
    }

    if (attempts >= this.config.retryAttempts) {
      // Inform the user after 2 failed attempts
      console.error("Failed to send response after 2 attempts.");
      // If the response fails finally, inform the user
      if (this.config.onResponseSendingFailed) {
        this.config.onResponseSendingFailed(responseUpdate);
      }
      this.isRequestInProgress = false;
    } else {
      if (responseUpdate.finished && this.config.onResponseSendingFinished) {
        this.config.onResponseSendingFinished();
      }
      this.isRequestInProgress = false;
      this.processQueue(); // process the next item in the queue if any
    }
  }

  async sendResponse(responseUpdate: TResponseUpdate): Promise<boolean> {
    try {
      if (this.workflowState.responseId !== null) {
        await this.api.client.response.update({
          ...responseUpdate,
          responseId: this.workflowState.responseId,
        });
      } else {
        const response = await this.api.client.response.create({
          ...responseUpdate,
          workflowId: this.workflowState.workflowId,
          userId: this.workflowState.userId || null,
          singleUseId: this.workflowState.singleUseId || null,
        });
        if (!response.ok) {
          throw new Error("Could not create response");
        }
        if (this.workflowState.displayId) {
          try {
            await this.api.client.display.update(this.workflowState.displayId, {
              responseId: response.data.id,
            });
          } catch (error) {
            console.error(`Failed to update display, proceeding with the response. ${error}`);
          }
        }
        this.workflowState.updateResponseId(response.data.id);
        if (this.config.setWorkflowState) {
          this.config.setWorkflowState(this.workflowState);
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // update workflowState
  updateWorkflowState(workflowState: WorkflowState) {
    this.workflowState = workflowState;
  }
}
