import { TResponseUpdate } from "@typeflowai/types/responses";

export class WorkflowState {
  responseId: string | null = null;
  displayId: string | null = null;
  userId: string | null = null;
  workflowId: string;
  responseAcc: TResponseUpdate = { finished: false, data: {}, ttc: {} };
  singleUseId: string | null;

  constructor(
    workflowId: string,
    singleUseId?: string | null,
    responseId?: string | null,
    userId?: string | null
  ) {
    this.workflowId = workflowId;
    this.userId = userId ?? null;
    this.singleUseId = singleUseId ?? null;
    this.responseId = responseId ?? null;
  }

  /**
   * Set the current workflow ID
   * @param id - The workflow ID
   */
  setWorkflowId(id: string) {
    this.workflowId = id;
    this.clear(); // Reset the state when setting a new workflowId
  }
  /**
   * Get a copy of the current state
   */
  copy() {
    const copyInstance = new WorkflowState(
      this.workflowId,
      this.singleUseId ?? undefined,
      this.responseId ?? undefined,
      this.userId ?? undefined
    );
    copyInstance.responseId = this.responseId;
    copyInstance.responseAcc = this.responseAcc;
    return copyInstance;
  }

  /**
   * Update the response ID after a successful response creation
   * @param id - The response ID
   */
  updateResponseId(id: string) {
    this.responseId = id;
  }

  /**
   * Update the response ID after a successful response creation
   * @param id - The response ID
   */
  updateDisplayId(id: string) {
    this.displayId = id;
  }

  /**
   * Update the user ID
   * @param id - The user ID
   */
  updateUserId(id: string) {
    this.userId = id;
  }

  /**
   * Accumulate the responses
   * @param responseUpdate - The new response data to add
   */
  accumulateResponse(responseUpdate: TResponseUpdate) {
    this.responseAcc = {
      finished: responseUpdate.finished,
      ttc: responseUpdate.ttc,
      data: { ...this.responseAcc.data, ...responseUpdate.data },
    };
  }

  /**
   * Check if the current accumulated response is finished
   */
  isResponseFinished() {
    return this.responseAcc.finished;
  }

  /**
   * Clear the current state
   */
  clear() {
    this.responseId = null;
    this.responseAcc = { finished: false, data: {}, ttc: {} };
  }
}

export default WorkflowState;
