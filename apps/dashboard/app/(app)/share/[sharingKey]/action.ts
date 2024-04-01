"use server";

import { getWorkflowByResultShareKey } from "@typeflowai/lib/workflow/service";

export async function getResultShareUrlWorkflowAction(key: string): Promise<string | null> {
  return getWorkflowByResultShareKey(key);
}
