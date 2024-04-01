"use server";

import { revalidatePath } from "next/cache";

export default async function revalidateWorkflowIdPath(environmentId: string, workflowId: string) {
  revalidatePath(`/environments/${environmentId}/workflows/${workflowId}`);
}
